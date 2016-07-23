module.exports = {
    entry: {
        main:    './main.js',
        monthly: './monthly.js'
    },
    output: {
        path: __dirname,
        filename: '[name].bundle.js'
    }
};
