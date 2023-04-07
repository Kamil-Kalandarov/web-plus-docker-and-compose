# базовый образ для сборки приложения
FROM node:16-alpine AS builder
# рабочая директория внутри образа, где будет находится приложение
WORKDIR /app
# копирование файлов package.json и package.json.lock
COPY package*.json ./
# установка зависимостей, ci - установит зависимости именно из lock файла, 
# чтобы не было конфликтов версий пакетов на другом компьюетере
RUN npm ci
# копирование всех файлов и директорий из папки frontend
COPY . .
# сборка проекта
RUN npm run build

# базовый образ для отображения статичного фронта через nginx
FROM nginx:latest AS production
# рабочая директория внутри образа, где будет находится приложение
WORKDIR /app
# копирование папки build из уже собранного образа builder выше в nginx
COPY --from=builder /app/build /usr/share/nginx/html
# копирование файла конфигурации для nginx
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
