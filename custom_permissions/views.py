from django.contrib.auth.models import User
import os
#from django.shortcuts import render_to_response
from django.shortcuts import render
from django.template import RequestContext
from django.contrib.auth.decorators import permission_required
from django.http import HttpResponse, JsonResponse
from django.contrib import messages
from django.core.mail import EmailMessage, get_connection
from django.contrib.sessions.models import Session
from django.utils import timezone
from django.views.decorators.http import require_POST
from django.core.exceptions import PermissionDenied
import json
from . import ajax as dajax_helpers
from .models import EmailConfig, DbConfig

NODE_API_TIMEOUT = 20


def _node_post(url, **kwargs):
    import requests
    last_exc = None
    for _ in range(2):
        try:
            return requests.post(url, timeout=NODE_API_TIMEOUT, **kwargs)
        except requests.exceptions.ReadTimeout as exc:
            last_exc = exc
            continue
    raise last_exc


@permission_required('custom_permissions.entrar_asignacion')
def asignar_empresa_usuario(request):
    users = User.objects.all()
    sueldo_enabled = os.getenv('DISABLE_SUELDO_DB') != '1'
    try:
        cfg = DbConfig.objects.filter(db_type='sueldo').first()
        if cfg and cfg.disabled:
            sueldo_enabled = False
    except Exception:
        pass
    return render(request,'custom_permissions/asignar_empresa_usuario.html',{'usuarios': users, 'sueldo_enabled': sueldo_enabled})


@permission_required('custom_permissions.entrar_admin', raise_exception=True)
def email_config(request):
    config, _ = EmailConfig.objects.get_or_create(id=1)
    if request.method == 'POST':
        action = request.POST.get('action', 'save')
        config.enabled = request.POST.get('enabled') == 'on'
        config.host = request.POST.get('host', '')
        config.port = int(request.POST.get('port') or 25)
        config.from_name = request.POST.get('from_name', '')
        config.from_email = request.POST.get('from_email', '')
        config.reply_to_name = request.POST.get('reply_to_name', '')
        config.reply_to_email = request.POST.get('reply_to_email', '')
        config.envelope_from = request.POST.get('envelope_from', '')
        config.use_ssl = request.POST.get('use_ssl') == 'on'
        config.use_tls = request.POST.get('use_tls') == 'on'
        config.use_auth = request.POST.get('use_auth') == 'on'
        config.username = request.POST.get('username', '')
        config.password = request.POST.get('password', '')
        config.save()

        if action == 'test':
            test_email = request.POST.get('test_email', '').strip()
            if not test_email:
                messages.error(request, 'Ingrese un email de prueba.')
            else:
                try:
                    connection = get_connection(
                        host=config.host,
                        port=config.port,
                        username=config.username if config.use_auth else '',
                        password=config.password if config.use_auth else '',
                        use_tls=config.use_tls,
                        use_ssl=config.use_ssl,
                        fail_silently=False,
                    )
                    from_email = config.from_email or config.username
                    msg = EmailMessage(
                        subject='Prueba de correo - MultiSoft',
                        body='Este es un mensaje de prueba.',
                        from_email=from_email,
                        to=[test_email],
                        connection=connection,
                        reply_to=[config.reply_to_email] if config.reply_to_email else None,
                    )
                    if config.envelope_from:
                        msg.extra_headers = msg.extra_headers or {}
                        msg.extra_headers['Return-Path'] = config.envelope_from
                    msg.send()
                    messages.success(request, 'Correo de prueba enviado correctamente.')
                except Exception as exc:
                    messages.error(request, 'Error al enviar correo de prueba: %s' % exc)
    return render(request, 'custom_permissions/email_config.html', {'config': config})


@permission_required('custom_permissions.entrar_admin', raise_exception=True)
def db_config_list(request):
    return render(request, 'custom_permissions/db_config_list.html')


@permission_required('custom_permissions.entrar_admin', raise_exception=True)
def db_config_edit(request, db_type):
    config, _ = DbConfig.objects.get_or_create(db_type=db_type)
    if not getattr(config, 'db_engine', None):
        config.db_engine = 'postgres' if config.db_type == 'postgres' else 'sqlanywhere'
        config.save(update_fields=['db_engine'])
    if not getattr(config, 'engine_settings', None):
        config.engine_settings = {}

    def _normalize_engine(raw_engine):
        if config.db_type == 'postgres':
            return 'postgres'
        return raw_engine if raw_engine in ('sqlanywhere', 'postgres') else 'sqlanywhere'

    def _default_port(engine):
        return 5432 if engine == 'postgres' else 2638

    engine_profiles = dict(config.engine_settings or {})
    for eng in ('sqlanywhere', 'postgres'):
        if eng not in engine_profiles:
            engine_profiles[eng] = {
                'host': '',
                'port': _default_port(eng),
                'server': '',
                'database': '',
                'username': '',
                'password': '',
            }
    # Backward compatibility: si no hay perfiles guardados, usar los campos legacy
    if config.host or config.database or config.username or config.password:
        legacy_engine = _normalize_engine(config.db_engine)
        prof = engine_profiles.get(legacy_engine, {})
        if not prof.get('host'):
            prof['host'] = config.host
        if not prof.get('port'):
            prof['port'] = config.port or _default_port(legacy_engine)
        if not prof.get('server'):
            prof['server'] = config.server
        if not prof.get('database'):
            prof['database'] = config.database
        if not prof.get('username'):
            prof['username'] = config.username
        if not prof.get('password'):
            prof['password'] = config.password
        engine_profiles[legacy_engine] = prof

    selected_engine = _normalize_engine(config.db_engine)
    active_profile = dict(engine_profiles.get(selected_engine, {}))
    active_profile.setdefault('host', '')
    active_profile.setdefault('port', _default_port(selected_engine))
    active_profile.setdefault('server', '')
    active_profile.setdefault('database', '')
    active_profile.setdefault('username', '')
    active_profile.setdefault('password', '')
    if request.method == 'POST':
        action = request.POST.get('action', 'save')
        selected_engine = _normalize_engine(request.POST.get('db_engine', config.db_engine or 'sqlanywhere'))
        posted_profile = {
            'host': request.POST.get('host', ''),
            'port': int(request.POST.get('port') or _default_port(selected_engine)),
            'server': request.POST.get('server', ''),
            'database': request.POST.get('database', ''),
            'username': request.POST.get('username', ''),
            'password': request.POST.get('password', ''),
        }
        engine_profiles[selected_engine] = posted_profile

        config.db_engine = selected_engine
        config.disabled = request.POST.get('disabled') == 'on'
        config.host = posted_profile['host']
        config.port = posted_profile['port']
        config.server = posted_profile['server']
        config.database = posted_profile['database']
        config.username = posted_profile['username']
        config.password = posted_profile['password']
        config.engine_settings = engine_profiles
        config.save()
        apply_ok = True
        if action in ('save', 'reconnect') and config.db_type in ('integrado', 'sueldo'):
            try:
                payload = {
                    'db_type': config.db_type,
                    'db_engine': config.db_engine,
                    'disabled': config.disabled,
                    'host': posted_profile['host'],
                    'port': posted_profile['port'],
                    'server': posted_profile['server'],
                    'database': posted_profile['database'],
                    'username': posted_profile['username'],
                    'password': posted_profile['password'],
                }
                resp = _node_post('http://localhost:3000/api/v1/db_config/update', json=payload)
                data = resp.json()
                if resp.status_code != 200 or not data.get('ok'):
                    err = data.get('error') if isinstance(data, dict) else 'Error desconocido'
                    messages.error(request, 'No tiene configurado el servicio de la base o el Servicio no está Activo. (%s)' % err)
                    apply_ok = False
            except Exception as exc:
                messages.error(request, 'No tiene configurado el servicio de la base o el Servicio no está Activo. (%s)' % exc)
                apply_ok = False
        if action == 'test':
            try:
                if config.db_type in ('integrado', 'sueldo') and not config.disabled:
                    missing = []
                    if not posted_profile['host']:
                        missing.append('Host')
                    if config.db_engine != 'postgres' and not posted_profile['server']:
                        missing.append('Servidor')
                    if not posted_profile['database']:
                        missing.append('Base de datos')
                    if not posted_profile['username']:
                        missing.append('Usuario')
                    if not posted_profile['password']:
                        missing.append('Contraseña')
                    if missing:
                        messages.error(request, 'No tiene configurado el servicio de la base. Faltan: %s.' % ', '.join(missing))
                        active_profile = posted_profile
                        break_render = {
                            'config': config,
                            'active_profile': active_profile,
                            'engine_profiles': engine_profiles,
                        }
                        return render(request, 'custom_permissions/db_config_edit.html', break_render)

                if config.db_type == 'postgres' or config.db_engine == 'postgres':
                    import psycopg2
                    psycopg2.connect(
                        host=posted_profile['host'],
                        port=posted_profile['port'] or 5432,
                        dbname=posted_profile['database'],
                        user=posted_profile['username'],
                        password=posted_profile['password'],
                        connect_timeout=5,
                    ).close()
                    messages.success(request, 'Conexión exitosa.')
                else:
                    host = posted_profile['host']
                    if posted_profile['port'] and host and ':' not in host:
                        host = f"{host}:{posted_profile['port']}"
                    payload = {
                        'host': host,
                        'server': posted_profile['server'],
                        'database': posted_profile['database'],
                        'username': posted_profile['username'],
                        'password': posted_profile['password'],
                    }
                    resp = _node_post('http://localhost:3000/api/v1/db_test/sqlanywhere', json=payload)
                    data = resp.json()
                    if resp.status_code != 200 or not data.get('ok'):
                        err = data.get('error') if isinstance(data, dict) else 'Error desconocido'
                        raise Exception(err)
                    messages.success(request, 'Conexión exitosa.')
            except Exception as exc:
                msg = str(exc)
                if 'Code:' in msg or 'Msg:' in msg or 'Mensaje:' in msg:
                    messages.error(request, 'Error de conexión: %s' % msg)
                else:
                    messages.error(request, 'Error de conexión: %s' % msg)
        elif action == 'reconnect':
            try:
                if config.db_type not in ('integrado', 'sueldo'):
                    raise Exception('Reconexión disponible solo para Integrado o Sueldo.')
                if config.db_type == 'sueldo':
                    resp = _node_post('http://localhost:3000/api/v1/sueldo/reconnect')
                else:
                    resp = _node_post('http://localhost:3000/api/v1/integrado/reconnect')
                data = resp.json()
                if resp.status_code != 200 or not data.get('ok'):
                    err = data.get('error') if isinstance(data, dict) else 'Error desconocido'
                    raise Exception(err)
                messages.success(request, 'Reconexión exitosa.')
            except Exception as exc:
                messages.error(request, 'Error al reconectar: %s' % exc)
        else:
            if apply_ok:
                messages.success(request, 'Configuración guardada correctamente.')
        active_profile = posted_profile

    config.db_engine = selected_engine
    render_ctx = {
        'config': config,
        'active_profile': active_profile,
        'engine_profiles': engine_profiles,
    }
    return render(request, 'custom_permissions/db_config_edit.html', render_ctx)


def active_sessions(request):
    if not (request.user.is_superuser or request.user.has_perm('custom_permissions.entrar_admin')):
        raise PermissionDenied
    if request.method == 'POST':
        action = request.POST.get('action')
        user_id = request.POST.get('user_id')
        if action == 'logout_user' and user_id:
            current_key = request.session.session_key
            keys_to_delete = []
            for s in Session.objects.filter(expire_date__gt=timezone.now()):
                data = s.get_decoded()
                if str(data.get('_auth_user_id')) == str(user_id):
                    if current_key and s.session_key == current_key:
                        continue
                    keys_to_delete.append(s.session_key)
            if keys_to_delete:
                Session.objects.filter(session_key__in=keys_to_delete).delete()
                messages.success(request, 'Sesión cerrada para el usuario.')
            else:
                if str(user_id) == str(request.user.id):
                    messages.info(request, 'No se cerró la sesión actual. Use Cerrar sesión en el menú.')
                else:
                    messages.info(request, 'No se encontraron sesiones activas para el usuario.')

    sessions = Session.objects.filter(expire_date__gt=timezone.now())
    counts = {}
    latest_expire = {}
    last_activity = {}
    ip_address = {}
    user_agent = {}
    total_sessions = 0
    for s in sessions:
        data = s.get_decoded()
        uid = data.get('_auth_user_id')
        if not uid:
            continue
        try:
            uid = int(uid)
        except Exception:
            continue
        total_sessions += 1
        counts[uid] = counts.get(uid, 0) + 1
        if uid not in latest_expire or s.expire_date > latest_expire[uid]:
            latest_expire[uid] = s.expire_date
        la = data.get('last_activity')
        if la:
            last_activity[uid] = la
        if uid not in ip_address and data.get('ip_address'):
            ip_address[uid] = data.get('ip_address')
        if uid not in user_agent and data.get('user_agent'):
            user_agent[uid] = data.get('user_agent')

    users = User.objects.in_bulk(list(counts.keys()))
    rows = []
    for uid, count in counts.items():
        user = users.get(uid)
        if not user:
            continue
        rows.append({
            'username': user.username,
            'full_name': user.get_full_name(),
            'email': user.email,
            'sessions': count,
            'expires': latest_expire.get(uid),
            'last_activity': last_activity.get(uid),
            'ip_address': ip_address.get(uid, ''),
            'user_agent': user_agent.get(uid, ''),
            'id': user.id,
        })

    rows.sort(key=lambda r: r['username'])
    return render(request, 'custom_permissions/active_sessions.html', {
        'rows': rows,
        'total_users': len(rows),
        'total_sessions': total_sessions,
    })


def dajax_get_permisos_empresa(request):
    if request.method not in ('POST', 'GET'):
        return HttpResponse(status=405)
    if request.method == 'GET':
        argv = request.GET.get('argv') or ''
    else:
        argv = request.POST.get('argv') or request.body.decode('utf-8')
    try:
        data = json.loads(argv)
    except Exception:
        try:
            # sometimes argv is sent as 'argv={...}' (urlencoded)
            if argv.startswith('argv='):
                data = json.loads(argv[5:])
            else:
                data = {}
        except Exception:
            data = {}
    usuario = data.get('usuario')
    result = dajax_helpers.get_permisos_empresa(request, usuario)
    return HttpResponse(result, content_type='application/json')


def dajax_save_permisos_empresa(request):
    if request.method != 'POST':
        return HttpResponse(status=405)
    argv = request.POST.get('argv') or request.body.decode('utf-8')
    try:
        data = json.loads(argv)
    except Exception:
        try:
            if argv.startswith('argv='):
                data = json.loads(argv[5:])
            else:
                data = {}
        except Exception:
            data = {}
    usuario = data.get('usuario')
    empresas = data.get('empresas')
    result = dajax_helpers.save_permisos_empresa(request, usuario, empresas)
    return HttpResponse(result, content_type='application/json')

