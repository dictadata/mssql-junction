/**
 * test/mssql
 */
"use strict";

require("../register");
const { dull } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/lib");

logger.info("=== Test: mssql");

async function tests() {

  logger.info("=== mssql dull");
  if (await dull({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|=Foo",
      pattern: {
        match: {
          Foo: 'one'
        }
      }
    },
    terminal: {
      output: "./test/data/output/mssql/dull_01.json"
    }
  })) return 1;

}

(async () => {
  if (await tests()) return;
})();
