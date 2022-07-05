FROM node:16-alpine AS devbase

WORKDIR /usr/api

RUN npm i --location=global typescript

COPY ./package.json ./

COPY ./yarn.lock ./

RUN yarn install 

COPY ./ ./

RUN yarn build



# FROM node:16-alpine AS prodbase

# RUN npm i --location=global pm2

# ARG NODE_ENV=production

# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/api

# COPY ./package.json ./

# COPY ./yarn.lock ./

# RUN yarn install --production --frozen-lockfile

# COPY --from=devbase /usr/api/dist ./dist

# CMD ["pm2-runtime", "dist/app.js"]