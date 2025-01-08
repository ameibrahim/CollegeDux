let courseImageEditObject;

function loadImageToIMGView(event, outputElement) {
    const output = document.querySelector(outputElement);

    courseImageEditObject = event.target.files[0];

    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
        URL.revokeObjectURL(output.src); // free memory
    };
}

async function saveCourseEdits(courseID, courseCode, title) {
    if (courseImageEditObject) {
        try {
            let { newFileName } = await uploadFile(courseImageEditObject);
            let params = `courseID=${courseID}&&image=${newFileName}`;

            console.log(params);

            let changePhoto = await AJAXCall({
                phpFilePath: "../include/course/changeCoursePhoto.php",
                rejectMessage: "Script Failed",
                params,
                type: "post",
            });

            console.log(changePhoto);
        } catch (error) {
            console.log(error);
        }
    }

    const params = createParametersFrom({courseID, courseCode, title});

    console.log(params);

    let saveProfileDetails = await AJAXCall({
        phpFilePath: "../include/course/saveCourseEdits.php",
        rejectMessage: "Script Failed",
        params,
        type: "post",
    });

    console.log(saveProfileDetails);

    closePopup(".edit-course-details-overlay");
    location.reload();

}
