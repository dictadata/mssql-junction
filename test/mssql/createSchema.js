/**
 * test/mssql/createSchema
 */
"use strict";

require("../register");
const { createSchema, dull } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/storage-junctions/utils");

logger.info("=== Test: mssql createSchema");

async function test(schema, encoding) {

  logger.info("=== createSchema " + schema);
  let retCode = await createSchema({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|" + schema + "|*",
      options: {
        auth: {
          username: "dicta",
          password: "data"
        },
        encoding: "./test/data/input/engrams/" + encoding + ".engram.json"
      }
    }
  });
  if (retCode > 0) return 1;

  if (retCode < 0) {
    // if schema already exists then truncate constructs
    logger.info("=== dull (truncate) " + schema);
    if (await dull({
      origin: {
        smt: "mssql|server=dev.dictadata.net;database=storage_node|" + schema + "|*"
      }
    })) return 1;
  }
}

async function test_lg() {

  logger.info("=== mssql large fields");
  let retCode = await createSchema({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema_lg|*",
      options: {
        encoding: "./test/data/input/engrams/foo_schema_lg.engram.json",
        stringBreakpoints: {
          keyword: 120,
          text: 2000
        }
      }
    }
  });
  if (retCode > 0) return 1;

}

(async () => {
  if (await test("foo_schema", "foo_schema")) return 1;
  if (await test("foo_schema_x", "foo_schema")) return 1;    // for dullSchema.js
  if (await test("foo_schema_01", "foo_schema_01")) return 1;
  if (await test("foo_widgets", "foo_widgets")) return 1;
  if (await test("foo_schema_two", "foo_schema_two")) return 1;
  if (await test_lg()) return 1;
})();
