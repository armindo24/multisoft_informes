
from django import template

register = template.Library()
@register.filter
def paginator_delimiter(last, current):
    lista=[]
    pages=int(15/2)
    for i in range(current-pages,current):
        if i >= 1:
            lista.append(i)
        
    for i in range(current,len(last)):
        if i<current+pages+1:
            lista.append(i)
    return lista


from django import template

@register.filter()
def to_int(value):
    return int(value)
