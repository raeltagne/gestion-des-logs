FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ..
RUN npm run build
#copier le build dans le volume partagé
FROM alpine
WORKDIR /dist
COPY --from=builder /app/dist ./