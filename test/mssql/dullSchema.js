/**
 * test/mssql/dullSchema
 */
"use strict";

require("../register");
const { dullSchema } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/lib");

logger.info("===== mssql dullSchema ");

async function test(schema, encoding) {

  logger.info("=== dullSchema" + schema);
  if (await dullSchema({
    smt: "mssql|server=dev.dictadata.net;database=storage_node|" + schema + "|*"
  })) return 1;

}

(async () => {
  if (await test("foo_schema_x", "foo_schema")) return;
})();
