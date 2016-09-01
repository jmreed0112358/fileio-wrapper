'use strict';

var FileIO = require('./fileio-wrapper');

const READABLE_WRITABLE_DIRECTORY = 'test/readable-writable/';
const NOT_READABLE_DIRECTORY = 'test/not-readable/';
const NOT_WRITABLE_DIRECTORY = 'test/not-writable/';
const NONEXISTANT_DIRECTORY = 'foo/';

const READABLE_WRITABLE_FILE = 'readable-writable.txt';
const NOT_READABLE_FILE = 'not-readable.txt';
const NOT_WRITABLE_FILE = 'not-writable.txt';
const TEST_FILE = 'test-file.txt';
const NONEXISTANT_FILE = 'foo.txt';

describe('FileIO', function () {
  var fileIO = new FileIO();

  describe('readdirSync', function () {
    /*
     *    List all the files in READABLE_WRITABLE_DIRECTORY directory.
     */
    it('should list all files in a directory', function () {
      var expected = ['not-readable.txt', 'not-writable.txt', 'readable-writable.txt'],
        actual = fileIO.readdirSync(READABLE_WRITABLE_DIRECTORY),
        i = 0;
      expect(actual.length).toEqual(expected.length);
      for (i = 0 ; i < actual.length ; i++ ) {
        expect(actual[i]).toEqual(expected[i]);
      }
    });

    /*
     *    Tries to list files in NONEXISTANT_DIRECTORY.
     */
    it('should throw error if the given directory doesn\t exist', function () {
      expect(function () {
        fileIO.readdirSync(NONEXISTANT_DIRECTORY);
      }).toThrow(
        new Error('ENOENT: no such file or directory, scandir \'' + NONEXISTANT_DIRECTORY + '\''));
    });

    /*
     *    Tries to list files in NOT_READABLE_DIRECTORY.
     */
    it('should throw error if the given directory isn\'t readable', function () {
      expect(function () {
        fileIO.readdirSync(NOT_READABLE_DIRECTORY);
      }).toThrow(
        new Error('EACCES: permission denied, scandir \'' + NOT_READABLE_DIRECTORY + '\''));
    });
  });

  describe('readDataSync', function() {
    /*
     *    Reads READABLE_WRITABLE_DIRECTORY/READABLE_WRITABLE_FILE,
     * and validates the contents.
     */
    it('should return file data for valid file', function () {
      var expected = 'Hello World.\n';
      var actual = fileIO.readDataSync(READABLE_WRITABLE_DIRECTORY + READABLE_WRITABLE_FILE);
      expect(actual).toEqual(expected);
    });

    it('should return file data for readable in a non-readable directory', function () {
      var expected = 'Hello World.\n';
      var actual = fileIO.readDataSync(NOT_READABLE_DIRECTORY + READABLE_WRITABLE_FILE);
      expect(actual).toEqual(expected);
    });

    /*
     *    Tries to read READABLE_WRITABLE_DIRECTORY/NONEXISTANT_FILE.
     */
    it('should throw error if the given file doesn\'t exist', function () {
      expect(function () {
        fileIO.readDataSync(READABLE_WRITABLE_DIRECTORY + NONEXISTANT_FILE);
      }).toThrow(
        new Error('ENOENT: no such file or directory, stat \'' + READABLE_WRITABLE_DIRECTORY + NONEXISTANT_FILE + '\''));
    });

    /*
     *    Tries to read NONEXISTANT_DIRECTORY/NONEXISTANT_FILE.
     */
    it('should throw error if the given directory doesn\'t exist', function () {
      expect(function () {
        fileIO.readDataSync(NONEXISTANT_DIRECTORY + NONEXISTANT_FILE);
      }).toThrow(
        new Error('ENOENT: no such file or directory, stat \'' + NONEXISTANT_DIRECTORY + NONEXISTANT_FILE + '\''));
    });

    /*
     *    Tries to read READABLE_WRITABLE_DIRECTORY/NOT_READABLE_FILE.
     */
    it('should throw error if the given file isn\'t readable', function () {
      expect(function () {
        fileIO.readDataSync(READABLE_WRITABLE_DIRECTORY + NOT_READABLE_FILE);
      }).toThrow(
        new Error('EACCES: permission denied, open \'' + READABLE_WRITABLE_DIRECTORY + NOT_READABLE_FILE + '\''));
    });
  });

  describe('writeDataSync', function() {
    /*
     *    Creates a new file by writing to it, verifies contents,
     * then removes it.
     *    Writes data to READABLE_WRITABLE_DIRECTORY/TEST_FILE,
     * verifies contents, then removes (unlink) the file.
     */
    it('should return true after writing data to the file', function () {
      var data = 'Foo bar\n',
        actual = fileIO.writeDataSync(READABLE_WRITABLE_DIRECTORY + TEST_FILE, data),
        dataCheck = '';
      expect(actual).toEqual(true);

      dataCheck = fileIO.readDataSync(READABLE_WRITABLE_DIRECTORY + TEST_FILE);
      expect(dataCheck).toEqual(data);
      fileIO.unlinkFileSync(READABLE_WRITABLE_DIRECTORY + TEST_FILE);
      expect(function () {
        fileIO.readDataSync(READABLE_WRITABLE_DIRECTORY + TEST_FILE);
      }).toThrow(
        new Error('ENOENT: no such file or directory, stat \'' + READABLE_WRITABLE_DIRECTORY + TEST_FILE + '\''));
    });

    /*
     *    Tries to write to NONEXISTANT_DIRECTORY/NONEXISTANT_FILE.
     */
    it('should throw error if the given directory doesn\'t exist.', function () {
      expect(function () {
        fileIO.writeDataSync(NONEXISTANT_DIRECTORY + NONEXISTANT_FILE);
      }).toThrow(
        new Error('ENOENT: no such file or directory, open \'' + NONEXISTANT_DIRECTORY + NONEXISTANT_FILE + '\''));
    });

    /*
     *    Tries to write to NOT_WRITABLE_DIRECTORY/TEST_FILE.
     */
    it('should throw error if the given directory isn\'t writable', function () {
      expect(function () {
        fileIO.writeDataSync(NOT_WRITABLE_DIRECTORY + TEST_FILE);
      }).toThrow(
        new Error('EACCES: permission denied, open \'' + NOT_WRITABLE_DIRECTORY + TEST_FILE + '\''));
    });

    /*
     *    Tries to write to READABLE_WRITABLE_DIRECTORY/NOT_WRITABLE_FILE.
     */

    it('should throw error if the given file isn\'t writable', function () {
      expect(function () {
        fileIO.writeDataSync(READABLE_WRITABLE_DIRECTORY + NOT_WRITABLE_FILE);
      }).toThrow(
        new Error('EACCES: permission denied, open \'' + READABLE_WRITABLE_DIRECTORY + NOT_WRITABLE_FILE + '\''));
    });
  });

  //describe('unlinkFileSync');
});