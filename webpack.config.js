module.exports = {
    entry: {
        main:    './main.js',
        monthly: './monthly.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js'
    }
};
