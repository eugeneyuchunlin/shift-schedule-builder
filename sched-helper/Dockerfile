FROM node:20

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]
