#!/bin/sh

echo "---------------------------------------"
echo "🚀 Configuration du projet Expo"
echo "---------------------------------------"

# Cas terminal interactif
if [ -t 1 ]; then
  echo "🔹 Sélectionnez la plateforme cible :"
  echo "1) Mobile (Expo Start)"
  echo "2) Android"
  echo "3) iOS"
  echo "4) Web"
  echo "5) Toutes les plateformes"
  read -p "Votre choix (1-5) : " CHOIX

  case "$CHOIX" in
      1) CMD="npx expo start --tunnel";;
      2) CMD="npx expo start --android --host lan";;
      3) CMD="npx expo start --ios --host lan";;
      4) CMD="npx expo start --web --host lan";;
      5) CMD="npx expo start --android --ios --web --host lan";;
      *) echo "❌ Option invalide, démarrage par défaut avec 'npx expo start'"; CMD="npx expo start --web --host lan";;
  esac
else
  # Mode automatique : Utilisation du port par défaut et lancement en mode web
  echo "🔹 Mode automatique détecté"
  CMD="npx expo start --web --host lan"
fi

# Lancement de Expo
$CMD &

# Lancement de localtunnel après 5 secondes pour laisser Expo démarrer
sleep 5
npx lt --port 8081 --subdomain "__TUNNEL_SUBDOMAIN__" &

# Vérification avec wget
wget -q -O - https://loca.lt/mytunnelpassword &

# Garde le conteneur actif
wait
