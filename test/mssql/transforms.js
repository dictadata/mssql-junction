/**
 * test/json
 */
"use strict";

require("../register");
const { transfer } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/storage-junctions/utils");

logger.info("=== Test: mssql transforms");

async function tests() {

  logger.verbose("=== json => mssql foo_schema_etl2");
  if (await transfer({
    "origin": {
      "smt": "json|./test/data/input/|foofile_01.json|*"
    },
    "transforms": [
      {
        "transform": "filter",
        "match": {
          "Bar": "row"
        },
        "drop": {
          "Baz": {
            "eq": 456
          }
        }
      },
      {
        "transform": "mutate",
        "map": {
          "foo": "=Foo",
          "bar": "=Bar",
          "baz": "=Baz",
          "fobe": "=Fobe",
          "dt_test": "=Dt Test",
          "state": "=subObj1.state",
        },
        "override": {
          "fie": "where's fum?"
        },
        "remove": [ "fobe" ]
      }
    ],
    "terminal": {
      "smt": "mssql|server=dev.dictadata.net;database=storage_node|foo_schema_etl2|*",
      "options": {
        "encoding": "./test/data/input/engrams/foo_schema_t.engram.json"
      }
    }
  })) return 1;

  logger.verbose('=== mssql > mssql_transform_0.json');
  if (await transfer({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|*",
      pattern: {
        match: {
          "Bar": "row",
          "Baz": { "lte": 500 }
        },
        fields: [ "Dt Test", "Foo", "Bar", "Baz" ]
      }
    },
    terminal: {
      smt: "json|./test/data/output/mssql/|transform_0.json|*",
      output: "./test/data/output/mssql/transform_0.json"
    }
  })) return 1;

  logger.verbose('=== mssql > mssql_transform_1.json');
  if (await transfer({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_schema_01|*",
      options: {
        encoding: "./test/data/input/engrams/foo_schema_01.engram.json"
      }
    },
    transforms: [
      {
        transform: "filter",
        "match": {
          "Bar": "row"
        },
        "drop": {
          "Baz": { "gt": 500 }
        }
      },
      {
        transform: "mutate",
        "default": {
          "fie": "where's fum?"
        },
        "override": {
          "fum": "here"
        },
        "map": {
          "dt_test": "=Dt Test",
          "foo": "=Foo",
          "bar": "=Bar",
          "baz": "=Baz",
          "fobe": "=Fobe",
          "subObj1": "=subObj1"
        },
        "remove": [ "fobe" ],
      }
    ],
    terminal: {
      smt: "json|./test/data/output/mssql/|transform_1.json|*",
      output: "./test/data/output/mssql/transform_1.json"
    }
  })) return 1;

  logger.verbose('=== mssql > mssql_transform_2.json');
  if (await transfer({
    origin: {
      smt: "mssql|server=dev.dictadata.net;database=storage_node|foo_widgets|*",
      options: {
        encoding: "./test/data/input/engrams/foo_widgets.engram.json"
      }
    },
    transforms: [
      {
        transform: "filter",
        "match": {
          "Bar": "row"
        },
        "drop": {
          "Baz": { "gt": 500 }
        }
      },
      {
        transform: "mutate",
        "default": {
          "fie": "where's fum?"
        },
        "override": {
          "fum": "here"
        },
        "map": {
          "dt_test": "=Dt Test",
          "foo": "=Foo",
          "bar": "=Bar",
          "baz": "=Baz",
          "fobe": "=Fobe",
          "tags": "=tags"
        },
        "remove": [ "fobe" ],
      }
    ],
    terminal: {
      smt: "json|./test/data/output/mssql/|transform_2.json|*",
      output: "./test/data/output/mssql/transform_2.json"
    }
  })) return 1;

}

(async () => {
  if (await tests()) return;
})();
