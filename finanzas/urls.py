
from django.conf.urls import patterns,url

urlpatterns = patterns('',
    url(r'^ordenpago/$',  'finanzas.views.ordenpago', name="ordenpago"),
    url(r'^balancegeneral/$',  'finanzas.views.balancegeneral', name="balancegeneral"),
    url(r'^balancegeneral_comprobado/$',  'finanzas.views.balancegeneral_comprobado', name="balancegeneral_comprobado"),
    url(r'^diario_comprobado/$',  'finanzas.views.diario_comprobado', name="diario_comprobado"),
    url(r'^mayor_cuentas/$',  'finanzas.views.mayor_cuentas', name="mayor_cuentas"),
    url(r'^venta_resumido/$',  'finanzas.views.venta_resumido', name="venta_resumido"),
)