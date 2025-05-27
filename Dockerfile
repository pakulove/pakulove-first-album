FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ssl/__pakulove_ru.crt /etc/nginx/ssl/__pakulove_ru.crt
COPY ssl/__pakulove_ru.key /etc/nginx/ssl/__pakulove_ru.key
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"] 