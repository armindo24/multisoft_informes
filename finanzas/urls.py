from django.conf.urls import patterns, url
from . import views

urlpatterns = patterns('',
    url(r'^ordenpago/$',  'finanzas.views.ordenpago', name="ordenpago"),
    url(r'^balancegeneral/$',  'finanzas.views.balancegeneral', name="balancegeneral"),
    url(r'^balancegeneral_comprobado/$',  'finanzas.views.balancegeneral_comprobado', name="balancegeneral_comprobado"),
    url(r'^diario_comprobado/$',  'finanzas.views.diario_comprobado', name="diario_comprobado"),
    url(r'^mayor_cuentas/$',  'finanzas.views.mayor_cuentas', name="mayor_cuentas"),
    url(r'^mayor_cuentas_auxiliar/$',  'finanzas.views.mayor_cuentasauxiliar', name="mayor_cuentasauxiliar"),
    url(r'^extracto_cuentas_banco/$', views.extracto_cuentas_banco, name='extracto_cuentas_banco')
)