'use strict';

const pick = require('lodash/pick');
const fs = require('fs');
const vinyl = require('vinyl');
const gulp = require('gulp');
const expect = require('chai').expect;
const gutil = require('gulp-util');
const helpers = require('../src/helpers');
const PluginError = gutil.PluginError;

const bemReplacer = require('../src/index');
require('mocha');

describe('gulp-bem-tmpl-specs-updater', () => {
    describe('# helpers', () => {
        const magicBundles = require('./fixtures/magic-bundle');
        const tmplSpecs = require('./fixtures/tmpl-specs');

        describe('# findRelativeItems function', () => {
            const findRelativeItems = require('../src/helpers/find-relative-items');

            it('should be a function', () => {
                expect(helpers.findRelativeItems).to.be.an.instanceOf(Function);
            });

            it('should return array of objects with 2 keys', () => {
                const findedRelativeItems = findRelativeItems(magicBundles, tmplSpecs);

                expect(findedRelativeItems).to.be.an.instanceOf(Array);
                findedRelativeItems.forEach(item => {
                    expect(item).to.have.all.keys('referenceMagicBundle', 'referenceTmplSpec');
                });
            });

            it('should find correct paths', () => {
                const findedRelativeItems = findRelativeItems(magicBundles, tmplSpecs);

                findedRelativeItems.forEach(item => {
                    expect(pick(item.referenceMagicBundle, ['block', 'test'])).to.eql(pick(item.referenceTmplSpec, ['block', 'test']));
                });
            });
        });
    });

    describe('# should throw error: ', () => {
        it('when options was missing', () => {
            expect(bemReplacer).to.throw('Missing required options');
        });

        it('when options is empty', () => {
            expect(bemReplacer.bind(null, {})).to.throw('Options is empty');
        });

        it('when on of required options was missing', () => {
            expect(bemReplacer.bind(null, {etalonPath: ''})).to.throw('Missing required arguments. See documentation to fix it');
            expect(bemReplacer.bind(null, {sourcePath: ''})).to.throw('Missing required arguments. See documentation to fix it');
        });
    });
});
