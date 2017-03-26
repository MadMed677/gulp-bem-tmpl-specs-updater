const through = require('through2');
const gutil = require('gulp-util');
const helpers = require('./helpers');
const PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-bem-tmpl-specs-updater';

const prefixStream = prefixText => {
    const stream = through();
    stream.write(prefixText);

    return stream;
};

const gulpPrefixer = prefixText => {
    if (!prefixText) {
        throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
    }

    prefixText = new Buffer(prefixText);

    return through.obj((file, enc, cb) => {
        console.log('hello world');
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isBuffer()) {
            file.contents = Buffer.concat([prefixText, file.contents]);
        }

        cb(null, file);
    });
};

module.exports = gulpPrefixer;
