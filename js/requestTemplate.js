const requestBody = {
    model: "gpt-4o",
    messages: [
        {
            role: "system" as const,
            content: `You are an AI system tasked with generating high-quality exam questions in strict compliance with JSON formatting. Ensure all JSON output is valid and structured exactly as requested.Ensure the response adheres to these JSON rules:
                    1. The JSON must represent an object or array.
                    2. All keys must be strings enclosed in double quotes ("key").
                    3. All strings must be enclosed in double quotes. Escape special characters using a backslash:
                      - Use \\ for backslash, \" for double quotes, \\n for newlines, etc.
                    4. Arrays should contain valid JSON values (e.g., strings, numbers, objects, arrays, true, false, null) and must not have trailing commas.
                    5. No trailing commas are allowed in objects or arrays.
                    6. Numbers must not have leading zeros unless the value is exactly zero, and must not be enclosed in quotes.
                    7. Boolean values and null must not be quoted (e.g., "true" is invalid, true is valid).
                    8. Avoid invalid characters or unescaped sequences. Use UTF-8 encoding.
                    9. Properly close all braces and brackets. JSON must be well-formed and free of truncation issues.
                    10.the output must be in proper json format and no extra characters before or after the json is allowed`,
        },
        {
            role: "user" as const,
            content: `Create a 10 question exam for the subject ${lecture.title} in this language ${course?.language}.Format the output as valid JSON with the following structure:
            {
                "questions": [
                    {
                        "section" : "string from these options : multiple-choice , fill-in-the-blank , true/false , classic",
                        "question": "string",
                        "options": ["option1", "option2", "option3", "option4"],
                        "answer": "correct answer"
                    }
                ]

                
            }
      
            Relevant Content from Course Resources:
            ${concatenatedContent}`,
        },
    ],
    max_tokens: 800,
};