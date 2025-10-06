-- SendKC Planter Tracker Database Schema
-- PostgreSQL Database

-- Create planters table
CREATE TABLE planters (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    text_numbers TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    sbc_id INTEGER,
    field_staff_rep VARCHAR(50),
    church_name VARCHAR(255),
    sending_church VARCHAR(255),
    birth_date DATE,
    spouse_first_name VARCHAR(100),
    spouse_last_name VARCHAR(100),
    spouse_email VARCHAR(255),
    care_start_date DATE,
    care_end_date DATE,
    orientation_date DATE,
    training_year INTEGER,
    monthly_funding DECIMAL(10, 2),
    startup_grant_received BOOLEAN DEFAULT false,
    current_stage VARCHAR(20) DEFAULT 'PREPARE',
    current_status VARCHAR(50) DEFAULT 'Potential',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create PACE process stages table
CREATE TABLE pace_stages (
    id SERIAL PRIMARY KEY,
    stage_name VARCHAR(20) NOT NULL,
    stage_order INTEGER NOT NULL,
    description TEXT,
    UNIQUE(stage_name)
);

-- Insert PACE stages
INSERT INTO pace_stages (stage_name, stage_order, description) VALUES
    ('PREPARE', 1, 'Initial development and evaluation'),
    ('ASSESS', 2, 'Formal assessment and qualification'),
    ('CARE', 3, 'Ongoing support and pastoral care'),
    ('EQUIP', 4, 'Training and practical preparation');

-- Create process tasks table
CREATE TABLE process_tasks (
    id SERIAL PRIMARY KEY,
    stage_id INTEGER REFERENCES pace_stages(id),
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT,
    task_order INTEGER,
    is_required BOOLEAN DEFAULT true,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert PREPARE stage tasks
INSERT INTO process_tasks (stage_id, task_name, task_description, task_order, category) VALUES
    (1, 'Meet with planters interested in planting (KC overview)', 'Initial meeting to discuss KC planting opportunities', 1, 'Initial Contact'),
    (1, 'Respond to Cold Calls from potential planters and leaders', 'Handle incoming inquiries from potential planters', 2, 'Initial Contact'),
    (1, 'Planter Expectations communication', 'Communicate expectations and requirements', 3, 'Communication'),
    (1, 'Baptist Faith & Message 2000 compliance', 'Verify doctrinal alignment', 4, 'Compliance'),
    (1, 'NAMB Code of Conduct agreement', 'Review and sign code of conduct', 5, 'Compliance'),
    (1, 'Pre-retreat preparation with planters', 'Prepare for assessment retreat', 6, 'Preparation'),
    (1, '9 Essentials evaluation process', 'Complete 9 essentials assessment', 7, 'Evaluation'),
    (1, 'Explain planter finances (funding grid) and benefits 2025', 'Review funding: $1100-$1300/month for 4 years', 8, 'Financial'),
    (1, 'Health insurance setup (1 year)', 'Set up health insurance benefits', 9, 'Benefits'),
    (1, 'Retirement setup with GuideOne (1 year)', 'Set up retirement plan', 10, 'Benefits'),
    (1, 'NAMB house arrangements (1.5 years, ~$500/month)', 'Arrange NAMB housing', 11, 'Benefits'),
    (1, 'SBC affiliation guidance for state and local associations', 'Guide through SBC affiliation process', 12, 'Compliance');

-- Insert ASSESS stage tasks
INSERT INTO process_tasks (stage_id, task_name, task_description, task_order, category) VALUES
    (2, 'Pre-Assessment coordination ($129 CPIA)', 'Schedule and pay for CPIA assessment', 1, 'Assessment'),
    (2, 'Assessment Retreat preparation and follow-up', 'Prepare for 2-day retreat', 2, 'Retreat'),
    (2, 'Planter Profile Questionnaire (PPQ) completion', 'Complete PPQ assessment', 3, 'Documentation'),
    (2, 'Assessment Tracking documentation', 'Track assessment progress', 4, 'Documentation'),
    (2, 'Final report discussions (planter, spouse, sending church)', 'Review results with stakeholders', 5, 'Follow-up'),
    (2, 'Assessment Retreat - 2 day with spouse if applicable', 'Attend 2-day assessment retreat', 6, 'Retreat');

-- Insert CARE stage tasks
INSERT INTO process_tasks (stage_id, task_name, task_description, task_order, category) VALUES
    (3, 'Send Network Orientation (2-day event in Alpharetta)', 'Attend orientation in Alpharetta', 1, 'Orientation'),
    (3, 'Set up Send Network Care for planters', 'Establish care network', 2, 'Setup'),
    (3, 'Monthly Planter Lunches (3rd Thursday)', 'Attend monthly fellowship lunches', 3, 'Events'),
    (3, 'Annual Planter event for just the Planter (Chiefs Game)', 'Attend annual Chiefs game', 4, 'Events'),
    (3, 'Annual Planter Family Event (picnic, waterpark, beach day)', 'Attend family event', 5, 'Events');

-- Insert EQUIP stage tasks
INSERT INTO process_tasks (stage_id, task_name, task_description, task_order, category) VALUES
    (4, 'Send Network Training 3.0', 'Complete Send Network Training', 1, 'Training'),
    (4, 'Annual 3-Day Planter Retreat (Connected to Send Missouri)', 'Attend annual retreat', 2, 'Training'),
    (4, 'Quarterly Reports with planters (10-15 assigned per CPC)', 'Submit quarterly reports', 3, 'Reporting'),
    (4, 'Help planters build planting and support teams', 'Build ministry teams', 4, 'Team Building'),
    (4, 'Discuss fundraising ideas and church budget', 'Plan fundraising strategy', 5, 'Financial'),
    (4, 'Set up coaching/mentorship at the sending church', 'Establish coaching relationship', 6, 'Mentorship'),
    (4, 'Startup funds (2025 - $6000 normally when services start)', 'Receive startup funding', 7, 'Financial'),
    (4, 'Church Planter - Master Checklist Review', 'Complete master checklist', 8, 'Review');

-- Create planter task progress table
CREATE TABLE planter_task_progress (
    id SERIAL PRIMARY KEY,
    planter_id INTEGER REFERENCES planters(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES process_tasks(id),
    is_completed BOOLEAN DEFAULT false,
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(planter_id, task_id)
);

-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100),
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(255),
    description TEXT,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert recurring events
INSERT INTO events (event_name, event_type, event_date, description, is_recurring, recurrence_pattern) VALUES
    ('Monthly Planter Lunch', 'Fellowship', '2025-10-16', 'Monthly fellowship lunch for all planters', true, 'Third Thursday'),
    ('Annual Chiefs Game', 'Appreciation', '2025-11-01', 'Annual planter appreciation event at Arrowhead', false, null),
    ('Annual Family Event', 'Family', '2025-07-15', 'Summer family gathering - picnic/waterpark/beach', false, null),
    ('Annual 3-Day Planter Retreat', 'Training', '2025-09-15', 'Connected to Send Missouri - intensive training', false, null);

-- Create event attendance table
CREATE TABLE event_attendance (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    planter_id INTEGER REFERENCES planters(id) ON DELETE CASCADE,
    attendance_status VARCHAR(20) DEFAULT 'invited',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, planter_id)
);

-- Create notes/activity log table
CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    planter_id INTEGER REFERENCES planters(id) ON DELETE CASCADE,
    activity_type VARCHAR(50),
    activity_description TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create field staff representatives table
CREATE TABLE field_staff (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample field staff
INSERT INTO field_staff (first_name, last_name, email, phone) VALUES
    ('Marrs', 'Representative', 'marrs@sendkc.org', '816-555-0001'),
    ('Partin', 'Representative', 'partin@sendkc.org', '816-555-0002');

-- Create indexes for better performance
CREATE INDEX idx_planters_stage ON planters(current_stage);
CREATE INDEX idx_planters_status ON planters(current_status);
CREATE INDEX idx_planters_rep ON planters(field_staff_rep);
CREATE INDEX idx_planters_email ON planters(email);
CREATE INDEX idx_task_progress_planter ON planter_task_progress(planter_id);
CREATE INDEX idx_task_progress_completed ON planter_task_progress(is_completed);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_activity_log_planter ON activity_log(planter_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_planters_updated_at BEFORE UPDATE ON planters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_progress_updated_at BEFORE UPDATE ON planter_task_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();