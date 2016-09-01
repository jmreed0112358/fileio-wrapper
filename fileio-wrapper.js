'use strict';

var fs = require('fs');

var FileIO = function () {};

FileIO.prototype.readdirSync = function (path) {
  try {
    return fs.readdirSync(path);
  } catch (error) {
    console.log('Caught error: ', error);
    throw error;
  }
};

FileIO.prototype.readDataSync = function (fileName) {
  var retval = '',
    stat,
    fd,
    bytesRead,
    buffer;

  try {
    stat = fs.statSync(fileName);
    fd = fs.openSync(fileName, 'r');
    buffer = new Buffer(stat.size);
    bytesRead = fs.readSync(fd, buffer, 0, buffer.length);
    retval = buffer.toString('utf8', 0, buffer.length);
    fs.closeSync(fd);
    return retval;
  } catch (error) {
    console.log('Caught error: ', error);
    throw error;
  }
};

FileIO.prototype.writeDataSync = function (fileName, data) {
  var input = data,
    fd;

  if (typeof data !== 'string') {
    input = JSON.stringify(data);
  }

  if (input === '') {
    return false;
  }

  try {
    fd = fs.openSync(fileName, 'w');
    fs.writeFileSync(fd, input, { encoding: 'utf8', mode: 0x600 });
  } catch (error) {
    console.log('Caught error: ', error);
    throw error;
  }
};

FileIO.prototype.unlinkFileSync = function (fileName) {
  try {
    fs.unlinkSync(fileName);
  } catch (error) {
    console.log('Caught error: ', error);
    throw error;
  }
};

module.exports = FileIO;