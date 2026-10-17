#!/bin/bash
# Instala en la Mac de Luz el publicador de carpetas de Drive (cada 10 min). Correr desde ~/CIMA-Paginas: bash drive/instalar.sh
set -e
AQUI="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$HOME/CIMA-Drive" && cp "$AQUI/carpetas_drive.py" "$HOME/CIMA-Drive/"
PY="$(command -v python3.12 || echo /usr/bin/python3)"; [ -x "$HOME/CIMA-Animados/venv/bin/python3" ] && PY="$HOME/CIMA-Animados/venv/bin/python3"
P="$HOME/Library/LaunchAgents/com.cima.drive.carpetas.plist"
cat > "$P" <<EOP
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>com.cima.drive.carpetas</string>
  <key>ProgramArguments</key><array><string>$PY</string><string>$HOME/CIMA-Drive/carpetas_drive.py</string></array>
  <key>StartInterval</key><integer>600</integer><key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>$HOME/CIMA-Drive/log.txt</string>
  <key>StandardErrorPath</key><string>$HOME/CIMA-Drive/log.txt</string>
</dict></plist>
EOP
launchctl unload "$P" 2>/dev/null || true
launchctl load "$P"
"$PY" "$HOME/CIMA-Drive/carpetas_drive.py"
