'use strict';

const pick = require('lodash/pick');
const fs = require('fs');
const vinyl = require('vinyl');
const gulp = require('gulp');
const expect = require('chai').expect;
const helpers = require('../src/helpers');

const bemReplacer = require('../src');
require('mocha');

describe('gulp-bem-tmpl-specs-updater', () => {
    describe('# helpers', () => {
        const magicBundles = require('./fixtures/magic-bundle');
        const tmplSpecs = require('./fixtures/tmpl-specs');

        describe('# findRelativeItems function', () => {
            const findRelativeItems = require('../src/helpers/find-relative-items');
            const devicesLevels = require('../src/helpers/devices-levels');

            it('should be a function', () => {
                expect(helpers.findRelativeItems).to.be.an.instanceOf(Function);
            });

            it('should return empty array', () => {
                expect(helpers.findRelativeItems()).to.eql([]);
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

            it('should related correct levels', () => {
                const findedRelativeItems = findRelativeItems(magicBundles, tmplSpecs);

                findedRelativeItems.forEach(item => {
                    const magicBundle = item.referenceMagicBundle;
                    const tmplSpec = item.referenceTmplSpec;

                    const magicDeviceLevels = devicesLevels[magicBundle.level];

                    const magicBundleLevelIndex = magicDeviceLevels.findIndex(level => level === magicBundle.level);
                    const tmplSpecsLevelIndex = magicDeviceLevels.findIndex(level => level === tmplSpec.level);

                    expect(magicBundleLevelIndex).to.have.most(tmplSpecsLevelIndex);
                });
            });
        });
    });

    describe('# gulp task', () => {
        describe('# bemReplacer()', () => {
            // it();
        });
    });
});
