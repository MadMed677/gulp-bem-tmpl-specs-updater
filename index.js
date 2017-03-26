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
    let result = {
        magicBundles: [],
        tmplSpecs: {}
        // magicBundles: [
        // 	{
        // 		level: 'desktop',
        // 		block: 'test-block1',
        // 		test: '10-default.html',
        // 		type: 'magic-bundles'
        // 	}
        // ],
        // tmplSpecs: {
        // 	'common/test-block1/10-empty.html': {
        // 		level: 'common',
        // 		block: 'test-block1',
        // 		test: '10-default.html',
        // 		type: 'tmpl-specs'
        // 	}
        // }
    };

    let magicBundles = [];
    let tmplSpecs = [];

    // if (!prefixText) {
    //     throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
    // }

    // prefixText = new Buffer(prefixText);

    return through((file, enc, cb) => {
        const relativePath = file.relative;

        if (file.relative.split('/')[0].includes('blocks')) {
            const relativePath = file.relative;
            const relativeArray = relativePath.split('/');

            const level = relativeArray
                .find((item) => item.includes('blocks'))
                .replace(/\.blocks/, '');
            const block = relativeArray[relativeArray.length - 2]
                .replace(/\.tmpl-specs/, '');
            const test = relativeArray[relativeArray.length - 1];

            const result = {
                level,
                block,
                test,
                type: 'tmpl-specs',
                relativePath: 'blocks/' + relativePath
            };

            tmplSpecs.push(result);
        } else {
            const relativePath = file.relative;
            const relativeArray = relativePath.split('/');

            const level = relativeArray[0]
                .replace(/\.tmpl-specs/, '');
            const block = relativeArray[relativeArray.length - 2];
            const test = relativeArray[relativeArray.length - 1]
                .replace(/\.bemhtml/, '')

            const result = {
                level,
                block,
                test,
                type: 'magic-bundles',
                relativePath: 'magic-bundles/' + relativePath
            };

            magicBundles.push(result);
        }

        cb(null, {magicBundles, tmplSpecs});
    }, (cb) => {
        console.log(magicBundles);
    });
};

module.exports = gulpPrefixer;
