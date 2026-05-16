# This stage installs our modules
FROM mhart/alpine-node:14
WORKDIR /app
COPY package.json package-lock.json ./

# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python3

RUN npm ci --prod

# Then we copy over the modules from above onto a `slim` image
FROM mhart/alpine-node:slim-14

ARG EJECUTA_CRON=${EJECUTA_CRON}
ENV EJECUTA_CRON=$EJECUTA_CRON

WORKDIR /app
COPY --from=0 /app .
COPY . .

EXPOSE 3000

CMD [ "node", "src/server.js" ]