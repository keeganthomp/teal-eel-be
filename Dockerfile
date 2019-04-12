FROM node:8 as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir /etc/letsencrypt

COPY letsencrypt/live/tealeel.com/fullchain.pem /etc/letsencrypt

COPY letsencrypt/live/tealeel.com/privkey.pem /etc/letsencrypt

COPY --from=react-build /app/build /usr/share/nginx/html
