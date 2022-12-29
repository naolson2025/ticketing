FROM node:alpine

WORKDIR /app
COPY package.json .
# the --only=prod flag will make it so dev dependencies are not installed
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]