from flask import Flask, render_template, request, jsonify
from hashlib import sha256
from database import Connection  # Assuming you have this module set up

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True  # Auto-reload templates for development
db = Connection()  # Database connection


@app.route("/")
def index():
    # Serve the registration page
    return render_template("login.html")


# Route to serve the register page
@app.route("/register")
def register_page():
    return render_template("register.html")


# Route to serve the course finder
@app.route("/courseFinder")
def courseFinder_page():
    return render_template("courseFinder.html")


# Route to serve the login page
@app.route("/login")
def login_page():
    return render_template("login.html")


# Route to serve the index page
@app.route("/index")
def index_page():
    return render_template("index.html")


@app.route("/register", methods=["POST"])
def register_user():
    try:
        data = request.json  # Expecting JSON data
        fname = data["fname"]
        lname = data["lname"]
        email = data["email"]
        password = data["password"]

        # Hash the password using SHA-256
        hashed_password = sha256(password.encode()).hexdigest()

        # Insert user into the database with parameterized query
        query = """
        INSERT INTO user (email, fname, lname, user_password)
        VALUES (%s, %s, %s, %s)
        """
        db.execute_query(query, (email, fname, lname, hashed_password))

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400


def verify_password(email, password):
    # Hash the provided password
    hashed_password = sha256(password.encode()).hexdigest()
    print(f"Hashed input password: {hashed_password}")

    # SQL query to fetch the stored password for the given email
    query = "SELECT user_password FROM user WHERE email = %s"

    try:
        # Execute the query
        db.execute_query(query, (email,))

        # Fetch the result after executing the query
        result = db.cur.fetchone()  # Use fetchone() to get the first row

        print(f"Query result: {result}")

        # Extract the stored password from the result (assuming result is a tuple)
        if not result:
            return False  # No matching email found

        stored_password = result[0]  # The hashed password will be the first element

        # Compare the stored hashed password with the hashed input password
        return hashed_password == stored_password

    except Exception as e:
        print(f"An error occurred: {e}")
        return False


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    print(email)
    print(password)

    if not email or not password:
        return (
            jsonify({"success": False, "error": "Email and password are required"}),
            400,
        )

    if verify_password(email, password):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Incorrect email or password"})


@app.route("/fetch_jobs", methods=["GET"])
def fetch_jobs():
    try:
        # Fetch jobs with their IDs, roles, companies, and locations
        query = """
            SELECT 
                jp.job_id,
                jp.job_role,
                c.company_name,
                jp.location
            FROM job_posting jp
            JOIN companies c ON jp.company = c.company_id
        """
        jobs = db.fetch_all(query)
        return jsonify(jobs)  # Return jobs as JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/fetch_job_details", methods=["POST"])
def fetch_job_details():
    try:
        data = request.get_json()
        job_id = data.get("jobId")  # Extract the jobId from the JSON payload
        print(job_id)

        if not isinstance(job_id, int):
            return jsonify({"error": "Invalid jobId; must be an integer"}), 400

        query = """
            SELECT 
                jp.job_role,
                jp.job_description,
                c.company_name,
                jp.location,
                jp.salary,
                jp.application_deadline,
                jp.employment_type,
                jp.remote_option,
                jp.industry
            FROM job_posting jp
            JOIN companies c ON jp.company = c.company_id
            WHERE jp.job_id = %s
        """
        result = db.fetch_all(query, job_id)
        print(result)

        if result:
            job = result[0]  # Fetch the first (and only) row
            job_details = {
                "job_role": job[0],
                "job_description": job[1],
                "company_name": job[2],
                "location": job[3],
                "salary": str(
                    job[4]
                ),  # Convert Decimal to string for JSON serialization
                "application_deadline": job[
                    5
                ].isoformat(),  # Convert date to ISO format
                "employment_type": job[6],
                "remote_option": bool(job[7]),  # Convert to Boolean
                "industry": job[8],
            }
            return jsonify(job_details)
        else:
            return jsonify({"error": "Job not found"}), 404
    except Exception as e:
        print(f"Error fetching job details: {e}")
        return jsonify({"error": "Failed to fetch job details"}), 500


# to fetch the courses
@app.route("/fetch_courses", methods=["GET"])
def fetch_courses():
    try:
        # Fetch course listings from the database
        query = """SELECT c.course_id, c.course_name, c.instructor, c.cost, c.course_description, s.skill_name, s.category 
        FROM course_rec c
        LEFT JOIN skills s ON c.skill = s.skill_id"""
        courses = db.fetch_all(query)
        return jsonify(courses)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# to get the skill names for the filter sidebar in courseFinder.html
@app.route("/fetch_skills", methods=["GET"])
def fetch_skills():
    try:
        # Query to fetch all skills
        query = "SELECT category FROM skills"
        skills = db.fetch_all(query)
        return jsonify(
            [skill[0] for skill in skills]
        )  # Return only skill names as a list
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=3000, debug=True)
