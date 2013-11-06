/*global describe, it */
'use strict';

var assert = require('assert');
var cache = require('../cache');
var fs = require('fs');
var path = require('path');

describe('Cache.store()', function () {
    it('should cache a file', function () {
        var src = path.join(__dirname, 'fixtures/test.jpg');

        cache.store(src, { name: 'test' });
        assert.ok(cache.check(src, { name: 'test' }));
    });
    it('should cache a file with a custom name', function () {
        var src = path.join(__dirname, 'fixtures/test.jpg');
        var dest = path.join(__dirname, 'fixtures/test.gif');

        cache.store(src, dest, { name: 'test' });
        assert.ok(cache.check(dest, { name: 'test' }));
    });
});

describe('Cache.get()', function () {
    it('should get a cached file', function () {
        var src = path.join(__dirname, 'fixtures/test.jpg');
        var dest = path.join(__dirname, 'tmp/test.jpg');

        cache.get(src, dest, { name: 'test' });
        assert.ok(fs.statSync(dest));
        cache.clean(src, { name: 'test' });
    });
});
