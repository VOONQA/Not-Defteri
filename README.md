# Denemenot - Not Alma Uygulaması

React Native ve Expo ile geliştirilmiş not alma uygulaması.

## Gereksinimler

- [Node.js](https://nodejs.org/) (v18.x önerilir, minimum v14.17.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Expo Go](https://expo.dev/client) (iOS veya Android cihazınızda)

## Teknik Detaylar
- React: 18.3.1
- React Native: 0.76.7
- Expo: 52.0.37
- TypeScript: 5.3.3

## Kurulum Adımları

1. Docker container'ı başlatın:
 - docker-compose up --build

Not: Docker Desktop açık olmalı.
## Uygulamayı Test Etme
- http://localhost:8081 bu adresten test edebilirsiniz.
### Expo Go ile Test (Önerilen)
 
1. Bilgisayarınızın IP adresini öğrenin:
       Windows için
         -ipconfig
      macOS/Linux için
         -ifconfig

   
2. Expo Go uygulamasında:
   - Uygulamayı açın
   - "Enter URL manually" seçeneğini seçin
   - Aşağıdaki URL formatını kullanın (IP adresinizi girin):
   ```
   exp://192.168.1.X:8081
   ```

Not: Telefonunuz ve bilgisayarınızın aynı WiFi ağında olması gerekiyor.

## Özellikler

- Not oluşturma, düzenleme ve silme
- Klasör yönetimi
- Çöp kutusu (30 gün saklama)
- Yazı tipi ve boyutu ayarları
- Arama fonksiyonu

## Teknolojiler

- React Native 0.76.7
- Expo 52.0.37
- TypeScript 5.3.3
- Docker
- AsyncStorage (Yerel depolama)

## Sorun Giderme

1. Docker bağlantı hatası alıyorsanız:
   - Docker Desktop'ın çalıştığından emin olun
   - Portların müsait olduğunu kontrol edin (8081, 19000-19002)

2. Expo Go bağlantı sorunu:
   - IP adresinin doğru olduğunu kontrol edin
   - Aynı WiFi ağında olduğunuzdan emin olun
   - Güvenlik duvarı ayarlarını kontrol edin

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inize push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun



