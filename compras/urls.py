from django.conf.urls import patterns, url
from . import views

urlpatterns = patterns('',
    url(r'^ordencompra/$',  'compras.views.ordencompra', name="ordencompra"),
    url(r'^compras/$',  'compras.views.compras', name="compras"),
    url(r'^compras_articulo/$',  'compras.views.compras_articulo', name="compras_articulo")
)