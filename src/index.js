'use strict';

const _ = require('lodash');
const through = require('through2').obj;
const compareFiles = require('save-compares-suggest');
const eachSeries = require('async/eachSeries');
const helpers = require('./helpers');

const config = require('./config');
const PLUGIN_NAME = config.PLUGIN_NAME;

/**
 * Entry point
 *
 * @param {Object} options - plugin options
 * @param {Object} options.etalonPath - etalon path. What compares
 * @param {Object} options.sourcePath - source path. With compares
 * @return {Function}
 */
const gulpPrefixer = () => {
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

    return through((file, enc, cb) => {
        if (file.relative.split('/')[0].includes('blocks')) {
            const relativePath = file.relative;
            const relativeArray = relativePath.split('/');

            const level = relativeArray
                .find((item) => item.includes('.blocks'))
                .replace(/\.blocks/, '');
            const block = relativeArray[relativeArray.length - 2]
                .replace(/\.tmpl-specs/, '');
            const test = relativeArray[relativeArray.length - 1];

            const bundle = {
                level,
                block,
                test,
                type: 'tmpl-specs',
                relativePath
            };

            const hashPath = bundle.level + '/' + bundle.block + '/' + bundle.test;
            result.tmplSpecs[hashPath] = bundle;
        } else {
            const relativePath = file.relative;
            const relativeArray = relativePath.split('/');

            const level = relativeArray[1]
                .replace(/\.tmpl-specs/, '');
            const block = relativeArray[relativeArray.length - 2];
            const test = relativeArray[relativeArray.length - 1]
                .replace(/\.bemhtml/, '')

            const bundle = {
                level,
                block,
                test,
                type: 'magic-bundles',
                relativePath
            };

            result.magicBundles.push(bundle);
        }

        cb(null, result);
    }, cb => {
        const relativeItems = helpers.findRelativeItems(result.magicBundles, result.tmplSpecs);

        eachSeries(relativeItems, (item, callback) => {
            return compareFiles({
                etalonPath: item.referenceTmplSpec.relativePath,
                magicPath: item.referenceMagicBundle.relativePath
            }).then(() => {
                callback();
            });
        }, cb);
    });
};

module.exports = gulpPrefixer;
