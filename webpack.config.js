const path = require('path');

module.exports = {
    entry: './widgets/chat-widget.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production',
};