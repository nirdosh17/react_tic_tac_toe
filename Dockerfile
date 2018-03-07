FROM node:9-alpine

Label maintainer="Nirdosh Gautam <nrdshgtm@gmail.com>"

ENV HOME /app

ADD . $HOME

WORKDIR $HOME

EXPOSE 3000

RUN npm install

CMD ["npm", "start"]
