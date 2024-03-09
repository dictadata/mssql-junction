# @dictadata/mssql-junction 0.9.x

MSSQLJunction provides a normalized, plug-in interface to access MSSQL Server data sources.  MSSQLJunction is a storage plugin for use with [_@dictadata/storage-junctions_](https://github.com/dictadata/storage-junctions) and related projects [_@dictadata/storage-stracts_](https://github.com/dictadata/storage-tracts) ETL command line utility and [_@dictadata/storage-node_](https://github.com/dictadata/storage-node) API Server.

## Installation

```bash
npm install @dictadata/mssql-junctions
```

## Plugin Initialization

Import the _Storage Junctions_ library and the _MSSQL Junction_ plugin.  Then register _MSSQL Junction_ with the _Storage Junctions_' `Storage` module. This will register _MSSQL Junction_ for use with storage model `"mssql"`.

```javascript
const { Storage } = require("@dictadata/storage-junctions");
const MSSQLJunction = require("@dictadata/mssql-junction");

Storage.Junctions.use("mssql", MSSQLJunction);
```

## Creating an instance of MSSQLJunction

Create an instance of `MSSQLJunction` class.

```javascript
let junction = Storage.activate(smt, options);
```

### SMT

`MSSQLJunction` constructor takes an SMT, Storage Memory Trace, with the address of the data source. SMT can be a string or object. The SMT string format is `"model|locus|schema|key"` which for MSSQLJunction is `"mssql|server=localhost;database=db_name|table_name|*"`.

```javascript
// SMT string
let smt = "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|=Foo"

// SMT object
let SMT = {
  model: "mssql",
  locus: "server=dev.dictadata.net;database=storage_node",
  schema: "foo_schema",
  key: "*" // all rows
}
```

### MSSQLJunction Options

`MSSQLJunction` constructor takes an options object with the following fields.

`{Object} encoding` - an Engram or plain object containing a Fields property with column definitions, optional.

`{Boolean} bulkLoad` - MSSQLJunction.store() and MSSQLWriter will use bulk load when possible, default is false.

`{Object} auth` - a plain object containing connection authentication information. See also auth_entries.json file.

`{String} auth.username` - username for the database connection.

`{String} auth.password` - password for the database connection.

## Examples

### Retrieve Rows

```javascript
  const { Storage } = require("@dictadata/storage-junctions");
  const MSSQLJunction = require("../storage/junctions/mssql");

  function registerPlugins() {
    Storage.Junctions.use("mssql", MSSQLJunction);
  }

  async function retrieveData() {
    let rows;

    let smt = "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|=Foo"
    let options = {
      username: "test",
      password: "test"
    }

    let pattern: {
      match: {
        "Foo": "first",
        "Baz": { "gte": 0, "lte": 1000 }
      },
      count: 3,
      order: { "Dt Test": "asc" },
      fields: [ "Foo", "Bar", "Baz" ]
    }

    var junction;
    try {
      junction = await Storage.activate(smt, options);
      let results = await junction.retrieve(pattern);

      console.log("result: " + results.status + " count: " + (results.data ? results.data.length : 0));
      console.log(JSON.stringify(results, null, "  "));

      rows = results.data;
    }
    catch (err) {
      console.error('!!! request failed: ' + err.status + " " + err.message);
      retCode = 1;
    }
    finally {
      if (junction)
        await junction.relax();
    }

    return rows;
  }
```

### Streaming

The following example creates an instance of `MSSQLReader` and collects streamed data into an array. In this case the storage construct is an object representing a row of columns from the MSSQL table. `MSSQLReader` is derived from Node.js stream Readable. So the reader can be the source of any Node.js pipeline.

```javascript
  const { Storage } = require("@dictadata/storage-junctions");
  const MSSQLJunction = require("../storage/junctions/mssql");

  function registerPlugins() {
    Storage.Junctions.use("mssql", MSSQLJunction);
  }

  async function retrieveData() {
    let response = [];

    let smt = "mssql|server=dev.dictadata.net;database=storage_node|foo_schema|=Foo"
    let options = {
      username: "test",
      password: "test"
    }

    let junction = Storage.activate(smt, options);
    let reader = junction.createReader();

    reader.on('data', (construct) => {
      response.push(construct);
    })
    rs.on('end', () => {
      console.log('End of data.');
    });
    rs.on('error', (err) => {
      console.error(err);
    });

    await stream.finished(reader);

    return response;
  }
```

## Using MSSQLJunction plugin with Storage-Tracts (ETL)

`MSSQLJunction` can be used from the command line, batch file or task schedular via the Storage-Tracts ETL command line interface.

### Install Storage-Tracts

Install Storage-Tracts in NPM's global workspace. This will allow you to run from any folder using the command "etl" or "storage-etl".

```bash
npm -g install @dictadata/storage-tracts
```

### Storage_ETL CLI

The ETL app takes two parameters as shown below. See the [Storage-Tracts](https://github.com/dictadata/storage-tracts) documentation for full details.

```bash
etl [-t tractsFile] [tractName]
```

### ETL Tracts File

An ETL Tracts file is a JSON object describing the storage source and storage destination. Each top level property is a tract. For MSSQL files you will need to also specify the plugin.

```json
{
  "config": {
    "plugins": {
      "junctions": {
        "@dictadata/mssql-junction": [ "mssql" ]
      }
    }
  },
  "transfer": {
    "name": "foo_transfer",
    "action": "transfer",
    "origin": {
      "smt": "mssql|./test/data/input/|foofile.mssql|*",
      "options": {}
    },
    "terminal": {
      "smt": "json|./test/data/output/|foofile.json|*"
    }
  }
}
```
