FROM node:12

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY ./dist .


EXPOSE 8080

CMD ["node", "index.js"]
