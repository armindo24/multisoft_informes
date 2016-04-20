from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^articulos/$', views.articulos, name='articulos'),
]
