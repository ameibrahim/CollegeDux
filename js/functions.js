const letters = "abcdefghijklmnopqrstuvwxyz".split("");

function truncateString(string, limit = 30) {
    return string.substring(0, limit) + "...";
}

function logoutDialog(_options) {
    let options = _options ?? {
        title: "Are You Sure You Want To Log Out?",
        denyTitle: "No",
        acceptTitle: "Yes",
    };

    return showOptionsDialog(options, () => logout());
}

function inactivityTime(duration, callback) {
    let time;
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;

    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(callback, duration);
    }
}

function runAfterInactiveSeconds(duration, callback) {
    window.onload = () => inactivityTime(duration, callback);
}

function playPause() {
    let myVideo = document.querySelector("#video1");

    if (myVideo.paused) myVideo.play();
    else myVideo.pause();
}

function showLoader(message) {
    let loader = document.createElement("div");
    loader.className = "loading-overlay user-select-none";
    let body = document.querySelector("body");

    let loaderInnerHTML = `   <div class="overlay-inner-container">
            <div class="sk-chase">
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
            </div>

            <div class="loading-message">
                ${message}
            </div>
        </div>
    `;

    loader.innerHTML = loaderInnerHTML;
    body.appendChild(loader);

    return loader;
}

function removeLoader(loader) {
    loader.style.opacity = "0";

    setTimeout(() => loader.remove(), 1000);
}

function cascadingDateChanges() {
    let dateInputs = document.querySelectorAll("#topicCardsContainer input");
    let daysToAdd = 7;

    dateInputs.forEach((input, index) => {
        input.addEventListener("change", (event) => {
            let chosenDate = event.target.value;
            let currentDate = new Date(`${chosenDate}:00.000`);
            let currentIndex = Number(input.getAttribute("data-position"));

            dateInputs.forEach((dateInput, index) => {
                let position = Number(dateInput.getAttribute("data-position"));

                if (position > currentIndex) {
                    let nextDate = currentDate;
                    let timezoneOffset = nextDate.getTimezoneOffset();
                    nextDate.setDate(currentDate.getDate() + daysToAdd);
                    currentDate = nextDate;

                    let [_date, _time] = currentDate.toJSON().split("T");
                    let [_hours, _minutes] = _time.split(".")[0].split(":");

                    let time = `${_hours - timezoneOffset / 60}:${_minutes}`;
                    const finalDate = `${_date} ${time}`;
                    dateInput.value = finalDate;
                }
            });
        });

        input.setAttribute("data-position", index);
    });
}

function makeUnique(strength) {
    let cache = {};
    let n = uniqueID(strength);
    while (!n in cache) {
        n = uniqueID(strength);
    }
    cache[n] = n;
}

function uniqueID(strength = 1) {
    const date = Date.now() + getRandomArbitrary(3000, 9999);
    const dateReversed =
        getRandomArbitrary(3000, 9999) +
        parseInt(String(date).split("").reverse().join(""));
    const base36 = (number) => number.toString(36);
    if (strength == 1) return base36(date);
    if (strength == -1) return base36(dateReversed);
    return base36(dateReversed) + base36(date);
    // return crypto.randomUUID().split("-").join("");
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function setUsernameDetails(user) {
    document.querySelectorAll("#userName").forEach((item) => {
        item.setAttribute("data-en", user.name);
        item.setAttribute("data-tr", user.name);
    });
    document
        .querySelectorAll("#userPhoto")
        .forEach((item) => (item.src = user.photo));
}

function AJAXCall(callObject) {
    let { phpFilePath, rejectMessage, params, type } = callObject;

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", phpFilePath, true);
        xhr.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );

        xhr.onload = function () {
            if (this.status == 200) {
                console.log("Raw response:", this.responseText); // Log the raw response
                try {
                    let result =
                        type === "fetch"
                            ? JSON.parse(this.responseText)
                            : this.responseText;

                    if (result.length < 1 && type !== "fetch")
                        reject(rejectMessage || "SQLError");
                    else resolve(result);
                } catch (e) {
                    reject("JSON Parse Error: " + e.message);
                }
            } else {
                reject("Error With PHP Script: Status " + this.status);
            }
        };

        xhr.onerror = function () {
            reject("Network Error");
        };

        xhr.send(params);
    });
}

function loadImage(event, outputElement) {
    const output = document.querySelector(outputElement);
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
        URL.revokeObjectURL(output.src); // free memory
    };
}

async function uploadFile(file, scriptPath = "../include/upload.php") {
    if (!file) {
        return false;
    }

    return new Promise((resolve, reject) => {
        let myFormData = new FormData();
        myFormData.append("file", file);

        let http = new XMLHttpRequest();
        http.open("POST", scriptPath, true);

        http.upload.addEventListener("progress", (event) => {
            let percent = (event.loaded / event.total) * 100;
            document.querySelector("#global-progress-bar").style.width =
                Math.round(percent) + "%";
        });

        http.onload = function () {
            if (this.status == 200) {
                console.log("name2: ", this.responseText);

                resolve({
                    oldFileName: file.name,
                    newFileName: this.responseText,
                });
            } else {
                reject("error");
            }
        };

        http.send(myFormData);
    });
}

async function getUserDetails() {
    let id = localStorage.getItem("id");

    try {
        let result = await AJAXCall({
            phpFilePath: "../include/getPersonalDetails.php",
            rejectMessage: "Getting Personal Details Failed",
            params: `id=${id}`,
            type: "fetch",
        });

        if (result) {
            return result[0];
        }
    } catch (error) {
        console.log(error);
        // TODO: Logout
    }
}

function openPopup(selector, going = "forward") {
    let popup = document.querySelector(selector);
    popup.style.display = "grid";

    try {
        if (going == "back") removeURLParameter("id");
    } catch (error) {}
}

function closePopup(selector) {
    let popup = document.querySelector(selector);
    popup.style.display = "none";
}

async function getGlobalDetails() {
    let result = await getUserDetails();

    if (!result.id) logout();
    else return result;
}

function createElement(type, className = "") {
    let element = document.createElement("div");
    element.className = className;
    return element;
}

function findElement(selector) {
    return document.querySelector(selector);
}

function findElements(...args) {
    let result = {};

    args.forEach((item) => {
        result[camelCase(item)] = findElement(item);
    });

    return result;
}

function camelCase(word) {
    return word
        .replace(".", "")
        .replace("#", "")
        .replace(/-([a-z])/g, function (k) {
            return k[1].toUpperCase();
        });
}

async function fetchOpenAIKey(phpFilePath = "../include/openAIKey.php") {
    return await AJAXCall({
        phpFilePath,
        rejectMessage: "Key Not Fetched",
        params: "",
        type: "fetch",
    });
}

async function generateGPTResponseFor(prompt) {
    try {
        // Fetch API key
        const keyResponse = await fetchOpenAIKey();
        if (!keyResponse || !keyResponse[0] || !keyResponse[0].value) {
            throw new Error("Invalid API key configuration");
        }
        const apiKey = keyResponse[0].value;

        const endpoint = "https://api.openai.com/v1/chat/completions";

        // Ensure the prompt includes JSON format instruction
        const systemMessage = {
            role: "system",
            content:
                "You are a helpful assistant. Always respond in JSON format with a 'response' key containing your message.",
        };

        const userMessage = {
            role: "user",
            content: typeof prompt === "string" ? prompt : prompt.content,
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Updated to a version that supports JSON response format
                messages: [systemMessage, userMessage],
                response_format: { type: "json_object" },
                temperature: 0.7,
                max_tokens: 150,
            }),
        });

        if (!response.ok) {
            throw new Error(
                `API request failed with status ${response.status}`
            );
        }

        const data = await response.json();
        // console.log("GPT Response Data:", data);

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error("Invalid response structure from API");
        }

        // Parse the JSON response
        const parsedContent = JSON.parse(data.choices[0].message.content);
        console.log("parsedContent: ", parsedContent);
        return parsedContent.response || "No response content available";
    } catch (error) {
        console.error("Error in generateGPTResponseFor:", error);
        return "I apologize, but I encountered an error processing your request.";
    }
}

function getRandomElement(arr) {
    if (arr.length === 0) {
        return undefined;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

async function saveAssessmentAsJSON(
    filename,
    ArrayContainingObjects,
    assessmentType,
    type
) {
    function escapeNonASCII(jsonString) {
        return jsonString.replace(/[\u007F-\uFFFF]/g, function (ch) {
            return "\\u" + ("0000" + ch.charCodeAt(0).toString(16)).slice(-4);
        });
    }

    let JSONString = JSON.stringify(ArrayContainingObjects);
    JSONString = escapeNonASCII(JSONString);

    console.log("assessment type: ", assessmentType);

    let correctPath;

    switch (type) {
        case "student":
        case "new":
        case "resume":
            correctPath = `../${assessmentType}/taken/${filename}`;
            break;
        case "teacher":
        case "generated":
            correctPath = `../${assessmentType}/generated/${filename}`;
            break;
    }

    console.log("[3] correctPath: ", correctPath);
    console.log("[4] jsonString: ", JSONString);

    try {
        let result = await AJAXCall({
            phpFilePath: "../include/saveJSONData.php",
            rejectMessage: "saving json file failed",
            params: `filepath=${correctPath}&&jsonString=${JSONString}`,
            type: "post",
        });

        console.log("[5] async Result: ", result);
    } catch (error) {
        //TODO: bubbleUpError()
        console.log(error);
    }
}

async function logout() {
    let result = await AJAXCall({
        phpFilePath: "../include/logout.php",
        rejectMessage: "logout error",
        params: "",
        type: "",
    });

    window.location.href = "../auth.php";
}

function getCurrentTimeInJSONFormat() {
    let now = new Date();
    return now.toJSON();
}

function clearEventListenersFor(old_element) {
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    return new_element;
}

function loadLoader(message) {
    let loader = document.createElement("div");
    loader.className = "loading-overlay user-select-none";
    let body = document.querySelector("body");

    let loaderInnerHTML = `   <div class="overlay-inner-container">

            <div class="sk-fold">
                <div class="sk-fold-cube"></div>
                <div class="sk-fold-cube"></div>
                <div class="sk-fold-cube"></div>
                <div class="sk-fold-cube"></div>
            </div>

            <div class="loading-message">
                ${message}
            </div>
        </div>
    `;

    loader.innerHTML = loaderInnerHTML;
    body.appendChild(loader);

    return loader;
}

function removeLoader(loader) {
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 1000);
}

function scrollBottom(element) {
    element.scroll({ top: element.scrollHeight, behavior: "smooth" });
}

async function getCourseDetails(givenID) {
    return AJAXCall({
        phpFilePath: "../include/course/getCourseDetails.php",
        rejectMessage: "Getting Details Failed",
        params: `id=${givenID}`,
        type: "fetch",
    });
}

async function getTitleAndFilename(givenID) {
    return AJAXCall({
        phpFilePath: "../include/course/getTitleAndFilename.php",
        rejectMessage: "Getting Details Failed",
        params: `id=${givenID}`,
        type: "fetch",
    });
}

function createParametersFrom(data) {
    let params = "";
    let entries = Object.entries(data);

    entries.forEach(([key, value], index) => {
        let parameter = `${key}=${value}`;
        index < entries.length - 1
            ? (params += parameter + "&&")
            : (params += parameter);
    });

    return params;
}

function extractType(type) {
    switch (type) {
        //TODO: refactor so that any image types can be accepted
        case "image/png":
        case "image/jpg":
        case "image/jpeg":
            return "image";
        case "application/pdf":
            return "pdf";
        case "video":
            return "video";
        case "video/mp4":
        case "video/webm":
        case "video/ogg":
        case "video/quicktime":
        case "video/x-msvideo":
        case "video/x-ms-wmv":
        case "video/x-flv":
        case "video/3gpp":
        case "video/3gpp2":
        case "video/mpeg":
        case "video/x-matroska":
        case "video/x-f4v":
            return "player";
        case "text":
            return "text";
        case "link":
            return "link";
    }
}

function questionMapSwitch(question) {
    switch (question.type.toLowerCase()) {
        case "multiplechoicequestion":
            return new MultipleChoice(question);
        case "trueandfalsequestion":
            return new TrueAndFalse(question);
        case "fillintheblankquestion":
            return new FillInTheBlank(question);
        default:
            throw new Error(`Not Made Yet: ${question.type.toLowerCase()}`);
    }
}

function questionEditMapSwitch(question) {
    switch (question.type.toLowerCase()) {
        case "multiplechoicequestion":
            return new EditMultipleChoice(question);
        case "trueandfalsequestion":
            return new EditTrueAndFalse(question);
        case "fillintheblankquestion":
            return new EditFillInTheBlank(question);
        default:
            throw new Error(`Not Made Yet: ${question.type.toLowerCase()}`);
    }
}

async function fetchCourseWithID(givenID) {
    let courseGridContainer = findElement("#course-grid-container");

    let loader = `
    <div class="loader">
        <div class="sk-chase">
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
        </div>
    </div>`;

    courseGridContainer.innerHTML = loader;

    let courses = await getCourseDetails(givenID);

    if (courses.length > 0) if (courses[0].status == "error") return;

    let selectedCourse = courses[0];

    console.log("selectedCourse: ", selectedCourse);

    (function sortCourses(course) {
        course.lectures.sort((firstLecture, secondLecture) => {
            firstLecture.subtopics.sort(
                (firstSubtopic, secondSubtopic) =>
                    firstSubtopic.hierarchy - secondSubtopic.hierarchy
            );

            return firstLecture.hierarchy - secondLecture.hierarchy;
        });
    })(selectedCourse);

    setTimeout(() => {
        // This is very important
        let deleteButton = clearEventListenersFor(
            findElement("#deleteCourseButton")
        );

        let course = new Course(selectedCourse);
        course.renderTitle();
        course.renderCourseCode();
        course.renderDeleteButton(deleteButton);
        course.renderEditLearningObjectivesButton();
        course.renderEditCourseDetailsButton();
        course.renderLectureSection();

        let addNewLectureButton = clearEventListenersFor(
            findElement("#addNewLecture")
        );
        let saveCourseDetailsButton = clearEventListenersFor(
            findElement("#saveCourseDetails")
        );
        let excelCourseFileUploadButton = clearEventListenersFor(
            findElement("#excelCourseFileUpload")
        );

        addNewLectureButton.addEventListener("click", () =>
            course.addLectureElement()
        );

        saveCourseDetailsButton.addEventListener("click", async () =>
            courseItemObjectLooper(course)
        );

        excelCourseFileUploadButton.addEventListener(
            "change",
            async (event) => {
                console.log("clickeddddd");

                try {
                    let file = event.target.files[0];
                    const objectURL = window.URL.createObjectURL(file);
                    let result = await parseExcelForCourseObject(objectURL);
                    course.markAllForDeletion();
                    course.eraseForExcelUpload(result);
                    findElement("#excelCourseFileUpload").value = "";
                } catch (error) {
                    console.log(error);
                }
            }
        );
    }, 2000);
}

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
}

function setURLParameter(name, value) {
    let url = new URL(window.location);
    let urlSearchParams = new URLSearchParams(url.search);

    urlSearchParams.set(name, value);
    url.search = urlSearchParams.toString();
    window.history.pushState(null, null, url.toString());
}

function getURLParameter(identifier) {
    let searchParams = new URLSearchParams(window.location.search);
    const hasIdentifier = searchParams.has(identifier);
    return hasIdentifier ? searchParams.get(identifier) : null;
}

function removeURLParameter(identifier) {
    let url = new URL(window.location);
    let searchParams = new URLSearchParams(url.search);
    const hasIdentifier = searchParams.has(identifier);
    hasIdentifier ? searchParams.delete(identifier) : false;

    console.log("search params: ", searchParams);

    url.search = searchParams.toString();
    window.history.pushState(null, null, url.toString());
}

function getMarksForQuestion(type) {
    switch (type.toLowerCase()) {
        case "multiplechoicequestion":
            return 1;
        case "trueandfalsequestion":
            return 1;
        case "fillintheblankquestion":
            return 1;
        default:
            return 1;
    }
}

async function checkImage(imagePath) {
    // This function checks for broken image paths
    // and replaces it with a default image

    try {
        let result = await fetch(imagePath);
        if (result.status != 404) return imagePath;
        throw new Error();
    } catch (error) {
        return `../assets/images/courseDefault.jpg`;
    }
}

async function getSummary(resourcesObjectArray) {
    const PDFNames = resourcesObjectArray
        .filter((object) => object.type == "application/pdf")
        .map((object) => object.value);

    console.log("PDFNames: ", PDFNames);

    return new Promise(async (resolve, reject) => {
        let summaries = [];

        try {
            for await (const names of PDFNames) {
                summaries.push(await summarize(names));
            }
        } catch (error) {
            reject(error);
        }

        resolve(summaries.join("\n"));
    });
}

function summarize(pdfName) {
    return new Promise(async (resolve, reject) => {
        const pdfUrl = `../uploads/${pdfName}`;

        try {
            // Fetch the PDF using the Fetch API
            const response = await fetch(pdfUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch PDF: ${response.statusText}`);
            }

            const pdfData = await response.arrayBuffer();

            // Load the PDF document
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

            let fullText = "";

            // Loop through all pages
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();

                // Concatenate all text into one large string
                fullText +=
                    textContent.items.map((item) => item.str).join(" ") + " ";
            }

            // Summarize the extracted text
            const summary = summarizeText(fullText);
            resolve(summary);
            // Log the summarized content to the console
            console.log("Summarized PDF Content:", summary);
        } catch (error) {
            reject(error);
            console.error("Error extracting PDF content:", error);
        }
    });

    function summarizeText(text) {
        // Tokenize text into sentences
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

        // Count word frequencies
        const wordFrequencies = {};
        const words = text
            .toLowerCase()
            .split(/\W+/)
            .filter((word) => word.length > 3); // Filter out short words
        words.forEach((word) => {
            wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
        });

        // Rank sentences by important keywords
        const sentenceScores = sentences.map((sentence) => {
            const wordsInSentence = sentence.toLowerCase().split(/\W+/);
            const score = wordsInSentence.reduce(
                (total, word) => total + (wordFrequencies[word] || 0),
                0
            );
            return { sentence, score };
        });

        // Sort sentences by score in descending order
        sentenceScores.sort((a, b) => b.score - a.score);

        // Return the top 3-5 sentences as the summary
        const summary = sentenceScores
            .slice(0, 5)
            .map((item) => item.sentence.trim());
        return summary.join(" ");
    }
}

function setActive(element) {
    console.log("element: ", element);
    const value = element.textContent;

    const parentElement = element.parentNode;
    const children = parentElement.querySelectorAll(".language-changer-element");

    console.log("children: ", children);

    for (const child of children) {
        console.log("child: ", child);
        child.className = "language-changer-element";
    }

    element.className = "language-changer-element active";

    parentElement.setAttribute("data-lang", value);
}
