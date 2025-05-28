FROM node:24-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=5000
ENV MONGO_URI=mongodb://localhost:27017/sit753?authSource=admin
# ENV JWT_SECRET=sit753-7.3HD

EXPOSE 5000

CMD ["npm", "start"]