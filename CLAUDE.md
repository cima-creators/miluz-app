# Páginas de los bots de Mi Luz (repo cima-creators/miluz-app)

Estas son las páginas donde Luz elige y revisa lo que hacen sus bots. Se publican solas en **cima-creators.github.io/miluz-app/<carpeta>/**
1-2 minutos después de cada `git push`. Las pueden cambiar Luz (desde su Mac, `~/CIMA-Paginas`) y CIMA.

| Página | Carpeta |
|---|---|
| Panel con todos los bots | `sistemas/` |
| Estáticos · Animados · Edición · B-roll · Ads Random | `estaticos/` `animados/` `edicion/` `broll/` `random/` |
| Variantes de ganadores (copia de Mi Luz) | `variantes/` |

## Cómo se hace un cambio (siempre así)
1. `git pull --rebase` antes de tocar nada (CIMA también publica acá).
2. Editar el `index.html` de esa carpeta. Cada página es un HTML de un solo archivo: buscar la parte que hay que cambiar y tocar solo eso.
3. Probarla en el navegador: `python3 -m http.server 8000` en esta carpeta y abrir `http://localhost:8000/<carpeta>/` (entrar con la clave).
4. `git add -A && git commit -m "<qué cambió, en criollo>" && git push`. En 1-2 minutos está publicado.
5. Anotarlo en `~/CIMA-Cambios-Luz/paginas.md` (fecha + qué) si el cambio lo pidió Luz.

## Lo que no se toca desde acá
- Los datos viven en Firebase (proyecto `cleargy-creators`, de CIMA). Si un cambio necesita una colección o un campo nuevo que el bot tiene
  que leer, hay que cambiar también el bot de esa carpeta en la Mac de Luz (`~/CIMA-<bot>`). Si necesita una regla nueva de Firestore,
  avisarle a CIMA: eso no se puede desde acá.
- Este repo es PÚBLICO: nunca claves, contraseñas de cuentas ni datos de clientas. Las claves de las páginas (miluz-2026, cima-2026) ya están.
- Reglas de marca de Mi Luz: solo ácido hialurónico y calcio; nunca "fortalecedor", "hace crecer la uña", "nutre/hidrata/revitaliza".
