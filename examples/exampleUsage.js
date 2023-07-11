import {
    createAiFunctionInstance
} from '../src/aiFunction.js';

import * as dotenv from "dotenv";

dotenv.config();

const aiFunction = createAiFunctionInstance(process.env.OPENAI_API_KEY);


(async () => {
    let options;
    options = {
        functionName: 'generate_quiz',
        args: {
            topic: 'history',
            difficulty: 'medium',
            num_questions: 1
        },
        description: 'Generate N quiz questions with the topic and the difficulty given based on all your knowledge. Return a list of questions and 4 possible answers + the correct answer.',
        funcReturn: {
            quizQuestions: {
                type: "array",
                items: {
                    question: { type: "string" },
                    answers: { type: "array", items: "string" },
                    correct_answer: { type: "string" }
                }
            }
        }
    };

    const quiz = await aiFunction(options);
    console.log(quiz.quizQuestions);
    options = {
        functionName: 'suggest_gifts',
        args: {
            hobbies: 'photography, cooking',
            interests: 'travel, fashion'
        },
        description: 'Suggest gift ideas for someone who loves the given hobbies and interests.',
        funcReturn: {
            giftIdeas: {
                type: "array",
                items: "string[]"
            }
        }
    };

    const giftIdeas = await aiFunction(options);
    console.log(giftIdeas.giftIdeas);
    const messages = [{
            id: 1,
            content: 'Hello, world!'
        },
        {
            id: 2,
            content: 'Offensive message here... I will kill you mf'
        },
        {
            id: 3,
            content: 'Another friendly message.'
        },
    ];

    options = {
        functionName: 'moderate_messages',
        args: messages,
        description: 'Analyze and moderate a list of messages. Return a list of messages with the "content" field updated with bad words changed with "*" to indicate whether the message was flagged for moderation.',
        funcReturn: {
            moderatedMessages: {
                type: "array",
                items: {
                    id: { type: "number" },
                    content: { type: "string" },
                    flagged: { type: "boolean" }
                }
            }
        }
    };

    aiFunction(options).then(moderatedMessages => {
        console.log(moderatedMessages.moderatedMessages);
    });

    let aiData;

    aiData = await aiFunction({
        args: {
            text: "Hello world !",
            to: "de",
        },
        functionName: "translate_text",
        description: "Translate text from one language to another. Use the to arguments to specify destination language. The text is from a game user interface. Return a string with the translated text",
        funcReturn: {
            translated_text: {
                type: "string"
            }
        },
        showDebug: false,
        temperature: 0,
    });
    console.log(aiData.translated_text);

    aiData = await aiFunction({
        args: {
            sentence: "I am a sentence that is too long and I need to be shorten. This is extra information that is not needed, and I want to remove it. Just keep the important information.",
        },
        functionName: "shorten_sentence",
        description: "Rewrite the sentence to a minimum of words without breaking the context or important data. If the sentence can't be shorten, it will return the same sentence.",
        funcReturn: {
            shortened_sentence: {
                type: "string"
            }
        },
        temperature: 0,
    });
    console.log(aiData.shortened_sentence);


})();