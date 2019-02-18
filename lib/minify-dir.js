#!/usr/bin/env node
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
const mkdirp = require('mkdirp');
const request = require('request');


/* Services */
const servMinHTML = 'http://minifycode.com/wp-content/themes/minify_code/minify.php?type=html';
const servMinCSS = 'https://minify.minifier.org/';
const servMinJS = 'https://minify.minifier.org/';

/* Configurations */
const minifyMark = '.min';

/* Global Variables */
var inputDir = '';
var outputDir = '';


/* Logger */
function info(msg) { console.log("[INFO] " + msg); }
function error(msg) { console.log("[ERROR] " + msg); }

/**
 * Write a file, if exists overwrite.
 * @param { string } filePath : file path.
 * @param { string } content : content to write to.
 */
function writeFile(filePath, content) {
  let dirname = path.dirname(filePath);
  mkdirp.sync(dirname, function (err) {
    if (err)
      console.log(err);
  });

  fs.writeFile(filePath, content, function (err) {
    if (err)
      console.log(err);
    else
      console.log("[+] Write file => '" + filePath + "'");
  });
}

/**
 * Copy file without changing any data form, if exists overwrite.
 * @param { string } inputFile : Input file path.
 * @param { string } outputFile : Output file path.
 */
function copyFile(inputFile, outputFile) {
  let dirname = path.dirname(outputFile);
  mkdirp.sync(dirname, function (err) {
    if (err)
      console.log(err);
  });

  fs.copyFile(inputFile, outputFile, function (err) {
    if (err)
      console.log(err);
    else
      console.log("[-] Copy file => '" + inputFile + "' to '" + outputFile + "'");
  });
}

/**
 * Minify the CSS file.
 * @param { string } iFilePath : target file you want to minified.
 * @param { string } oFilePath : output file path.
 */
function minifyFileCSS(iFilePath, oFilePath = "") {
  defineDirIO(iFilePath, oFilePath);

  if (oFilePath == "")
    oFilePath = iFilePath.replace(inputDir, outputDir);

  fs.readFile(iFilePath, 'utf8', function(err, contents) {
    const requestForm = {
      source: contents,
      type: 'css'
    };

    request.post(
      {
        url : servMinCSS,
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

        // Write the minified file.
        writeFile(oFilePath, minifiedContent);
      }
    );
  });
}

/**
 * Minify the HTML file.
 * @param { string } iFilePath : target file you want to minified.
 * @param { string } oFilePath : output file path.
 */
function minifyFileHTML(iFilePath, oFilePath = "") {
  defineDirIO(iFilePath, oFilePath);

  if (oFilePath == "")
    oFilePath = iFilePath.replace(inputDir, outputDir);

  fs.readFile(iFilePath, 'utf8', function(err, contents) {
    const requestForm = {
      html_enter_code: contents
    };

    request.post(
      {
        url : servMinHTML,
        formData: requestForm
      },
      function (error, response, body) {
        // Default minified content, so if something went wrong,
        // this should output in the file.
        let minifiedContent = "N/A";

        // Get the minified content.
        if (!error && response.statusCode == 200) {
          var data = JSON.parse(body);
          minifiedContent = data.minified_code;
        } else {
          // If something went wrong, content will be the error message.
          minifiedContent = error;
        }

        // Write the minified file.
        writeFile(oFilePath, minifiedContent);
      }
    );
  });
}

/**
 * Minify the JS file.
 * @param { string } iFilePath : target file you want to minified.
 * @param { string } oFilePath : output file path.
 */
function minifyFileJS(iFilePath, oFilePath = "") {
  defineDirIO(iFilePath, oFilePath);

  if (oFilePath == "")
    oFilePath = iFilePath.replace(inputDir, outputDir);

  fs.readFile(iFilePath, 'utf8', function(err, contents) {
    const requestForm = {
      source: contents,
      type: 'js'
    };

    request.post(
      {
        url : servMinJS,
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

        // Write the minified file.
        writeFile(oFilePath, minifiedContent);
      }
    );
  });
}

/**
 * Minify a file.
 * @param { string } iFilePath : file path.
 */
function minifyFile(iFilePath, oFilePath = "") {

  if (!fs.existsSync(iFilePath)) {
    error("Cannot minify file that does not exists.");
    return;
  }

  // Get the extension to decide file type.
  let ext = path.extname(iFilePath);

  defineDirIO(iFilePath, oFilePath);

  if (oFilePath == "")
    oFilePath = iFilePath.replace(inputDir, outputDir);

  if (ext == '.css')
    minifyFileCSS(iFilePath, oFilePath);
  else if (ext == '.js')
    minifyFileJS(iFilePath, oFilePath);
  else if (ext == '.html')
    minifyFileHTML(iFilePath, oFilePath);
  else {
    // The rest just copy the file.
    copyFile(iFilePath, oFilePath);
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
 * @param { string } iDir : Input directory path.
 * @param { string } oDir : Output directory path.
 */
function minifyDirectory(iDir, oDir = "") {

  info("Minify directory => " + iDir);

  if (!fs.existsSync(iDir)) {
    error("Cannot minify directory that does not exists.");
    return;
  }

  defineDirIO(iDir, oDir);

  /* Safe create directory. */
  if (!fs.existsSync(outputDir)) {
    mkdirp.sync(outputDir, function (err) {
      if (err)
        console.log(err);
    });
    console.log("[+] Create output directory => " + outputDir);
  }

  // Walk nested directories.
  const tree = dirTree(iDir, { normalizePath: true });

  inputDir = inputDir.replace("./", "");
  outputDir = outputDir.replace("./", "");

  minifyDirectoryRecursive(tree.children);
}

/**
 * Minify all files under a directory or just a single file.
 * @param { string } iPath : Input file/directory path.
 * @param { string } oPath : Output file/directory path.
 */
function minifyDirOrFile(iPath, oPath) {
  if (fs.lstatSync(iPath).isFile())
    minifyFile(iPath, oPath);
  else
    minifyDirectory(iPath, oPath);
}

/**
 * Define directory IO.
 * @param { string } iPath : Input file/directory path.
 * @param { string } oPath : Output file/directory path.
 */
function defineDirIO(iPath, oPath) {
  if (inputDir != "" || outputDir != "")
    return;

  if (fs.lstatSync(iPath).isFile())
    inputDir = path.dirname(iPath);
  else
    inputDir = iPath;

  if (oPath == "")
    outputDir = inputDir + minifyMark;
  else
    outputDir = oPath;
}


/* Module Exports */
module.exports.minifyFileCSS = minifyFileCSS;
module.exports.minifyFileHTML = minifyFileHTML;
module.exports.minifyFileJS = minifyFileJS;

module.exports.minifyFile = minifyFile;
module.exports.minifyDirectory = minifyDirectory;
module.exports.minifyDirOrFile = minifyDirOrFile;
