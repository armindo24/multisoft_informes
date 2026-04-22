from django.contrib import admin
from django.core.exceptions import PermissionDenied


class CustomAdminSite(admin.AdminSite):
    def app_index(self, request, app_label, extra_context=None):
        if not request.user.has_module_perms(app_label):
            raise PermissionDenied
        return super().app_index(request, app_label, extra_context=extra_context)


custom_admin_site = CustomAdminSite(name='custom_admin')
custom_admin_site._registry = admin.site._registry
