from .common import *

DEBUG = True

ALLOWED_HOSTS = ['*']

SECRET_KEY = 'w#@8h=qh07b46fup8sh3j@ly+u-*_4xhljl+dn6ojbw!r0fk+3'

DATABASES = {
    'default':
        {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'multisoft_informes',
            'USER': 'postgres',
            'PASSWORD': 'postgres',
            'HOST': 'localhost',
            'PORT': ''
        }
}
