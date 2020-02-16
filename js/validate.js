import {errorsStatus} from "./errors-status.js";

document.addEventListener("DOMContentLoaded", () => {
    const mainForm = document.getElementsByClassName("reg-form")[0];

    const submitButton = document.getElementsByClassName("submit-button")[0];

    const regFields = document.getElementsByClassName("reg-field");
    const regErrors = document.getElementsByClassName("reg-error");

    const usernameField = document.getElementsByClassName("username-field")[0];
    const usernameError = document.getElementById("usernameError");

    const passwordField = document.getElementsByClassName("password-field")[0];
    const passwordError = document.getElementById("passwordError");

    const confirmField = document.getElementsByClassName("confirm-field")[0];
    const confirmError = document.getElementById("confirmError");

    const emailField = document.getElementsByClassName("email-field")[0];
    const emailError = document.getElementById("emailError");

    const checkboxesNodes = document.getElementsByClassName("reg-checkbox");
    const checkboxesValues = document.getElementsByClassName("checkbox-text");
    const checkboxesError = document.getElementById("checkboxError");

    setEventForField(usernameField, usernameError, "focusout", validateUsername,
                     errorsStatus.usernameErrorStatus,);
    setEventForField(passwordField, passwordError, "focusout", validatePassword,
                     errorsStatus.passwordErrorStatus);
    setEventForField(confirmField, confirmError, "focusout", validateConfirm,
                     errorsStatus.confirmErrorStatus);
    setEventForField(emailField, emailError, "focusout", validateEmail,
                     errorsStatus.emailErrorStatus);

    function setEventForField(field, fieldError, event, callbackFunc, errorStatusName) {
        field.addEventListener(event, () => {
            if ( !checkForEmpty(field, fieldError, errorStatusName ) ) {
                callbackFunc();
            }
        });
    }

    function showError(error, errorMsg) {
        error.textContent = errorMsg;
        error.style.display = "block";
    }

    function hideError(error) {
        error.style.display = "none";
    }

    function makeFieldValid(field, error, errorStatusName) {
        addAndRemoveClass(field, "valid-field", "invalid-field");
        hideError(error);
        changeErrorStatus(errorStatusName, false);
    }

    function makeFieldInvalid(field, error, errorMsg, errorStatusName) {
        addAndRemoveClass(field,"invalid-field", "valid-field");
        showError(error, errorMsg);
        changeErrorStatus(errorStatusName, true);
    }

    function changeErrorStatus(errorStatusName, changeFlag) {
        errorsStatus[errorStatusName] = changeFlag;
    }

    function addAndRemoveClass(field, newClass, removableClass) {
        field.classList.add(newClass);
        field.classList.remove(removableClass);
    }

    function checkForEmpty(field, fieldError, errorStatusName) {
        let fieldValue = field.value;

        if (fieldValue === "") {
            makeFieldInvalid(field, fieldError, "This field is empty", errorStatusName);
            return true;
        } else {
            makeFieldValid(field, fieldError, errorStatusName);
            return false;
        }
    }

    function validateUsername() {
        let pattern = /^[a-zA-z]/;
        let userNameValue = usernameField.value;

        pattern.test(userNameValue) ? makeFieldValid(usernameField, usernameError, "usernameErrorStatus")
                                    : makeFieldInvalid(usernameField, usernameError,
                                          "Name must contain a-z or A-Z chars", "usernameErrorStatus");

    }

    function validatePassword() {
        let passwordValue = passwordField.value;

        passwordValue.length > 8 ? makeFieldValid(passwordField, passwordError, "passwordErrorStatus")
                                 : makeFieldInvalid(passwordField, passwordError,
                                   "Password must contain at least 8 chars!", "passwordErrorStatus");
    }

    function validateConfirm() {
        let confirmValue = confirmField.value;
        let passwordValue = passwordField.value;

        confirmValue === passwordValue ? makeFieldValid(confirmField, confirmError, "confirmErrorStatus")
                                       : makeFieldInvalid(confirmField, confirmError,
                                         "Passwords don't match!", "confirmErrorStatus");
    }

    function validateEmail() {
        let pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        let emailValue = emailField.value;

        pattern.test(emailValue) ? makeFieldValid(emailField, emailError, "emailErrorStatus")
                                 : makeFieldInvalid(emailField, emailError,
                                               "Invalid email", "emailErrorStatus");
    }

    function validateCheckboxes() {
        let areAllEmpty = true;

        for (let i = 0; i < checkboxesNodes.length; i++) {
            if ( checkboxesNodes[i].checked ) {
                areAllEmpty = false;
                break;
            }
        }

        if ( areAllEmpty ) {
            changeErrorStatus("checkboxErrorStatus", true);
            showError(checkboxesError, "At least one checkbox must be chosen!");
            changeErrorStatus("checkboxErrorStatus", true);
        } else {
            changeErrorStatus("checkboxErrorStatus", false);
            hideError(checkboxesError);
            changeErrorStatus("checkboxErrorStatus", false);
        }
    }

    (function() {
        let submitPermission = true;

        submitButton.addEventListener("click", () => {
            let i = 0;

            for (let property in errorsStatus) {
                if (i < regFields.length) {
                    checkForEmpty(regFields[i], regErrors[i], property);
                    i++;
                }
            }

            validateCheckboxes();

            for (let property in errorsStatus) {
                if (errorsStatus[property] === true) {
                    submitPermission = false;
                    console.log("no");
                    break;
                } else {
                    submitPermission = true;
                }
            }
        });

        mainForm.onsubmit = () => {
            let checkboxesValuesArr = [];
            let usernameValue = usernameField.value;
            let emailValue = emailField.value;

            for (let i = 0; i < checkboxesNodes.length; i++) {
                if (checkboxesNodes[i].checked) {
                    checkboxesValuesArr.push(checkboxesValues[i].textContent);
                }
            }

            if (submitPermission) {
                localStorage.setItem("checkboxesValues", JSON.stringify(checkboxesValuesArr));
                localStorage.setItem("usernameValue", usernameValue);
                localStorage.setItem("emailValue", emailValue);
            }

            return false;
        }

    })();

});