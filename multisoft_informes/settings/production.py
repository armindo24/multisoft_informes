from .common import *

DEBUG = False

ALLOWED_HOSTS = ['*']

SECRET_KEY = env('DJANGO_SECRET_KEY')

DATABASES = {
    'default':
        {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'multisoft_informes',
            'USER': 'multisoft_user',
            'PASSWORD': 'password',
            'HOST': 'localhost',
            'PORT': ''
        }
}
