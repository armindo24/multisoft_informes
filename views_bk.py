
# -*- coding: utf-8 -*-
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.contrib import auth
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Permission
from django.contrib.auth import views as auth_views
import custom_permissions

def server_error(request, template_name='500.html'):
    return render(request, template_name, status=500)

def custom_404(request, exception=None):
    return render(request, '404.html', status=404)

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username','')
        password = request.POST.get('password','')
        user = auth.authenticate(username=username, password=password)
        if user is not None:
            auth.login(request, user)
            return redirect('/accounts/loggedin')
        else:
            return redirect('/accounts/invalid')
    return render(request, 'login.html')

def auth_view(request):
    username = request.POST.get('username','')
    password = request.POST.get('password','')
    user = auth.authenticate(username=username, password=password)

    if user is not None:
        auth.login(request, user)
        return HttpResponseRedirect('/accounts/loggedin')
    else:
        return HttpResponseRedirect('/accounts/invalid')

@login_required
def loggedin(request):    
    modulos_usuario = []
    permisos = [[p[1], p[0]] for p in custom_permissions.models.permissions_list]

    iconos = {
        "Finanzas":"fa fa-university fa-5x",
        "Ventas":"fa fa-file-text-o fa-5x",
        "Stock":"fa fa-cube fa-5x",
        "Compras": "fa fa-shopping-cart fa-5x",
        "RRHH": "fa fa-users fa-5x",
        "Admin":"fa fa-cogs fa-5x",
        "Migraciones":"fa fa-random fa-5x",
        "Produccion":"fa fa-industry fa-5x",
    }

    for permiso in permisos: 
        if request.user.has_perm('custom_permissions.' + permiso[1]):
            icono = iconos.get(permiso[0], '')
            modulos_usuario.append([permiso[0], icono])

    return render(request, 'loggedin.html', {'modulos_usuario': modulos_usuario})

@login_required
def menu(request):
    q = request.GET.get('q', '')
    request.session['modulo_seleccionado'] = q
    permisos = {p[1]: p[0] for p in custom_permissions.models.permissions_list}

    titulo = ''
    if request.user.has_perm('custom_permissions.' + permisos.get(q, '')):
        titulo = permisos[q]

    return render(request, 'menu.html', {'titulo': titulo})

def invalid_login(request):
    return render(request, 'invalid_login.html')

def logout(request):
    auth.logout(request)
    return render(request, 'logout.html')
