FROM node:22-alpine

WORKDIR /app

# Copiar package files
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm
RUN npm install -g pnpm@10.4.1

# Instalar dependências (sem frozen-lockfile para evitar erro de lockfile desatualizado)
RUN pnpm install

# Copiar código
COPY . .

# Build
RUN pnpm build

# Expor porta
EXPOSE 3000

# Start
CMD ["pnpm", "start"]
