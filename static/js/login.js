document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector(".btn-primary");
    const emailInput = document.querySelector("input[placeholder='Email address']");
    const passwordInput = document.querySelector("input[placeholder='Password']");

    loginButton.addEventListener("click", async function (event) {
        event.preventDefault();

        // Clear previous error messages
        clearErrors();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showError(passwordInput, "Username or password is incorrect.");
            return;
        }

        try {
            // Send the email and password to the server
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (result.success) {
                // Redirect to index.html if authentication is successful
                window.location.href = "/index";
            } else {
                // Show error if authentication fails
                showError(passwordInput, "Username or password is incorrect.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            showError(loginButton, "An error occurred. Please try again.");
        }
    });

    function showError(input, message) {
        const error = document.createElement("small");
        error.textContent = message;
        error.style.color = "red";
        error.classList.add("error-message");
        input.parentElement.appendChild(error);
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll(".error-message");
        errorMessages.forEach((error) => error.remove());
    }
});
