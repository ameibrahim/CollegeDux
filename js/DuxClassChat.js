function renderClassView(element){
    const givenID = globalCache.get("givenCourseID");
    const courseData = globalCache.get("chosenCourseData");
    const duxClassChat = new DuxClassChat(courseData, givenID);

    openPopup('.class-chat-inner-overlay');

    let duxSendButton = document.querySelector(".class-send-message-button");
    let duxInputText = document.querySelector("#final_speech");
    let duxMessagesView = document.querySelector(".dux-class-chat-container");
    let uploadPDF = document.querySelector("#duxAddPDF");
    let classchatroomTitle = document.querySelector(".classchatroom-course-title");
    let classchatroomCourseCode = document.querySelector(".classchatroom-course-code");

    duxClassChat.addTitleElement(classchatroomTitle);
    duxClassChat.addCourseCodeElement(classchatroomCourseCode);
    duxClassChat.addSendButtonElement(duxSendButton);
    duxClassChat.addTextBoxInputElement(duxInputText);
    duxClassChat.addMessagesView(duxMessagesView);
    duxClassChat.setAddToDuxPDF(uploadPDF);
    duxClassChat.startChatEngine();

}

class DuxClassChat {

    messagesView

    constructor(courseObject, courseID, startMessage = "Welcome To Class."){

        this.startMessage = startMessage;
        this.PDFCorpus = [];

        let {
            title,
            courseCode,
            lectures,
            id,
        } = courseObject

        this.title = title;
        this.courseCode = courseCode;
        this.lectureQueue = lectures;
        this.subtopicQueue = [];
        this.resourceQueue = [];
        this.quizQueue = [];
        this.currentLecture = null;
        this.currentSubtopic = null;
        this.currentQuiz = null;
        this.hasQuiz = false;
        this.courseObject = courseObject;
        this.id = id;
        this.currentStep = "lecture";
        this.courseID = courseID;
        this.currentHierarchy = 0;

        ( async() => {
            try{
                let response = await fetchOpenAIKey();
                console.log(response[0].value);
                this.apiKey = response[0].value;
            }
            catch(error){
                console.log(error);
            }
        })();

    }

    startChatEngine(){
        this.renderTitle()
        this.renderCourseCode()
        this.messagesView.innerHTML = "";
        this.renderDuxMessageFor(this.startMessage, null, "forced");
        this.next();
    }

    next(){

        switch(this.currentStep){
            case "lecture":
                console.log("lecture");
                this.getCurrentLecture()
            break;
            case "subtopic":
                console.log("subtopic");
                this.getCurrentSubtopic()
            break;
            case "resource":
                console.log("resource");
                this.getCurrentResource()
            break;
            case "quiz":
                console.log("quiz");
                this.getCurrentQuiz()
            break;
        }
    }

    getCurrentLecture(){

        if(this.lectureQueue.length > 0){
            this.currentLecture = this.lectureQueue.shift();
            this.currentHierarchy = this.currentLecture.hierarchy;
            
            this.renderLectureTitle(this.currentLecture.title);

            if(this.currentLecture.quizzes.length > 0){
                this.hasQuiz = true 
                this.quizQueue = this.currentLecture.quizzes
            }
            else this.hasQuiz = false; 

            this.subtopicQueue = this.currentLecture.subtopics;
            this.currentStep = "subtopic";
            this.next()
        } else {
            this.currentStep = "finished"
            // showThatThereAreNoLecturesToStudy()
            // showThatTheLecturesAreFinished()
            return;
        }

    }

    getCurrentSubtopic(){

        if(this.subtopicQueue.length > 0){
            this.currentSubtopic = this.subtopicQueue.shift();

            this.renderSubtopicTitle(this.currentSubtopic.title);

            this.resourceQueue = this.currentSubtopic.resources;
            this.currentStep = "resource";
            this.next()

        } else {

            if (this.hasQuiz == true) this.currentStep = "quiz";
            else this.currentStep = "lecture";  
            this.next();
        }

    }

    getCurrentResource(){

        if(this.resourceQueue.length > 0){

            this.currentResource = this.resourceQueue.shift();

            let { type, title, value } = this.currentResource;

            switch(type){
                case "application/pdf":
                    this.renderPDFMessage(value, false);
                break;
                case "image/jpg":
                case "image/png":
                    this.renderImageMessage(`../uploads/${value}`);
                break;
                case "video/mpeg":
                break;
            }
        }

        else {
            this.currentStep = "subtopic";
            this.next();
        }

    }

    getCurrentQuiz(){

        if(this.quizQueue.length > 0){

            this.currentQuiz = this.quizQueue.shift();
            const quizObject = { hierarchy: this.currentHierarchy, ...this.currentQuiz };
            this.quizButton = this.renderQuizButton();
            handleQuiz({ courseID: this.courseID , ...quizObject }, this.quizButton, "iterative"); // TODO: handle quiz finishing.
        } else {
            this.currentStep = "lecture";
            this.next();
        }

    }

    renderTitle(){
        this.titleElement.textContent = this.title
    }

    renderCourseCode(){
        this.courseCodeElement.textContent = this.courseCode
    }

    renderLectureTitle(title){
        const leftMessageOuterContainer = document.createElement("li")
        leftMessageOuterContainer.className = "left-container";
        leftMessageOuterContainer.textContent = title;
        leftMessageOuterContainer.style.marginLeft = "30px";
        this.messagesView.append(leftMessageOuterContainer);
    }

    renderSubtopicTitle(title){
        const leftMessageOuterContainer = document.createElement("li")
        leftMessageOuterContainer.className = "left-container";
        leftMessageOuterContainer.textContent = title;
        leftMessageOuterContainer.style.marginLeft = "60px";
        this.messagesView.append(leftMessageOuterContainer);
    }

    addTextBoxInputElement(textInput){
        this.textInput = textInput;

        // this.textInput.addEventListener("keypress", (e) => {
        //     if(e.keyCode == 13) {
        //         this.initiateDuxResponse();
        //     }
        // })
    }

    addTitleElement(element){
        this.titleElement = element
        console.log("element: ", element)
    }

    addCourseCodeElement(element){
        this.courseCodeElement = element
        console.log("element: ", element)
    }

    addSendButtonElement(button){
        this.sendButton = button;
        this.sendButton.addEventListener("click", () => {
            this.initiateDuxResponse();
        })
    }

    addMessagesView(view){
        this.messagesView = view;
    }

    setAddToDuxPDF(button){
        button.addEventListener("change", (event) => this.openPDFSelector(event))
    }

    openPDFSelector(event){

        let file = event.target.files[0];
        let objectURL = window.URL.createObjectURL(file);
        this.renderPDFMessage(objectURL, "direct");
        // output.onload = function() { URL.revokeObjectURL(objectURL) }
    }

    renderPDFMessage(filename, type = "direct"){

        const PDFLink = type == "direct" ? filename : `../uploads/${filename}`;

        const centerMessageOuterContainer = document.createElement("li")
        centerMessageOuterContainer.className = "center";

        const PDFContainer = document.createElement("div");
        PDFContainer.className = "pdf-message";
        
        const PDFIframe = document.createElement("iframe");
        PDFIframe.className = "pdf-frame";
        PDFIframe.setAttribute("width", "100%");
        PDFIframe.setAttribute("height", "100%");
        PDFIframe.src = PDFLink;

        PDFContainer.appendChild(PDFIframe);
        centerMessageOuterContainer.appendChild(PDFContainer);

        if(type != "direct"){    
            const finishedReadingButton = document.createElement("div");
            finishedReadingButton.className = "finished-button";
            finishedReadingButton.textContent = "I Have Finished Reading";
    
            finishedReadingButton.addEventListener("click", () => {
                this.next();
                finishedReadingButton.remove();
            })

            centerMessageOuterContainer.appendChild(finishedReadingButton);
        }

        this.messagesView.append(centerMessageOuterContainer);

        this.addPDFToCorpus(filename, PDFLink);

    }

    async addPDFToCorpus(filename, url){
        const pages = await getPagesFrom(url);
        this.PDFCorpus.push(pages);
        console.log("current PDF Corpus: ", this.PDFCorpus);
    }

    async findInPDFCorpus(query){

        let results = performSearch(query, this.PDFCorpus);
        console.log("entries: ", results);

        let joinedPages = 
        results.map( result => {
            const entry = Object.entries(result)[0];

            console.log("key: ", entry[0])
            console.log("value: ", entry[1])

            return `page - ${entry[0]} : [${entry[1]}]`
        }
        ).join(",\n");

        console.log(joinedPages);
    }

    renderImageMessage(imageLink){

        const centerMessageOuterContainer = document.createElement("li")
        centerMessageOuterContainer.className = "center";

        const imageContainer = document.createElement("div");
        imageContainer.className = "image-message";
        
        const imageFrame = document.createElement("img");
        imageFrame.className = "image-frame";
        imageFrame.src = imageLink;

        imageContainer.appendChild(imageFrame);

        const finishedViewingButton = document.createElement("div");
        finishedViewingButton.className = "finished-button";
        finishedViewingButton.textContent = "I Have Finished Viewing";

        finishedViewingButton.addEventListener("click", () => {
            this.next();
            finishedViewingButton.remove();
        })

        centerMessageOuterContainer.appendChild(imageContainer);
        centerMessageOuterContainer.appendChild(finishedViewingButton);
        this.messagesView.append(centerMessageOuterContainer);

    }

    renderQuizButton(){

        const centerMessageOuterContainer = document.createElement("li")
        centerMessageOuterContainer.className = "center";

        const quizButton = document.createElement("div");
        quizButton.className = "row-item-action quiz-action";
        quizButton.style.justifySelf = "center";

        quizButton.addEventListener("click", () => {
            this.next();
            quizButton.remove();
        })


        centerMessageOuterContainer.appendChild(quizButton);
        this.messagesView.append(centerMessageOuterContainer);

        return quizButton;

    }


    renderMyMessage(message){

        const myMessageContainer = document.createElement("li");
        myMessageContainer.className = "mine";

        // This format
        // <li class="mine">
        //     <p class="name-tag">IA</p>
        //     <p>Hello</p>
        // </li>

        const myIcon = document.createElement("div");
        myIcon.className = "name-tag";
        myIcon.textContent = "ME";

        const myMessageText = document.createElement("div");
        myMessageText.className = "message-text";
        myMessageText.innerHTML = message;

        myMessageContainer.append(myIcon);
        myMessageContainer.append(myMessageText);
        this.messagesView.append(myMessageContainer);

    }

    initiateDuxResponse(){

        let message = this.textInput.textContent;

        let results = performSearch(message,this.PDFCorpus);
        let joinedResults = joinSearchResult(results);

        const promptMessage = `From the following PDF Extract ${joinedResults}, give me a response to the input ${message} with a limit of 50 words.`;
        
        this.renderMyMessage(message);
        this.textInput.textContent = "";

        if(message.length > 0 && results.length > 0){
            this.renderDuxMessageFor(message, promptMessage);
        }else{
            this.renderDuxMessageFor(message, `Give me a response to the input ${message} with a limit of 50 words`, 'free-response')
        }

    }

    // async playVoice(text, apiKey){
    //     const response = await generateTextToAudioFor(text, this.apiKey);
    //     playAudioFileFromResponse(response);
        
            


    // }
    async  playVoice(text, _) {
        // Detect language for the main text
        const language = detectLanguage(text);
        let introText = introTextEnglish; // Default to English intro
        let introVoice = introVoiceEnglish; // Default to English voice
    
        if (language === 'Turkish') {
            introText = introTextTurkish; // Switch to Turkish intro if text is in Turkish
            introVoice = introVoiceTurkish; // Set to Turkish voice if text is detected as Turkish
        }
    
        // Split the main text into sentences based on punctuation marks
        let sentences = text.split(/(?<=[.!?])/).filter(sentence => sentence.trim() !== '');
    
        console.log('Detected language:', language);
        console.log('Selected voice:', introVoice);
    
        return new Promise(resolve => {
            const speakMainText = () => {
                const speakNextSentence = (index) => {
                    if (index < sentences.length) {
                        isLastSentenceSpoken = false;
                        currentSentenceIndex = index;
    
                        responsiveVoice.speak(sentences[index].trim(), introVoice, {
                            onstart: function() {
                                speakButton.src = talkingGif;
                            },
                            onend: function() {
                                isLastSentenceSpoken = (index === sentences.length - 1);
                                // Ensure the silent GIF shows only after all sentences are spoken and voice has stopped
                                if (isLastSentenceSpoken) {
                                    setTimeout(() => {
                                        speakButton.src = silentGif;
                                        resolve(); // Resolve the promise when the last sentence is done
                                    }, 500); // Adjust the delay as needed
                                } else {
                                    setTimeout(() => {
                                        speakButton.src = silentGif;
                                        setTimeout(() => {
                                            speakNextSentence(index + 1); // Speak the next sentence
                                        }, 700); // Delay before starting the next sentence
                                    }, 100); // Short delay to handle GIF change
                                }
                            }
                        });
                    } else {
                        speakButton.src = silentGif; // Set the silent GIF after all sentences are spoken
                        resolve();
                    }
                };
    
                speakNextSentence(0); // Start speaking the first sentence of the main text
            };
    
            if (!introSpoken) {
                responsiveVoice.speak(introText, introVoice, {
                    onstart: function() {
                        speakButton.src = talkingGif;
                    },
                    onend: function() {
                        introSpoken = true; // Mark the introduction as spoken
                        speakMainText(); // Proceed to speak the main text
                    }
                });
            } else {
                speakMainText(); // Skip the intro and directly speak the main text
            }
        });
    };

    renderDuxMessageFor(message, promptMessage, type){

        console.log("hellooo");

        const loader = `
        <div class="dux-message-loader">
            <div class="sk-flow">
                <div class="sk-flow-dot"></div>
                <div class="sk-flow-dot"></div>
                <div class="sk-flow-dot"></div>
            </div>
        </div>`;

        const duxMessageContainer = document.createElement("li");
        duxMessageContainer.className = "foreign foreign-a";

        const duxIcon = document.createElement("div");
        duxIcon.className = "name-tag";
        duxIcon.textContent = "DU";

        const duxMessageText = document.createElement("div");
        duxMessageText.className = "message-text";
        duxMessageText.innerHTML = loader;

        const duxListenButton = document.createElement("div");
        duxListenButton.className = "play-button";

        const duxListenIcon = document.createElement("img");
        duxListenIcon.src = "../assets/icons/speaker.png";
        duxListenButton.append(duxListenIcon);

        const responseBadge = document.createElement("div");
        responseBadge.className = "response-badge";
        responseBadge.textContent = "from books";

        if(type == "free-response") responseBadge.textContent = "free response";

        duxMessageText.innerHTML = loader;

        duxMessageContainer.append(duxIcon);
        duxMessageContainer.append(duxMessageText);
        duxMessageContainer.append(duxListenButton);
        this.messagesView.append(duxMessageContainer);

        // fetch message;

        if(type != "forced") ( async() => {

            duxMessageContainer.appendChild(responseBadge);
            
            console.log("message sent: ", message);

            let responseMessage = await generateGPTResponseFor(message, this.apiKey);
            duxListenButton.addEventListener("click", () => this.playVoice(responseMessage))
            console.log(responseMessage);

            setTimeout(() => {
                duxMessageText.innerHTML = "";
                duxMessageText.textContent = responseMessage;
            },2000);
        })()
        else {
            duxMessageText.textContent = message;
            duxListenButton.addEventListener("click", () => this.playVoice(message))

        }

    }
}

async function generateGPTResponseFor(prompt, apiKey) {

    const endpoint = 'https://api.openai.com/v1/chat/completions';

    try {

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                    role: 'system',
                    content: 'You are a helpful assistant.'
                    },
                    {
                    role: 'user',
                    content: prompt
                    }
                ]
            })
        });

        const data = await response.json();
        console.log('HERE IS DATA FROM GPT: ', data);
        return data.choices[0].message.content;

    } catch (error) {
        console.error('Error fetching response:', error);
        return null;
    }
}

// voice

function generateTextToAudioFor(input, apiKey) {

    return new Promise( async(resolve, reject) => {

        const endpoint = 'https://api.openai.com/v1/audio/speech';

        try {

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'tts-1',
                    voice: 'onyx',
                    input: input,
                    speed: '0.95',
                    stream: true
                })
            });

            let audioCtx = new AudioContext();
            let buffer = await audioCtx.decodeAudioData(await response.arrayBuffer());
            resolve({ audioCtx, buffer });

        } catch (error) {
            reject(error);
        }

    })
}

async function playAudioFileFromResponse({ audioCtx, buffer }){

    try {

        let source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();

    }
    catch(error){
        console.log("HMMM")
    }
}








// Define the talking and silent GIF URLs
const talkingGif = "../assets/images/DuxTalk3.gif";
const silentGif = "../assets/images/secoSpritesilent.gif";

// Get the speak button element
const speakButton = document.getElementById('speakButton');

// Define the intro text and voice
const introTextEnglish = 'Hello, I will read the text for you.';
const introTextTurkish = 'Merhaba, metni size okuyacağım.';
const introVoiceEnglish = 'UK English Male';
const introVoiceTurkish = 'Turkish Male';

// Define the API key (replace with your actual API key)
// const apiKey = 'NVbGYm7d';

// Flag to track if the intro has been spoken
let introSpoken = false;

// Flag to track if the last sentence has been spoken
let isLastSentenceSpoken = false;

// Current sentence index
let currentSentenceIndex = 0;

// Function to detect the language of the text
function detectLanguage(text) {
    // Implement your language detection logic here
    // For demonstration purposes, assume the language is Turkish if the text contains 'Merhaba'
    return text.includes('Merhaba') ? 'Turkish' : 'English';
}

// Function to play the voice


// Function to create delay using Promise
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

