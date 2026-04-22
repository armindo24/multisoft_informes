#from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns = [
    path('articulos/', views.articulos, name='articulos'),
    path('precios/', views.precios, name='precios'),
    path('existencia_deposito/', views.existencia_deposito, name='existencia_deposito'),
    path('valorizado/', views.valorizado, name='valorizado'),
    path('ficha/', views.ficha_productos, name='ficha_productos'),
    path('costo_articulo_full/', views.costo_articulo_full, name='costo_articulo_full'),
]
