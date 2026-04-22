#from django.conf.urls import patterns, url
from compras import views
from django.urls import path
from django.views.generic import TemplateView

urlpatterns = (
    path('ordencompra/',views.ordencompra, name="ordencompra"),
    path('compras/',views.compras, name="compras"),
    path('compras_articulo/',views.compras_articulo, name="compras_articulo"),
    path('saldos_proveedores/',views.saldos_proveedores, name="saldos_proveedores"),
    path('fondo_fijo/',views.fondo_fijo, name="fondo_fijo"),
    path('gastos_rendir/',views.gastos_rendir, name="gastos_rendir"),
    path('estadisticos/',views.compras_estadisticos, name="compras_estadisticos"),
)
