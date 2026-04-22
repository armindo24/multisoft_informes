#from django.conf.urls import patterns, url
from finanzas.views import ordenpago, ordenpago_financiero
from django.urls import path
from . import views

urlpatterns = (
    path('ordenpago/',ordenpago, name="ordenpago"),
    path('ordenpago_financiero/',ordenpago_financiero, name="ordenpago_financiero"),
    path('balancegeneral/',views.balancegeneral, name="balancegeneral"),
    path('balancegeneral_puc/',views.balancegeneral_puc, name="balancegeneral_puc"),
    path('balancegeneral_comprobado/',views.balancegeneral_comprobado, name="balancegeneral_comprobado"),
    path('diario_comprobado/',views.diario_comprobado, name="diario_comprobado"),
    path('mayor_cuentas/',views.mayor_cuentas, name="mayor_cuentas"),
    path('mayor_cuentas_auxiliar/',views.mayor_cuentasauxiliar, name="mayor_cuentasauxiliar"),
    path('extracto_cuentas_banco/',views.extracto_cuentas_banco, name='extracto_cuentas_banco'),
    path('centro_costos/',views.centro_costos, name="centro_costos"),
    path('bienes_activo/',views.bienes_activo, name="bienes_activo"),
    path('flujo_fondo/', views.flujo_fondo, name="flujo_fondo"),
    path('dashboard_financiero/', views.dashboard_financiero, name="dashboard_financiero"),
    path('balance_integral/', views.balance_integral, name="balance_integral"),
)
