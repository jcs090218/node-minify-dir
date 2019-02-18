/**
 * $File: minify-dir.js $
 * $Date: 2019-02-18 15:29:52 $
 * $Revision: $
 * $Creator: Jen-Chieh Shen $
 * $Notice: See LICENSE.txt for modification and distribution information
 *                   Copyright © 2019 by Shen, Jen-Chieh $
 */

"use strict";

/* Dependencies */
const fs = require('fs');
const path = require('path');

const dirTree = require('directory-tree');
const request = require('request');

/* Services */
const serviceHTML = 'https://minify.minifier.org/';
const serviceCSS = 'https://minify.minifier.org/';
const serviceJS = 'https://minify.minifier.org/';

/* Configurations */
const minifyMark = '.min';

/* Global Variables */
var inputDir = '';
var outputDir = '';


/**
 * Write a file, if exists overwrite.
 * @param { string } filePath : file path.
 * @param { string } content : content to write to.
 */
function writeFile(filePath, content) {
  fs.writeFile(filePath, content, function (err) {
    if (err)
      console.log(err);
    else
      console.log("[+] Write file => " + filePath);
  });
}

/**
 * Copy file without changing any data form, if exists overwrite.
 * @param { string } inputFile : Input file path.
 * @param { string } outputFile : Output file path.
 */
function copyFile(inputFile, outputFile) {
  fs.readFile(inputFile, 'utf8', function(err, content) {
    writeFile(outputFile, content);
  });
}

/**
 * Minify the CSS file.
 * @param { string } filePath : target file you want to minified.
 * @param { string } outputFilePath : output file path.
 */
function minifyFileCSS(filePath, outputFilePath) {
  let newFileDir = path.dirname(outputFilePath);

  fs.readFile(filePath, 'utf8', function(err, contents) {
    const requestForm = {
      source: contents,
      type: 'css'
    };

    request.post(
      {
        url : serviceCSS,
        formData: requestForm
      },
      function (error, response, body) {
        // Default minified content, so if something went wrong,
        // this should output in the file.
        let minifiedContent = "N/A";

        // Get the minified content.
        if (!error && response.statusCode == 200) {
          var data = JSON.parse(body);
          minifiedContent = data.minified;
        } else {
          // If something went wrong, content will be the error message.
          minifiedContent = error;
        }

        // Make directory recursively, if not exists.
        fs.mkdir(newFileDir, { recursive: true }, function (err) {
          // Write the minified file.
          writeFile(outputFilePath, minifiedContent);
        });
      }
    );
  });
}

/**
 * Minify the HTML file.
 * @param { string } filePath : target file you want to minified.
 * @param { string } outputFilePath : output file path.
 */
function minifyFileHTML(filePath, outputFilePath) {
  let newFileDir = path.dirname(outputFilePath);
  copyFile(filePath, outputFilePath);
}

/**
 * Minify the JS file.
 * @param { string } filePath : target file you want to minified.
 * @param { string } outputFilePath : output file path.
 */
function minifyFileJS(filePath, outputFilePath) {
  let newFileDir = path.dirname(outputFilePath);

  fs.readFile(filePath, 'utf8', function(err, contents) {
    const requestForm = {
      source: contents,
      type: 'js'
    };

    request.post(
      {
        url : serviceJS,
        formData: requestForm
      },
      function (error, response, body) {
        // Default minified content, so if something went wrong,
        // this should output in the file.
        let minifiedContent = "N/A";

        // Get the minified content.
        if (!error && response.statusCode == 200) {
          var data = JSON.parse(body);
          minifiedContent = data.minified;
        } else {
          // If something went wrong, content will be the error message.
          minifiedContent = error;
        }

        // Make directory recursively, if not exists.
        fs.mkdir(newFileDir, { recursive: true }, function (err) {
          // Write the minified file.
          writeFile(outputFilePath, minifiedContent);
        });
      }
    );
  });
}

/**
 * Minify a file.
 * @param { string } filePath : file path.
 */
function minifyFile(filePath) {
  // Get the extension to decide file type.
  let ext = path.extname(filePath);

  // Make the output file path.
  let outputFilePath = filePath.replace(inputDir, outputDir);

  if (ext == '.css')
    minifyFileCSS(filePath, outputFilePath);
  else if (ext == '.js')
    minifyFileJS(filePath, outputFilePath);
  else if (ext == '.html')
    minifyFileHTML(filePath, outputFilePath);
  else {
    // The rest just copy the file.
    copyFile(filePath, outputFilePath);
  }
}

/**
 * Minify all the file content in this directory recursively.
 * @param { string } dir : Directory path.
 */
function minifyDirectoryRecursive(dir) {
  for (let index = 0;
       index < dir.length;
       ++index)
  {
    let pathObj = dir[index];
    if (pathObj.children != null && pathObj.children.length != 0) {
      minifyDirectoryRecursive(pathObj.children);
    }

    if (pathObj.type == 'file') {
      minifyFile(pathObj.path);
    }
  }
}

/**
 * Minify all the file content in this directory.
 * @param { string } dir : Directory path.
 */
function minifyDirectory(dir) {

  if (!fs.existsSync(dir)) {
    console.log("[ERROR] Cannot minify directory that does not exists.");
    return;
  }

  inputDir = dir;

  // Make output directory.
  outputDir = dir + minifyMark;

  /* Safe create directory. */
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    console.log("[+] Create output directory => " + outputDir);
  }

  const tree = dirTree(dir, { normalizePath: true });

  inputDir = inputDir.replace("./", "");
  outputDir = outputDir.replace("./", "");

  minifyDirectoryRecursive(tree.children);
}


/* Module Exports */
module.exports.minifyFileCSS = minifyFileCSS;
module.exports.minifyFileHTML = minifyFileHTML;
module.exports.minifyFileJS = minifyFileJS;
module.exports.minifyFile = minifyFile;
module.exports.minifyDirectory = minifyDirectory;
