from .common import *

DEBUG = True

ALLOWED_HOSTS = ['*']

CSRF_TRUSTED_ORIGINS = [
    'http://10.0.0.22:8000',
]

# Email backend: use DB-stored SMTP config.
EMAIL_BACKEND = 'custom_permissions.email_backend.DatabaseEmailBackend'

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
