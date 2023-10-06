FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# For PROD:
# CMD [ "npm", "run", "start:prod" ]
# Development:
CMD [ "npm", "start" ]
