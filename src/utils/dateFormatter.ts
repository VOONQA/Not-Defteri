const aylar = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export function formatDate(date: Date): string {
  const gun = date.getDate();
  const ay = aylar[date.getMonth()];
  const yil = date.getFullYear();
  const saat = date.getHours().toString().padStart(2, '0');
  const dakika = date.getMinutes().toString().padStart(2, '0');

  return `${gun} ${ay} ${yil} ${saat}:${dakika}`;
} 