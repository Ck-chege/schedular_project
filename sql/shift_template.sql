-- Create the shift_templates table
CREATE TABLE shift_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration NUMERIC(4,2) NOT NULL,
    shift_type VARCHAR(50) NOT NULL,
    shifts JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Add a comment to the table
COMMENT ON TABLE shift_templates IS 'Stores shift templates for businesses';

-- Add comments to the columns (as before)
-- ...

-- Create an index on business_id for faster queries
CREATE INDEX idx_shift_templates_business_id ON shift_templates(business_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_shift_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER trigger_update_shift_templates_updated_at
BEFORE UPDATE ON shift_templates
FOR EACH ROW
EXECUTE FUNCTION update_shift_templates_updated_at();

-- Enable Row Level Security
ALTER TABLE shift_templates ENABLE ROW LEVEL SECURITY;

-- Create a policy for viewing shift templates
CREATE POLICY view_shift_templates ON shift_templates
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id 
            FROM users
            WHERE business_id = shift_templates.business_id 
            AND (role = 'manager' OR role = 'admin')
        )
    );

-- Create a policy for inserting shift templates
CREATE POLICY insert_shift_templates ON shift_templates
    FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT id
            FROM users
            WHERE business_id = shift_templates.business_id 
            AND (role = 'manager' OR role = 'admin')
        )
    );

-- Create a policy for updating shift templates
CREATE POLICY update_shift_templates ON shift_templates
    FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT id 
            FROM users 
            WHERE business_id = shift_templates.business_id 
            AND (role = 'manager' OR role = 'admin')
        )
    );

-- Create a policy for deleting shift templates
CREATE POLICY delete_shift_templates ON shift_templates
    FOR DELETE
    USING (
        auth.uid() IN (
            SELECT id 
            FROM users 
            WHERE business_id = shift_templates.business_id 
            AND (role = 'manager' OR role = 'admin')
        )
    );

-- Grant necessary permissions
GRANT ALL ON TABLE shift_templates TO authenticated;
GRANT ALL ON TABLE shift_templates TO service_role;