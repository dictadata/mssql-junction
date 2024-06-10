/**
 * test/mssql list
 */
"use strict";

require("../register");
const { list } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/lib");

logger.info("=== tests: mssql list");

async function tests() {

  logger.info("=== list");
  if (await list({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|*|*",
      options: {
        schema: "foo*"
      }
    },
    terminal: {
      output: "./test/data/output/mssql/list.json"
    }
  }, 1)) return 1;

}

(async () => {
  if (await tests()) return;
})();
