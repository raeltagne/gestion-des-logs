FROM node:22
WORKDIR /app
#installer unoquement les dependances necessaires
COPY package*.json ./
RUN npm install --production
#copier le code source
COPY ..
#compiler le projet 
RUN npm run build
#lancer l'application compilée
CMD ["node", "dist/main"]