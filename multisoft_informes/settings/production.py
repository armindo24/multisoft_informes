from .common import *

DEBUG = False

ALLOWED_HOSTS = ['*']

env.read_env('.envariables')

SECRET_KEY = env('DJANGO_SECRET_KEY')

DATABASES = {
    'default':
        {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'multisoft_informes',
            'USER': env('DB_USER'),
            'PASSWORD': env('DB_PASSWORD'),
            'HOST': 'localhost',
            'PORT': ''
        }
}