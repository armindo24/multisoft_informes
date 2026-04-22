"""multisoft_informes URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
#from django.conf.urls import include, url, patterns
#from multisoft_informes.views import login

from django.contrib import admin
from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views
from multisoft_informes import views as custom_views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

handler500 = 'multisoft_informes.views.server_error'
handler404 = 'multisoft_informes.views.custom_404'

urlpatterns = [
    path('admin/', admin.site.urls),

    # Autenticación personalizada
   # path('', custom_views.login, name='login'),
    path('accounts/login/', custom_views.login, name='login'),
    path('accounts/auth/', custom_views.auth_view, name='auth_view'),
    path('accounts/logout/', custom_views.logout, name='logout'),
    path('accounts/loggedin/', custom_views.loggedin, name='loggedin'),
    path('accounts/invalid/', custom_views.invalid_login, name='invalid_login'),
    path('accounts/menu/', custom_views.menu, name='menu'),

    # Cambiar contraseña con vistas integradas de Django
    path('accounts/password_change/', auth_views.PasswordChangeView.as_view(
        success_url='/accounts/password_change/done/'), name='password_change'),
    path('accounts/password_change/done/', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),

    # Módulos del sistema
    path('finanzas/', include(('finanzas.urls', 'finanzas'), namespace='finanzas')),
    path('ventas/', include(('ventas.urls', 'ventas'), namespace='ventas')),
    path('compras/', include(('compras.urls', 'compras'), namespace='compras')),
    path('stock/', include(('stock.urls', 'stock'), namespace='stock')),
    path('rrhh/', include(('rrhh.urls', 'rrhh'), namespace='rrhh')),
    path('custom_permissions/', include(('custom_permissions.urls', 'custom_permissions'), namespace='custom_permissions')),
]

urlpatterns += staticfiles_urlpatterns()
