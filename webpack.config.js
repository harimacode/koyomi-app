module.exports = {
    entry: {
        main:    './main.js',
        monthly: './monthly.js',

        Button:       './test/Button.test.jsx',
        OldDateMonth: './test/OldDateMonth.test.jsx'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react']
                }
            }
        ]
    }
};
