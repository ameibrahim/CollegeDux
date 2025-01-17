class CourseSharingEngine {
    chosenTeacherToBeAssisting = null;
    availableTeachers;
    availableTeacherListElements = [];
    availableTeacherListContainer;

    chosenTeacherToRemove = null;
    availableAssistants;
    availableAssistantListElements = [];
    availableAssistantListContainer;

    constructor({ courseID, userID }) {
        this.userID = userID;
        this.courseID = courseID;
        console.log("courseID: ", courseID);
    }

    async setup() {
        this.availableTeacherListContainer.innerHTML = "";
        this.chosenTeacherToBeAssisting = null;
        this.availableTeacherListElements = [];

        this.availableAssistantListContainer.innerHTML = "";
        this.chosenTeacherToRemove = null;
        this.availableAssistantListElements = [];

        try {
            const coTeachers = await this.loadCoTeachers();
            const availableTeachers = await this.loadAvailableRecipientList();

            const filteredRecipientList = filterObjectsByIds(
                availableTeachers,
                [...coTeachers.map((x) => x.userID), this.userID]
            );
            console.log("coTeachers: ", coTeachers);
            console.log("availableTeachers: ", availableTeachers);
            console.log("filteredRecipientList: ", filteredRecipientList);

            this.availableAssistants = coTeachers;
            this.availableTeachers = filteredRecipientList;
        } catch (error) {
            console.log(error);
        }

        this.renderCoTeachers();
        this.renderAvailableRecipientList();
    }

    createBadgeTitle(title) {
        const badgeTitle = document.createElement("div");
        badgeTitle.className = "badge-title";
        badgeTitle.textContent = title;
        return badgeTitle;
    }

    setRecipientListContainer(container) {
        this.availableTeacherListContainer = container;
    }

    setAddInstructorButton(button) {
        let newButton = clearEventListenersFor(button);
        this.addInstructorButton = newButton;

        this.addInstructorButton.addEventListener("click", () => {
            this.applyAddInstructor();
        });
    }

    setRemoveInstructorButton(button) {
        let newButton = clearEventListenersFor(button);
        this.removeInstructorButton = newButton;

        this.removeInstructorButton.addEventListener("click", () => {
            this.applyRemoveInstructor();
        });
    }

    // setCourseCountElement(element) {
    //     this.coTeacherElement = element;
    // }

    setCourseListContainer(container) {
        this.availableAssistantListContainer = container;
    }

    renderAvailableRecipientList() {
        const badgeTitleForRecipients = this.createBadgeTitle(
            `Available Teachers (${this.availableTeachers.length})`
        );
        this.availableTeacherListContainer.append(badgeTitleForRecipients);

        this.availableTeachers.forEach(async (person, index) => {
            const id = `personBox${index}`;
            const checkboxContainer = document.createElement("div");
            checkboxContainer.className = "checkbox person-checkbox";
            checkboxContainer.setAttribute("data-recipientID", person.id);

            const inputElement = document.createElement("input");
            inputElement.id = id;
            inputElement.type = "checkbox";
            const labelElement = document.createElement("label");
            labelElement.setAttribute("for", id);

            const backgroundImage = document.createElement("div");
            backgroundImage.className = "background-image rounded";
            const imageElement = document.createElement("img");
            imageElement.src = await checkImageIfMissing(person.image);
            backgroundImage.append(imageElement);

            const checkboxDetailsContainer = document.createElement("div");
            checkboxDetailsContainer.className = "checkbox-details-container";
            const personName = document.createElement("div");
            personName.className = "person-name";
            personName.textContent = person.name;
            const personEmail = document.createElement("div");
            personEmail.className = "person-email";
            personEmail.textContent = person.email;
            checkboxDetailsContainer.append(personName);
            checkboxDetailsContainer.append(personEmail);

            labelElement.appendChild(backgroundImage);
            labelElement.appendChild(checkboxDetailsContainer);

            checkboxContainer.appendChild(inputElement);
            checkboxContainer.appendChild(labelElement);

            this.availableTeacherListContainer.append(checkboxContainer);
            this.availableTeacherListElements.push(checkboxContainer);

            checkboxContainer.addEventListener("click", () => {
                this.resetSelectedRecipientListSelection();
                this.applyClickOnCheckBox(checkboxContainer);
                this.chosenTeacherToBeAssisting = person.id;
            });
        });
    }

    renderCoTeachers() {
        const badgeTitleForRecipients = this.createBadgeTitle(
            `Co Teachers (${this.availableAssistants.length})`
        );

        this.availableAssistantListContainer.append(badgeTitleForRecipients);

        this.availableAssistants.forEach(async (person, index) => {
            const id = `personBox${index}`;
            const checkboxContainer = document.createElement("div");
            checkboxContainer.className = "checkbox person-checkbox";
            checkboxContainer.setAttribute("data-recipientID", person.userID);

            const inputElement = document.createElement("input");
            inputElement.id = id;
            inputElement.type = "checkbox";
            const labelElement = document.createElement("label");
            labelElement.setAttribute("for", id);

            const backgroundImage = document.createElement("div");
            backgroundImage.className = "background-image rounded";
            const imageElement = document.createElement("img");
            imageElement.src = await checkImageIfMissing(person.image);
            backgroundImage.append(imageElement);

            const checkboxDetailsContainer = document.createElement("div");
            checkboxDetailsContainer.className = "checkbox-details-container";
            const personName = document.createElement("div");
            personName.className = "person-name";
            personName.textContent = person.name;
            const personEmail = document.createElement("div");
            personEmail.className = "person-email";
            personEmail.textContent = person.email;
            checkboxDetailsContainer.append(personName);
            checkboxDetailsContainer.append(personEmail);

            labelElement.appendChild(backgroundImage);
            labelElement.appendChild(checkboxDetailsContainer);

            checkboxContainer.appendChild(inputElement);
            checkboxContainer.appendChild(labelElement);

            this.availableAssistantListContainer.append(checkboxContainer);
            this.availableAssistantListElements.push(checkboxContainer);

            checkboxContainer.addEventListener("click", () => {
                this.resetSelectedAssistantListSelection();
                this.applyClickOnCheckBox(checkboxContainer);
                this.chosenTeacherToRemove = person.subscriptionID;
            });
        });
    }

    resetSelectedRecipientListSelection() {
        console.log("resetting: ", this.availableTeacherListElements);

        this.availableTeacherListElements.forEach((checkbox) => {
            const input = checkbox.querySelector("input");
            input.checked = false;
        });
    }

    resetSelectedAssistantListSelection() {
        console.log("removingggg: ", this.availableAssistantListElements);

        this.availableAssistantListElements.forEach((checkbox) => {
            const input = checkbox.querySelector("input");
            input.checked = false;
        });
    }

    applyClickOnCheckBox(checkbox) {
        const input = checkbox.querySelector("input");
        input.checked = true;
    }

    applyAddInstructor() {
        if (this.chosenTeacherToBeAssisting == null) {
            animateDialog("You need to select a person to add", "error");
            return;
        }

        let messageDetails = {
            title: "Add Instructor / Instructors?",
            denyTitle: "Go Back",
            acceptTitle: "Start",
            message: "Are you sure?",
        };

        const startAddProcess = async () => {
            const loader = showLoader("adding...");

            AJAXCall({
                rejectMessage: "Something went wrong adding teacher",
                params: `userID=${this.chosenTeacherToBeAssisting}&&courseID=${this.courseID}`,
                type: "post",
                phpFilePath: "../include/course/addCoTeacher.php",
            });

            setTimeout(async () => {
                removeLoader(loader);
                await this.setup();
            }, 2000);
        };

        showOptionsDialog(messageDetails, startAddProcess);
    }

    applyRemoveInstructor() {
        if (this.chosenTeacherToRemove == null) {
            animateDialog("You need to select a person to remove", "error");
            return;
        }

        let messageDetails = {
            title: "Remove Instructor / Instructors?",
            denyTitle: "Go Back",
            acceptTitle: "Start",
            message: "Are you sure?",
        };

        const startRemoveMoving = async () => {
            const loader = showLoader("removing...");

            AJAXCall({
                rejectMessage: "Something went wrong removing teacher",
                params: `subscriptionID=${this.chosenTeacherToRemove}`,
                type: "post",
                phpFilePath: "../include/course/removeCoTeacher.php",
            });

            setTimeout(async () => {
                removeLoader(loader);
                await this.setup();
            }, 2000);
        };

        showOptionsDialog(messageDetails, startRemoveMoving);
    }

    async loadAvailableRecipientList() {
        return AJAXCall({
            phpFilePath: "../include/course/getTeachers.php",
            rejectMessage: "Getting Details Failed",
            params: "",
            type: "fetch",
        });
    }

    async loadCoTeachers() {
        return AJAXCall({
            phpFilePath: "../include/course/getCoTeachers.php",
            rejectMessage: "Getting Details Failed",
            params: `courseID=${this.courseID}&&userID=${this.userID}`,
            type: "fetch",
        });
    }
}

async function checkImageIfMissing(
    imageName,
    defaultImage = "demoAccount.png"
) {
    // This function checks for broken image paths
    // and replaces it with a default image

    let fix = imageName.split("/");
    fix.length > 1 ? (fix = fix[1]) : (fix = fix[0]);
    const imagePath = `../uploads/${fix}`;

    try {
        let result = await fetch(imagePath);
        if (result.status != 404) return imagePath;
        throw new Error();
    } catch (error) {
        return `../uploads/${defaultImage}`;
    }
}

function filterObjectsByIds(objects, idsToFilter) {
    return objects.filter((obj) => !idsToFilter.includes(obj.id));
}
