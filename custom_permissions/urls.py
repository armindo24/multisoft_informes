#from django.conf.urls import patterns, url
from django.urls import path
from custom_permissions import views

urlpatterns = (
       path('asignar_empresa_usuario/',views.asignar_empresa_usuario,name="asignar_empresa_usuario"),
       path('email_config/',views.email_config,name="email_config"),
       path('active_sessions/',views.active_sessions,name="active_sessions"),
       path('db_config/',views.db_config_list,name="db_config_list"),
       path('db_config/<str:db_type>/',views.db_config_edit,name="db_config_edit"),

)
