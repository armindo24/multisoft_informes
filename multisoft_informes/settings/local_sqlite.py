from .common import *

# Ajustes rápidos para desarrollo local con SQLite (no para producción)
DEBUG = True

SECRET_KEY = 'dev-secret-local'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
