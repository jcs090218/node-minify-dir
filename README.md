[![Build Status](https://travis-ci.com/jcs090218/node-minify-dir.svg?branch=master)](https://travis-ci.com/jcs090218/node-minify-dir)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# minify-dir #

> Minify all the files under a directory.


## Installation ##
```sh
$ npm install -g minify-dir
```


## Usage ##
### CLI ###
```sh
$ minify-dir ./website ./website.min
```

```sh
usage : minify-dir I_FOLDER [output O_FOLDER]

Minify-Dir : Minify all the files under a directory.

positional arguments:
  I_FOLDER          Directory you want to minified.

optional arguments:
  O_FOLDER          Output all the minified files here.
```

### Code ###
```js
const minifyDir = require('../lib/minify-dir');

/* Minify all files under this directory recursively. */
minifyDir.minifyDirectory("./test/website");

/* Minify a CSS file. */
minifyDir.minifyFileCSS("./test/website/css/style.css");

/* Minify a HTML file. */
minifyDir.minifyFileHTML("./test/website/index.html");

/* Minify a JS file. */
minifyDir.minifyFileJS("./test/website/js/main.js");
```
