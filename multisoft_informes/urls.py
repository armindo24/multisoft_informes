from django.contrib import admin
from multisoft_informes.admin_site import custom_admin_site
from django.urls import path, include
from custom_permissions import views as custom_permissions_views
from multisoft_informes import views as custom_views
from django.contrib.auth import views as auth_views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

handler500 = 'multisoft_informes.views.server_error'
handler404 = 'multisoft_informes.views.custom_404'
handler403 = 'multisoft_informes.views.custom_403'

urlpatterns = [
    path('admin/', custom_admin_site.urls),
            # Lightweight Dajaxice-compatible endpoints mapped to our functions
            path('dajaxice/custom_permissions.get_permisos_empresa/', custom_permissions_views.dajax_get_permisos_empresa),
            path('dajaxice/custom_permissions.save_permisos_empresa/', custom_permissions_views.dajax_save_permisos_empresa),

    # Autenticación personalizada
    path('', custom_views.login_view, name='login'),
    path('accounts/login/', custom_views.login_view, name='login'),
    path('accounts/logout/', custom_views.logout_view, name='logout'),
    path('accounts/loggedin/', custom_views.loggedin, name='loggedin'),
    path('accounts/invalid/', custom_views.invalid_login, name='invalid_login'),
    path('accounts/menu/', custom_views.menu, name='menu'),
    path('migraciones/asientos/', custom_views.migraciones_asientos, name='migraciones_asientos'),
    path('migraciones/ventas/', custom_views.migraciones_ventas, name='migraciones_ventas'),
    path('migraciones/compras/', custom_views.migraciones_compras, name='migraciones_compras'),
    path('api/next/migraciones/asientos/validate/', custom_views.api_migraciones_asientos_validate, name='api_migraciones_asientos_validate'),
    path('api/next/migraciones/asientos/migrate/', custom_views.api_migraciones_asientos_migrate, name='api_migraciones_asientos_migrate'),
    path('api/next/migraciones/ventas/validate/', custom_views.api_migraciones_ventas_validate, name='api_migraciones_ventas_validate'),
    path('api/next/migraciones/ventas/migrate/', custom_views.api_migraciones_ventas_migrate, name='api_migraciones_ventas_migrate'),

    # Cambiar contraseña con vistas integradas de Django
    path('accounts/password_change/', auth_views.PasswordChangeView.as_view(
        success_url='/accounts/password_change/done/'), name='password_change'),
    path('accounts/password_change/done/', auth_views.PasswordChangeDoneView.as_view(),
         name='password_change_done'),
    path('accounts/password_reset/', auth_views.PasswordResetView.as_view(
        success_url='/accounts/password_reset/done/'), name='password_reset'),
    path('accounts/password_reset/done/', auth_views.PasswordResetDoneView.as_view(),
         name='password_reset_done'),
    path('accounts/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),
    path('accounts/reset/done/', auth_views.PasswordResetCompleteView.as_view(),
         name='password_reset_complete'),

    # Módulos del sistema
    path('finanzas/', include(('finanzas.urls', 'finanzas'), namespace='finanzas')),
    path('ventas/', include(('ventas.urls', 'ventas'), namespace='ventas')),
    path('compras/', include(('compras.urls', 'compras'), namespace='compras')),
    path('stock/', include(('stock.urls', 'stock'), namespace='stock')),
    path('rrhh/', include(('rrhh.urls', 'rrhh'), namespace='rrhh')),
    path('custom_permissions/', include(('custom_permissions.urls', 'custom_permissions'), namespace='custom_permissions')),
]

urlpatterns += staticfiles_urlpatterns()
