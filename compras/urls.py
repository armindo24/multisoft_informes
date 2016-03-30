from django.conf.urls import patterns, url
from . import views
from django.views.generic import TemplateView

urlpatterns = patterns('',
    url(r'^ordencompra/$',  'compras.views.ordencompra', name="ordencompra"),
    url(r'^compras/$',  'compras.views.compras', name="compras"),
    url(r'^compras_articulo/$',  'compras.views.compras_articulo', name="compras_articulo"),
    url(r'^saldos_proveedores/$',  'compras.views.saldos_proveedores', name="saldos_proveedores"),
    url(r'^fondo_fijo/$',  'compras.views.fondo_fijo', name="fondo_fijo"),
    url(r'^gastos_rendir/$',  'compras.views.gastos_rendir', name="gastos_rendir"),
    url(r'^estad/$',  TemplateView.as_view(template_name='compras/chartEjemplo.html'), name="chart_ejemplo")
)