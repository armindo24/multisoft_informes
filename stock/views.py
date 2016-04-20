from django.shortcuts import render, render_to_response
from django.template.context import RequestContext
from django.contrib.auth.decorators import permission_required


# TODO: Permiso
def articulos(request):
    return render_to_response('stock/articulos.html', {'user': request.user.id},
                              context_instance=RequestContext(request))
