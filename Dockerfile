FROM node:16-alpine AS prodbase 

WORKDIR /usr/compileapi

RUN npm install --location=global typescript

COPY ./package.json /usr/compileapi/
COPY ./yarn.lock /usr/compileapi/

RUN yarn install 

COPY ./ /usr/compileapi/

RUN tsc

FROM prodbase AS newprodbase

RUN npm install --location=global pm2

COPY --from=prodbase /usr/compileapi/dist /usr/prodapi/dist
COPY --from=prodbase /usr/compileapi/node_modules /usr/prodapi/node_modules
COPY --from=prodbase /usr/compileapi/package.json /usr/prodapi/package.json

WORKDIR /usr/prodapi
