--Insetring new register
INSERT INTO public.account 
    (account_firstname, account_lastname, account_email, account_password)
VALUES
    ('Tony', 'Stark','tony@starkent.com','Iam1ronM@n');

--Modifying register
UPDATE 
    public.account 
SET 
    account_type = 'Admin'::account_type
WHERE 
    account_id = 1

--Deleting register
DELETE 
FROM 
    public.account 
WHERE 
    account_id = 1

-- UPDATING WITH REPLACE
UPDATE 
	public.inventory
SET
	inv_description = REPLACE(inv_description, 'small interiors','a huge interior')
WHERE
	inv_id = 10

-- JOIN
SELECT
	i.*,
	c.classification_name
FROM 
	public.inventory i
INNER JOIN 
	public.classification c ON i.classification_id = c.classification_id
WHERE
	c.classification_name = 'Sport'

-- UPDATING WITH REPLACE ALL REGISTERS
UPDATE 
	public.inventory
SET
	inv_image = REPLACE(inv_image, '/images/','/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/','/images/vehicles/')
