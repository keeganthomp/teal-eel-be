FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir /etc/letsencrypt

ADD letsencrypt/live/www.tealeel-api.com/fullchain.pem /etc/letsencrypt
ADD letsencrypt/live/www.tealeel-api.com/privkey.pem /etc/letsencrypt

RUN ls /etc/letsencrypt


EXPOSE "80"
EXPOSE "443"