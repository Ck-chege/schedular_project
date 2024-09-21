
-- Create the users table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'employee', 'manager')),
    business_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create an index on the email column for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create an index on the business_id column for faster lookups
CREATE INDEX idx_users_business_id ON users(business_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to read their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Create a policy that allows users to update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Create a policy that allows managers to view data of users in the same business
CREATE POLICY "Managers can view business users" ON users
    FOR SELECT 
    USING (
        auth.jwt() -> 'user_metadata'->>'role' = 'manager' 
        AND auth.jwt() -> 'user_metadata' ->>'business_id' = business_id::text
    );

-- Create a policy that allows managers to update data of employees in the same business
CREATE POLICY "Managers can update business employees" ON users
    FOR UPDATE 
    USING (
        auth.jwt() -> 'user_metadata'->>'role' = 'manager' 
        AND auth.jwt() -> 'user_metadata' ->>'business_id' = business_id::text
        AND role = 'employee'
    );



-- Create a policy that allows admins full access to all users
CREATE POLICY "Admins have full access" ON users
    USING (auth.jwt()->>'role' = 'admin');





-- ###### Trigger to update the updated_at column -----------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Grant permissions to authenticated users
GRANT SELECT, UPDATE ON users TO authenticated;


---########## TRIGGER TO INSERT USER INFO INTO USER TABEL AFTER SUCCESSFULLY SINGUP----
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the role in the metadata is 'manager'
  IF NEW.raw_user_meta_data->>'role' = 'manager' THEN
    INSERT INTO public.users (id, full_name, email, role, business_id)
    VALUES (
      NEW.id, 
      NEW.raw_user_meta_data->>'full_name', 
      NEW.email, 
      NEW.raw_user_meta_data->>'role', 
      (NEW.raw_user_meta_data->>'business_id')::uuid
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger creation remains the same
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();






-- How to DELETE this table ---
-- Drop all policies on the users table
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Managers can view business users" ON users;
DROP POLICY IF EXISTS "Managers can update business employees" ON users;
DROP POLICY IF EXISTS "Admins have full access" ON users;

-- Drop the trigger
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- Drop the function used by the trigger
DROP FUNCTION IF EXISTS update_updated_at();

-- Revoke all privileges from the users table
REVOKE ALL PRIVILEGES ON TABLE users FROM authenticated;
REVOKE ALL PRIVILEGES ON TABLE users FROM anon;
REVOKE ALL PRIVILEGES ON TABLE users FROM service_role;

-- Drop the indexes
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_business_id;

-- Finally, drop the users table
DROP TABLE IF EXISTS users;

