from __future__ import annotations

import argparse
import pathlib
import re
import sys


PROC_NAME = 'Gen_Informe_Despacho_PorcAranc'
PROC_NAME_RPT = 'Gen_Informe_Despacho_PorcAranc_Rpt'


def transform(sql: str) -> str:
    updated = sql

    updated, rename_count = re.subn(
        r'("DBA"\."|DBA\.)' + re.escape(PROC_NAME) + r'(")?',
        lambda m: (m.group(1) or '') + PROC_NAME_RPT + (m.group(2) or ''),
        updated,
        count=1,
        flags=re.IGNORECASE,
    )
    if rename_count != 1:
        raise ValueError('No pude renombrar la cabecera del procedimiento.')

    updated, cursor_count = re.subn(
        r'\n\s*declare\s+cur_FactDesp\s+dynamic\s+scroll\s+cursor\s+for.*?;\s*(?=\n\s*//|\n\s*declare|\n\s*set|\n\s*open)',
        '\n',
        updated,
        count=1,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if cursor_count != 1:
        raise ValueError('No pude ubicar el bloque "declare cur_FactDesp ...".')

    updated, tail_count = re.subn(
        r'\n\s*open\s+cur_FactDesp\s*;.*?\n\s*close\s+cur_FactDesp\s*(?=\n\s*end\b)',
        '\n',
        updated,
        count=1,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if tail_count != 1:
        raise ValueError('No pude ubicar el bloque final "open cur_FactDesp ... close cur_FactDesp".')

    return updated.strip() + '\n'


def main() -> int:
    parser = argparse.ArgumentParser(
        description='Genera Gen_Informe_Despacho_PorcAranc_Rpt a partir del SP original.'
    )
    parser.add_argument('input', help='Archivo .sql con el ALTER PROCEDURE original')
    parser.add_argument(
        '-o',
        '--output',
        help='Archivo de salida. Por defecto genera <input>.rpt.sql',
    )
    args = parser.parse_args()

    input_path = pathlib.Path(args.input)
    if not input_path.exists():
        print(f'No existe el archivo de entrada: {input_path}', file=sys.stderr)
        return 1

    output_path = pathlib.Path(args.output) if args.output else input_path.with_suffix(input_path.suffix + '.rpt.sql')

    source = input_path.read_text(encoding='utf-8')
    result = transform(source)
    output_path.write_text(result, encoding='utf-8')

    print(f'OK: generado {output_path}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
