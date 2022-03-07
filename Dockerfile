FROM node:latest

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install

COPY . .

EXPOSE 4001

CMD ["node","index.js"]