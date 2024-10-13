let string =
  '{"id":"lumgcr9e","title":"Water Theory","time":{"timeStart":"2024-04-27T00:00:00.000Z","timeFinish":null,"hierarchy":"1"},"hierarchy":"1","subtopics":[{"id":"lumgcy6b","title":"Water basics","hierarchy":"1","resources":[{"id":"lvanx0vs","type":"application/pdf","title":"Bees.pdf","value":"1713772530.pdf","subtopicID":"lumgcy6b","estimatedTime":null},{"id":"lw929i53","type":"image/png","title":"apple2.png","value":"1715852478.png","subtopicID":"lumgcy6b","estimatedTime":null}]},{"id":"lw926tvu","title":"Basics 2","hierarchy":"2","resources":[{"id":"lw927kti","type":"application/pdf","title":"Swift Vs Python: Which Language is Better?.pdf","value":"1715852387.pdf","subtopicID":"lw926tvu","estimatedTime":null}]},{"id":"lw92704y","title":"Learning How it Flows","hierarchy":"3","resources":[{"id":"lw928zpa","type":"image/png","title":"blueberry2.png","value":"1715852449.png","subtopicID":"lw92704y","estimatedTime":null}]}],"quizzes":[{"id":"lwemgenx","courseID":"undefined","lectureID":"lumgcr9e","name":"Quiz on Water basics, Basics 2, Learning How it Flows","filename":"Quiz-2t6m4cazvlwemgatd.json","dateGenerated":"2024-05-20T07:05:17.657Z","hierarchy":null,"totalMarks":"10"}]}';

let lecture = JSON.parse(string);
let topics = lecture.subtopics.map((subtopic) => subtopic.title).join(", ");
// console.log(`topics: ${topics}`);

async function generateGPTResponseFor(prompt) {
  let apiKey = "";

  const endpoint = "https://api.openai.com/v1/chat/completions";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    console.log("HERE IS DATA FROM GPT: ", data);
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching response:", error);
    return null;
  }
}

async function generateQuestion(generateQuestionObject, amount = 1) {
  const { type, languages, educationEnvironment, level, topics } =
    generateQuestionObject;

  const shortHandLanguages = getShortHandsFor(languages);

  // TODO: Mickey #1
  // Everything can be generated, but it will go through a validator
  // The validator may/will include
  // * Error Checkers
  // * Comparators ✅
  // * Matchers ✅
  // * Encoders/Decoders
  // * Loggers

  // TODO: Mickey #2
  // Make a ReGenerate () Function that will be able to regenerate the
  // results of just one question

  // TODO: Mickey #3 ++DONE
  // Create premade structure to fill in data and ensure integrity of
  // a json file. Invalid JSON files should be logged.

  // TODO: Mickey #4
  // Abstract long generations as classes and ensure all of them have
  // this new validation process.

  // TODO: Mickey #5
  // Document all findings.

  let query = `create for me in valid json format using ISO encoding, ${amount} questions with the keywords 'questions' in the ${languages
    .map((language) => `${language}`)
    .join("and ")} as well as their answers 
      in the ${languages
        .map((language) => `${language}`)
        .join("and ")} with those exact key names in the topics of ${topics} 
      for ${educationEnvironment}. 
  
      The questions should be ${type} with its respective answer choices as well in the languages types ${languages
    .map((language) => `${language}`)
    .join("and ")}
      as well as the correct answer option in ${languages
        .map((language) => `${language}`)
        .join("and ")}.
  
      The questions should be ${level}.
  
      The json format should have the following keys, 
      "question, answerOptions, answer, type, hardness". 
  
      question, answerOptions and answer should all come with the ${languages
        .map((language) => `${language}`)
        .join("and ")}
  
      The answerOptions should only be available if the 
      question type is multiple choice or true and false.
  
      Do not add any invalid characters in the result please.`;

  let unparsedJSONResponse = await generateGPTResponseFor(query);
  let result = await JSON.parse(unparsedJSONResponse);

  try {
    if (result.questions) result = result.questions;
    else if (result.question) result = result.question;
    else if (result.questions.questions) result = result.questions.questions;
    else result = result;
  } catch (error) {
    console.log(error);
  }

  console.log("1. passed result from GPT");

  // FROM HERE WE ARE VALIDATING;

  console.log("2. Starting Promise");

  return new Promise((resolve, reject) => {
    let conformedResults = [];

    console.log("3. For Loop of Question Object Start");

    result.forEach((questionObject) => {
      conformedResults.push(
        conformToStructure({
          questionObject,
          type,
          languages,
          shortHandLanguages,
        })
      );
    });

    console.log("4. For Loop of Question Object End");

    resolve(conformedResults);
  });
}

function conformToStructure({
  questionObject,
  type,
  languages,
  shortHandLanguages,
}) {
  switch (type) {
    case "MultipleChoiceQuestion":
      return validateMultipleChoiceQuestion({
        questionObject,
        languages,
        shortHandLanguages,
      });
    case "FillInTheBlankQuestion":
      return validateFillInTheBlankQuestion({
        questionObject,
        languages,
        shortHandLanguages,
      });
    case "TrueAndFalseQuestion":
      return validateTrueAndFalseQuestion({
        questionObject,
        languages,
        shortHandLanguages,
      });
    default:
      break;
  }

  function questionComparator(
    question,
    language,
    shortHandLanguages,
    index,
    conformedQuestion
  ) {
    if (question[language]) {
      if (question[language].length > 1) {
        conformedQuestion[language] = question[language];
      } else {
        /* regenerateQuestion() */
      }
    } else {
      if (question[shortHandLanguages[index]]) {
        if (question[shortHandLanguages[index]].length > 1) {
          conformedQuestion[language] = question[shortHandLanguages[index]];
        }
      }
      {
        /* regenerateQuestion() */
      }
    }
  }

  function answerComparator(
    answer,
    language,
    shortHandLanguages,
    index,
    conformedAnswer
  ) {
    console.log(`shortHands: `, shortHandLanguages);

    if (answer[language]) {
      if (answer[language].length > 1) {
        conformedAnswer[language] = answer[language];
      } else {
        /* regenerateAnswer */
      }
    } else {
      if (answer[shortHandLanguages[index]]) {
        if (answer[shortHandLanguages[index]].length > 1) {
          conformedAnswer[language] = answer[shortHandLanguages[index]];
        }
      }
      // regenerateAnswer()
    }
  }

  function validateMultipleChoiceQuestion({
    questionObject,
    languages,
    shortHandLanguages,
  }) {
    console.log("3.1 MCP QuestionObject.question ");
    const question = questionObject.question || null;
    console.log("3.2 MCP QuestionObject.answerOptions ");
    const answerOptions = questionObject.answerOptions || {};
    console.log("3.3 MCP QuestionObject.answer ");
    const answer = questionObject.answer || null;
    const hardness = questionObject.hardness || "unknown";

    let conformedQuestion = generateEmptyLanguageTemplateObject(
      languages,
      "...?"
    );

    let conformedAnswerOptions = generateEmptyLanguageTemplateObject(
      languages,
      ["A", "B", "C", "D"]
    );

    let conformedAnswer = generateEmptyLanguageTemplateObject(languages, "...");

    languages.forEach((_langugage, index) => {
      const language = _langugage.toLowerCase();

      questionComparator(
        question,
        language,
        shortHandLanguages,
        index,
        conformedQuestion
      );

      if (answerOptions[language]) {
        if (answerOptions[language].length > 1) {
          conformedAnswerOptions[language] = answerOptions[language];
        } else {
          {
            /* regenerateAnswerOptions() */
          }
        }
      } else {
        if (answerOptions[shortHandLanguages[index]]) {
          if (answerOptions[shortHandLanguages[index]].length > 1) {
            conformedAnswerOptions[language] =
              answerOptions[shortHandLanguages[index]];
          }
        }
        /* regenerateAnswerOptions() */
      }

      answerComparator(
        answer,
        language,
        shortHandLanguages,
        index,
        conformedAnswer
      );
    });

    console.log("3.4 MCP Comparators Finished");

    return MultipleChoiceQuestionStructure({
      questionObject: conformedQuestion,
      answerOptionsObject: conformedAnswerOptions,
      correctAnswerObject: conformedAnswer,
      hardness,
    });
  }

  function validateFillInTheBlankQuestion({
    questionObject,
    languages,
    shortHandLanguages,
  }) {
    console.log("3.1 FITB QuestionObject.question ");
    const question = questionObject.question || null;
    console.log("3.2 FITB QuestionObject.answer ");
    const answer = questionObject.answer || null;
    const hardness = questionObject.hardness || "unknown";

    let conformedQuestion = generateEmptyLanguageTemplateObject(
      languages,
      "...?"
    );
    let conformedAnswer = generateEmptyLanguageTemplateObject(languages, "...");

    languages.forEach((_langugage, index) => {
      const language = _langugage.toLowerCase();

      questionComparator(
        question,
        language,
        shortHandLanguages,
        index,
        conformedQuestion
      );

      answerComparator(
        answer,
        language,
        shortHandLanguages,
        index,
        conformedAnswer
      );
    });

    console.log("3.3 FITB Comparators Finished ");

    return FillInTheBlankQuestionStructure({
      questionObject: conformedQuestion,
      correctAnswerObject: conformedAnswer,
      hardness,
    });
  }

  function validateTrueAndFalseQuestion({
    questionObject,
    languages,
    shortHandLanguages,
  }) {
    console.log("3.1 TAF QuestionObject.question ");
    const question = questionObject.question || null;
    console.log("3.2 TAF QuestionObject.answer ");
    const answer = questionObject.answer || null;
    const hardness = questionObject.hardness || "unknown";

    let conformedQuestion = generateEmptyLanguageTemplateObject(
      languages,
      "...?"
    );
    let conformedAnswerOptions =
      generateTrueAndFalseAnswerOptionsBasedOn(languages);
    let conformedAnswer = generateEmptyLanguageTemplateObject(languages, "...");

    languages.forEach((_langugage, index) => {
      const language = _langugage.toLowerCase();
      questionComparator(
        question,
        language,
        shortHandLanguages,
        index,
        conformedQuestion
      );
      answerComparator(
        answer,
        language,
        shortHandLanguages,
        index,
        conformedAnswer
      );
    });

    console.log("3.3 TAF Comparators Finished ");

    return TrueAndFalseQuestionStructure({
      questionObject: conformedQuestion,
      answerOptionsObject: conformedAnswerOptions,
      correctAnswerObject: conformedAnswer,
      hardness,
    });
  }
}

function generateEmptyLanguageTemplateObject(languages, emptiness) {
  let result = {};
  languages.forEach(
    (language) => (result = { ...result, [language]: emptiness })
  );
  return result;
}

function generateTrueAndFalseAnswerOptionsBasedOn(languages) {
  let answerOptionsDictionary = fetchTrueAndFalseAnswerOptionsDictionary();

  let answerOptions = {};

  languages.forEach((language) => {
    answerOptions[language] = [...answerOptionsDictionary[language]];
  });

  return answerOptions;
}

function MultipleChoiceQuestionStructure({
  questionObject,
  answerOptionsObject,
  correctAnswerObject,
  hardness,
}) {
  return {
    id: uniqueID(1),
    question: questionObject,
    answerOptions: answerOptionsObject,
    correctAnswer: correctAnswerObject,
    type: "MultipleChoiceQuestion",
    hardness,
    marksWorth: 1,
  };
}

function FillInTheBlankQuestionStructure({
  questionObject,
  correctAnswerObject,
  hardness,
}) {
  return {
    id: uniqueID(1),
    question: questionObject,
    correctAnswer: correctAnswerObject,
    type: "FillInTheBlankQuestion",
    hardness,
    marksWorth: 1,
  };
}

function TrueAndFalseQuestionStructure({
  questionObject,
  answerOptionsObject,
  correctAnswerObject,
  hardness,
}) {
  return {
    id: uniqueID(1),
    question: questionObject,
    answerOptions: answerOptionsObject,
    correctAnswer: correctAnswerObject,
    type: "TrueAndFalseQuestion",
    hardness,
    marksWorth: 1,
  };
}

function getShortHandsFor(languages) {
  const shortHandDictionary = fetchShortHandDictionary();

  let answerOptions = [];

  languages.forEach((language) =>
    answerOptions.push(shortHandDictionary[language])
  );

  return answerOptions;
}

function uniqueID(strength = 2) {
  const date = Date.now() + getRandomArbitrary(0, 9999);
  const dateReversed = parseInt(String(date).split("").reverse().join(""));
  const base36 = (number) => number.toString(36);
  if (strength == 1) return base36(date);
  if (strength == -1) return base36(dateReversed);
  return base36(dateReversed) + base36(date);

  // return crypto.randomUUID().split("-").join("");
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

(async () => {
  let generateQuestionObject = {
    type: "MultipleChoiceQuestion",
    languages: ["english", "turkish"],
    educationEnvironment: "College Students",
    level: "Difficult",
    topics,
  };

  let questions = await generateQuestion(generateQuestionObject, 4);
  console.log(questions);
})();

function fetchShortHandDictionary() {
  return {
    english: "en",
    turkish: "tr",
    german: "de",
    ukrainian: "",
    french: "",
    arabic: "",
  };

  //TODO: Finish the dictionary;
}

function fetchTrueAndFalseAnswerOptionsDictionary() {
  return {
    english: ["True", "False"],
    turkish: ["Doğru", "Yanlış"],
    french: ["Fr: True", "Fr: False"],
    russian: ["Ru: True", "Ru: False"],
    german: ["De: True", "De: False"],
  };
}
