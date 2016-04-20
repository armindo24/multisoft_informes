from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^legajos/$', views.legajos, name='legajos'),
]
