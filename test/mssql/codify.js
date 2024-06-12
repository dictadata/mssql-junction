/**
 * test/codify
 */
"use strict";

require("../register");
const { codify } = require("@dictadata/storage-junctions/test")
const { logger } = require("@dictadata/lib");

logger.info("=== tests: MS SQL Codify ");

async function tests() {

  logger.info("=== codify foo_schema");
  if (await codify({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|=Foo"
    },
    terminal: {
      output: './test/data/output/mssql/codify_00.json'
    }
  })) return 1;

  logger.info("=== codify foo_schema_01");
  if (await codify({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema_01|=Foo"
    },
    terminal: {
      output: './test/data/output/mssql/codify_01.json'
    }
  })) return 1;

  logger.info("=== codify foo_widgets");
  if (await codify({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_widgets|=Foo"
    },
    terminal: {
      output: './test/data/output/mssql/codify_02.json'
    }
  })) return 1;

}

(async () => {
  if (await tests()) return;
})();
