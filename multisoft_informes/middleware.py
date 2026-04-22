from django.utils import timezone


class SessionActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        user = getattr(request, 'user', None)
        if user and user.is_authenticated:
            ip = request.META.get('HTTP_X_FORWARDED_FOR')
            if ip:
                ip = ip.split(',')[0].strip()
            else:
                ip = request.META.get('REMOTE_ADDR', '')
            ua = request.META.get('HTTP_USER_AGENT', '')
            request.session['last_activity'] = timezone.now().isoformat()
            request.session['ip_address'] = ip
            request.session['user_agent'] = ua[:255]
            request.session.modified = True
        return response
