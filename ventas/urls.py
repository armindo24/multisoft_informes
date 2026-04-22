#from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns = [
    path('resumido/', views.venta_resumido, name='resumido'),
    path('presupuesto/', views.presupuesto, name='presupuesto'),
    path('cuentas_cobrar/', views.cuentas_cobrar, name='cuentas_comprar'),
    path('recaudaciones/', views.recaudaciones, name='recaudaciones'),
    path('estadisticas/', views.estadisticas, name='estadisticas')
]
