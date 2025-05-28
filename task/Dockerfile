FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=5000
ENV MONGO_URI=mongodb://mongodb:27017/sit753?authSource=admin

EXPOSE 5000

CMD ["npm", "start"]