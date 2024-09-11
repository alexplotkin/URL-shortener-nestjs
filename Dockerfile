FROM node:alpine as development

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm

RUN pnpm install

COPY src ./

RUN pnpm run build

FROM node:alpine as production

ARG NODE_ENV=production

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm

RUN pnpm install --prod

COPY --from=development /app/dist /app/dist

CMD ["node", "dist/main"]