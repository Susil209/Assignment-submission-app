FROM node:18.16.0-alpine3.18

# Copy all files from current directory to working dir in image
COPY . .

# Arguments
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

# install node modules 
RUN npm install


CMD [ "npm" , "start" ]

