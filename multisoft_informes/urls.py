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
from django.conf.urls import include, url, patterns
from django.contrib import admin
from django.views.generic.base import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from dajaxice.core import dajaxice_autodiscover, dajaxice_config

dajaxice_autodiscover()

handler500 = 'multisoft_informes.views.server_error'
handler404 = 'multisoft_informes.views.custom_404'

urlpatterns = patterns('',

    url(r'^admin/', include(admin.site.urls)),
    url(dajaxice_config.dajaxice_url, include('dajaxice.urls')),
    url(r'^accounts/login/$',   'multisoft_informes.views.login'),
    url(r'^accounts/auth/$',   'multisoft_informes.views.auth_view'),
    url(r'^accounts/logout/$',   'multisoft_informes.views.logout'),
    url(r'^accounts/loggedin/$',   'multisoft_informes.views.loggedin'),
    url(r'^accounts/invalid/$',   'multisoft_informes.views.invalid_login'),
    url(r'^accounts/menu/$',   'multisoft_informes.views.menu'),
    url(r'^accounts/password_change/$', 
        'django.contrib.auth.views.password_change', 
        {'post_change_redirect' : '/accounts/password_change/done/'}, 
        name="password_change"), 
    (r'^accounts/password_change/done/$', 
        'django.contrib.auth.views.password_change_done'),
    url(r'^finanzas/', include("finanzas.urls", namespace="finanzas")),
    url(r'^ventas/', include('ventas.urls', namespace='ventas')),
    url(r'^compras/', include('compras.urls', namespace='compras')),
    url(r'^stock/', include('stock.urls', namespace='stock')),
    url(r'^rrhh/', include('rrhh.urls', namespace='rrhh')),
    url(r'^custom_permissions/', include("custom_permissions.urls", namespace="custom_permissions")),
)

urlpatterns += staticfiles_urlpatterns()
