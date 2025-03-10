class Objectives {
  currentHierarchy = 0;
  currentIndex = 0;
  objectivesToDelete = [];

  constructor({ courseID, objectives }, overwrite = "false") {
    this.objectives = objectives;
    this.courseID = courseID;
    this.currentIndex = this.objectives.length - 1;
    this.overwrite = overwrite;
  }

  renderObjectives() {
    let learningObjectivesOuterContainer = document.querySelector(
      ".outer-objective-container"
    );
    learningObjectivesOuterContainer.innerHTML = "";

    this.objectives.forEach((objective, index) => {
      let objectiveContainer = this.createObjectiveInput(objective, index);
      learningObjectivesOuterContainer.appendChild(objectiveContainer);
      this.currentHierarchy = objective.hierarchy;
    });

    console.log("Objectives Modified: ", this.objectives);
  }

  setAddNewObjectiveButton(button) {
    clearEventListenersFor(button).addEventListener("click", () => {
      this.addObjective();
    });
  }

  setSaveLearningObjectivesButton(button) {
    clearEventListenersFor(button).addEventListener("click", () => {
      this.saveObjectives();
      closePopup(".edit-learning-objectives-overlay");
    });
  }

  createObjectiveInput(objective, index) {
    let objectiveContainer = document.createElement("div");
    objectiveContainer.className = "objective-container";

    let objectiveItemization = document.createElement("div");
    objectiveItemization.className = "objective-itemization";

    let objectiveText = document.createElement("input");
    objectiveText.value = objective.title;
    objectiveText.className = "objective-text";
    objectiveText.setAttribute("contentEditable", "true");
    // objectiveText.textContent = objective.title;
    objectiveText.addEventListener("input", () =>
      this.updateObjective(objectiveText, this.objectives[index])
    );

    let objectiveDeleteButton = document.createElement("div");
    objectiveDeleteButton.className = "delete-button";
    objectiveDeleteButton.addEventListener("click", () => {
      this.objectivesToDelete.push(this.objectives[index].id);
      this.objectives.splice(index, 1);
      --this.currentIndex;
      console.log(this.objectives);
      this.renderObjectives();
    });

    let objectiveDeleteButtonImage = document.createElement("img");
    objectiveDeleteButtonImage.src = "../assets/icons/delete.png";

    objectiveDeleteButton.appendChild(objectiveDeleteButtonImage);
    objectiveContainer.appendChild(objectiveItemization);
    objectiveContainer.appendChild(objectiveText);
    objectiveContainer.appendChild(objectiveDeleteButton);
    return objectiveContainer;
  }

  addObjective() {
    let learningObjectivesOuterContainer = document.querySelector(
      ".outer-objective-container"
    );

    let hierarchy = "" + ++this.currentHierarchy;
    let index = ++this.currentIndex;
    let id = uniqueID(1);

    const objective = {
      hierarchy,
      title: "",
      id,
      courseID: this.courseID,
      action: "new",
    };
    this.objectives.push(objective);

    let objectiveContainer = this.createObjectiveInput(objective, index);
    learningObjectivesOuterContainer.appendChild(objectiveContainer);
  }

  updateObjective(element, textObject) {
    textObject.title = element.value;
    textObject.action = textObject.action == "new" ? "new" : "editted";
    console.log("updating objective: ", this.objectives);
  }

  saveObjectives() {
    //TODO: Objective 1

    (async () => {
      try {
        const result = await saveLearningObjectives(
          this.courseID,
          this.objectives,
          this.objectivesToDelete,
          this.overwrite
        );
        console.log("save objectives result: ", result);
      } catch (error) {
        console.log(error);
      }
    })();
  }
}

async function refreshObjectives() {
  let loader = loadLoader("Generating Objectives");

  let mainContainer = document.querySelector(".main-container");
  let courseID = mainContainer.getAttribute("data-id");

  console.log("id:", courseID);

  const courseDetails = await getTitleAndFilename(courseID);
  console.log(courseDetails);
  const { title } = courseDetails[0];
  const language=extrapolateLanguage();
  console.log("jerry", language);
  const prompt = `Create a JSON string with a structured format for a course with the title "${title}" in "${language}". The format should be: { courseTitle: "", learningObjectives: [ "" ] }, include a decent amount of learning objectives.`;

  const objectivesResponse = await generateGPTResponseFor(prompt);
  const objectivesJSON = objectivesResponse;
  const objectivesList = objectivesJSON.learningObjectives;

  console.log("objectiveList: ", objectivesJSON);
  console.log("objectiveList: ", objectivesList);

  const objectives = objectivesList.map((objective, index) => {
    return {
      id: uniqueID(),
      hierarchy: index + 1,
      title: objective,
      courseID,
      action: "new",
    };
  });

  let addLearningObjectiveButton = findElement(
    ".add-learning-objective-button"
  );
  let saveLearningObjectivesButton = findElement(
    ".save-learning-objectives-button"
  );

  console.log("objectivesObject: ", objectives);

  let learningObjectives = new Objectives({ courseID, objectives }, "overwrite");
  learningObjectives.renderObjectives();
  learningObjectives.setAddNewObjectiveButton(addLearningObjectiveButton);
  learningObjectives.setSaveLearningObjectivesButton(
    saveLearningObjectivesButton
  );

  removeLoader(loader);
}

async function deleteAllObjectivesFor(courseID) {
  return AJAXCall({
    phpFilePath: "../include/objective/deleteAllObjectivesFor.php",
    rejectMessage: `Deleting Objectives For Course With ID ${courseID} Has Failed`,
    type: "post",
    params: createParametersFrom({ courseID }),
  });
}

async function saveLearningObjectives(
  courseID,
  objectives,
  objectivesToDelete,
  overwrite
) {
  if (overwrite == "overwrite") {
    await deleteAllObjectivesFor(courseID);
  }

  for await (objective of objectives) {
    switch (objective.action) {
      case "new":
        addNewObjective(objective);
        break;
      case "editted":
        editObjective(objective);
        break;
      default:
        console.log("objective action: ", objective.action);
        break;
    }
  }

  for await (objective of objectivesToDelete) {
    deleteObjective(objective);
  }
}

async function addNewObjective(objective) {
  let params = createParametersFrom(objective);

  return AJAXCall({
    phpFilePath: "../include/objective/addNewObjective.php",
    rejectMessage: "Adding New Objective Failed",
    type: "post",
    params,
  });
}

async function editObjective(objective) {
  let params = createParametersFrom(objective);

  return AJAXCall({
    phpFilePath: "../include/objective/editObjective.php",
    rejectMessage: "Editting Objective Failed",
    type: "post",
    params,
  });
}

async function deleteObjective(objectiveID) {
  return AJAXCall({
    phpFilePath: "../include/objective/deleteObjective.php",
    rejectMessage: "Deleting Objective Failed",
    type: "post",
    params: `objectiveID=${objectiveID}`,
  });
}
