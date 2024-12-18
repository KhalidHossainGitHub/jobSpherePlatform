document.addEventListener("DOMContentLoaded", function () {
    const jobListContainer = document.querySelector("#job-list");
    const jobDetailsContainer = document.querySelector("#job-details");

    // Fetch jobs from the backend
    async function fetchJobs() {
        try {
            const response = await fetch('/fetch_jobs');
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }

            const jobs = await response.json();

            if (Array.isArray(jobs) && jobs.length > 0) {
                // Clear the job list container
                jobListContainer.innerHTML = "";

                // Dynamically create list items for each job
                jobs.forEach((job, index) => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    listItem.setAttribute('data-job-id', job[0]); // Add job_id to the list item

                    listItem.innerHTML = `
                        <h5>${job[1]}</h5>  <!-- job_role -->
                        <p><strong>Company:</strong> ${job[2]}</p>  <!-- company_name -->
                        <p><strong>Location:</strong> ${job[3]}</p>  <!-- location -->
                    `;

                    // Add click event listener to update the job details section
                    listItem.addEventListener('click', function () {
                        updateJobDetails(job[0]);
                    });

                    jobListContainer.appendChild(listItem);

                    // Show details for the first job by default
                    if (index === 0) {
                        updateJobDetails(job[0]);
                    }
                });
            } else {
                jobListContainer.innerHTML = '<li class="list-group-item">No jobs available.</li>';
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            jobListContainer.innerHTML = '<li class="list-group-item">Failed to load jobs. Please try again later.</li>';
        }
    }

    async function updateJobDetails(jobId) {
        try {
            const response = await fetch('/fetch_job_details', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ jobId: jobId }), // Send jobId in the request body
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch job details');
            }
    
            const jobDetails = await response.json();
    
            // Populate the job details section
            jobDetailsContainer.innerHTML = `
                <h5>${jobDetails.job_role}</h5>
                <p><strong>Company:</strong> ${jobDetails.company_name}</p>
                <p><strong>Location:</strong> ${jobDetails.location}</p>
                <p><strong>Salary:</strong> $${jobDetails.salary}</p>
                <p><strong>Application Deadline:</strong> ${new Date(jobDetails.application_deadline).toLocaleDateString()}</p>
                <p><strong>Employment Type:</strong> ${jobDetails.employment_type}</p>
                <p><strong>Remote Option:</strong> ${jobDetails.remote_option ? 'Yes' : 'No'}</p>
                <p><strong>Industry:</strong> ${jobDetails.industry}</p>
                <p><strong>Description:</strong> ${jobDetails.job_description}</p>
                <button id="apply-btn" class="btn btn-primary mt-3">Apply</button>
            `;
    
            // Add event listener to the "Apply" button
            const applyButton = document.querySelector("#apply-btn");
            applyButton.addEventListener("click", () => {
                alert(`Application started for ${jobDetails.job_role} at ${jobDetails.company_name}`);
            });
        } catch (error) {
            console.error("Error updating job details:", error);
            jobDetailsContainer.innerHTML = '<p>Failed to load job details. Please try again later.</p>';
        }
    }
    

    // Call the function to fetch jobs on page load
    fetchJobs();
});