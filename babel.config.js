module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-reanimated/plugin',
            'nativewind/babel',
            ['@babel/plugin-transform-flow-strip-types'],
            ['@babel/plugin-proposal-decorators', {legacy: true}],
            ['@babel/plugin-proposal-class-properties', {loose: true}],
            [
                'module-resolver',
                {
                    alias: {
                        '@components': './src/components',
                        '@contexts': './src/contexts',
                        '@screens': './src/screens',
                        '@assets': './assets',
                        '@services': './services',
                    },
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            ],
        ],
    };
};
