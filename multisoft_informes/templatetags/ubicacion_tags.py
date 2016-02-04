from django import template
register = template.Library()

@register.filter
def get_object_name(objeto):
    return objeto.Meta.model.__name__
  