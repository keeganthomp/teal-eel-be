FROM node:8
RUN mkdir /tealeel-api
ADD . /tealeel-api
WORKDIR /tealeel-api
RUN npm install pm2 -g
RUN npm i
EXPOSE 3000
CMD ["pm2-runtime", "start"]
