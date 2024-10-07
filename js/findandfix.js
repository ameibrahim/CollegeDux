async function findAndFixMissingObjectiveFiles(){

    const problems = document.querySelector(".problems");

    const response = await AJAXCall({
        phpFilePath: "../include/course/getAllObjectivesFilenames.php",
        rejectMessage: "Getting Filenames Failed",
        type: "fetch",
        params: ""
    })

    console.log("filenameResponse: ", response);

    for await(objective of response){

        let {id: courseID, objectives: foundObjectives, title, courseCode } = objective;

        if(foundObjectives.length == 0){
            await addNewObjective(courseID);

            const problem = document.createElement("div");
            problem.className = "problem"
            problem.textContent = `${courseCode} - ${title}`;

            problems.append(problem);
        }
    }
    // await saveLearningObjectivesAsJSON(`ObjectiveErrors-${uniqueID(2)}`, errors);
}