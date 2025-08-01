-- This script removes the CHECK constraint on the 'type' column of the 'inventory' table.
-- This allows for more flexible material types beyond 'aluminum' and 'glass'.

-- First, identify the name of the existing CHECK constraint.
-- Constraint names are often generated automatically (e.g., 'inventory_type_check').
-- You can find it by querying your database's information schema:
-- SELECT constraint_name
-- FROM information_schema.table_constraints
-- WHERE table_name = 'inventory' AND constraint_type = 'CHECK';

-- Assuming a common naming convention or if you know the name, you can drop it directly.
-- If the constraint name is different, replace 'inventory_type_check' with the actual name.
ALTER TABLE inventory
DROP CONSTRAINT IF EXISTS inventory_type_check;

-- Alternatively, if you want to add a new CHECK constraint with an expanded list of types,
-- you would first drop the old one (as above) and then add a new one like this:
-- ALTER TABLE inventory
-- ADD CONSTRAINT inventory_type_new_check CHECK (type IN ('aluminum', 'glass', 'steel', 'wood', 'plastic'));
-- Make sure to replace 'steel', 'wood', 'plastic' with your desired new types.
