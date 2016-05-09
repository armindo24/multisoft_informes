from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^articulos/$', views.articulos, name='articulos'),
    url(r'^precios/$', views.precios, name='precios'),
    url(r'^existencia_deposito/$', views.existencia_deposito, name='existencia_deposito'),
    url(r'^valorizado/$', views.valorizado, name='valorizado'),
    url(r'^ficha/$', views.ficha_productos, name='ficha_productos')
]
