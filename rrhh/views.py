from django.shortcuts import render, render_to_response
from django.template.context import RequestContext

# Create your views here.
#@permission_required('custom_permissions.informe_ventascomprobante')
def legajos(request):
    return render_to_response('rrhh/legajos.html', {'user': request.user.id}, context_instance=RequestContext(request))
