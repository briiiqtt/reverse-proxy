FROM nginx:stable-alpine

# nginx의 기본 설정 경로는 보통 /etc/nginx/nginx.conf
COPY ./conf/ /etc/nginx/

# nginx html 기본 경로는 /usr/share/nginx/html
COPY ./html /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]