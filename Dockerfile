FROM node:22-alpine

WORKDIR /app

# Copiar apenas package.json
COPY package.json ./

# Instalar pnpm
RUN npm install -g pnpm@10.4.1

# Instalar dependências (sem lockfile, deixar pnpm criar um novo)
RUN pnpm install --no-frozen-lockfile

# Copiar resto do código
COPY . .

# Build
RUN pnpm build

# Expor porta
EXPOSE 3000

# Start
CMD ["pnpm", "start"]
