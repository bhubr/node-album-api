FROM node:14.15.3
WORKDIR /app
COPY package.json /app
RUN npm install
COPY ./src /app/src
COPY ormconfig.ts /app
COPY public /app/public

CMD ["npm", "start"]
