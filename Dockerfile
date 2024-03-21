FROM node:20.11.1 as production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY . .

RUN ls -a

RUN yarn add global nestjs
RUN yarn install --frozen-lockfile
RUN yarn run build

CMD ["node", "dist/main"]

# Tell Docker about the port we'll run on.
EXPOSE 4400
