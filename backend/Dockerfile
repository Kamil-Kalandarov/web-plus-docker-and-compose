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
# сборка проекта
RUN npm run build

# базовый образ для выкатики уже собранного бэка
FROM node:16-alpine as production
# рабочая директория внутри образа, где будет находится приложение
WORKDIR /app
# копирование файлов package.json и package.json.lock
COPY package*.json ./
# установка зависимостей, но уже без dev зависимостей
RUN npm ci --omit=dev
# копирование папки dist (собранный проект) в папку dist образа
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "./dist/main.js"]