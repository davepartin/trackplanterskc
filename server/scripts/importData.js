const pool = require('../db');
const XLSX = require('xlsx');

async function importPlanters() {
  const workbook = XLSX.readFile('path_to_your_excel_file.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  for (const row of data) {
    await pool.query(
      `INSERT INTO planters 
       (first_name, last_name, phone, email, field_staff_rep, church_name, 
        sending_church, care_start_date, care_end_date, orientation_date, 
        training_year, monthly_funding, spouse_first_name, spouse_last_name, 
        spouse_email, sbc_id, current_stage, current_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        row['First Name'],
        row['Last name'],
        row['Phone'],
        row['Email'],
        row['Field Staff Rep'],
        row['Church'],
        row['Sending'],
        row['Care Start'],
        row['End Date'],
        row['Orientation'],
        row['SNTraining'],
        row['Grid Money'],
        row['Spouse First'],
        row['Spouse Last'],
        row['Spouse Email'],
        row['SBC ID'],
        'CARE', // Set appropriate stage
        'Active Care' // Set appropriate status
      ]
    );
  }
  
  console.log('Import complete!');
  process.exit(0);
}

importPlanters().catch(console.error);
