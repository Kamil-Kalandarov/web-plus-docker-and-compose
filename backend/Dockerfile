# базовый образ для сборки приложения
FROM node:16-alpine as builder
# рабочая директория внутри образа, где будет находится приложение
WORKDIR /app
# копирование файлов package.json и package.json.lock
COPY package*.json ./
# установка зависимостей, ci - установит зависимости именно из lock файла, 
# чтобы не было конфликтов версий пакетов на другом компьюетере
RUN npm ci
# копирование всех файлов и директорий из папки backend
COPY . .
# сборка проекта и удаление исходников с папкой node_modules
RUN npm run build \
    && rm -rf ./src \
    && rm -rf ./node_modules

# базовый образ для выкатики уже собранного бэка
FROM node:16-alpine as backend
# рабочая директория внутри образа, где будет находится приложение
WORKDIR /app
# копирование файлов package.json и package.json.lock
COPY package*.json ./
# установка зависимостей, но уже без dev зависимостей
RUN npm ci --omit=dev && npm i pm2 -g
# копирование папки dist (собранный проект) в папку dist образа
COPY --from=builder /app/dist ./dist
COPY ./ecosystem.config.js .
# COPY --from=builder /app/ecosystem.config.js .
EXPOSE 3000
CMD ["pm2-runtime", "start", "ecosystem.config.js"]