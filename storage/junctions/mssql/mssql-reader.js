/**
 * mssql/reader
 */
"use strict";

const { StorageReader } = require('@dictadata/storage-junctions');
const { logger } = require('@dictadata/lib');
const sqlEncoder = require("./mssql-encoder-sql");
const tedious = require('tedious');


module.exports = exports = class MSSQLReader extends StorageReader {

  /**
   *
   * @param {*} storageJunction
   * @param {*} options
   */
  constructor(storageJunction, options) {
    super(storageJunction, options);

    this.started = false;
  }

  async _construct(callback) {
    logger.debug("MSSQLReader._construct");

    try {
      // open output stream

      callback();
    }
    catch (err) {
      logger.warn(err);
      callback(this.stfs?.Error(err) || new Error('MSSQLReader construct error'));
    }
  }

  /**
   * Fetch data from the underlying resource.
   * @param {*} size <number> Number of bytes to read asynchronously
   */
  async _read(size) {
    logger.debug('MSSQLReader._read');

    // read up to size constructs
    if (!this.started) {
      this.started = true;

      try {
        let pattern = this.options.pattern || {};
        let sql = sqlEncoder.sqlSelectByPattern(this.engram, pattern);

        let request = new tedious.Request(sql, (err, rowCount) => {
          // when done reading from source
          this.push(null);
          if (err) {
            logger.warn(err);
          } else {
            logger.debug(rowCount + ' rows');
          }
        });

        let engram = this.engram;
        request.on('row', (columns) => {
          this.push(sqlEncoder.decodeResults(engram, columns));
        });

        this.junction.connection.execSql(request);
      }
      catch (err) {
        logger.warn("MSSQLReader reader: " + err.message);
        this.destroy(err);
      }
    }
  }

};
