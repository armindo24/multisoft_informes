from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^legajos/$', views.legajos, name='legajos'),
    url(r'^sueldos_jornales/$', views.sueldos_jornales, name='sueldos_jornales'),
    url(r'^anticipos/$', views.anticipos, name='anticipos'),
    url(r'^aguinaldos/$', views.aguinaldos, name='aguinaldos'),
    url(r'^recibos/$', views.recibos, name='recibos'),
]
