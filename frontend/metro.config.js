const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('db');
config.resolver.sourceExts.push('mjs');

module.exports = config;