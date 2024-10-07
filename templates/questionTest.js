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

async function generateQuestion(generateQuestionObject, amount){

    const { 
        type,
        languages,
        educationEnvironment,
        level,
        topics
    } = generateQuestionObject;

    // TODO: Mickey #1
    // Everything can be generated, but it will go through a validator
    // The validator may/will include
    // * Error Checkers
    // * Comparators
    // * Matchers
    // * Encoders/Decoders
    // * Loggers

    // TODO: Mickey #2
    // Make a ReGenerate () Function that will be able to regenerate the
    // results of just one question

    // TODO: Mickey #3
    // Create premade structure to fill in data and ensure integrity of
    // a json file. Invalid JSON files should be logged.

    // TODO: Mickey #4
    // Abstract long generations as classes and ensure all of them have
    // this new validation process.

    // TODO: Mickey #5
    // Document all findings.


    let query = 
    `create for me in valid json format using ISO encoding, ${amount} questions with the keywords 'questions' in the ${languages.map( language => `${language}`).join("and ")} as well as their answers 
    in the ${languages.map( language => `${language}`).join("and ")} with those exact key names in the topics of ${topics} 
    for ${educationEnvironment}. 

    The questions should be ${type} with its respective answer choices as well in the languages types ${languages.map( language => `${language}`).join("and ")}
    as well as the correct answer option in ${languages.map( language => `${language}`).join("and ")}.

    The questions should be ${level}.

    The json format should have the following keys, 
    "question, answerOptions, answer, type, hardness". 

    question, answerOptions and answer should all come with the ${languages.map( language => `${language}`).join("and ")}

    The answerOptions should only be available if the 
    question type is multiple choice or true and false.

    Do not add any invalid characters in the result please.`;

    let unparsedJSONResponse = await generateGPTResponseFor(query);
    let result = await JSON.parse(unparsedJSONResponse);

    try{
        if(result.questions) return result.questions
        else if(result.question) return result.question
        else if(result.questions.questions) return result.questions.questions
        else return result
    }catch(error){
        console.log(error);
    }

}

generateQuestion(lecture)