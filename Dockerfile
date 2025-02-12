FROM node:18

WORKDIR /usr/src/app

COPY package.json ./
COPY bun.lock ./

RUN npm install -g bun
RUN bun install

COPY . .

CMD [ "bun", "run", "start:dev" ]