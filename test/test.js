/*global afterEach, describe, it */
'use strict';

var assert = require('assert');
var cache = require('../');
var eachAsync = require('each-async');
var fs = require('fs');
var path = require('path');
var rm = require('rimraf');

afterEach(function (cb) {
    var files = [
        path.join(__dirname, 'fixtures/test.jpg'),
        path.join(__dirname, 'fixtures/test.gif')
    ];

    rm.sync(path.join(__dirname, 'tmp'));

    eachAsync(files, function (file, index, done) {
        cache.clean(file);
        done();
    }, cb);
});

describe('Cache.store()', function () {
    it('should cache a file', function (cb) {
        var src = path.join(__dirname, 'fixtures/test.jpg');

        cache.store(src).on('finish', function() {
          cb(assert.equal(cache.check(src), true));
        });
    });

    it('should cache a file with a custom name', function (cb) {
        var src = path.join(__dirname, 'fixtures/test.jpg');
        var dest = path.join(__dirname, 'fixtures/test.gif');

        cache.store(src, dest).on('finish', function() {
          cb(assert.equal(cache.check(dest), true));
        });
    });
});

describe('Cache.get()', function () {
    it('should get a cached file', function (cb) {
        var src = path.join(__dirname, 'fixtures/test.jpg');
        var dest = path.join(__dirname, 'tmp/test.jpg');

        cache.store(src).on('finish', function() {
          cache.get(src, dest).on('finish', function() {
            cb(assert.equal(fs.existsSync(dest), true));
          });
        });
    });
});

describe('Cache.check()', function () {
    it('should check if a file exists in cache', function (cb) {
        var src = path.join(__dirname, 'fixtures/test.jpg');

        cache.store(src).on('finish', function() {
          cb(assert.equal(cache.check(src), true));
        });
    });
});

describe('Cache.path()', function () {
    it('should return the path to a cached file', function (cb) {
        var src = path.join(__dirname, 'fixtures/test.jpg');

        cache.store(src).on('finish', function() {
          cb(assert.equal(path.basename(cache.path(src)), 'e5a4045cc21680e1162f3ac776a4b3d9acb5550a'));
        });
    });
});

describe('Cache.clean()', function () {
    it('should clean a cached file', function (cb) {
        var src = path.join(__dirname, 'fixtures/test.jpg');

        cache.store(src).on('finish', function() {
          cache.clean(src);
          cb(assert.equal(cache.check(src), false));
        });
    });
});

