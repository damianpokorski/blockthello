var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require("babelify");

// Initializing browserify
var b = browserify({
    entries: ['source/main.js'],
    cache: {},
    packageCache: {},
    plugin: [watchify]
});

b.on('update', bundle);

function bundle() {
    console.log('Watchify started recompiling the *.js files!');
    b
        .transform(babelify, { presets: ["babel-preset-env"] })
        .bundle()
        .on('error', console.error)
        .on("end", () => console.log('Watchify finished recompiling the *.js files!'))
        .pipe(fs.createWriteStream('js/bundle.js'));
}

bundle();