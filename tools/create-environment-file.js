/**
 * Created on 19-Apr-18.
 */
'use strict';
const fs = require('fs');
fs.createReadStream('.env.example')
  .pipe(fs.createWriteStream('.env'));
