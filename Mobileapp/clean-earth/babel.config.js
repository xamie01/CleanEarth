module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { reactCompiler: false }], 'nativewind/babel'],
    plugins: [
      'expo-router/babel',
      'react-native-reanimated/plugin', // This MUST be the last item
    ],
  };
};