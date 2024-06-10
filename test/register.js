/**
 * test/register
 */
"use strict";

const { Storage } = require("@dictadata/storage-junctions");
const { logger } = require("@dictadata/lib");

const MSSQLJunction = require("../storage/junctions/mssql");

logger.info("--- adding MSSQLJunction to storage cortex");
Storage.Junctions.use("mssql", MSSQLJunction);
