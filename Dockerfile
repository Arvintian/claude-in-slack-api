###################
# PRODUCTION
###################

FROM node:18-alpine As production

COPY node_modules node_modules
COPY dist dist
# 设置生产环境变量
ENV NODE_ENV production
# 启动服务
CMD [ "node", "dist/main.js" ]
