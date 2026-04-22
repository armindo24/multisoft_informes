#from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns = [
    path('legajos/', views.legajos, name='legajos'),
    path('sueldos_jornales/', views.sueldos_jornales, name='sueldos_jornales'),
    path('anticipos/', views.anticipos, name='anticipos'),
    path('aguinaldos/', views.aguinaldos, name='aguinaldos'),
    path('recibos/', views.recibos, name='recibos'),
]
