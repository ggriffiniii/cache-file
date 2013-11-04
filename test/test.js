/*global describe, it */
'use strict';

var assert = require('assert');
var cache = require('../cache');
var crypto = require('crypto');
var fs = require('fs');
var os = require('os');
var path = require('path');
var tmp = path.join(os.tmpdir ? os.tmpdir() : os.tmpDir());

describe('Cache.store()', function () {
    it('should cache a file', function () {
        var src = path.join(__dirname, 'fixtures/test.jpg');
        var content = fs.readFileSync(String(src), 'utf8');
        var file = crypto.createHash('sha1').update(content).digest('hex');
        var cacheFile = path.join(tmp, 'test', file);

        cache.store(src, { name: 'test' });
        assert.ok(fs.statSync(cacheFile));
    });
});

describe('Cache.get()', function () {
    it('should get a cached file', function () {
        var src = path.join(__dirname, 'fixtures/test.jpg');
        var dest = path.join(__dirname, 'tmp/test.jpg');

        cache.get(src, dest, { name: 'test' });
        assert.ok(fs.statSync(dest));
    });
});
