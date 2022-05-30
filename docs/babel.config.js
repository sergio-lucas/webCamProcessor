module.exports = {
  presets: [
    require.resolve('@docusaurus/core/lib/babel/preset'),
    '@babel/preset-typescript',
  ],
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx", {
        "pragma": "h",
        "pragmaFrag": "Fragment",
      }
    ]
  ]
};
