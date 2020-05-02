FROM node:12.16.3

WORKDIR /usr/tinyhouse

COPY . .

RUN cd server \
    && npm ci \
    && npm run build \
    && cd ../client \
    && npm ci \
    && npm run build

CMD ["node", "server/build"]