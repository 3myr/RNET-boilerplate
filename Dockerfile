FROM node:18-alpine

# Défini le répertoire de travail dans le conteneur
WORKDIR /app

# Optimisation du cache Docker
COPY package.json package-lock.json ./

# Installation les dépendances
RUN npm install

# Copie du code source dans le conteneur
COPY . .

# Permissions d'exécution au script
RUN chmod +x /app/start.sh

# Peut etre modifier
EXPOSE 8081 19000 19001 19002 19006

# Lancement du script
CMD ["/app/start.sh"]
