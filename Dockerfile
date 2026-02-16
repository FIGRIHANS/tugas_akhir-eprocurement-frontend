# =====================================================
# Multi-Stage Dockerfile for Vue.js Frontend
# Production Build with NGINX
# =====================================================

# =====================================================
# Stage 1: Build Stage
# =====================================================
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL=http://localhost
ARG VITE_ACCOUNT_API=/api/account
ARG VITE_GENERAL_API=/api/general
ARG VITE_INVOICE_API=/api/invoice
ARG VITE_VENDOR_API=/api/vendor

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_ACCOUNT_API=$VITE_ACCOUNT_API
ENV VITE_GENERAL_API=$VITE_GENERAL_API
ENV VITE_INVOICE_API=$VITE_INVOICE_API
ENV VITE_VENDOR_API=$VITE_VENDOR_API

# Build the application
RUN yarn build

# =====================================================
# Stage 2: Production Stage with NGINX
# =====================================================
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create nginx user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
