from .common import *
import importlib.util

DEBUG = False

ALLOWED_HOSTS = ['*']

env.read_env('.envariables')

SECRET_KEY = env('DJANGO_SECRET_KEY')

DATABASES = {
    'default':
        {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': env('DB_NAME', default='multisoft_informes'),
            'USER': env('DB_USER'),
            'PASSWORD': env('DB_PASSWORD'),
            'HOST': env('DB_HOST', default='localhost'),
            'PORT': env('DB_PORT', default='')
        }
}

if importlib.util.find_spec('redis_sessions') is not None and env('REDIS_SOCK', default=''):
    SESSION_ENGINE = 'redis_sessions.session'
    SESSION_REDIS_UNIX_DOMAIN_SOCKET_PATH = env('REDIS_SOCK')
    SESSION_REDIS_PREFIX = 'session'
else:
    SESSION_ENGINE = 'django.contrib.sessions.backends.db'
