"""informes URL Configuration

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

handler500 = 'informes.views.server_error'
handler404 = 'informes.views.custom_404'

urlpatterns = patterns('',
                       
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/login/$',   'informes.views.login'),
    url(r'^accounts/auth/$',   'informes.views.auth_view'),
    url(r'^accounts/logout/$',   'informes.views.logout'),
    url(r'^accounts/loggedin/$',   'informes.views.loggedin'),
    url(r'^accounts/invalid/$',   'informes.views.invalid_login'),
    url(r'^accounts/menu/$',   'informes.views.menu'),
    url(r'^accounts/password_change/$', 
        'django.contrib.auth.views.password_change', 
        {'post_change_redirect' : '/accounts/password_change/done/'}, 
        name="password_change"), 
    (r'^accounts/password_change/done/$', 
        'django.contrib.auth.views.password_change_done'),
     url(r'^finanzas/', include("finanzas.urls", namespace="finanzas")),
)

urlpatterns += staticfiles_urlpatterns()
