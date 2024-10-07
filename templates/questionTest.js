let string = "{\"id\":\"lumgcr9e\",\"title\":\"Water Theory\",\"time\":{\"timeStart\":\"2024-04-27T00:00:00.000Z\",\"timeFinish\":null,\"hierarchy\":\"1\"},\"hierarchy\":\"1\",\"subtopics\":[{\"id\":\"lumgcy6b\",\"title\":\"Water basics\",\"hierarchy\":\"1\",\"resources\":[{\"id\":\"lvanx0vs\",\"type\":\"application/pdf\",\"title\":\"Bees.pdf\",\"value\":\"1713772530.pdf\",\"subtopicID\":\"lumgcy6b\",\"estimatedTime\":null},{\"id\":\"lw929i53\",\"type\":\"image/png\",\"title\":\"apple2.png\",\"value\":\"1715852478.png\",\"subtopicID\":\"lumgcy6b\",\"estimatedTime\":null}]},{\"id\":\"lw926tvu\",\"title\":\"Basics 2\",\"hierarchy\":\"2\",\"resources\":[{\"id\":\"lw927kti\",\"type\":\"application/pdf\",\"title\":\"Swift Vs Python: Which Language is Better?.pdf\",\"value\":\"1715852387.pdf\",\"subtopicID\":\"lw926tvu\",\"estimatedTime\":null}]},{\"id\":\"lw92704y\",\"title\":\"Learning How it Flows\",\"hierarchy\":\"3\",\"resources\":[{\"id\":\"lw928zpa\",\"type\":\"image/png\",\"title\":\"blueberry2.png\",\"value\":\"1715852449.png\",\"subtopicID\":\"lw92704y\",\"estimatedTime\":null}]}],\"quizzes\":[{\"id\":\"lwemgenx\",\"courseID\":\"undefined\",\"lectureID\":\"lumgcr9e\",\"name\":\"Quiz on Water basics, Basics 2, Learning How it Flows\",\"filename\":\"Quiz-2t6m4cazvlwemgatd.json\",\"dateGenerated\":\"2024-05-20T07:05:17.657Z\",\"hierarchy\":null,\"totalMarks\":\"10\"}]}"

let lecture = JSON.parse(string);

async function generateGPTResponseFor(prompt) {

    let apiKey = 'removed-key'

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
                ],
                response_format: {"type": "json_object"}
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

async function generateQuestion(lectureObject, refresh = true, type = "multiple choice question", level="extremely difficult"){

    // let loader = loadLoader("Generating Quiz");

    let languages=["english", "turkish"];
    let amount = 4;

    let lectureID = lectureObject.id;
    let lectureTitle = lectureObject.title;
    let courseID = lectureObject.courseID;
    let subtopicTitles = lectureObject.subtopics
    .map( subtopic => subtopic.title ).join(", ");

    let topic = subtopicTitles;
    let educationEnvironment = "college students";

    let query = 
    `Please create ${amount} questions in valid JSON format using ISO encoding, with both the questions and their answers written in ${languages.join(", ")}. The questions should cover the topic of ${topic} and be suitable for ${educationEnvironment}.
    
    Each question should be in ${type} format, including its respective answer options and the correct answer. Ensure the difficulty level is ${level}.
    
    The JSON format must include the following keys: 
    - "question": The text of the question
    - "answerOptions": The list of answer choices (only for multiple choice or true/false)
    - "answer": The correct answer
    - "type": The question format (multiple choice, true/false, etc.)
    - "hardness": The difficulty level of the question.
    
    Please ensure no invalid characters are included in the response.`
    

    let unparsedJSONResponse = await generateGPTResponseFor(query);
    let questions = await JSON.parse(unparsedJSONResponse);
    console.log("questions: ", questions);

    let filename = `Quiz-${uniqueID(2)}.json`;
    saveAssessmentAsJSON(filename, questions.questions, "generated");

    let quizID = uniqueID(1);
    let name = `Quiz on ${subtopicTitles}`; // ...
    let dateGenerated = getCurrentTimeInJSONFormat();
    let hierarchy = ""; // ...
    let totalMarks = questions.questions.length; //TODO: figure out the marks properly...

    let params = `id=${quizID}&&courseID=${courseID}&&lectureID=${lectureID}&&name=${name}`+
    `&&dateGenerated=${dateGenerated}&&filename=${filename}&&totalMarks=${totalMarks}`;

    let response = await AJAXCall({
        phpFilePath: "../include/quiz/addNewQuiz.php",
        rejectMessage: "New Quiz Failed To Add",
        params,
        type: "post"
    });

    console.log("quiz generation response: ", response);

    setTimeout(() => {
        if(refresh) refreshTeacherCourseOutline(); //Bugs???
        removeLoader(loader);
    }, 2000);
    
}

generateQuestion(lecture)