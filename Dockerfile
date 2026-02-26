# =====================================================
# Stage 1: Build Stage
# =====================================================
FROM node:20-alpine AS build

WORKDIR /app

# Aktifkan corepack (penting untuk yarn modern)
RUN corepack enable

# Copy semua file termasuk .yarn dan .yarnrc.yml
COPY . .

# Install dependencies (cara benar untuk yarn berry)
RUN yarn install

# Set environment variables
ARG VITE_API_BASE_URL=http://localhost
ARG VITE_ACCOUNT_API=/api/account
ARG VITE_GENERAL_API=/api/general
ARG VITE_INVOICE_API=/api/invoice
ARG VITE_VENDOR_API=/api/vendor

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_ACCOUNT_API=$VITE_ACCOUNT_API
ENV VITE_GENERAL_API=$VITE_GENERAL_API
ENV VITE_INVOICE_API=$VITE_INVOICE_API
ENV VITE_VENDOR_API=$VITE_VENDOR_API

# Build app
RUN yarn build

# =====================================================
# Stage 2: Production Stage
# =====================================================
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
