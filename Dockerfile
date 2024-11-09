FROM node:18.19.0-bullseye-slim
WORKDIR /app
COPY . /app 
#COPY . .
#COPY package.json /app/package.json
RUN npm install
EXPOSE 3000
CMD [ "npm","start" ]




#FROM node:18

#WORKDIR /app
#RUN npm install
#COPY . .

#EXPOSE 3000
#CMD ["npm", "start"]