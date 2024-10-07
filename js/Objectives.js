class Objectives {
  currentHierarchy = 0;
  currentIndex = 0;

  constructor({ id, objectives }) {
    this.id = id;
    this.objectives = objectives;
    this.currentIndex = this.objectives.length - 1;
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

    let objectiveText = document.createElement("div");
    objectiveText.className = "objective-text";
    objectiveText.setAttribute("contentEditable", "true");
    objectiveText.textContent = objective.title;
    objectiveText.addEventListener("input", () =>
      this.updateObjective(objectiveText, this.objectives[index])
    );

    let objectiveDeleteButton = document.createElement("div");
    objectiveDeleteButton.className = "delete-button";
    objectiveDeleteButton.addEventListener("click", () => {
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

    const objective = { hierarchy, title: "" };
    this.objectives.push(objective);

    let objectiveContainer = this.createObjectiveInput(objective, index);
    learningObjectivesOuterContainer.appendChild(objectiveContainer);
  }

  updateObjective(element, textObject) {
    textObject.title = element.textContent;
    console.log("yupp", this.objectives);
  }

  saveObjectives() {
    //TODO: Objective 1

    (async () => {
      try {
        const result = await saveLearningObjectives(this.id, this.objectives);
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
  let id = mainContainer.getAttribute("data-id");

  console.log("id:", id);

  const courseDetails = await getTitleAndFilename(id);
  console.log(courseDetails);
  const { title } = courseDetails[0];

  const prompt = `generate for me in json format with the structure { courseTitle: "", learningObjectives: [ "" ] }, a decent amount of learning 
    objectives for students for the given course title: ${title}
    `;

  const objectivesResponse = await generateGPTResponseFor(prompt);
  const objectivesJSON = await JSON.parse(objectivesResponse);
  const objectivesList = objectivesJSON.learningObjectives;

  console.log("objectiveList: ", objectivesJSON);
  console.log("objectiveList: ", objectivesList);

  const objectives = objectivesList.map((objective, index) => {
    return { hierarchy: index + 1, title: objective };
  });

  let addLearningObjectiveButton = findElement(
    ".add-learning-objective-button"
  );
  let saveLearningObjectivesButton = findElement(
    ".save-learning-objectives-button"
  );

  console.log("objectivesObject: ", objectives);

  let learningObjectives = new Objectives({ id, objectives });
  learningObjectives.renderObjectives();
  learningObjectives.setAddNewObjectiveButton(addLearningObjectiveButton);
  learningObjectives.setSaveLearningObjectivesButton(
    saveLearningObjectivesButton
  );

  removeLoader(loader);
}

function addNewObjective(courseID) {
  const id = uniqueID(1);
  const objectives = encodeURIComponent(JSON.stringify([]));

  return new Promise(async (resolve, reject) => {
    try {
      await AJAXCall({
        phpFilePath: "../include/course/addNewObjective.php",
        rejectMessage: "adding new objective failed",
        params: `id=${id}&&courseID=${courseID}&&objectives=${objectives}`,
        type: "post",
      });
    } catch (error) {
      //TODO: bubbleUpError()
      reject();
      console.log(error);
    }

    resolve(id);
  });
}

function saveLearningObjectives(id, objectives) {
  let stringifiedObjectives = encodeURIComponent(JSON.stringify(objectives));

  //TODO: continue encoding for PHP

  return new Promise(async (resolve, reject) => {
    try {
      await AJAXCall({
        phpFilePath: "../include/course/saveLearningObjectives.php",
        rejectMessage: "saving new objective failed",
        params: `id=${id}&&objectives=${stringifiedObjectives}`,
        type: "post",
      });
    } catch (error) {
      //TODO: bubbleUpError()
      reject();
      console.log(error);
    }

    resolve(id);
  });
}
