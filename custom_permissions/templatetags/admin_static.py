from django import template
from django.templatetags.static import static

register = template.Library()


@register.simple_tag
def admin_static_url():
    return static('admin/')


@register.simple_tag
def admin_static(path):
    return static(path)
