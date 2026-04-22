from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission


ROLE_PERMISSIONS = {
    "Finanzas": [
        "entrar_finanzas",
        "informe_balancegeneral",
        "informe_balancegeneralpuc",
        "informe_balancegeneralcomprobado",
        "informe_diario",
        "informe_mayorcuenta",
        "informe_mayorcuentaauxiliar",
        "informe_ordenpago",
        "informe_extractocuenta",
        "informe_centrocostos",
        "informe_bienactivo",
        "informe_flujofondo",
    ],
    "Ventas": [
        "entrar_ventas",
        "informe_ventascomprobante",
        "informe_ventaestadisticos",
        "informe_recaudaciones",
        "informe_cuentascobrar",
        "informe_presupuesto",
    ],
    "Compras": [
        "entrar_compras",
        "informe_ordencompra",
        "informe_compras",
        "informe_saldosproveedores",
        "informe_fondofijo",
        "informe_gastosrendir",
        "informe_comprasestadisticos",
    ],
    "Stock": [
        "entrar_stock",
        "informe_articulos",
        "informe_depositos",
        "informe_valorizado",
        "informe_precios",
    ],
    "RRHH": [
        "entrar_rrhh",
        "informe_legajos",
        "informe_sueldosjornales",
        "informe_anticipos",
        "informe_aguinaldos",
        "informe_recibos",
    ],
    "Admin": [
        "entrar_admin",
        "entrar_asignacion",
        "config_email",
        "config_db",
    ],
    "Migraciones": [
        "entrar_migraciones",
    ],
    "Produccion": [
        "entrar_produccion",
    ],
}


class Command(BaseCommand):
    help = "Crea/actualiza grupos de roles y asigna permisos por módulo."

    def handle(self, *args, **options):
        created_groups = 0
        missing_perms = []

        for role, codenames in ROLE_PERMISSIONS.items():
            group, created = Group.objects.get_or_create(name=role)
            if created:
                created_groups += 1

            perms = []
            for codename in codenames:
                try:
                    perm = Permission.objects.get(codename=codename)
                    perms.append(perm)
                except Permission.DoesNotExist:
                    missing_perms.append(codename)

            group.permissions.set(perms)
            group.save()

        if created_groups:
            self.stdout.write(self.style.SUCCESS(f"Grupos creados: {created_groups}"))
        else:
            self.stdout.write(self.style.SUCCESS("Grupos actualizados"))

        if missing_perms:
            uniq = sorted(set(missing_perms))
            self.stdout.write(self.style.WARNING(
                "Permisos no encontrados: " + ", ".join(uniq)
            ))
