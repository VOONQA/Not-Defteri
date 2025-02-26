FROM node:18

WORKDIR /app

# Gerekli paketleri yükle
RUN apt-get update && apt-get install -y \
    android-tools-adb \
    git \
    && rm -rf /var/lib/apt/lists/*

# Expo CLI'yi global olarak yükle
RUN npm install -g expo-cli

# Package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Projenin geri kalanını kopyala
COPY . .

# Tüm interface'lerde dinle
ENV HOST=0.0.0.0

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 8081

CMD ["npx", "expo", "start", "--lan"]
