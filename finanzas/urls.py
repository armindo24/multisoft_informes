
from django.conf.urls import patterns,url
from django.views.generic.base import TemplateView

urlpatterns = patterns('',
    url(r'^ordenpago/$',  TemplateView.as_view(template_name='finanzas/ordenpago.html'), name="ordenpago"),
    url(r'^balancegeneral/$',  TemplateView.as_view(template_name='finanzas/balancegeneral.html'), name="balancegeneral"),
    url(r'^balancegeneral_comprobado/$',  TemplateView.as_view(template_name='finanzas/balancegeneral_comprobado.html'), name="balancegeneral_comprobado"),
    url(r'^diario_comprobado/$',  TemplateView.as_view(template_name='finanzas/diario_comprobado.html'), name="diario_comprobado"),
)