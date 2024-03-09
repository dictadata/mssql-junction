/**
 * test/mssql
 */
"use strict";

require("../register");
const { retrieve } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/storage-junctions/utils");

logger.info("=== Test: mssql");

async function tests() {

  logger.info("=== mssql retrieve");
  if (await retrieve({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|*",
      pattern: {
        match: {},
        "order": { "Foo": "asc" }
      }
    },
    terminal: {
      output: "./test/data/output/mssql/retrieve_0.json"
    }
  })) return 1;

  logger.info("=== mssql retrieve");
  if (await retrieve({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema_01|*",
      options: {
        encoding: "./test/data/input/engrams/foo_schema_01.engram.json"
      },
      pattern: {
        match: {
          "Bar": { 'wc': 'row*' }
        }
      }
    },
    terminal: {
      output: "./test/data/output/mssql/retrieve_1.json"
    }
  })) return 1;

  logger.info("=== mssql retrieve");
  if (await retrieve({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_widgets|*",
      options: {
        encoding: "./test/data/input/engrams/foo_widgets.engram.json"
      },
      pattern: {
        match: {
          "Bar": { 'wc': 'row*' }
        }
      }
    },
    terminal: {
      output: "./test/data/output/mssql/retrieve_2.json"
    }
  })) return 1;

  logger.info("=== mssql retrieve w/ cues");
  if (await retrieve({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|*",
      pattern: {
        "order": { "Foo": "asc" },
        "count": 100
      }
    }
  })) return 1;

  logger.info("=== mssql retrieve with pattern");
  if (await retrieve({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_transfer|*",
      pattern: {
        match: {
          "Foo": "first",
          "Baz": { "gte": 0, "lte": 1000 }
        },
        count: 3,
        order: { "Dt Test": "asc" },
        fields: [ "Foo", "Baz" ]
      }
    }
  })) return 1;

}

(async () => {
  if (await tests()) return;
})();
