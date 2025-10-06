# SendKC Planter Tracker - Complete Setup Guide

## 📋 Overview
This guide will help you build and deploy your complete Church Planter Management application using Cursor, GitHub, and Railway.

## 🏗️ Architecture
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Deployment**: Railway
- **Version Control**: GitHub

---

## 🚀 Step-by-Step Setup

### Step 1: Create New Project in Cursor

1. Open **Cursor**
2. Create a new folder: `sendkc-planter-tracker`
3. Open the folder in Cursor

### Step 2: Initialize the Project

Open the terminal in Cursor and run:

```bash
# Initialize Node.js project
npm init -y

# Install backend dependencies
npm install express cors dotenv pg pg-hstore
npm install --save-dev nodemon

# Create backend structure
mkdir server
mkdir server/routes
mkdir server/controllers
mkdir server/models

# Initialize React frontend
npx create-react-app client --template typescript
cd client
npm install axios lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..
```

### Step 3: Configure Tailwind CSS

Edit `client/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Edit `client/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 4: Create Backend Files

#### `server/index.js`

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/planters', require('./routes/planters'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/events', require('./routes/events'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### `server/db.js`

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = pool;
```

#### `server/routes/planters.js`

```javascript
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all planters
router.get('/', async (req, res) => {
  try {
    const { stage, status, rep } = req.query;
    let query = 'SELECT * FROM planters WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (stage) {
      query += ` AND current_stage = $${paramCount}`;
      params.push(stage);
      paramCount++;
    }
    if (status) {
      query += ` AND current_status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    if (rep) {
      query += ` AND field_staff_rep = $${paramCount}`;
      params.push(rep);
      paramCount++;
    }

    query += ' ORDER BY last_name, first_name';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single planter
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM planters WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Planter not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new planter
router.post('/', async (req, res) => {
  try {
    const {
      first_name, last_name, phone, email, field_staff_rep,
      church_name, sending_church, current_stage, current_status,
      spouse_first_name, spouse_last_name, monthly_funding
    } = req.body;

    const result = await pool.query(
      `INSERT INTO planters 
       (first_name, last_name, phone, email, field_staff_rep, church_name, 
        sending_church, current_stage, current_status, spouse_first_name, 
        spouse_last_name, monthly_funding)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [first_name, last_name, phone, email, field_staff_rep, church_name,
       sending_church, current_stage || 'PREPARE', current_status || 'Potential',
       spouse_first_name, spouse_last_name, monthly_funding || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update planter
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    
    const setClause = Object.keys(fields)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.values(fields);
    
    const result = await pool.query(
      `UPDATE planters SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Planter not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete planter
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM planters WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Planter not found' });
    }
    
    res.json({ message: 'Planter deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get planter tasks
router.get('/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT pt.*, ptp.is_completed, ptp.completed_date, ptp.notes as progress_notes, ps.stage_name
       FROM process_tasks pt
       LEFT JOIN planter_task_progress ptp ON pt.id = ptp.task_id AND ptp.planter_id = $1
       LEFT JOIN pace_stages ps ON pt.stage_id = ps.id
       ORDER BY ps.stage_order, pt.task_order`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task progress
router.post('/:planterId/tasks/:taskId', async (req, res) => {
  try {
    const { planterId, taskId } = req.params;
    const { is_completed, notes } = req.body;
    
    const result = await pool.query(
      `INSERT INTO planter_task_progress (planter_id, task_id, is_completed, completed_date, notes)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (planter_id, task_id) 
       DO UPDATE SET is_completed = $3, completed_date = $4, notes = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [planterId, taskId, is_completed, is_completed ? new Date() : null, notes]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
```

#### `server/routes/tasks.js`

```javascript
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all tasks by stage
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pt.*, ps.stage_name, ps.stage_order
       FROM process_tasks pt
       JOIN pace_stages ps ON pt.stage_id = ps.id
       ORDER BY ps.stage_order, pt.task_order`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tasks by stage
router.get('/stage/:stageName', async (req, res) => {
  try {
    const { stageName } = req.params;
    const result = await pool.query(
      `SELECT pt.*
       FROM process_tasks pt
       JOIN pace_stages ps ON pt.stage_id = ps.id
       WHERE ps.stage_name = $1
       ORDER BY pt.task_order`,
      [stageName]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const { stage_name, task_name, task_description, task_order, category } = req.body;
    
    const stageResult = await pool.query('SELECT id FROM pace_stages WHERE stage_name = $1', [stage_name]);
    
    if (stageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Stage not found' });
    }
    
    const stage_id = stageResult.rows[0].id;
    
    const result = await pool.query(
      `INSERT INTO process_tasks (stage_id, task_name, task_description, task_order, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [stage_id, task_name, task_description, task_order, category]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { task_name, task_description, task_order, category } = req.body;
    
    const result = await pool.query(
      `UPDATE process_tasks 
       SET task_name = $1, task_description = $2, task_order = $3, category = $4
       WHERE id = $5
       RETURNING *`,
      [task_name, task_description, task_order, category, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM process_tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
```

#### `server/routes/events.js`

```javascript
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all events
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY event_date');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create event
router.post('/', async (req, res) => {
  try {
    const { event_name, event_type, event_date, event_time, location, description } = req.body;
    
    const result = await pool.query(
      `INSERT INTO events (event_name, event_type, event_date, event_time, location, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [event_name, event_type, event_date, event_time, location, description]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
```

### Step 5: Update package.json

Edit root `package.json`:

```json
{
  "name": "sendkc-planter-tracker",
  "version": "1.0.0",
  "description": "Church Planter Management System",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js",
    "client": "cd client && npm start",
    "build": "cd client && npm run build"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Step 6: Create .env file

Create `.env` in root:

```
PORT=5000
DATABASE_URL=your_postgresql_connection_string_here
NODE_ENV=development
```

### Step 7: Create .gitignore

```
node_modules/
.env
client/build/
.DS_Store
```

### Step 8: Deploy to Railway

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Add PostgreSQL database
   - Set environment variables
   - Deploy!

3. **Get Database Connection**:
   - In Railway, click on your PostgreSQL service
   - Copy the `DATABASE_URL`
   - Add it to your environment variables

### Step 9: Import Your Excel Data

Create `server/scripts/importData.js`:

```javascript
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
```

Run with: `node server/scripts/importData.js`

---

## 📚 Next Steps

1. **Test locally**: Run `npm run dev` for backend and `npm run client` for frontend
2. **Set up the database**: Run the SQL schema on your Railway PostgreSQL
3. **Import your data**: Use the import script
4. **Deploy**: Push to GitHub and Railway will auto-deploy

## 🎯 Key Features to Add

- Task completion tracking
- Event management
- Planter notes and activity log
- Export to Excel
- Email notifications
- Calendar integration
- Document uploads
- Reporting dashboard

## 📞 Need Help?

If you run into issues, check:
- Railway logs for backend errors
- Browser console for frontend errors
- Database connection string is correct
- All environment variables are set

---

**Your app is now ready to manage church planters through their PACE journey!** 🚀