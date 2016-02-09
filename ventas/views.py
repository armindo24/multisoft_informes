from django.shortcuts import render, render_to_response
from django.template.context import RequestContext
from django.contrib.auth.decorators import permission_required

# TODO: Add permission
@permission_required('custom_permissions.informe_ventascomprobante')
def venta_resumido(request):
    return render_to_response('ventas/resumido.html', {}, context_instance=RequestContext(request))
