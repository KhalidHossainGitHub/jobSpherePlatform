document.addEventListener("DOMContentLoaded", function () {
    const courseListContainer = document.querySelector(".course-list");
    const categoryFilter = document.querySelector("#categoryFilter"); // Changed to categoryFilter

    // Fetch and display courses
    async function fetchCourses() {
        try {
            const response = await fetch('/fetch_courses'); // Endpoint to fetch courses

            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            const contentType = response.headers.get("Content-Type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error('Expected JSON, but got something else');
            }

            const courses = await response.json();
            console.log(courses);

            if (Array.isArray(courses) && courses.length > 0) {
                // Populate courses and categories
                displayCourses(courses);
                populateCategoryFilter(courses);
            } else {
                courseListContainer.innerHTML = '<div class="course-item">No courses available.</div>';
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            courseListContainer.innerHTML = '<div class="course-item">Failed to load courses. Please try again later.</div>';
        }
    }

    // Display courses in the container
    function displayCourses(courses) {
        courseListContainer.innerHTML = ""; // Clear previous content
        courses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.classList.add('course-item');

            courseItem.innerHTML = `
                <h5>${course[1]}</h5> <!-- Course Name -->
                <p><strong>Instructor:</strong> ${course[2]}</p> <!-- Instructor -->
                <p><strong>Cost:</strong> $${course[3]}</p> <!-- Cost -->
                <p><strong>Skills:</strong> ${course[5]}</p> <!-- Skills -->
                <p><strong>Description:</strong> ${course[4]}</p> <!-- Description -->
                <p><strong>Category:</strong> ${course[6]}</p> <!-- Category -->
                <button class="save-course-btn" data-course='${JSON.stringify(course)}'>Save</button>
            `;

            courseListContainer.appendChild(courseItem);
        });

        // Add event listeners to all save buttons
        const saveButtons = document.querySelectorAll(".save-course-btn");
        saveButtons.forEach(button => {
            button.addEventListener("click", handleSaveCourse);
        });
    }

    // Handle saving a course
    async function handleSaveCourse(event) {
        const courseData = JSON.parse(event.target.getAttribute("data-course"));

        // Example email - replace this with actual logged-in user email
        const userEmail = "user@example.com"; 

        // Prepare data for saving
        const saveData = {
            email: userEmail,
            course_name: courseData[1],
            instructor: courseData[2],
            cost: courseData[3],
            skill: courseData[5],
            category: courseData[6] // Add category to save data
        };

        try {
            const response = await fetch('/save_course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(saveData)
            });

            if (!response.ok) {
                throw new Error('Failed to save course');
            }

            const result = await response.json();
            alert(result.message || "Course saved successfully!");
        } catch (error) {
            console.error("Error saving course:", error);
            alert("Failed to save course. Please try again.");
        }
    }

    // Populate the category filter dropdown
    function populateCategoryFilter(courses) {
        const categorySet = new Set();
        courses.forEach(course => {
            const category = course[6]; // Get category from the course
            categorySet.add(category);
        });

        // Add unique categories to the dropdown
        categoryFilter.innerHTML = `<option value="All">All</option>`; // Reset and include "All"
        categorySet.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Add event listener to filter courses based on selected category
        categoryFilter.addEventListener("change", () => filterCoursesByCategory(courses));
    }

    // Filter courses based on selected category
    function filterCoursesByCategory(courses) {
        const selectedCategory = categoryFilter.value;

        if (selectedCategory === "All") {
            displayCourses(courses); // Show all courses
        } else {
            const filteredCourses = courses.filter(course =>
                course[6] === selectedCategory // Filter based on category
            );
            displayCourses(filteredCourses); // Show filtered courses
        }
    }

    // Fetch and display courses on page load
    fetchCourses();
});
    


/* Working code displaying course list with filter, but filter is wrong at 2:03 PM
document.addEventListener("DOMContentLoaded", function () {
    const courseListContainer = document.querySelector(".course-list");
    const skillFilter = document.querySelector("#skillFilter");

    // Fetch and display courses
    async function fetchCourses() {
        try {
            const response = await fetch('/fetch_courses'); // Endpoint to fetch courses

            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            const contentType = response.headers.get("Content-Type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error('Expected JSON, but got something else');
            }

            const courses = await response.json();
            console.log(courses);

            if (Array.isArray(courses) && courses.length > 0) {
                // Populate courses and skills
                displayCourses(courses);
                populateSkillFilter(courses);
            } else {
                courseListContainer.innerHTML = '<div class="course-item">No courses available.</div>';
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            courseListContainer.innerHTML = '<div class="course-item">Failed to load courses. Please try again later.</div>';
        }
    }

    // Display courses in the container
    function displayCourses(courses) {
        courseListContainer.innerHTML = ""; // Clear previous content
        courses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.classList.add('course-item');

            courseItem.innerHTML = `
                <h5>${course[1]}</h5> <!-- Course Name -->
                <p><strong>Instructor:</strong> ${course[2]}</p> <!-- Instructor -->
                <p><strong>Cost:</strong> $${course[3]}</p> <!-- Cost -->
                <p><strong>Skills:</strong> ${course[5]}</p> <!-- Skills -->
                <p><strong>Description:</strong> ${course[4]}</p> <!-- Description -->
                <p><strong>Category:</strong> ${course[6]}</p> <!-- Category -->
                <button class="save-course-btn" data-course='${JSON.stringify(course)}'>Save</button>
            `;

            courseListContainer.appendChild(courseItem);
        });

        // Add event listeners to all save buttons
        const saveButtons = document.querySelectorAll(".save-course-btn");
        saveButtons.forEach(button => {
            button.addEventListener("click", handleSaveCourse);
        });
    }

    // Handle saving a course
    async function handleSaveCourse(event) {
        const courseData = JSON.parse(event.target.getAttribute("data-course"));

        // Example email - replace this with actual logged-in user email
        const userEmail = "user@example.com"; 

        // Prepare data for saving
        const saveData = {
            email: userEmail,
            course_name: courseData[1],
            instructor: courseData[2],
            cost: courseData[3],
            skill: courseData[5],
            category: courseData[6] // Add category to save data
        };

        try {
            const response = await fetch('/save_course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(saveData)
            });

            if (!response.ok) {
                throw new Error('Failed to save course');
            }

            const result = await response.json();
            alert(result.message || "Course saved successfully!");
        } catch (error) {
            console.error("Error saving course:", error);
            alert("Failed to save course. Please try again.");
        }
    }

    // Populate the skill filter dropdown
    function populateSkillFilter(courses) {
        const skillSet = new Set();
        courses.forEach(course => {
            const skills = course[5].split(',').map(skill => skill.trim());
            skills.forEach(skill => skillSet.add(skill));
        });

        // Add unique skills to the dropdown
        skillFilter.innerHTML = `<option value="All">All</option>`; // Reset and include "All"
        skillSet.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill;
            option.textContent = skill;
            skillFilter.appendChild(option);
        });

        // Add event listener to filter courses based on skill
        skillFilter.addEventListener("change", () => filterCoursesBySkill(courses));
    }

    // Filter courses based on selected skill
    function filterCoursesBySkill(courses) {
        const selectedSkill = skillFilter.value;

        if (selectedSkill === "All") {
            displayCourses(courses); // Show all courses
        } else {
            const filteredCourses = courses.filter(course =>
                course[5].split(',').map(skill => skill.trim()).includes(selectedSkill)
            );
            displayCourses(filteredCourses); // Show filtered courses
        }
    }

    // Fetch and display courses on page load
    fetchCourses();
});

*/