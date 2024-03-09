/**
 * test/mssql
 */
"use strict";

require("../register");
const { retrieve } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/storage-junctions/utils");

logger.info("=== Tests: retreive");

async function tests() {

  logger.info("=== mssql aggregate");
  if (await retrieve({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|*",
      pattern: {
        match: {
          "Bar": "row",
          "Baz": { "gte": 0, "lte": 1000 }
        },
        aggregate: {
          "baz_sum": { "sum": "Baz" },
          "fobe_max": { "max": "Fobe" }
        }
      }
    },
    terminal: {
      output: './test/data/output/mssql/aggregate_1.json'
    }
  })) return 1;

  logger.info("=== mssql aggregate summary");
  if (await retrieve({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|*",
      pattern: {
        match: {
          "Baz": { "gte": 0, "lte": 1000 }
        },
        aggregate: {
          "sum": { "sum": "Baz" },
          "avg": { "avg": "Baz" },
          "min": { "min": "Baz" },
          "max": { "max": "Baz" },
          "count": { "count": "Baz" }
        },
        "order": { "sum": "desc" },
        "count": 10
      }
    },
    terminal: {
      output: './test/data/output/mssql/aggregate_2.json'
    }
  })) return 1;

  logger.info("=== mssql aggregate w/ groupby");
  if (await retrieve({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|*",
      pattern: {
        match: {
          "Baz": { "gte": 0, "lte": 1000 }
        },
        aggregate: {
          "Foo": {
            "baz_sum": { "sum": "Baz" },
            "count": { "count": "Baz" },
            "dt_min": { "min": "Dt Test" },
            "dt_max": { "max": "Dt Test" }
          }
        },
        "order": { "baz_sum": "desc" },
        "count": 5
      }
    },
    terminal: {
      output: './test/data/output/mssql/aggregate_3.json'
    }
  })) return 1;

}

(async () => {
  if (await tests()) return;
})();
