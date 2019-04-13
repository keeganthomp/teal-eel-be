FROM node:8
RUN mkdir /practice_docker
ADD . /practice_docker
WORKDIR /practice_docker
RUN npm install pm2 -g
RUN npm i
EXPOSE 3000
CMD ["pm2-runtime", "start"]
