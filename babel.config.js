module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      "@babel/preset-typescript",  // 👈 add this
    ],
    plugins: [
      'react-native-reanimated/plugin', // 👈 must be last
    ],
  };
};
