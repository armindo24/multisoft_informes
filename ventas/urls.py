from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^resumido/$', views.venta_resumido, name='resumido'),
    url(r'^presupuesto/$', views.presupuesto, name='presupuesto'),
    url(r'^cuentas_cobrar/$', views.cuentas_cobrar, name='cuentas_comprar'),
    url(r'^recaudaciones/$', views.recaudaciones, name='recaudaciones'),
    url(r'^estadisticas/$', views.estadisticas, name='estadisticas')
]
