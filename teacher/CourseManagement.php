<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dux Teacher</title>
    <page data-id="Course Management"></page>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>

    <?php include '../include/teacherImports.php'; ?>
    <script src="../js/localize.js?3"></script>
    <script src="../js/courseDetailChanges.js?1"></script>

</head>

<body>

    <?php include 'components/header.php'; ?>

    <div class="outer-container">
        <?php include 'components/sidebar.php'; ?>
        <div class="main-container">

            <div class="header-combo">
                <h1 class="large-title">
                    <text>Course Management</text>
                </h1>

                <div class="two-column-grid">
                    <div class="button" onclick="openPopup('.create-mover-overlay'); startCourseMover()">
                        <text>move course</text>
                    </div>
                    <div class="button" onclick="openCreateCourseOverlay()">
                        <text>Create Course</text>
                    </div>
                </div>
            </div>

            <div class="course-view-container">
                <div class="container-message blank course-view-container-loader">
                    <div class="sk-fold">
                        <div class="sk-fold-cube"></div>
                        <div class="sk-fold-cube"></div>
                        <div class="sk-fold-cube"></div>
                        <div class="sk-fold-cube"></div>
                    </div>
                </div>
            </div>

            <div class="edit-course-container inner-overlay">

                <div class="back-arrow"
                    onclick="openPopup('.course-view-container','back'); closeEditCourseContainer()">
                    <img class="icon" src="../assets/icons/fi/fi-rr-arrow-alt-left.svg" alt="">
                </div>

                <?php include 'components/editCourse.php' ?>

            </div>

        </div>
    </div>

    <?php include 'components/courseCreationOverlay.php' ?>
    <?php include 'components/courseMoverOverlay.php' ?>
    <?php include 'components/courseSharingOverlay.php' ?>
    <?php include 'components/editLearningObjectivesOverlay.php' ?>
    <?php include 'components/editCourseDetailsOverlay.php' ?>

    <script>

        const URLID = getURLParameter("id");

        if (URLID && URLID.length > 1) {
            editCourseWith({ id: URLID });
        }

        (async () => {
            await loadCoursesGeneric("id", editCourseWith, { emptyMessage: "No courses yet" });
        })();

        let courseImageObject;

        async function createCourse(event) {
            // Prevent the default form submission
            event.preventDefault();

            let createCourseLoader = loadLoader("Creating Course");

            let courseCode = document.querySelector(".course-code").value;
            let courseName = document.querySelector(".course-name").value;
            let courseLanguage = document.querySelector(".course-language").value;
            let courseIsLanguage = document.querySelector(".course-is-language").value;

            let isLanguageCourse = (courseIsLanguage === "yes") ? "true" : "false";

            let id = uniqueID(1);

            let { id: creatorID } = await getGlobalDetails();

            let params = `id=${id}&&courseCode=${courseCode}&&title=${courseName}&&language=${courseLanguage}&&isLanguage=${isLanguageCourse}&&creatorID=${creatorID}&&image=''`;

            if (courseImageObject) {
                try {
                    let { newFileName } = await uploadFile(courseImageObject);
                    if (newFileName) params = `id=${id}&&courseCode=${courseCode}&&title=${courseName}&&language=${courseLanguage}&&isLanguage=${isLanguageCourse}&&creatorID=${creatorID}&&image=${newFileName}`;
                    console.log(params);
                } catch (error) {
                    console.log(error);
                }
            }

            let result = await AJAXCall({
                phpFilePath: "../include/course/addNewCourse.php",
                rejectMessage: "course error",
                params,
                type: "post"
            });

            console.log(result);

            // objectives.
            // await saveLearningObjectivesInDatabase(id);

            await loadCoursesGeneric("id", editCourseWith, { emptyMessage: "No courses yet" });

            setTimeout(() => {
                closeCreateCourseOverlay();
                removeLoader(createCourseLoader);
            }, 2000);
        }


        function openCreateCourseOverlay() {
            clearCourseOverlayInputs();
            let courseOverlay = document.querySelector(".create-course-overlay");
            courseOverlay.style.display = "grid";
        }

        function closeCreateCourseOverlay() {
            let courseOverlay = document.querySelector(".create-course-overlay");
            courseOverlay.style.display = "none";
        }

        function loadImageToCoursePopupView(event, outputElement) {

            const output = document.querySelector(outputElement);

            const overWrapper = document.querySelector(".over-wrapper");
            overWrapper.style.display = "none";

            courseImageObject = event.target.files[0];

            output.src = URL.createObjectURL(event.target.files[0]);
            output.onload = function () {
                URL.revokeObjectURL(output.src) // free memory
            }
        }

        function clearCourseOverlayInputs() {

            const createCourseOverlay = document.querySelector(".create-course-overlay");
            const courseImageElement = createCourseOverlay.querySelector(".course-image-view-element");
            const courseCodeElement = createCourseOverlay.querySelector(".form-input.course-code");
            const courseTitleElement = createCourseOverlay.querySelector(".form-input.course-name");

            const overWrapper = document.querySelector(".over-wrapper");
            overWrapper.style.display = "grid";

            courseImageElement.removeAttribute("src")
            courseCodeElement.value = "";
            courseTitleElement.value = "";
        }

        async function startCourseMover() {

            let { id: currentOwner } = await getGlobalDetails();
            const courseMoverEngine = new CourseMoverEngine({ currentOwner });

            const recipientListContainer = document.querySelector(".teacher-list-container");
            const courseListContainer = document.querySelector(".course-list-container");
            const moveButton = document.querySelector(".move-button");
            const courseCountElement = document.querySelector(".course-count");

            courseMoverEngine.setRecipientListContainer(recipientListContainer)
            courseMoverEngine.setCourseListContainer(courseListContainer)
            courseMoverEngine.setMoveButton(moveButton)
            courseMoverEngine.setCourseCountElement(courseCountElement)
            courseMoverEngine.setup()

        }

        async function startCourseSharing() {

            let { id: currentOwner } = await getGlobalDetails();
            let courseID = globalCache.get("chosenCourseID");
            const courseMoverEngine = new CourseSharingEngine({ courseID, userID: currentOwner });

            const recipientListContainer = document.querySelector(".teacher-list-container.share");
            const courseListContainer = document.querySelector(".course-list-container.share");
            const addInstructorButton = document.querySelector(".add-instructor-button");
            const removeInstructorButton = document.querySelector(".remove-instructor-button");
            const courseCountElement = document.querySelector(".course-count.share");

            courseMoverEngine.setRecipientListContainer(recipientListContainer)
            courseMoverEngine.setCourseListContainer(courseListContainer)
            courseMoverEngine.setAddInstructorButton(addInstructorButton)
            courseMoverEngine.setRemoveInstructorButton(removeInstructorButton)
            courseMoverEngine.setup()

        }


    </script>

    <?php include 'components/uploadCourseMaterialOverlay.php'; ?>

    <?php include 'components/editQuizOverlay.php'; ?>

    <div class="overlay video-overlay" style="display: none;">
        <!-- <div class="popup"> -->
        <div class="popup-header">
            <div class="close-button" onclick="closePopup('.video-overlay')">
                <img src="../assets/icons/close.png" alt="Close">
            </div>
            <h1 class="pop-up-title">Watch Video</h1>
        </div>

        <iframe id="videoFrame" src="" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

        <div class="popup-footer">
            <div class="button-group">
                <div class="button secondary-button" onclick="closePopup('.video-overlay')">
                    <text>Close</text>
                </div>
                <div class="button" onclick="saveVideo(); closePopup('.video-overlay')">
                    <text>Save</text>
                </div>

            </div>
        </div>
    </div>

</body>

</html>