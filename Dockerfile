FROM node:lts-alpine
WORKDIR /app
COPY package.json /app
RUN npm install
COPY ./src /app/src
COPY ormconfig.ts ./src/
COPY tsconfig.json .
RUN npm run build
RUN cp dist/ormconfig.js* .
COPY public /app/public
RUN rm -rf src

CMD ["npm", "start"]
