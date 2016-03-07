from django.shortcuts import render, render_to_response
from django.template.context import RequestContext
from django.contrib.auth.decorators import permission_required

# Create your views here.

#@permission_required('custom_permissions.informe_ordenpago')
def ordencompra(request):
    return render_to_response('compras/ordencompra.html', {'user':request.user.id}, context_instance=RequestContext(request))