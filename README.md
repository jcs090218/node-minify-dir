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
Here we target `website` folder and output the minified 
files to `website.min` folder.
```sh
$ minify-dir ./website ./website.min
```
Or you can target `file` instead of a `directory`.
```sh
$ minify-dir ./website/index.html ./website.min/index.html
```


### Example Code ###
Use `minify-dir`.
```js
const minifyDir = require('minify-dir');
```

Minify all files under `website` directory recursively, 
defualt will output to `website.min` directory.
```js
minifyDir.minifyDirectory([source], [option destination]);

minifyDir.minifyDirectory("./website");
minifyDir.minifyDirectory("./website", "./website.min");
```

Minify a CSS/HTML/JS file, default will output 
to `website.min/anyfile.html`.
```js
minifyDir.minifyFile([source], [option destination]);

minifyDir.minifyFile("./website/anyfile.html");
minifyDir.minifyFile("./website/anyfile.html", "./website.min/anyfile.html");
```


## Service Provider ##
* *HTML Minifider* - http://minifycode.com/
* *CSS Minifier* - https://www.minifier.org/
* *JS Minifier* - https://www.minifier.org/
