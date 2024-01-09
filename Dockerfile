FROM node:lts-alpine as build-stage
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:lts-alpine as production
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build-stage /app/.next ./.next
COPY --from=build-stage /app/package.json ./package.json
COPY --from=build-stage /app/public ./public

RUN yarn install --production --frozen-lockfile && yarn cache clean

EXPOSE 3000

CMD yarn start