/**
 * mssql/encoder
 */
"use strict";

const { ynBoolean } = require('@dictadata/storage-junctions/utils');
const TYPES = require('tedious').TYPES;

var { stringBreakpoints } = require('@dictadata/storage-junctions/types');
exports.stringBreakpoints = stringBreakpoints = Object.assign({}, stringBreakpoints);
if (stringBreakpoints.text > 8000)
  stringBreakpoints.text = 8000;   // up to 32767 if MAX_STRING_SIZE = EXTENDED;

/**
 * convert a mssql type to a storage type
 */
var storageType = exports.storageType = (mssqlType, size = 0) => {
  let fldType = 'unknown';

  switch (mssqlType.toUpperCase()) {
    case 'BIT':
    case 'TINYINT':
      if (size === 1) {
        fldType = 'boolean';
        break;
      }
    // eslint-disable-next-line no-fallthrough
    case 'SMALLINT':
    case 'INT':
    case 'Numeric':
    case 'YEAR':
      fldType = 'integer';
      break;

    case 'BIGINT':
      fldType = 'keyword';
      break;

    case 'NUMERIC':
    case 'DECIMAL':
    case 'SMALLMONEY':
    case 'MONEY':
    case 'REAL':
    case 'FLOAT':
      fldType = 'number';
      break;

    case 'DATETIME':
    case 'DATETIME2':
    case 'DATE':
    case 'TIME':
    case 'SMALLDATETIME':
    case "DATETIMEOFFSET":
      fldType = 'date';
      break;

    case 'CHAR':
    case 'VARCHAR':
      if (size <= stringBreakpoints.keyword)
        fldType = 'keyword';
      else
        fldType = 'text';
      break;

    case 'TEXT':
    case 'NCHAR':
    case 'NVARCHAR':
    //note: a "list" or "map" field type could be stuff in NVARCHAR column as JSON
    //A person will need to manually modify the storage encoding.
    case 'NTEXT':
    case 'XML':
      fldType = 'text';
      break;

    case 'uniqueidentifier':
      fldType = 'uuid';
      break;

    // binary strings (javascript buffer)
    case 'BINARY':
    case 'VARBINARY':
    case 'IMAGE':
      fldType = 'binary';
      break;
  }

  return fldType;
};

/**
 * convert a mssql column definition to a storage field definition
 */
exports.storageField = (column) => {

  let sqlType = column[ "type" ].value;
  let size = column[ "size" ].value;

  let field = {
    name: column[ "name" ].value,
    type: storageType(sqlType, size),
    size: column[ "size" ].value,
  };

  if (Object.hasOwn(column, "default")) {
    field.default = (column[ "default" ].value === "(NULL)") ? null : column[ "default" ].value;
  }
  if (Object.hasOwn(column, "is_nullable"))
    field.nullable = ynBoolean(column[ "is_nullable" ].value);
  if (Object.hasOwn(column, "key_ordinal"))
    field.key = column[ "key_ordinal" ].value;

  // add MSSQL definition
  field._mssql = {};
  for (let [ name, def ] of Object.entries(column)) {
    field._mssql[ name ] = def.value;
  }

  return field;
};

/**
 * return a mssql type given a storage field definition
 */
exports.mssqlType = (field) => {
  if (field._mssql) {
    let strTypes = [ 'varchar', 'char', 'text', 'nvarchar', 'nchar', 'ntext' ];
    if (strTypes.includes(field._mssql.type))
      return field._mssql.type + '(' + field._mssql.size + ')';
    else
      return field._mssql.type;
  }

  let mssqlType = "varchar(256)";  // default type
  switch (field.type.toLowerCase()) {
    case "boolean":
      mssqlType = "bit";
      break;
    case "integer":
      mssqlType = "int";
      break;
    case "number":
      mssqlType = "float";
      break;
    case "keyword":
      mssqlType = "varchar(" + (field.size > 0 ? field.size : stringBreakpoints.keyword) + ")";
      break;
    case "string":
    case "text":
      mssqlType = "varchar(" + (field.size > 0 && field.size <= stringBreakpoints.text ? field.size : "max") + ")";
      break;
    case "date":
      mssqlType = "datetime";
      break;
    case "uuid":
      mssqlType = "uniqueidentifier";
      break;
    case "list":
    case "map":
      mssqlType = "nvarchar(max)";  // will be stuffed in a column as JSON
      break;
    case "binary":
      mssqlType = "binary";
      break;
  }

  return mssqlType;
};
