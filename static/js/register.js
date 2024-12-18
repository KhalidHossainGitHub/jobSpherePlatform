document.addEventListener("DOMContentLoaded", function () {
    const firstNameField = document.getElementById("first-name");
    const lastNameField = document.getElementById("last-name");
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const signUpButton = document.getElementById("sign-up");

    function validateFirstName() {
        const value = firstNameField.value.trim();
        const regex = /^[A-Za-z]+$/;
        return regex.test(value);
    }

    function validateLastName() {
        const value = lastNameField.value.trim();
        const regex = /^[A-Za-z]+$/;
        return regex.test(value);
    }

    function validateEmail() {
        const value = emailField.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    }

    function validatePassword() {
        const value = passwordField.value.trim();
        const hasLowercase = /[a-z]/.test(value);
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        return value.length >= 12 && [hasLowercase, hasUppercase, hasNumber, hasSpecialChar].filter(Boolean).length >= 3;
    }

    function showErrorMessage(field, message) {
        const errorElement = field.nextElementSibling;
        errorElement.textContent = message;
    }

    function clearErrorMessage(field) {
        const errorElement = field.nextElementSibling;
        errorElement.textContent = "";
    }

    function validateFields() {
        let isValid = true;

        if (!firstNameField.value.trim()) {
            showErrorMessage(firstNameField, "First Name is required.");
            isValid = false;
        } else if (!validateFirstName()) {
            showErrorMessage(firstNameField, "First Name must contain only letters.");
            isValid = false;
        } else {
            clearErrorMessage(firstNameField);
        }

        if (!lastNameField.value.trim()) {
            showErrorMessage(lastNameField, "Last Name is required.");
            isValid = false;
        } else if (!validateLastName()) {
            showErrorMessage(lastNameField, "Last Name must contain only letters.");
            isValid = false;
        } else {
            clearErrorMessage(lastNameField);
        }

        if (!emailField.value.trim()) {
            showErrorMessage(emailField, "Email address is required.");
            isValid = false;
        } else if (!validateEmail()) {
            showErrorMessage(emailField, "Enter a valid email address (e.g., user@example.com).");
            isValid = false;
        } else {
            clearErrorMessage(emailField);
        }

        if (!passwordField.value.trim()) {
            showErrorMessage(passwordField, "Password is required.");
            isValid = false;
        } else if (!validatePassword()) {
            showErrorMessage(passwordField, "Password must be at least 12 characters long and include at least 1 of each: uppercase letters, lowercase letters, numbers, and special characters.");
            isValid = false;
        } else {
            clearErrorMessage(passwordField);
        }

        return isValid;
    }

    signUpButton.addEventListener("click", async function (e) {
        e.preventDefault();
        if (validateFields()) {
            const userData = {
                fname: firstNameField.value.trim(),
                lname: lastNameField.value.trim(),
                email: emailField.value.trim(),
                password: passwordField.value.trim()
            };
            
            //Sending data to the server to put into the database.
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    const result = await response.json();
                    //alert(result.message || "Registration successful!");
                    window.location.href = 'profile.html'; // Redirect to profile page to add skills
                } else {
                    const error = await response.json();
                    alert(error.error || "An error occurred during registration. Please try again.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Failed to register. Please try again later.");
            }
        }
    });
});
