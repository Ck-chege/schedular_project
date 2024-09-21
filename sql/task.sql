-- Create the tasks table with a foreign key to businesses
CREATE TABLE tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Create an index on business_id for faster queries
CREATE INDEX idx_tasks_business_id ON tasks(business_id);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows insert for authenticated users
CREATE POLICY insert_task ON tasks 
FOR INSERT TO authenticated 
WITH CHECK (
    business_id::text = (auth.jwt() -> 'user_metadata' ->> 'business_id')::text
);

-- Create a policy that allows select for users in the same business
CREATE POLICY select_task ON tasks
FOR SELECT TO authenticated
USING (
    business_id::text = (auth.jwt() -> 'user_metadata' ->> 'business_id')::text
);

-- Create a policy that allows update for users in the same business
CREATE POLICY update_task ON tasks
FOR UPDATE TO authenticated
USING (
    business_id::text = (auth.jwt() -> 'user_metadata' ->> 'business_id')::text
)
WITH CHECK (
    business_id::text = (auth.jwt() -> 'user_metadata' ->> 'business_id')::text
);

-- Create a policy that allows delete for users in the same business
CREATE POLICY delete_task ON tasks
FOR DELETE TO authenticated
USING (
    business_id::text = (auth.jwt() -> 'user_metadata' ->> 'business_id')::text
);








---*****************To Drop Tasks Table and All****************************
-- Drop policies
DROP POLICY IF EXISTS insert_task ON tasks;
DROP POLICY IF EXISTS select_task ON tasks;
DROP POLICY IF EXISTS update_task ON tasks;
DROP POLICY IF EXISTS delete_task ON tasks;

-- Disable Row Level Security
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Drop index
DROP INDEX IF EXISTS idx_tasks_business_id;

-- Drop table
DROP TABLE IF EXISTS tasks;