'use strict';

const fs = require('fs');
const vinyl = require('vinyl');
const gulp = require('gulp');
const expect = require('chai').expect;
const gutil = require('gulp-util');
const helpers = require('../helpers');
const PluginError = gutil.PluginError;

const bemReplacer = require('../index');
require('mocha');

describe('gulp-bem-tmpl-specs-updater', () => {
    describe('# helpers', () => {
        describe('# findRelativeItems function', () => {
            // const
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
