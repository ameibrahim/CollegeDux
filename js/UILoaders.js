async function loadCoursesGeneric(options = "id", eventListener, metadata){

    let emptyMessage = null;

    if(metadata) emptyMessage = metadata.emptyMessage;

    let courseViewContainer = document.querySelector(".course-view-container");

    let noCoursesYetText = createLocalizedTextElement(emptyMessage ?? "No courses yet");
    let emptyView = createElement("div", "container-message");
    emptyView.append(noCoursesYetText);

    let errorText = createLocalizedTextElement("Something Went Wrong");
    let errorView = createElement("div", "container-message");
    errorView.appendChild(errorText);

    return new Promise(async (resolve, reject) => {

    let { id:userID } = await getGlobalDetails();

    try {

        const params = `id=${userID}`;

        let phpFilePath;

        switch(options){
            case "id": 
                phpFilePath = "../include/course/getCourses.php";
            break;
            case "all":
                phpFilePath = "../include/course/getAllCourses.php";
            break;
            case "mine":
                phpFilePath = "../include/course/getMyCourses.php";
            break;
        }
        
        const result = await AJAXCall({
            phpFilePath,
            rejectMessage: "Getting Courses Failed",
            params,
            type: "fetch"
        });

        if(result && result.length > 0) {
            loadCoursesUI(result, userID, eventListener);
            resolve();
        }
        else {
            courseViewContainer.innerHTML = "";
            courseViewContainer.appendChild(emptyView);
        }
        
    }
    catch(error){

    }

    });

    function loadCoursesUI(coursesObject, userID, eventListener, showSubscription = false){

        courseViewContainer.innerHTML = "";

        coursesObject.map( async (course) => {

            const { id, title, image, courseCode } = course;

            let courseCard = createElement("div", "course-card");

            let courseCardImage = createElement("div", "course-card-image");
            let imageElement = document.createElement("img");

            imageElement.src = image.length > 2 ? await checkImage(`../uploads/${image}`) : `../assets/images/courseDefault.jpg`;

            courseCardImage.appendChild(imageElement);
            
            let cardText = createElement("div", "card-text");
            let courseCardCode = createElement("div", "course-card-code");
            let courseCardTitle = createElement("div", "course-card-title");
            
            courseCardCode.textContent = courseCode;
            courseCardTitle.textContent = title;

            cardText.appendChild(courseCardCode);
            cardText.appendChild(courseCardTitle);

            let cardOverlay = createElement("div", "card-overlay");

            courseCard.appendChild(courseCardImage);
            courseCard.appendChild(cardText);
            courseCard.appendChild(cardOverlay);

            courseCard.addEventListener("click", () => {
                closePopup('.course-view-container');
                setURLParameter("id", id);
                console.log("setting URL id: ", id);
                eventListener(course);
            });
            
            if( showSubscription ){
                let subscriptionResult = await getCourseSubscriptionStatus(id, userID);

                // This is the subscription part for the student view.
                let subscriptionIcon = document.createElement("div");
                subscriptionIcon.className = "subscription-icon";
                let tickImageElement = document.createElement("img");
                tickImageElement.src = "../assets/icons/check.png";
                subscriptionIcon.appendChild(tickImageElement);
    
                try {
                    if(subscriptionResult[0].status == "true"){
                        courseCard.appendChild(subscriptionIcon);
                    }
                }catch(error){
    
                }         
            }

            courseViewContainer.appendChild( courseCard );
        });

    }

    async function getCourseSubscriptionStatus(id, userID){

        return await AJAXCall({
            phpFilePath: "../include/course/getSubscriptionStatus.php",
            rejectMessage: "Getting Status Failed",
            params: `id=${id}&&userID=${userID}`,
            type: "fetch"
        });

    }

}

