from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^articulos/$', views.articulos, name='articulos'),
    url(r'^precios/$', views.precios, name='precios'),
]
