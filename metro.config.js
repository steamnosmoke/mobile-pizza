const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Игнорируем все некомпонентные файлы
config.resolver.blockList = [
  /components\/.*\.ts$/,
  /styles\/.*\.ts$/,
  /redux\/.*\.ts$/,
  /utils\/.*\.ts$/,
];

module.exports = config;
