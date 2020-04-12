FROM node:latest as build

WORKDIR /home/app

COPY package*.json ./

RUN npm install --production

ARG REACT_APP_API_URL

COPY . .

RUN npm run build

# Final Stage: Export
FROM nginx:alpine

COPY --from=build /home/app/build /usr/share/nginx/html
