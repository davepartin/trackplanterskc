// server/scripts/importPlantersFromExcel.js
// Run this script to import your Excel data into PostgreSQL

const { Pool } = require('pg');
const XLSX = require('xlsx');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_