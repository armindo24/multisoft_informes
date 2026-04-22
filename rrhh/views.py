#from django.shortcuts import render, render_to_response
from django.shortcuts import render
from django.template.context import RequestContext
from django.contrib.auth.decorators import permission_required

# Create your views here.
@permission_required('custom_permissions.informe_legajos')
def legajos(request):
    return render(request,'rrhh/legajos.html', {'user': request.user.id})

@permission_required('custom_permissions.informe_sueldosjornales')
def sueldos_jornales(request):
    return render(request,'rrhh/sueldos_jornales.html', {'user': request.user.id})

@permission_required('custom_permissions.informe_anticipos')
def anticipos(request):
    return render(request,'rrhh/anticipos.html', {'user': request.user.id})

@permission_required('custom_permissions.informe_aguinaldos')
def aguinaldos(request):
    return render(request,'rrhh/aguinaldos.html', {'user': request.user.id})

@permission_required('custom_permissions.informe_recibos')
def recibos(request):
    return render(request,'rrhh/recibos.html', {'user': request.user.id})
