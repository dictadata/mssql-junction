/**
 * test/mssql
 */
"use strict";

require("../register");
const { dullSchema, transfer } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/lib");

logger.info("=== Test: mssql transfers");

async function tests() {

  logger.info("=== dullSchema foo_transfer");
  if (await dullSchema({
    smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_transfer|*"
  })) return 1;

  logger.info("=== foofile.csv > mssql");
  if (await transfer({
    origin: {
      smt: "csv|./test/data/input/|foofile.csv|*",
      options: {
        header: true
      }
    },
    terminal: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|=Foo"
    }
  })) return 1;

  logger.info("=== foofile_01.json > mssql");
  if (await transfer({
    origin: {
      smt: "json|./test/data/input/|foofile_01.json|*"
    },
    terminal: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema_01|=Foo",
      options: {
        encoding: "./test/data/input/engrams/foo_schema_01.engram.json"
      }
    }
  })) return 1;

  logger.info("=== foo_widgets.json > mssql");
  if (await transfer({
    origin: {
      smt: "json|./test/data/input/|foo_widgets.json|*"
    },
    terminal: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_widgets|=Foo",
      options: {
        encoding: "./test/data/input/engrams/foo_widgets.engram.json"
      }
    }
  })) return 1;

  logger.info("=== mssql > mssql foo_transfer");
  if (await transfer({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|=Foo"
    },
    terminal: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_transfer|=Foo"
    }
  })) return 1;

  logger.info("=== mssql > mssql_transfer.csv");
  if (await transfer({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_transfer|=Foo",
      options: {},
      pattern: {
        order: { "Foo": "asc" }
      }
    },
    terminal: {
      smt: "csv|./test/data/output/mssql/|transfer.csv|*",
      options: {
        header: true
      },
      output: "./test/data/output/mssql/transfer.csv"
    }
  })) return 1;
}

(async () => {
  if (await tests()) return;
})();
