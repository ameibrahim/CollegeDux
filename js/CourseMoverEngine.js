class CourseMoverEngine {

    chosenRecipient = null;
    recipientList;
    recipientListElements = [];
    recipientListContainer;
    courseListContainer;
    availableCourses
    courseCountElement

    constructor({ currentOwner }){
        this.currentOwner = currentOwner
            // 4
            // 5 UI
            // 6 Testing
    }

    async setup(){

        this.recipientListContainer.innerHTML = "";
        this.courseListContainer.innerHTML = "";
        this.chosenRecipient = null;
        this.recipientListElements = [];

        try {
            const availableCourses = await this.loadAvailableCourseList();
            const recipientList = await this.loadAvailableRecipientList();

            console.log("availableCourses: ", availableCourses);
            console.log("recipientList: ", recipientList);

            this.availableCourses = availableCourses;
            this.recipientList = recipientList;
            const totalCourses = this.availableCourses.length;

            this.courseCountElement.textContent = `( ${totalCourses} )`;
        }catch(error){
            console.log(error)
        }

        this.renderAvailableCourseList();
        this.renderAvailableRecipientList();
    }

    createBadgeTitle(title){
        const badgeTitle = document.createElement("div");
        badgeTitle.className = "badge-title";
        badgeTitle.textContent = title;
        return badgeTitle;
    }

    setRecipientListContainer(container){
        this.recipientListContainer = container;
    }

    setMoveButton(button){
        let newButton = clearEventListenersFor(button);
        this.moveButton = newButton;

        this.moveButton.addEventListener("click", () => {
            this.applyChanges();
        })
    }

    setCourseCountElement(element){
        this.courseCountElement = element;
    }

    setCourseListContainer(container){
        this.courseListContainer = container;
    }
    

    renderAvailableRecipientList(){

        const badgeTitleForRecipients = this.createBadgeTitle(`Available Teachers (${this.recipientList.length})`);
        this.recipientListContainer.append(badgeTitleForRecipients);

        this.recipientList.forEach( async(person, index) => {

            const id = `personBox${index}`;
            const checkboxContainer = document.createElement("div");
            checkboxContainer.className = "checkbox person-checkbox";
            checkboxContainer.setAttribute("data-recipientID", person.id)

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
            checkboxDetailsContainer.append(personName)
            checkboxDetailsContainer.append(personEmail)

            labelElement.appendChild(backgroundImage)
            labelElement.appendChild(checkboxDetailsContainer)

            checkboxContainer.appendChild(inputElement)
            checkboxContainer.appendChild(labelElement)

            this.recipientListContainer.append(checkboxContainer);
            this.recipientListElements.push(checkboxContainer);

            checkboxContainer.addEventListener("click", () => {
                this.resetSelectedRecipientListSelection();
                this.applyClickOnCheckBox(checkboxContainer);
                this.chosenRecipient = person.id;
            })
        })

    }

    renderAvailableCourseList(){

        const badgeTitleForCourses = this.createBadgeTitle(`Available Courses (${this.availableCourses.length})`);
        this.courseListContainer.append(badgeTitleForCourses);

        this.availableCourses.forEach( async (course,index) => {

            const id = `checkbox${index}`;
            const checkboxContainer = document.createElement("div");
            checkboxContainer.className = "checkbox";
            checkboxContainer.setAttribute("data-courseID", course.id);

            const inputElement = document.createElement("input");
            inputElement.id = id;
            inputElement.type = "checkbox";
            const labelElement = document.createElement("label");
            labelElement.setAttribute("for", id);

            const backgroundImage = document.createElement("div");
            backgroundImage.className = "background-image";
            const imageElement = document.createElement("img");
            imageElement.src = await checkImageIfMissing(course.image);
            backgroundImage.append(imageElement);

            const checkboxDetailsContainer = document.createElement("div");
            checkboxDetailsContainer.className = "checkbox-details-container";
            const courseCodeContainer = document.createElement("div");
            courseCodeContainer.className = "course-code";
            courseCodeContainer.textContent = course.code;
            const courseTitleContainer = document.createElement("div");
            courseTitleContainer.className = "course-title";
            courseTitleContainer.append(createLocalizedTextElement(course.title));

            checkboxDetailsContainer.append(courseCodeContainer)
            checkboxDetailsContainer.append(courseTitleContainer)

            labelElement.appendChild(backgroundImage)
            labelElement.appendChild(checkboxDetailsContainer)

            checkboxContainer.appendChild(inputElement)
            checkboxContainer.appendChild(labelElement)

            this.courseListContainer.append(checkboxContainer);
        })
    }

    resetSelectedRecipientListSelection(){

        console.log("resetting: ", this.recipientListElements);

        this.recipientListElements.forEach( checkbox => {
            const input = checkbox.querySelector("input")
            input.checked = false;
        })
    }

    applyClickOnCheckBox(checkbox){
        const input = checkbox.querySelector("input")
        input.checked = true;
    }

    extractIDsFromChosenCourses(){
        const checkboxes = this.courseListContainer.querySelectorAll(`.checkbox`);
        const checked = [];
        const unchecked = [];
        
        checkboxes.forEach( checkbox => 
            checkbox.querySelector("input:checked") ? 
            checked.push(checkbox) : unchecked.push(checkbox) 
        )

        console.log({ checked, unchecked })
        
       return checked.map( checkbox => checkbox.getAttribute("data-courseID"));
    }

    applyChanges(){

        const selectedCourseIDsToMove = this.extractIDsFromChosenCourses();

        if(this.chosenRecipient == null) {
            animateDialog("You need to select a person", "error");
            return;
        }

        if(selectedCourseIDsToMove.length < 1) {
            animateDialog("You need to select atleast 1 course", "error");
            return;
        }

        let messageDetails = {
            title: "Moving Course / Courses",
            denyTitle: "Go Back",
            acceptTitle: "Start Moving", 
            message: "Are you sure?",   
        };

        const startMoving = async () => {
            const selectedCourseIDsToMove = this.extractIDsFromChosenCourses();
            console.log("selectedCourseIDsToMove: ", selectedCourseIDsToMove);

            const loader = showLoader();

            for await (const courseID of selectedCourseIDsToMove) {
                // try and catch????
                this.swapCourseOwner({ courseID, newOwnerID: this.chosenRecipient });
            }

            setTimeout( async () => {
                removeLoader(loader);
                await this.setup();
            }, 2000);
        }

        showOptionsDialog(messageDetails, startMoving);

    }

    async loadAvailableCourseList(){
        return AJAXCall({
            phpFilePath: "../include/course/getCourses.php",
            rejectMessage: "Getting Details Failed",
            params: `id=${this.currentOwner}`,
            type: "fetch",
        });
    }

    async loadAvailableRecipientList(){
        return AJAXCall({
            phpFilePath: "../include/course/getTeachers.php",
            rejectMessage: "Getting Details Failed",
            params: '',
            type: "fetch",
        });
    }

    async swapCourseOwner(swapObject){
        console.log("swapping: ", swapObject);
        return AJAXCall({
            phpFilePath: "../include/course/moveToNewOwner.php",
            rejectMessage: "Getting Details Failed",
            type: "post",
            params: createParametersFrom(swapObject)
        });
    }
}

async function checkImageIfMissing(imageName, defaultImage = "demoAccount.png") {
    // This function checks for broken image paths
    // and replaces it with a default image
  
    let fix = imageName.split("/");
    fix.length > 1 ? fix = fix[1] : fix = fix[0];
    const imagePath = `../uploads/${fix}`;

    try {
      let result = await fetch(imagePath);
      if (result.status != 404) return imagePath;
      throw new Error();
    } catch (error) {
      return `../uploads/${defaultImage}`;
    }
  }