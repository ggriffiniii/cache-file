'use strict';

var crypto = require('crypto');
var fs = require('fs');
var mkdir = require('mkdirp');
var os = require('os');
var path = require('path');
var rm = require('rimraf');
var tmp = path.join(os.tmpdir ? os.tmpdir() : os.tmpDir());

/**
 * Initialize `Cache` with options
 *
 * Options:
 *
 *   - `name` Directory name
 *
 * @param {String} src
 * @param {Object} opts
 * @api private
 */

function Cache(src, opts) {
    opts = opts || {};
    this.opts = opts;
    this.src = src;
    this.cache = this.opts.name ? path.join(tmp, this.opts.name, this._hashFile(src)) : path.join(tmp, this._hashFile(src));
}

/**
 * Cache a file
 *
 * @api public
 */

Cache.prototype.store = function () {
    if (!fs.existsSync(this.cache)) {
        var content = fs.readFileSync(String(this.src), 'utf8');

        if (!fs.existsSync(path.dirname(this.cache))) {
            mkdir.sync(path.dirname(this.cache));
        }

        fs.writeFileSync(this.cache, content);
    }
};

/**
 * Get a cached file
 *
 * @param {String} dest
 * @api public
 */

Cache.prototype.get = function (dest) {
    if (fs.existsSync(this.cache)) {
        var content = fs.readFileSync(String(this.cache), 'utf8');

        if (!fs.existsSync(path.dirname(dest))) {
            mkdir.sync(path.dirname(dest));
        }

        fs.writeFileSync(dest, content);
    }
};

/**
 * Check if a file exists in cache
 *
 * @api public
 */

Cache.prototype.check = function () {
    if (fs.existsSync(this.cache)) {
        return true;
    }

    return false;
};

/**
 * Clean cache
 *
 * @api public
 */

Cache.prototype.clean = function () {
    if (this.opts.name) {
        rm.sync(path.dirname(this.cache));
    } else {
        rm.sync(this.cache);
    }
};

/**
 * Create a hashed file name
 *
 * @param {String} src
 * @api private
 */

Cache.prototype._hashFile = function (src) {
    var content = fs.readFileSync(String(src), 'utf8');
    return crypto.createHash('sha1').update(content).digest('hex');
};

/**
 * Module exports
 */

module.exports.store = function (src, opts) {
    var cache = new Cache(src, opts);
    return cache.store();
};

module.exports.get = function (src, dest, opts) {
    var cache = new Cache(src, opts);
    return cache.get(dest);
};

module.exports.check = function (src, opts) {
    var cache = new Cache(src, opts);
    return cache.check();
};

module.exports.clean = function (src, opts) {
    var cache = new Cache(src, opts);
    return cache.clean();
};
