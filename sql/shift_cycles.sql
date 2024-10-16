
-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create shift_cycles table
CREATE TABLE shift_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    num_work_days INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -- Add check constraint for status
-- ALTER TABLE shift_cycles
-- ADD CONSTRAINT check_shift_cycle_status
-- CHECK (status IN ('Created', 'SchedulingInProcess', 'SchedulingComplete', 'Active', 'Complete'));

-- -- Create index on status for faster queries
-- CREATE INDEX idx_shift_cycles_status ON shift_cycles(status);

-- -- Create index on start_date and end_date for date range queries
-- CREATE INDEX idx_shift_cycles_date_range ON shift_cycles(start_date, end_date);

COMMENT ON TABLE shift_cycles IS 'Stores information about shift cycles';













-- Create workdays table
CREATE TABLE workdays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_cycle_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_cycle_id) REFERENCES shift_cycles(id) ON DELETE CASCADE
);

-- Create index on shift_cycle_id for faster joins
CREATE INDEX idx_workdays_shift_cycle_id ON workdays(shift_cycle_id);

-- Create index on date for date-based queries
CREATE INDEX idx_workdays_date ON workdays(date);

COMMENT ON TABLE workdays IS 'Represents individual workdays within a shift cycle';



















-- Create shifts table
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workday_id UUID NOT NULL,
    duration INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workday_id) REFERENCES workdays(id) ON DELETE CASCADE
);

-- Create index on workday_id for faster joins
CREATE INDEX idx_shifts_workday_id ON shifts(workday_id);

-- Create index on start_time and end_time for time range queries
CREATE INDEX idx_shifts_time_range ON shifts(start_time, end_time);

COMMENT ON TABLE shifts IS 'Contains details about specific shifts within a workday';





-- Create shift_tasks table
CREATE TABLE shift_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_id UUID NOT NULL,
    task_id UUID NOT NULL,
    employees_required INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE RESTRICT
);

-- Create composite index on shift_id and task_id
CREATE INDEX idx_shift_tasks_shift_task ON shift_tasks(shift_id, task_id);

COMMENT ON TABLE shift_tasks IS 'Links shifts with tasks and specifies the number of employees required';