FROM node:8
RUN mkdir /practice_docker
ADD . /practice_docker
WORKDIR /practice_docker
RUN npm i
EXPOSE 3000
CMD ["npm", "start"]
