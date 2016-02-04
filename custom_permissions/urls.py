from django.conf.urls import patterns,url

urlpatterns = patterns('',
        url(r'^asignar_empresa_usuario/$',  
           'custom_permissions.views.asignar_empresa_usuario', 
           name="asignar_empresa_usuario"),
                       
)