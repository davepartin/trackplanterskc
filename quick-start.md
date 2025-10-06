# SendKC Planter Tracker - Quick Start Guide

## 🎯 What You're Building

A complete church planter management system that tracks 42+ planters through the PACE framework (Prepare, Assess, Care, Equip) with:
- Planter database with all contact info
- Task tracking for each stage
- Event management (monthly lunches, annual events)
- Filtering by rep, stage, status
- Financial tracking
- Import from your existing Excel file

---

## 📦 Step 1: Create Project Structure

Open your terminal and run these commands:

```bash
# Create project folder
mkdir sendkc-planter-tracker
cd sendkc-planter-tracker

# Initialize Node.js project
npm init -y

# Install backend dependencies
npm install express cors dotenv pg xlsx

# Install development dependencies
npm install --save-dev nodemon

# Create folder structure
mkdir server
mkdir server/routes
mkdir server/scripts

# Create React frontend
npx create-react-app client --template typescript

# Install frontend dependencies
cd client
npm install axios lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..
```

---

## 📝 Step 2: Create Configuration Files

### Create `.env` file in root:
```bash
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/sendkc_db
NODE_ENV=development
```

### Create `.gitignore` file in root:
```
node_modules/
.env
client/build/
.DS_Store
*.log
```

### Update root `package.json` scripts section:
```json
{
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js",
    "client": "cd client && npm start",
    "build": "cd client && npm run build",
    "import": "node server/scripts/importPlantersFromExcel.js"
  }
}
```

### Configure Tailwind - Edit `client/tailwind.config.js`:
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

### Update `client/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 🗄️ Step 3: Set Up Database

### Option A: Local PostgreSQL

1. Install PostgreSQL on your computer
2. Create database:
```bash
createdb sendkc_db
```

3. Run the schema:
```bash
psql sendkc_db < database-schema.sql
```

### Option B: Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Sign up/login
3. Click "New Project" → "Provision PostgreSQL"
4. Copy the `DATABASE_URL` from Railway
5. Update your `.env` file with the Railway database URL
6. Connect to database and run schema:
```bash
# Railway will give you a connection command like:
psql postgresql://user:pass@host:port/railway
```

Then paste the entire database schema SQL.

---

## 🔧 Step 4: Create Backend Files

You need to create these files with the code from the setup guide:

### File: `server/index.js`
Main server file (see setup guide)

### File: `server/db.js`
Database connection (see setup guide)

### File: `server/routes/planters.js`
Planter API endpoints (see setup guide)

### File: `server/routes/tasks.js`
Task API endpoints (see setup guide)

### File: `server/routes/events.js`
Event API endpoints (see setup guide)

### File: `server/scripts/importPlantersFromExcel.js`
Excel import script (already created for you)

---

## 🎨 Step 5: Update Frontend

Replace `client/src/App.tsx` with the React component code from the first artifact I created.

### Update `client/package.json` to add proxy:
```json
{
  "proxy": "http://localhost:5000"
}
```

---

## 📊 Step 6: Import Your Data

1. Copy your Excel file to the project root:
```bash
cp "/path/to/planter list for app oct 2025 1.xlsx" .
```

2. Run the import script:
```bash
npm run import
```

Or specify the file path:
```bash
node server/scripts/importPlantersFromExcel.js "path/to/your/file.xlsx"
```

---

## 🚀 Step 7: Test Locally

### Terminal 1 - Start Backend:
```bash
npm run dev
```

Should see: `Server running on port 5000`

### Terminal 2 - Start Frontend:
```bash
npm run client
```

Should open browser to `http://localhost:3000`

### Test the API:
```bash
# Get all planters
curl http://localhost:5000/api/planters

# Health check
curl http://localhost:5000/api/health
```

---

## 🌐 Step 8: Deploy to Railway

### A. Push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit - SendKC Planter Tracker"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/sendkc-planter-tracker.git
git branch -M main
git push -u origin main
```

### B. Deploy on Railway:

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `sendkc-planter-tracker` repository
5. Railway will auto-detect Node.js and deploy

### C. Add Environment Variables in Railway:

1. Click on your project
2. Go to "Variables"
3. Add:
   - `PORT` = 5000
   - `DATABASE_URL` = (copy from your PostgreSQL service)
   - `NODE_ENV` = production

### D. Configure Build Settings:

Railway should auto-detect, but if needed:
- **Build Command**: `cd client && npm install && npm run build`
- **Start Command**: `node server/index.js`

### E. Add Custom Domain (Optional):
1. Click "Settings" → "Domains"
2. Click "Generate Domain" for free Railway domain
3. Or add your custom domain

---

## ✅ Verification Checklist

- [ ] Database is created and schema is loaded
- [ ] Environment variables are set
- [ ] Backend server starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Can see planters in the table
- [ ] Can filter by stage, rep, status
- [ ] Can click "View" on a planter to see details
- [ ] Excel data imported successfully

---

## 🎯 Next Features to Add

### 1. Task Management
- View all tasks for a planter
- Check off completed tasks
- Add notes to tasks
- Track progress percentage

### 2. Event Management
- Add planters to events
- Track attendance
- Send reminders

### 3. Search & Filter
- Full-text search
- Advanced filters
- Save filter presets

### 4. Reporting
- Generate reports by stage
- Export to Excel/PDF
- Financial summaries

### 5. Notifications
- Email reminders for tasks
- Care period ending alerts
- Event RSVPs

### 6. Document Management
- Upload documents per planter
- Store assessments
- Training certificates

---

## 🆘 Troubleshooting

### Backend won't start:
```bash
# Check if port 5000 is in use
lsof -ti:5000

# Kill process if needed
kill -9 $(lsof -ti:5000)
```

### Database connection error:
- Verify `DATABASE_URL` in `.env`
- Check PostgreSQL is running
- Test connection with `psql`

### Frontend can't reach backend:
- Check proxy setting in `client/package.json`
- Verify backend is running on port 5000
- Check for CORS errors in browser console

### Import script fails:
- Verify file path is correct
- Check Excel file format matches expected columns
- Look for email duplicates

---

## 📚 Resources

- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Railway Docs**: https://docs.railway.app
- **Tailwind CSS**: https://tailwindcss.com

---

## 🎉 You're Done!

Your SendKC Planter Tracker is now ready to:
- ✅ Track 42+ planters
- ✅ Manage PACE process
- ✅ Organize by rep and stage
- ✅ Import from Excel
- ✅ Deploy to production

**Questions?** Run into issues? Check the troubleshooting section or review the full setup guide.