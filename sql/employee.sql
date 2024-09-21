CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    primary_task VARCHAR(100) NOT NULL,
    secondary_tasks VARCHAR(100)[] NOT NULL DEFAULT '{}',
    max_hours INTEGER NOT NULL CHECK (max_hours >= 0 AND max_hours <= 168),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Create an index on business_id for faster queries
CREATE INDEX idx_employees_business_id ON employees(business_id);    


-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows insert for authenticated users
CREATE POLICY insert_employee ON employees
FOR INSERT TO authenticated
WITH CHECK (
    business_id::text = (auth.jwt() -> 'user_metadata' ->> 'business_id')::text
);


-- Create a policy that allows select for users in the same business
CREATE POLICY select_employee ON employees FOR SELECT TO authenticated 
USING (
    business_id::text = (auth.jwt() -> 'user_metadata' ->> 'business_id')::text
);

-- Create a policy that allows update for users in the same business
CREATE POLICY update_employee ON employees 
FOR UPDATE TO authenticated 
USING (
    business_id::text = (auth.jwt() -> 'user_metadata' ->> 'business_id')::text
)
WITH CHECK (
    business_id::text = (auth.jwt() -> 'user_metadata' ->> 'business_id')::text
);

-- Create a policy that allows delete for users in the same business
CREATE POLICY delete_employee ON employees 
FOR DELETE TO authenticated 
USING (
    business_id::text = (auth.jwt() -> 'user_metadata' ->> 'business_id')::text
);




---**************************** TO DROP THIS **************************************
-- Drop policies
DROP POLICY IF EXISTS insert_employee ON employees;
DROP POLICY IF EXISTS select_employee ON employees;
DROP POLICY IF EXISTS update_employee ON employees;
DROP POLICY IF EXISTS delete_employee ON employees;

-- Disable Row Level Security
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;

-- Drop index
DROP INDEX IF EXISTS idx_employees_business_id;

-- Drop table
DROP TABLE IF EXISTS employees;