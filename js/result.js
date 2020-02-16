import {errorsStatus} from "./errors-status.js";

document.addEventListener("DOMContentLoaded", () => {
    const accountWrapperNode = document.getElementsByClassName("account-wrapper")[0];

    const checkboxesResultNode = document.getElementsByClassName("checkboxes-result")[0];
    const usernameResultText = document.getElementsByClassName("username-result-text")[0];
    const emailResultText = document.getElementsByClassName("email-result-text")[0];

    const submitButton = document.getElementsByClassName("submit-button")[0];

    submitButton.addEventListener("click", () => {
        let showPermission = true;

        for (let property in errorsStatus) {
            if (errorsStatus[property] === true) {
                showPermission = false;
                break;
            }
        }

        if (showPermission) {
            setTimeout( () => {
                const usersLodgings = JSON.parse(localStorage.getItem("checkboxesValues"));
                const usernameValue = localStorage.getItem("usernameValue");
                const emailValue = localStorage.getItem("emailValue");

                usernameResultText.textContent = usernameValue;
                emailResultText.textContent = emailValue;
                checkboxesResultNode.innerHTML = '';

                for (let i = 0; i < usersLodgings.length; i++) {
                    let checkboxNode = document.createElement("p");
                    checkboxNode.textContent = usersLodgings[i];
                    checkboxNode.classList.add("checkbox-result-text");
                    checkboxesResultNode.appendChild(checkboxNode);
                }

                showAccountField();
            }, 100 );
        }

    });

    function showAccountField() {
        accountWrapperNode.style.display = "flex";
    }
});