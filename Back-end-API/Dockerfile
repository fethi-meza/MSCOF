FROM node:18.17.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 4001 

CMD ["npm", "start"]