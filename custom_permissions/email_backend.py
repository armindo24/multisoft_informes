from django.core.mail.backends.smtp import EmailBackend
from django.core.exceptions import ImproperlyConfigured

try:
    from custom_permissions.models import EmailConfig
except Exception:
    EmailConfig = None


class DatabaseEmailBackend(EmailBackend):
    """
    SMTP backend that reads configuration from EmailConfig (global).
    Falls back to parent initialization if no config is active.
    """
    def __init__(self, *args, **kwargs):
        config = None
        if EmailConfig is not None:
            try:
                config = EmailConfig.objects.filter(enabled=True).first()
            except Exception:
                config = None

        if config:
            kwargs.update({
                'host': config.host,
                'port': config.port,
                'username': config.username if config.use_auth else '',
                'password': config.password if config.use_auth else '',
                'use_tls': config.use_tls,
                'use_ssl': config.use_ssl,
                'timeout': kwargs.get('timeout', None),
                'fail_silently': kwargs.get('fail_silently', False),
            })
        else:
            # No config active: keep defaults
            pass

        super().__init__(*args, **kwargs)
