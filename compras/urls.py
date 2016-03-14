from django.conf.urls import patterns, url
from . import views

urlpatterns = patterns('',
    url(r'^ordencompra/$',  'compras.views.ordencompra', name="ordencompra"),
    url(r'^compras/$',  'compras.views.compras', name="compras"),
    url(r'^presupuesto/$', views.presupuesto, name='presupuesto')
)