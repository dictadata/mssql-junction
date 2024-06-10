/**
 * test/mssql
 */
"use strict";

require("../register");
const { storeBulk, transfer } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/lib");

logger.info("=== Test: mssql bulk storage");

async function tests() {

  logger.info("=== mssql storeBulk");
  if (await storeBulk({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|=Foo"
    },
    constructs: [{
      Foo: 'one-o-five',
      Bar: 'Lincoln',
      Baz: 105
    },{
      Foo: 'one-ten',
      Bar: 'Hamilton',
      Baz: 110
    },{
      Foo: 'one-twenty',
      Bar: 'Jackson',
      Baz: 120
    } ],
    terminal: {
      output: "./test/data/output/mssql/store_bulk_01.json"
    }
  })) return 1;

  logger.verbose('=== timeseries.csv > mssql');
  if (await transfer({
    origin: {
      smt: "csv|/var/dictadata/test/data/input/|timeseries.csv|*",
      options: {
        header: false,
        encoding: {
          fields: {
            "time": "date",
            "temp": "number"
          }
        }
      }
    },
    terminal: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|timeseries|*",
      options: {
        bulkLoad: true
      }
    }
  })) return 1;

}

(async () => {
  if (await tests()) return;
})();
