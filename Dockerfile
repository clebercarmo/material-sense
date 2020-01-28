FROM node:12.2.0-alpine as build
WORKDIR /app
COPY . /app

FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 9000
CMD ["nginx", "-g", "daemon off;"]