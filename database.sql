-- CREATE DATABASE DBMS_FINAL_PROJECT;

USE DBMS_FINAL_PROJECT;

-- Users Table
CREATE TABLE user (
    email VARCHAR(255) PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    user_password VARCHAR(255) NOT NULL, 			-- backend will hash password
    profile_picture VARCHAR(255), 					-- path for profile picture stored on server(whatever computer is hosting it)
    user_resume VARCHAR(255) 						-- path for resume stored on server(whatever computer is hosting it)
);

-- Companies Table
CREATE TABLE companies (
	company_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255)
);

-- Job Posting Table
CREATE TABLE job_posting (
    job_id INT PRIMARY KEY AUTO_INCREMENT,
    job_role VARCHAR(50) NOT NULL,
    job_description TEXT,
    company INT,
    location VARCHAR(100),
    salary DECIMAL(10, 2),
    application_deadline DATE,
    employment_type VARCHAR(50),
    remote_option BOOLEAN,
    industry VARCHAR(100),
    FOREIGN KEY (company) REFERENCES companies(company_id)
);

-- Contacts Table
CREATE TABLE contacts (
    contact_id INT PRIMARY KEY AUTO_INCREMENT,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50),
    contact_role VARCHAR(50),
    company INT,
    linkedIn VARCHAR(255),
    location VARCHAR(100),
    FOREIGN KEY (company) REFERENCES companies(company_id)
);

-- Skills Table
CREATE TABLE skills (
    skill_id INT PRIMARY KEY,
    skill_name VARCHAR(50) NOT NULL,
    category VARCHAR(50)
);

-- User Skills Table
CREATE TABLE user_skills (
    user_email VARCHAR(255),
    skill INT,
    proficiency VARCHAR(50),
    num_years INT,
    PRIMARY KEY (user_email, skill),
    FOREIGN KEY (user_email) REFERENCES user(email),
    FOREIGN KEY (skill) REFERENCES skills(skill_id)
);

-- Job Skills Table
CREATE TABLE job_skills (
    job_id INT,
    skill INT,
    proficiency_required VARCHAR(50),
    num_years_required INT,
    certification BOOLEAN,
    PRIMARY KEY (job_id, skill),
    FOREIGN KEY (job_id) REFERENCES job_posting(job_id),
    FOREIGN KEY (skill) REFERENCES skills(skill_id)
);

-- Saved Jobs Table
CREATE TABLE saved_jobs (
    user_email VARCHAR(255),
    job_id INT,
    date_saved DATE,
    PRIMARY KEY (user_email, job_id),
    FOREIGN KEY (user_email) REFERENCES user(email),
    FOREIGN KEY (job_id) REFERENCES job_posting(job_id)
);

-- Application Tracker Table
CREATE TABLE application_tracker (
    user_email VARCHAR(255),
    job_id INT,
    date_applied DATE,
    status VARCHAR(50),
    PRIMARY KEY (user_email, job_id),
    FOREIGN KEY (user_email) REFERENCES user(email),
    FOREIGN KEY (job_id) REFERENCES job_posting(job_id)
);

-- Course Recommendations Table
CREATE TABLE course_rec (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    instructor VARCHAR(100),
    cost DECIMAL(10, 2),
    course_description TEXT,
    skill INT,
    FOREIGN KEY (skill) REFERENCES skills(skill_id)
);

-- Application Summary View
CREATE VIEW application_summary AS
SELECT 
    at.user_email, 
    jp.job_role, 
    c.company_name, 
    at.status, 
    at.date_applied
FROM 
    application_tracker at
INNER JOIN job_posting jp ON at.job_id = jp.job_id
INNER JOIN companies c ON jp.company = c.company_id;

-- Job Details View
CREATE VIEW job_details_view AS
SELECT 
    jp.job_id, 
    jp.job_role, 
    jp.job_description, 
    c.company_name, 
    jp.location, 
    jp.salary, 
    jp.application_deadline, 
    jp.employment_type, 
    jp.remote_option, 
    jp.industry
FROM 
    job_posting jp
INNER JOIN companies c ON jp.company = c.company_id;

-- User Skill Summary View
CREATE VIEW user_skill_summary AS
SELECT 
    us.user_email, 
    s.skill_name, 
    us.proficiency, 
    us.num_years
FROM 
    user_skills us
INNER JOIN skills s ON us.skill = s.skill_id;
