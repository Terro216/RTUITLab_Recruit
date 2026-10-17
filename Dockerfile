FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS build
WORKDIR /app
ENV PARCEL_WORKERS=2 NODE_OPTIONS=--max-old-space-size=1536
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY .parcelrc .postcssrc ./
COPY src ./src
COPY public ./public
COPY scripts ./scripts
COPY tests ./tests
RUN npm test && npm run build

FROM nginx:stable-alpine@sha256:970364228b1e4f932abc22d321932816782cca8a20b85a77552a7cfe9acfb3b5 AS runtime
ARG SOURCE_REVISION=restored-worktree
LABEL org.opencontainers.image.title="Честный брокер — demo" \
      org.opencontainers.image.source="https://github.com/Terro216/RTUITLab_Recruit" \
      org.opencontainers.image.revision=$SOURCE_REVISION \
      dev.ilyamedve.broker.upstream="f8ab86663837b92cd0851141f375a96a79020b35"
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html
USER nginx
EXPOSE 8080
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
