FROM node:10

WORKDIR /usr/src/app

COPY ./dist .
COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

EXPOSE 8080

CMD ["node", "index.js"]
