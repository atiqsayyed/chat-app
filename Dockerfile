FROM node:alpine

WORKDIR /usr/app

COPY . .

RUN yarn install --ignore-scripts

RUN yarn install

CMD  node ./server/chat-server.js & yarn start