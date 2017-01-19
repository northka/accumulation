# docker学习

## Dockerfile
```docker
FROM node:latest  ###最好写版本
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
RUN npm i pm2 node-dev cross-env -g
EXPOSE 8000
CMD ["npm", "run", "dev"]
```