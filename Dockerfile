FROM node:lts

WORKDIR /usr/src/todo-api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]

