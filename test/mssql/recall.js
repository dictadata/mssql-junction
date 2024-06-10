/**
 * test/mssql
 */
"use strict";

require("../register");
const { recall } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/lib");

logger.info("=== Test: mssql");

async function tests() {

  logger.info("=== mssql recall");
  if (await recall({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|=Foo",
      pattern: {
        match: {
          Foo: 'twenty'
        }
      }
    },
    terminal: {
      output: "./test/data/output/mssql/recall_01.json"
    }
  })) return 1;

  logger.info("=== mssql recall");
  if (await recall({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|*",
      pattern: {
        match: {
          Foo: 'ten'
        }
      }
    },
    terminal: {
      output: "./test/data/output/mssql/recall_02.json"
    }
  })) return 1;

}

(async () => {
  if (await tests()) return;
})();
