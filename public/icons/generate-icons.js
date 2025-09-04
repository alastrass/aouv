// Script pour générer les icônes PWA
// Ce fichier sert de documentation pour les icônes nécessaires

const iconSizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' }
];

console.log('Icônes nécessaires pour la PWA:');
iconSizes.forEach(icon => {
  console.log(`- ${icon.name} (${icon.size}x${icon.size}px)`);
});

console.log('\nPour générer ces icônes:');
console.log('1. Créez une icône de base 512x512px avec le logo du jeu');
console.log('2. Utilisez un outil comme https://realfavicongenerator.net/');
console.log('3. Ou utilisez ImageMagick: convert icon-512x512.png -resize 192x192 icon-192x192.png');
