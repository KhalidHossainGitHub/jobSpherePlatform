# Example usage
from database import Connection
db = Connection()

# Insert data
# insert_query = "INSERT INTO users (name, email) VALUES (%s, %s)"
# db.execute_query(insert_query, ("John Doe", "john@example.com"))

# Fetch data
select_query = """
SELECT 
    u.email AS user_email, 
    CONCAT(u.fname, ' ', u.lname) AS full_name, 
    j.job_role, 
    j.company, 
    j.location, 
    a.status, 
    a.date_applied
FROM 
    user u
JOIN 
    application_tracker a ON u.email = a.user_email
JOIN 
    job_posting j ON a.job_id = j.job_id;
"""
results = db.fetch_all(select_query)
for row in results:
    print(row)

# Close the connection
db.close()
