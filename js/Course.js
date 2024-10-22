class Course {
  lectureUpdates = {};
  subtopicUpdates = {};
  newLectures = {};
  newSubtopics = {};
  newResources = {};
  deleteLectures = {};
  deleteSubtopics = {};
  deleteResource = {};

  itemizationIndex = 0;

  markAllForDeletion() {
    this.lectures.forEach((lecture) => {
      this.deleteLectureTitle(lecture.id, this);
    });
  }

  eraseForExcelUpload(lectures) {
    this.lectureIndex = 0;
    this.lectureUpdates,
      this.subtopicUpdates,
      this.newLectures,
      this.newSubtopics,
      (this.newResources = {});
    this.lectures = lectures;

    this.renderLectureSection("excel");
    this.forceNewCourseDataAsNew();
  }

  constructor(courseObject) {
    let { title, courseCode, lectures, id } = courseObject;

    this.title = title;
    this.courseCode = courseCode;
    this.lectures = lectures;
    this.id = id;
    this.lectureIndex = 0;
  }

  setTitle(title, _this) {
    _this.title = title;
    _this.renderTitle();
  }

  renderTitle() {
    let titleElement = findElement("#course-title");
    let textElement = createLocalizedTextElement(this.title);
    titleElement.innerHTML = "";
    titleElement.appendChild(textElement);
  }

  renderCourseCode() {
    let titleElement = findElement("#course-code");
    let textElement = createLocalizedTextElement(this.courseCode);
    titleElement.innerHTML = "";
    titleElement.appendChild(textElement);
  }

  renderEditLearningObjectivesButton() {
    let editLearningObjectivesButton = clearEventListenersFor(
      findElement("#editLearningObjectives")
    );
    editLearningObjectivesButton.addEventListener("click", () => {
      editLearningObjectives(this.id);
    });
  }

  renderDeleteButton(button) {
    button.addEventListener("click", () => this.deleteCourse(this.id));
  }

  renderLectureSection(from = "object") {
    let courseGridContainer = findElement("#course-grid-container");
    courseGridContainer.innerHTML = "";

    this.lectures.forEach((lecture, index) => {
      console.log("lectures object: ", JSON.stringify(lecture));

      this.lectureIndex = lecture.hierarchy;
      this.itemizationIndex = index + 1;

      let lectureSection = document.createElement("div");
      lectureSection.className = "lecture-section";

      let itemizationElement = document.createElement("div");
      itemizationElement.className = "itemization";
      itemizationElement.setAttribute("hierarchy", lecture.hierarchy);
      itemizationElement.textContent = this.itemizationIndex + ".";

      let lectureInnerContainer = document.createElement("div");
      lectureInnerContainer.className = "lecture-inner-container";

      let inputElementObject = {
        id: lecture.id,
        parentID: this.id,
        title: lecture.title,
        inputChangeCallback: this.updateLectureTitle,
        hierarchy: this.lectureIndex,
        type: "lecture",
      };

      let lectureInputElement = this.createInputElement(inputElementObject);

      lectureInnerContainer.appendChild(lectureInputElement);

      // BADGE FOR SHOWING UPLOADS
      let resourcesCount = 0;

      lecture.subtopics.forEach((subtopic) => {
        if (subtopic.resources) resourcesCount += subtopic.resources.length;
      });

      const badgeButton = this.createBadgeButton(lecture.id, resourcesCount);
      lectureInputElement.appendChild(badgeButton);

      let floatingContainer = document.createElement("div");
      floatingContainer.className = "lecture-floating-container";

      let addSubtopicButton = document.createElement("div");
      addSubtopicButton.className = "add-subtopic-button";
      addSubtopicButton.innerHTML = `<img src="../assets/icons/fi/fi-rr-plus.svg" alt="">`;

      floatingContainer.appendChild(addSubtopicButton);

      let generateQuizButton = document.createElement("div");
      generateQuizButton.className = "button green-button generate-quiz-button";
      generateQuizButton.textContent = "generate quiz";
      // generateQuizButton.innerHTML = `<img src="../assets/icons/fi/fi-rr-plus.svg" alt="">`;
      generateQuizButton.addEventListener("click", () => {
        switch (from) {
          case "object":
            generateQuiz({ courseID: this.id, ...lecture });
            break;
          case "excel":
            generateQuiz({ courseID: this.id, ...lecture }, false);
            this.save();
            break;
        }
      });

      //TODO: add/show addQuiz/editQuiz button if subtopicCount is larger than 1;

      if (
        lecture.subtopics &&
        lecture.quizzes &&
        lecture.subtopics.length > 0 &&
        lecture.quizzes.length == 0
      )
        floatingContainer.appendChild(generateQuizButton);

      let subtopicsContainer = document.createElement("div");
      subtopicsContainer.className = "subtopics-container";

      let subtopicIndex = 0;

      lecture.subtopics.forEach((subtopic) => {
        let subtopicWrapper = document.createElement("div");
        subtopicWrapper.className = "subtopics-wrapper";

        const attachButton = this.createAttachButton(subtopic.id);

        subtopicIndex = subtopic.hierarchy;

        const inputElementObject = {
          id: subtopic.id,
          parentID: lecture.id,
          title: subtopic.title,
          inputChangeCallback: this.updateSubtopicTitle,
          hierarchy: subtopicIndex,
          type: "subtopic",
        };

        let subtopicInputElement = this.createInputElement(inputElementObject);
        subtopicInputElement.appendChild(attachButton);

        subtopicWrapper.appendChild(subtopicInputElement);

        let subtopicResourceWrapper = document.createElement("div");
        subtopicResourceWrapper.className = "subtopics-resource-wrapper";

        subtopic.resources &&
          subtopic.resources.forEach((resource) => {
            const resourceElement = this.createSubtopicItem(resource);
            subtopicResourceWrapper.appendChild(resourceElement);
          });

        subtopicWrapper.appendChild(subtopicResourceWrapper);
        subtopicsContainer.appendChild(subtopicWrapper);
      });

      addSubtopicButton.addEventListener("click", () => {
        this.addSubtopicElement({
          parentID: lecture.id,
          parentElement: subtopicsContainer,
          hierarchy: ++subtopicIndex,
        });
      });

      let quizContainer = document.createElement("div");
      quizContainer.className = "subtopics-container quiz-container";

      if (lecture.quizzes)
        lecture.quizzes.forEach((quiz) => {
          const quizRow = this.createQuizRow(quiz);

          let quizDeleteButton = document.createElement("div");
          quizDeleteButton.className = "quiz-delete-button";
          let quizDeleteIcon = document.createElement("img");
          quizDeleteIcon.src = "../assets/icons/delete.png";
          quizDeleteButton.appendChild(quizDeleteIcon);

          quizDeleteButton.addEventListener("click", () => deleteQuiz(quiz.id));

          quizContainer.className = "subtopics-container quiz-container";
          quizContainer.appendChild(quizRow);
          quizContainer.appendChild(quizDeleteButton);
        });

      lectureInnerContainer.appendChild(subtopicsContainer);
      lectureInnerContainer.appendChild(quizContainer);
      lectureSection.appendChild(floatingContainer);
      lectureSection.appendChild(itemizationElement);
      lectureSection.appendChild(lectureInnerContainer);
      courseGridContainer.appendChild(lectureSection);
    });

    if (this.lectures.length == 0) {
      let myEmptyView = createElement("div", "container-message");
      let NoSelectedCoursesYet = createLocalizedTextElement(
        "No Lectures Yet, Add a New Lecture"
      );
      let myLargeMessage = createElement("div", "large-message");
      myLargeMessage.appendChild(NoSelectedCoursesYet);
      myEmptyView.appendChild(myLargeMessage);

      courseGridContainer.innerHTML = "";
      courseGridContainer.appendChild(myEmptyView);
    }
  }

  createSubtopicItem(resource) {
    let resourceType = extractType(resource.type);
    let { id, value } = resource;

    let mainClassroomSubtopicItem = createElement(
      "div",
      "main-classroom-subtopic-item"
    );
    mainClassroomSubtopicItem.setAttribute("id", id);

    let rowItemIcon = createElement("div", "row-item-icon");
    let rowItemText = createElement("div", "row-item-text");
    let rowItemAction = createElement("div", "row-item-action");

    let imageElement = document.createElement("img");

    switch (resourceType) {
      case "image":
        imageElement.src = "../assets/icons/image.png";
        //TODO: change this textContent to a localizedTranslatableElement
        rowItemAction.textContent = "view";
        rowItemAction.addEventListener("click", () =>
          openImageViewer(`../uploads/${value}`)
        );
        break;
      case "pdf":
        imageElement.src = "../assets/icons/pdf.png";
        rowItemAction.textContent = "view";
        rowItemAction.addEventListener("click", () =>
          openPDFViewer(`../uploads/${value}`)
        );
        break;
      //TODO: Video
      default:
        throw new Error("Type has not been created yet!");
        break;
    }

    //TODO: This should be changed to the title of the resource;
    rowItemText.textContent = value;

    rowItemIcon.appendChild(imageElement);
    mainClassroomSubtopicItem.appendChild(rowItemIcon);
    mainClassroomSubtopicItem.appendChild(rowItemText);
    mainClassroomSubtopicItem.appendChild(rowItemAction);

    return mainClassroomSubtopicItem;
  }

  createQuizRow(quizObject) {
    let {
      courseID,
      dateGenerated,
      filename,
      id,
      lectureID,
      name,
      totalMarks,
      hierarchy,
    } = quizObject;

    let quizRowContainer = document.createElement("div");
    quizRowContainer.className = "quiz-row-container";

    let quizFilename = document.createElement("div");
    quizFilename.className = "quiz-row-name";
    quizFilename.textContent = name;

    let editButton = document.createElement("div");
    editButton.className = "button green-button quiz-edit-button";
    editButton.textContent = "edit quiz";

    editButton.addEventListener("click", () =>
      startEdittingAssessment(filename, "quiz")
    );

    quizRowContainer.appendChild(quizFilename);
    quizRowContainer.appendChild(editButton);
    return quizRowContainer;
  }

  addLectureElement(lectureTitle = "") {
    let lectureID = uniqueID(1);
    let subtopicIndex = 0;

    let courseGridContainer = findElement("#course-grid-container");
    let emptyView = document.querySelector(".container-message");
    if (emptyView) courseGridContainer.innerHTML = "";

    let lectureSection = document.createElement("div");
    lectureSection.className = "lecture-section";

    let itemizationElement = document.createElement("div");
    itemizationElement.className = "itemization";
    itemizationElement.textContent = ++this.itemizationIndex + ".";

    let lectureInnerContainer = document.createElement("div");
    lectureInnerContainer.className = "lecture-inner-container";

    let inputElementObject = {
      id: lectureID,
      parentID: this.id,
      title: lectureTitle,
      inputChangeCallback: this.newLectureTitle,
      hierarchy: ++this.lectureIndex,
      type: "lecture",
    };

    let lectureInputElement =
      lectureTitle.length == 0
        ? this.createInputElement(inputElementObject)
        : this.createInputElement(inputElementObject, "excelUpload");

    // TODO: BADGE FOR SHOWING UPLOADS
    const badgeButton = this.createBadgeButton(lectureID, 0);
    lectureInputElement.appendChild(badgeButton);

    let floatingContainer = document.createElement("div");
    floatingContainer.className = "lecture-floating-container";

    let addSubtopicButton = document.createElement("div");
    addSubtopicButton.className = "add-subtopic-button";
    addSubtopicButton.innerHTML = `<img src="../assets/icons/fi/fi-rr-plus.svg" alt="">`;

    let subtopicsContainer = document.createElement("div");
    subtopicsContainer.className = "subtopics-container";

    addSubtopicButton.addEventListener("click", () => {
      this.addSubtopicElement({
        parentID: lectureID,
        parentElement: subtopicsContainer,
        hierarchy: ++subtopicIndex,
      });
    });

    floatingContainer.appendChild(addSubtopicButton);

    lectureInnerContainer.appendChild(lectureInputElement);
    lectureInnerContainer.appendChild(subtopicsContainer);
    lectureSection.appendChild(floatingContainer);
    lectureSection.appendChild(itemizationElement);
    lectureSection.appendChild(lectureInnerContainer);
    courseGridContainer.appendChild(lectureSection);

    let editCourseContainer = document.querySelector(".edit-course-container");
    scrollBottom(editCourseContainer);
  }

  recountItemizations() {
    let courseGridContainer = findElement("#course-grid-container");
    const itemizationElements =
      courseGridContainer.querySelectorAll(".itemization");

    itemizationElements.forEach((itemizationElement, index) => {
      this.itemizationIndex = index + 1;
      itemizationElement.textContent = this.itemizationIndex + ".";
    });
  }

  addSubtopicElement(
    { parentID, parentElement, hierarchy },
    subtopicTitle = ""
  ) {
    let subtopicID = uniqueID(1);

    let attachButton = this.createAttachButton(subtopicID);

    let inputElementObject = {
      id: subtopicID,
      parentID: parentID,
      title: subtopicTitle,
      inputChangeCallback: this.newSubtopicTitle,
      hierarchy,
      type: "subtopic",
    };

    let subtopicInputElement =
      subtopicTitle.length == 0
        ? this.createInputElement(inputElementObject)
        : this.createInputElement(inputElementObject, "excelUpload");

    subtopicInputElement.appendChild(attachButton);

    parentElement.appendChild(subtopicInputElement);
  }

  updateLectureTitle({ id, title, hierarchy, _this }) {
    _this.lectureUpdates[id] = { id, title, hierarchy };
    console.log(_this.lectureUpdates[id]);
  }

  updateSubtopicTitle({ id, title, hierarchy, _this }) {
    _this.subtopicUpdates[id] = { id, title, hierarchy };
    console.log(_this.subtopicUpdates[id]);
  }

  newLectureTitle({ id, parentID, title, hierarchy, _this }) {
    _this.newLectures[id] = { id, parentID, title, hierarchy };
    console.log(_this.newLectures[id]);
  }

  newSubtopicTitle({ id, parentID, title, hierarchy, _this }) {
    _this.newSubtopics[id] = { id, parentID, title, hierarchy };
    console.log(_this.newSubtopics[id]);
  }

  deleteCourse() {
    let options = {
      title: "Are You Sure You Want To Delete This Course?",
      denyTitle: "No",
      acceptTitle: "Yes",
    };

    console.log("Delete Course: ");

    return showOptionsDialog(options, async () => {
      this.lectureUpdates = {};
      this.subtopicUpdates = {};

      this.newLectures = {};
      this.newSubtopics = {};
      this.newResources = {};

      this.lectures.map((lecture) => {
        this.deleteLectures[lecture.id] = { id: lecture.id };

        if (lecture.quizzes && lecture.quizzes.length > 0) {
          lecture.quizzes.map((quiz) => {
            this.deleteLectures[lecture.id]["quizID"] = quiz.id;
          });
        }

        lecture.subtopics.map((subtopic) => {
          this.deleteSubtopics[subtopic.id] = { id: subtopic.id };

          if (subtopic.resources) {
            subtopic.resources.map((resource) => {
              this.deleteResource[resource.id] = { id: resource.id };
            });
          }
        });
      });

      await courseItemObjectLooper(this, "delete course");
      await deleteCourseFromDatabase(this.id);
    });
  }

  forceNewCourseDataAsNew() {
    this.lectures.forEach((lecture) => {
      this.newLectureTitle({
        id: lecture.id,
        parentID: this.id,
        title: lecture.title,
        hierarchy: lecture.hierarchy,
        _this: this,
      });

      lecture.subtopics.forEach((subtopic) => {
        this.newSubtopicTitle({
          id: subtopic.id,
          parentID: lecture.id,
          title: subtopic.title,
          hierarchy: subtopic.hierarchy,
          _this: this,
        });
      });
    });
  }

  deleteLectureTitle(id, _this) {
    let lectureIndex = null;

    this.lectures.forEach((lecture, index) => {
      if (lecture.id == id) {
        lectureIndex = index;
        return;
      }
    });

    let quizID =
      "neverGonnaGiveYouUpNeverGonnaLetYouDownNeverGonnaRunAroundAndDesertYou";

    if (this.lectures[lectureIndex].quizzes.length > 0) {
      quizID = this.lectures[lectureIndex].quizzes[0].id;
    }

    _this.deleteLectures[id] = { id, quizID };

    if (lectureIndex != null) {
      this.lectures[lectureIndex].subtopics.forEach((subtopic) => {
        _this.deleteSubtopics[subtopic.id] = { id: subtopic.id };
      });
    }
  }

  deleteSubtopicTitle(id, title, _this) {
    _this.deleteSubtopics[id] = { id };
  }

  searchAndDeleteLecture(id) {
    let deleted = false;

    this.lectures.forEach((lecture, index) => {
      if (lecture.id == id) {
        this.deleteLectureTitle(id, this);
        deleted = true;
        return;
      }
    });

    if (!deleted) delete this.newLectures[id];
  }

  searchAndDeleteSubtopic(idObject) {
    let deleted = false;

    let lectureIndex = null;
    let { id, lectureID } = idObject;

    this.lectures.forEach((lecture, index) => {
      if (lecture.id == lectureID) {
        lectureIndex = index;
        return;
      }
    });

    if (lectureIndex != null) {
      this.lectures[lectureIndex].subtopics.forEach((subtopic, index) => {
        if (subtopic.id == id) {
          this.deleteSubtopicTitle(id, "", this);
          deleted = true;
          return;
        }
      });
    }

    if (!deleted) delete this.newSubtopics[id];
  }

  createInputElement(inputElementObject, addType = "normal") {
    let { id, parentID, title, inputChangeCallback, hierarchy, type } =
      inputElementObject;

    let inputElementContainer = document.createElement("div");
    inputElementContainer.className = "input-element";

    let inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = title;
    inputElement.setAttribute("data-id", id);
    inputElement.setAttribute("required", "true");

    let inputCallbackObject = {
      id,
      parentID,
      title: inputElement.value,
      hierarchy,
      _this: this,
    };

    // Force an inputElement event to write data to the course class
    if (addType == "excelUpload") inputChangeCallback(inputCallbackObject);

    inputElement.onchange = () => {
      inputCallbackObject.title = inputElement.value;
      inputChangeCallback(inputCallbackObject);
      console.log(inputCallbackObject.title);
    };

    let deleteButton = document.createElement("div");
    deleteButton.className = "delete-button";
    deleteButton.innerHTML = `<img src="../assets/icons/delete.png" alt="">`;

    deleteButton.addEventListener("click", () => {
      switch (type) {
        case "lecture":
          inputElementContainer.parentElement.parentElement.remove();
          this.recountItemizations();
          this.searchAndDeleteLecture(id);
          this.lectureIndex--;
          break;
        case "subtopic":
          inputElementContainer.remove();
          this.searchAndDeleteSubtopic({ id, lectureID: parentID });
          break;
      }
    });

    inputElementContainer.appendChild(inputElement);
    inputElementContainer.appendChild(deleteButton);

    return inputElementContainer;
  }

  createAttachButton(id) {
    let attachButton = document.createElement("div");
    attachButton.className = "attachments-button";
    attachButton.innerHTML = `<img class="icon" src="../assets/icons/fi/fi-rr-paperclip-vertical.svg" alt="">`;
    attachButton.addEventListener("click", () => {
      openUploadOverlay(id);
    });

    return attachButton;
  }

  createBadgeButton(id, count) {
    let badgeButton = document.createElement("div");
    badgeButton.className = "badge";
    badgeButton.textContent = count;
    badgeButton.addEventListener("click", () => {});

    if (count) badgeButton.style.display = "grid";
    else badgeButton.style.display = "none";

    return badgeButton;
  }

  save() {
    courseItemObjectLooper(this);
  }
}

async function editLearningObjectives(id) {
  const objectives = await AJAXCall({
    phpFilePath: "../include/objective/getLearningObjectives.php",
    rejectMessage: "Getting Objectives Failed",
    type: "fetch",
    params: `courseID=${id}`,
  });

  objectives.forEach((objectives) => (objectives.action = "fetched"));

  console.log("HERE: response of objectives 1: ", objectives);

  let addLearningObjectiveButton = document.querySelector(
    ".add-learning-objective-button"
  );
  let saveLearningObjectivesButton = document.querySelector(
    ".save-learning-objectives-button"
  );

  //DEPRACATED: parseAvailableJSONFromArray(response, "objectives");

  console.log("HERE: parsed objectives", objectives);

  let learningObjectives = new Objectives({ courseID: id, objectives });
  learningObjectives.renderObjectives();
  learningObjectives.setAddNewObjectiveButton(addLearningObjectiveButton);
  learningObjectives.setSaveLearningObjectivesButton(
    saveLearningObjectivesButton
  );
  openPopup(".edit-learning-objectives-overlay");
}

function parseAvailableJSONFromArray(array, objectIdentifier) {
  let result = [];

  if (array.length > 0) {
    let temp = array[0];
    temp = JSON.parse(temp[objectIdentifier]);
    result = temp;
  }

  return result;
}

// TODO: Get Course class lines under 500

async function generateQuiz(
  lectureObject,
  refresh = true,
  language = "english"
) {
  let loader = loadLoader("Generating Quiz");

  const languages = ["english", "turkish"];
  const educationEnvironment = "college students";
  const types = [
    "MultipleChoiceQuestion",
    "FillInTheBlankQuestion",
    "TrueAndFalseQuestion",
  ];
  const levels = ["easy", "medium", "hard", "difficult", "extremely difficult"];

  const lectureID = lectureObject.id;
  const lectureTitle = lectureObject.title;
  const courseID = lectureObject.courseID;

  console.log("courseID: ", courseID);

  const topics = lectureObject.subtopics
    .map((subtopic) => subtopic.title)
    .join(", ");

  let quizQuestions = [];

  for await (const type of types) {
    try {
      console.log("type: ", type);
      const generateQuestionObject = {
        type,
        languages,
        subtopics: lectureObject.subtopics,
        educationEnvironment,
        topics,
        level: getRandomElement(levels),
      };

      console.log("generateQuestionObject: ", generateQuestionObject);

      let result = await generateQuestion(generateQuestionObject, 4);
      console.log("result: ", result);
      quizQuestions = [...quizQuestions, ...result];
    } catch (error) {
      continue;
    }
  }

  shuffle(quizQuestions);

  console.log("quizQuestions: ", quizQuestions);

  let filename = `Quiz-${uniqueID(2)}.json`;
  saveAssessmentAsJSON(filename, quizQuestions, "quiz", "generated");

  let quizID = uniqueID(1);
  let name = `Quiz on ${topics}`; // ...
  let dateGenerated = getCurrentTimeInJSONFormat();
  let hierarchy = ""; // ...
  let totalMarks = quizQuestions.length; //TODO: figure out the marks properly...

  console.log("hierarchy: ", lectureObject.hierarchy);

  let params =
    `id=${quizID}&&courseID=${courseID}&&lectureID=${lectureID}&&name=${name}` +
    `&&dateGenerated=${dateGenerated}&&filename=${filename}&&totalMarks=${totalMarks}&&hierarchy=${lectureObject.hierarchy}`;

  let response = await AJAXCall({
    phpFilePath: "../include/quiz/addNewQuiz.php",
    rejectMessage: "New Quiz Failed To Add",
    params,
    type: "post",
  });

  console.log("quiz generation response: ", response);

  setTimeout(() => {
    if (refresh) refreshTeacherCourseOutline(); //Bugs???
    removeLoader(loader);
  }, 2000);
}

async function loopThroughObjectForAsync(courseObject, asyncCallback) {
  if (courseObject) {
    let __courseObjectEntries = Object.entries(courseObject);

    __courseObjectEntries.map(async ([key, details] = entry) => {
      try {
        let result = await asyncCallback(details);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    });
  }
}

async function courseItemObjectLooper(course, type = "") {
  let loader =
    type != "delete course"
      ? loadLoader("Saving Course Outline")
      : loadLoader("Deleting Course");

  console.log("delete Lectures: ", course.deleteLectures);
  console.log("delete Subtopics: ", course.deleteSubtopics);

  // Here Now
  await loopThroughObjectForAsync(
    course.lectureUpdates,
    updateLectureTitleToDatabase
  );
  await loopThroughObjectForAsync(
    course.newLectures,
    addLectureTitleToDatabase
  );
  await loopThroughObjectForAsync(
    course.subtopicUpdates,
    updateSubtopicTitleToDatabase
  );
  await loopThroughObjectForAsync(
    course.newSubtopics,
    addSubtopicTitleToDatabase
  );
  await loopThroughObjectForAsync(
    course.deleteSubtopics,
    deleteSubtopicsFromDatabase
  );
  await loopThroughObjectForAsync(
    course.deleteLectures,
    deleteLecturesFromDatabase
  );

  setTimeout(async () => {
    if (type == "delete course") {
      console.log("course deleted");
      closePopup(".edit-course-container");
      removeLoader(loader);
      location.reload();
    } else {
      await refreshTeacherCourseOutline(); //TODO: Bugs??? YES!
      removeLoader(loader);
    }
  }, 5000);
}

async function deleteCourseFromDatabase(courseID) {
  if (courseID.length > 2) {
    let params = `id=${courseID}`;

    const response = await AJAXCall({
      phpFilePath: "../include/delete/deleteCourse.php",
      rejectMessage: "Deleting Course Failed",
      params,
      type: "post",
    });

    console.log("delete Response: ", response);
  }
}

async function deleteLecturesFromDatabase(lectureObject) {
  let { id, quizID } = lectureObject;

  if (id.length > 2) {
    let params = `id=${id}`;

    await AJAXCall({
      phpFilePath: "../include/delete/deleteLecture.php",
      rejectMessage: "Deleting lecture failed",
      params,
      type: "post",
    });

    if (
      quizID !=
      "neverGonnaGiveYouUpNeverGonnaLetYouDownNeverGonnaRunAroundAndDesertYou"
    ) {
      await deleteQuiz(quizID);
    }
  }
}

async function deleteSubtopicsFromDatabase(subtopicsObject) {
  let { id } = subtopicsObject;

  if (id.length > 2) {
    let params = `id=${id}`;

    await AJAXCall({
      phpFilePath: "../include/delete/deleteSubtopic.php",
      rejectMessage: "Deleting subtopics failed",
      params,
      type: "post",
    });
  }
}

async function updateLectureTitleToDatabase(lectureOject) {
  let { id, title, hierarchy } = lectureOject;

  if (id.length > 2) {
    let params = `lectureID=${id}&&title=${title}&&hierarchy=${hierarchy}`;

    await AJAXCall({
      phpFilePath: "../include/course/editLectureDetails.php",
      rejectMessage: "Getting Details Failed",
      params,
      type: "post",
    });
  }
}

async function updateSubtopicTitleToDatabase(subtopicObject) {
  let { id, title, hierarchy } = subtopicObject;

  if (id.length > 2) {
    let params = `id=${id}&&title=${title}&&hierarchy=${hierarchy}`;

    await AJAXCall({
      phpFilePath: "../include/course/editSubtopicDetails.php",
      rejectMessage: "Setting Details Failed",
      params,
      type: "post",
    });
  }
}

async function addLectureTitleToDatabase(lectureOject) {
  let { id, title, parentID: courseID, hierarchy } = lectureOject;

  if (id.length > 2) {
    let params = `id=${id}&&title=${title}&&courseID=${courseID}&&hierarchy=${hierarchy}`;

    await AJAXCall({
      phpFilePath: "../include/course/addNewLecture.php",
      rejectMessage: "Setting Details Failed",
      params,
      type: "post",
    });
  }
}

async function addSubtopicTitleToDatabase(subtopicObject) {
  let { id, parentID: lectureID, title, hierarchy } = subtopicObject;

  if (id.length > 2) {
    let params = `id=${id}&&title=${title}&&lectureID=${lectureID}&&hierarchy=${hierarchy}`;

    await AJAXCall({
      phpFilePath: "../include/course/addNewSubtopic.php",
      rejectMessage: "Adding New Subtopic Failed",
      params,
      type: "post",
    });
  }
}

async function deleteQuiz(id) {
  let loader = loadLoader("Deleting Quiz");

  try {
    await AJAXCall({
      phpFilePath: "../include/delete/deleteQuiz.php",
      rejectMessage: "Quiz not deleted",
      type: "post",
      params: `id=${id}`,
    });
  } catch (error) {}

  setTimeout(() => {
    refreshTeacherCourseOutline(); //Bugs???
    removeLoader(loader);
  }, 2000);
}

function refreshTeacherCourseOutline() {
  let mainContainer = document.querySelector(".main-container");
  let id = mainContainer.getAttribute("data-id");
  editCourseWith({ id });
}
