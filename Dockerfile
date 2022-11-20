FROM node:16-alpine as prod
ENV NODE_ENV=production
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile --prod; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN chown -R node:node . 
USER node
COPY --chown=node:node src ./src
# RUN yarn test
CMD ["node", "./src/server.js"]

FROM prod as dev
ENV NODE_ENV=development
RUN yarn install --prod=false
CMD ["yarn", "dev"]
