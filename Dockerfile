
FROM node:8

# Create application directory
RUN mkdir -p /usr/src/app

RUN npm config set registry https://pi-artifactory.lmig.com/artifactory/api/npm/npm
RUN yarn config set registry https://pi-artifactory.lmig.com/artifactory/api/npm/npm

# Run npm install in a temporary location, before copying application to
# take advantage of Docker's caching
ADD package.json /tmp/package.json

RUN cd /tmp && yarn --production --update-checksums
RUN cp -a /tmp/node_modules /usr/src/app

# We need to add the appdynamics agent globally to avoid integrity errors with the -lock file
# https://community.appdynamics.com/t5/Dynamic-Languages-Node-JS-Python/NPM-install-integrity-check-failure-on-Linux/td-p/29166
RUN npm link appdynamics

WORKDIR /usr/src/app
COPY . /usr/src/app/

HEALTHCHECK --interval=60s --timeout=30s --retries=3 CMD curl -v --fail http://localhost:8080/health || exit 1
CMD [ "node", "./build/server" ]
