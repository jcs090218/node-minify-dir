#!/usr/bin/env node
/**
 * $File: cli.js $
 * $Date: 2019-02-18 17:37:22 $
 * $Revision: $
 * $Creator: Jen-Chieh Shen $
 * $Notice: See LICENSE.txt for modification and distribution information
 *                   Copyright © 2019 by Shen, Jen-Chieh $
 */

"use strict";

const fs = require('fs');
const md = require('./minify-dir');


const usage =
    "usage : minify-dir I_FOLDER [output O_FOLDER] \n" +
    "\n" +
    "Minify-Dir : Minify all the files under a directory.\n" +
    "\n" +
    "positional arguments:\n" +
    "  I_FOLDER          Directory you want to minified.\n" +
    "\n" +
    "optional arguments:\n" +
    "  O_FOLDER          Output all the minified files here.\n";


/* CLI */
const cli_md = function (iPath, oPath) {
  iPath = iPath || "";
  oPath = oPath || "";

  // Check valid args.
  if (iPath == "")
    console.log(usage);
  // Check directory/file exists.
  else if (!fs.existsSync(iPath)) {
    console.log("Cannot minify directory/file that does not exists.");
  }
  // Do minify action.
  else {
    md.minifyDirOrFile(iPath, oPath);
  }
};


if (require.main === module) {
  let args = process.argv;
  cli_md(args[2], args[3]);
}
