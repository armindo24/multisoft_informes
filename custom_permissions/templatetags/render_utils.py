from django import template
from django.template import TemplateDoesNotExist
from django.template.loader import get_template

register = template.Library()


@register.simple_tag(takes_context=True)
def render_with_template_if_exist(context, template_name, fallback=""):
    try:
        tmpl = get_template(template_name)
    except TemplateDoesNotExist:
        return fallback or ""
    if hasattr(context, "flatten"):
        ctx = context.flatten()
    else:
        ctx = context
    return tmpl.render(ctx)
