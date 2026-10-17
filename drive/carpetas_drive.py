#!/usr/bin/env python3
"""Publica en Firebase (miluz_drive/carpetas) los IDs de las carpetas de Drive de "Mi Luz · Bots",
para que cada página tenga su botón "📁 Carpeta en Drive" (pedido de Luz, 17/10/2026: "no doy con las carpetas").
Corre en la Mac de Luz cada 10 min (launchd com.cima.drive.carpetas). Solo lee carpetas; no mueve nada.
Uso: python3 carpetas_drive.py        (una pasada)
"""
import json, subprocess, time, urllib.request, datetime
from pathlib import Path

KEY = "AIzaSyCTv4DiRCpbCpGYP6E86TPHlkPvaAZTN3g"   # clave web pública de Firebase (la misma de las páginas)
DOC = "https://firestore.googleapis.com/v1/projects/cleargy-creators/databases/(default)/documents/miluz_drive/carpetas"
REV, LIS = "🔍 En revisión", "✅ Listos para subir"


def bots_dir():
    for mi in sorted(Path.home().glob("Library/CloudStorage/GoogleDrive-*/Mi unidad")) + \
              sorted(Path.home().glob("Library/CloudStorage/GoogleDrive-*/My Drive")):
        if (mi / "Mi Luz · Bots").exists():
            return mi / "Mi Luz · Bots"
    raise SystemExit("No encuentro «Mi Luz · Bots» en Google Drive para escritorio")


def fid(p: Path) -> str:
    r = subprocess.run(["xattr", "-p", "com.google.drivefs.item-id#S", str(p)], capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else ""


def carpeta(p: Path, dia=""):
    i = fid(p)
    return {"id": i, "dia": dia} if i else None


def main():
    b = bots_dir()
    datos = {"actualizado": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
             "raiz": fid(b), "revision": fid(b / REV), "listos": fid(b / LIS), "formatos": {}}
    for clave, nombre in (("revision", REV), ("listos", LIS)):
        base = b / nombre
        dias = sorted((d for d in base.iterdir() if d.is_dir() and d.name[:4].isdigit()), reverse=True) if base.exists() else []
        if dias:
            c = carpeta(dias[0], dias[0].name)
            if c: datos[clave + "Hoy"] = c
        for d in dias:                       # el día más nuevo que tenga ese formato
            for f in d.iterdir():
                if f.is_dir() and not f.name.startswith("."):
                    fm = datos["formatos"].setdefault(f.name, {})
                    if clave not in fm and (c := carpeta(f, d.name)):
                        fm[clave] = c

    def enc(v):
        if isinstance(v, dict): return {"mapValue": {"fields": {k: enc(x) for k, x in v.items()}}}
        return {"stringValue": str(v)}
    tok = json.load(urllib.request.urlopen(urllib.request.Request(
        f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={KEY}", data=b'{"returnSecureToken":true}',
        headers={"Content-Type": "application/json"}), timeout=60))["idToken"]
    urllib.request.urlopen(urllib.request.Request(DOC, method="PATCH",
        data=json.dumps({"fields": {k: enc(v) for k, v in datos.items()}}).encode(),
        headers={"Authorization": "Bearer " + tok, "Content-Type": "application/json"}), timeout=60)
    print(time.strftime("%Y-%m-%d %H:%M"), "ok ·", ", ".join(datos["formatos"]) or "sin formatos todavía")


if __name__ == "__main__":
    main()
