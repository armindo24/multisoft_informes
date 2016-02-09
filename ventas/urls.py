from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^resumido/$', views.venta_resumido, name='resumido')
]
