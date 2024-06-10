/**
 * test/mssql
 */
"use strict";

require("../register");
const { store } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/lib");

logger.info("=== Test: mssql");

async function tests() {

  logger.info("=== mssql store one");
  if (await store({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|=Foo"
    },
    construct: {
      Foo: 'one',
      Bar: 'Washington',
      Baz: 1,
      Fobe: 1.1,
      "Dt Test": "10/07/2018",
      enabled: false
    },
    terminal: {
      output: "./test/data/output/mssql/store_01.json"
    }
  })) return 1;

  logger.info("=== mssql store twenty");
  if (await store({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|=Foo",
    },
    construct: {
      Foo: 'twenty',
      Bar: 'Jackson',
      Baz: 20,
      Fobe: 20.20,
      "Dt Test": "2020-10-07T08:00:00",
      enabled: true
    },
    terminal: {
      output: "./test/data/output/mssql/store_02.json"
    }
  })) return 1;

  logger.info("=== mssql store 30");
  if (await store({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|=Foo",
    },
    construct: {
      Foo: 'twenty',
      Bar: 'Jackson',
      Baz: 30,
      enabled: false
    },
    terminal: {
      output: "./test/data/output/mssql/store_03.json"
    }
  })) return 1;

  logger.info("=== mssql store ten");
  if (await store({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|=Foo",
    },
    construct: {
      Foo: 'ten',
      Bar: 'Hamilton',
      Baz: 10,
      Fobe: 0.10,
      "Dt Test": "2020-10-07",
      enabled: false
    },
    terminal: {
      output: "./test/data/output/mssql/store_04.json"
    }
  })) return 1;

}

(async () => {
  if (await tests()) return;
})();
