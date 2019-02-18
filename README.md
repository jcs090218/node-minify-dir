[![Build Status](https://travis-ci.com/jcs090218/node-minify-dir.svg?branch=master)](https://travis-ci.com/jcs090218/node-minify-dir)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


# minify-dir #

Minify all the files under a directory.


## Install ##
```sh
$ npm install -g minify-dir
```


## Usage ##
```sh
usage : minify-dir I_FOLDER [output O_FOLDER]

Minify-Dir : Minify all the files under a directory.

positional arguments:
  I_FOLDER          Directory you want to minified.

optional arguments:
  O_FOLDER          Output all the minified files here.
```

### CLI ###
Try minify a `directory`.
```sh
# Default Output => `website.min`
$ minify-dir ./website

# Target Output => `website2`
$ minify-dir ./website ./website2
```
Or you can minify `file` instead of a `directory`.
```sh
# Default Output => `website.min/anyfile.html`
$ minify-dir ./website/index.html

# Target Output => `website2/anyfile.html`
$ minify-dir ./website/index.html ./website2/index.html
```


### Example Code ###
Include `minify-dir` package in your code.
```js
const minifyDir = require('minify-dir');
```

Minify all files under `website` directory recursively, 
defualt will output to `website.min` directory.
```js
minifyDir.minifyDirectory([source], [option destination]);

/* Default Output => `website.min` */
minifyDir.minifyDirectory("./website");

/* Target Output => `website2` */
minifyDir.minifyDirectory("./website", "./website2");
```

Minify a CSS/HTML/JS file, default will output 
to `website.min/anyfile.html`.
```js
minifyDir.minifyFile([source], [option destination]);

/* Default Output => `website.min/anyfile.html` */
minifyDir.minifyFile("./website/anyfile.html");

/* Target Output => `website2/anyfile.html` */
minifyDir.minifyFile("./website/anyfile.html", "./website2/anyfile.html");
```


## Service Provider ##
* *HTML Minifider* - http://minifycode.com/
* *CSS Minifier* - https://www.minifier.org/
* *JS Minifier* - https://www.minifier.org/
