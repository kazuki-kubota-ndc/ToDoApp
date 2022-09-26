module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                'modules': 'false',
                'useBuiltIns': 'usage',
                'targets': '> 0.25%, not dead',
            }
        ]
    ],
    env: {
        test: {
            presets: [
              "@babel/preset-react",
              ['@babel/preset-env', {
                targets: {
                  node: 'current'
                },
                "useBuiltIns": "usage",
                "corejs": 3,
                "modules": "cjs"
              }]
            ]
        }
    },
    plugins: [
      '@babel/plugin-transform-modules-commonjs',
    ]
};