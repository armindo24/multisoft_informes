'''
Created on 2 de dic. de 2015

@author: Lucas
'''
# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response, render
from django.http import HttpResponseRedirect
from django.contrib import auth
from django.core.context_processors import csrf
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import *
from django.template.context import RequestContext
from django.contrib.auth.models import Permission

from django.shortcuts import render_to_response
from django.template import RequestContext
import custom_permissions

def server_error(request, template_name='500.html'):
    """
    500 error handler.

    Templates: `500.html`
    Context: None
    """
    return render_to_response(template_name,
        context_instance = RequestContext(request)
    )

def custom_404(request):
    return render(request, '404.html', {}, status=404)

def login(request):
    c = {}
    c.update(csrf(request))
    return render_to_response('login.html', c)

def auth_view(request):
    username = request.POST.get('username','')
    password = request.POST.get('password','')
    user = auth.authenticate(username=username, password=password)
    
    if user is not None:
        auth.login(request, user)
        return HttpResponseRedirect('/accounts/loggedin')
    else:
        return HttpResponseRedirect('/accounts/invalid')

def loggedin(request):    
    modulos_usuario=[]
    permisos = []   #Debe ser invertida.
    for permission in custom_permissions.models.permissions_list:
        permisos.append([permission[1], permission[0]])
        
    iconos = {"Finanzas":"fa fa-university fa-5x",
              "Ventas":"fa fa-file-text-o fa-5x",
              "Stock":"fa fa-cube fa-5x",
              "Compras": "fa fa-shopping-cart fa-5x",
              "RRHH": "fa fa-users fa-5x",
              "Admin":"fa fa-cogs fa-5x",
              }
    
    for permiso in permisos: 
        print request.user.has_perm('custom_permissions.'+permiso[1])
        if request.user.has_perm('custom_permissions.'+permiso[1]):
            icono = iconos[permiso[0]]
            modulos_usuario+=[[permiso[0],icono]]
    return render_to_response('loggedin.html',
                              {'modulos_usuario':modulos_usuario},RequestContext(request))
def menu(request):
    q=request.GET.get('q','')
    request.session['modulo_seleccionado'] = q
    permisos = {}
    for permission in custom_permissions.models.permissions_list:
        permisos[permission[1]] = permission[0]
        
    if request.user.has_perm('custom_permissions.'+permisos[q]):
        if q == "Ventas":
            titulo = 'Ventas'
        elif q == "Stock":
            titulo = 'Stock'
        elif q == "Finanzas":
            titulo = 'Finanzas'
        elif q == "Compras":
            titulo = 'Compras'
        elif q == "RRHH":
            titulo = 'RRHH'
        elif q == "Admin":
            titulo = 'Admin'

    return render_to_response('menu.html',
                              {'titulo':titulo},RequestContext(request))
    
def invalid_login(request):
    return render_to_response('invalid_login.html')

def logout(request):
    auth.logout(request)
    return render_to_response('logout.html')
    