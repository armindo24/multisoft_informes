"""
WSGI config for multisoft_informes project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

import os,sys

sys.path.append("/home/luke/webapps/multisoft_informes/lib/python2.7/site-packages")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "multisoft_informes.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
