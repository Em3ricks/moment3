"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
//______________________________________ |VARIABLER| ______________________________________
var _a = require("gulp"),
    src = _a.src,
    dest = _a.dest,
    watch = _a.watch,
    series = _a.series,
    parallel = _a.parallel;
var concat = require("gulp-concat");
var uglify = require("gulp-uglify-es").default;
var concatCss = require("gulp-concat-css");
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var files = { // Sökvägar
    htmlPath: "src/**.html",
    jsPath: "src/**.js",
    cssPath: "src/css/**.css",
    mediaPath: "src/media/*",
    sassPath: "src/css/**.scss"
}
//______________________________________ |FUNKTIONER| ______________________________________
function watchTask() { // Funktionen 'watchTask' spårar alla ändringar och håller live-filen uppdaterad
    watch([
        files.htmlPath,
        files.jsPath,
        files.cssPath,
        files.mediaPath,
        files.sassPath
    ], parallel(copyHTML, copyMedia, jsTask, cssCombine, sassConvert));
}

function copyHTML() { // Task: kopiera HTML
    return src(files.htmlPath)
        .pipe(dest("pub")); // Skickar filerna till mapp med namn "pub"
}

function copyMedia() { // Task: kopiera mediafiler
    return src(files.mediaPath)
        .pipe(dest("pub/css/media")); // Skickar filerna till mapp med namn "pub/media"
}

function jsTask() { // Task: Sammanslå och minifiera js-filer
    return src(files.jsPath)
        .pipe(concat('main.js')) // Sammanslår alla .js-filer till "main.js"       
        .pipe(uglify()) // Förkortar "main.js"
        .pipe(dest('pub/js')); // Skickar filen till "pub/js"
}

function cssCombine() { // Task: Sammanslå CSS-filer
    return src(files.cssPath)
        .pipe(concatCss("style.css")) //Sammanslår all css till "style.css"
        .pipe(cleanCSS({ // Minifierar CSS-fil
            compatibility: 'ie8'
        }))
        .pipe(dest('pub/css')); //Skickar sammanslagen fil till "pub/css"
}

function sassConvert() { // Task: Konvertera sass/scss till css
    return src(files.sassPath)
        .pipe(sass().on('error', sass.logError)) // Kallar på funktion för konvertering
        .pipe(concatCss("style.css")) //Sammanslår all css till "style.css"
        .pipe(cleanCSS({ // Minifierar CSS-fil
            compatibility: 'ie8'
        }))
        .pipe(dest("pub/css")); // Skickar konverterad fil till pub/css
}

//______________________________________ |GULP-Aktivering| ______________________________________
exports.default = series( // Huvudkommandot 'Gulp' sätter igång samtliga funktioner
    parallel(copyHTML, copyMedia, jsTask, cssCombine, sassConvert), watchTask);



    