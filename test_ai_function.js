const {
    createAiFunctionInstance
} = require('./test-aifunction');
const path = require('path')
require('dotenv').config();

const aiFunction = createAiFunctionInstance(process.env.OPENAI_API_KEY);

const math = require('mathjs');

const showDebug = false;
const numTestToRun = 3;


// Initialize the OpenAI API client
// Make sure to set the OPENAI_API_KEY environment variable

// Run all tests, print the results, and return the number of failed tests
async function runTests(model) {
    const testFunctions = [test1, test2, test4, test5, test6, test7, test8, test9];
    const testNames = [
        'Generate fake people',
        'Generate Random Password',
        'Calculate the nth prime number',
        'Encrypt text',
        'Find missing numbers',
        'Find capital cities',
        'Grammar Correction',
        'Detect language in a text',
    ];
    const numberOfTests = numTestToRun;
    const successRates = [];

    for (let i = 0; i < testFunctions.length; i++) {
        const test = testFunctions[i];
        let successfulTests = 0;
        console.log(`=-=-=- Running test: ${test.name} - ${testNames[i]} with model ${model} -=-=-=`);

        for (let j = 0; j < numberOfTests; j++) {
            try {
                await test(model);
                successfulTests++;
            } catch (error) {
                // Ignore the error as we are counting successful tests
                console.log(error);
            }
        }

        const successRate = (successfulTests / numberOfTests) * 100;
        successRates.push(successRate);
        console.log(`${test.name}: ${successRate.toFixed(2)}% success rate`);
    }

    // Print the total number of tests
    console.log(`Total tests: ${testFunctions.length * numberOfTests}`);

    // Print the success rates for each test
    console.log("Success Rates:");
    for (let i = 0; i < testNames.length; i++) {
        console.log(`${testNames[i]}: ${successRates[i].toFixed(2)}%`);
    }
}


// Ai function test 1
async function test1(model) {
    const randomCount = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    const aiData = await aiFunction({
        args: {
            count_people: randomCount
        },
        functionName: 'fake_people',
        description: 'Generates n examples of fake data representing people, each with a name and an age.',
        funcReturn: {
            peoples: {
                type: "array",
                items: {
                    name: { type: "string" },
                    age: { type: "number" }
                }
            }
        },
        temperature: 1,
        model: model,
        showDebug: showDebug,
        // autoConvertReturn: true,
    });

    const result = aiData.peoples;

    console.log(`Output: ${JSON.stringify(result)}`);

    // Assert the result is a list of dictionaries
    if (!Array.isArray(result)) {
        throw new Error('Result is not an array');
    }

    // Assert the length of the result is equal to the number of people requested
    if (result.length !== randomCount) {
        throw new Error('Result length is not equal to the number of people requested');
    }
}

// Ai function test 2
async function test2(model) {
    const randomLength = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    const specialChar = (Math.random() > 0.5) ? true : false;
    const aiData = await aiFunction({
        args: {
            length: randomLength,
            specialChar: specialChar
        },
        functionName: 'random_string_generator',
        description: 'Generates a strong random string of given length with or without special characters. Just put random characters in a string and it will generate the desired output. ',
        funcReturn: {
            string: {
                type: "object",
                items: {
                    string: { type: "string" },
                    length: { type: "number" },
                }
            }
        },
        temperature: 1,
        model: model,
        showDebug: showDebug,
    });

    const result = aiData.string;

    console.log(`Output: ${result.string} (${result.string.length}) (AI: ${result.length}) | Expected length: ${randomLength} | Special characters: ${specialChar}`);

    // Assert the length of the result is equal to the length requested
    if (result.string.length !== randomLength) {
        throw new Error('Result length is not equal to the length requested');
    }
}

// Ai function test 4
async function test4(model) {
    const result = await aiFunction({
        args: 10,
        functionName: 'get_nth_prime_number',
        description: 'Finds and returns the nth prime number.',
        funcReturn: { type: "number" },
        temperature: 0,
        model: model,
        showDebug: showDebug,
    });

    console.log(`Output: ${result}`);

    // Assert the result is an integer
    if (!Number.isInteger(parseFloat(result))) {
        throw new Error('Result is not an integer');
    }

    // Assert the result is equal to the expected nth prime number
    const expectedPrimeNumber = 29;
    if (parseInt(result) !== expectedPrimeNumber) {
        throw new Error(`Result is not equal to the expected nth prime number, which is: ${expectedPrimeNumber}`);
    }
}

// Ai function test 5
async function test5(model) {
    const aiData = await aiFunction({
        args: ['Hello, World!', 'abc123'],
        functionName: 'encrypt_text',
        description: 'Encrypts the given text using a simple character substitution based on the provided key.',
        // funcReturn: 'str',
        funcReturn: {
            encryptedText: {
                type: "string"
            }
        },
        temperature: 0,
        model: model,
        showDebug: showDebug,
    });

    const result = aiData.encryptedText;

    console.log(`Output: ${result}`);

    // Assert the result has the same length as the input text
    if (result.length !== 'Hello, World!'.length) {
        throw new Error('Result length is not equal to the input text length');
    }
}

// Ai function test 6
async function test6(model) {
    const aiData = await aiFunction({
        args: [
            [3, 5, 8, 15, 16]
        ],
        functionName: 'find_missing_numbers_in_list',
        description: 'Finds and returns a list of missing numbers in a given sorted list.',
        funcReturn: {
            missingNumbers: {
                type: "array",
                items: "number[]"
            }
        },
        temperature: 0,
        model: model,
        showDebug: showDebug,
    });

    const result = aiData.missingNumbers;

    console.log(`Output: ${result}`);

    // Assert the result is an array
    if (!Array.isArray(result)) {
        throw new Error('Result is not an array');
    }

    // Assert the result array contains the expected missing numbers
    const expectedMissingNumbers = [4, 6, 7, 9, 10, 11, 12, 13, 14];
    if (!arraysEqual(result, expectedMissingNumbers)) {
        throw new Error(`Result array does not contain the expected missing numbers`);
    }
}

async function test7(model) {
    const country = 'Italy';
    const aiData = await aiFunction({
        args: {
            country: country
        },
        functionName: 'get_capital_city',
        description: 'This function should return the capital city of the given country.',
        // funcReturn: 'str',
        funcReturn: {
            capitalCity: {
                type: "string"
            }
        },
        temperature: 0,
        model: model,
        showDebug: showDebug,
    });

    const result = aiData.capitalCity;

    console.log(`Output: ${result}`);

    // Assert the result is a string
    if (typeof result !== 'string') {
        throw new Error('Result is not a string');
    }

    // Assert the result is the correct capital city for the given country
    if (result !== 'Rome') {
        throw new Error('Result is not the correct capital city for the given country');
    }
}

async function test8(model) {
    const sentence = 'He are a good person';
    const aiData = await aiFunction({
        args: {
            sentence: sentence
        },
        functionName: 'correct_grammar',
        description: 'This function should correct the grammar of the given sentence.',
        funcReturn: {
            correctedSentence: {
                type: "string",
            }
        },
        temperature: 0,
        model: model,
        showDebug: showDebug,
    });

    const result = aiData.correctedSentence;

    console.log(`Output: ${result}`);

    // Assert the result is a string
    if (typeof result !== 'string') {
        throw new Error('Result is not a string');
    }

    // Assert the result is the grammatically correct version of the input sentence
    if (result !== 'He is a good person') {
        throw new Error('Result is not the grammatically correct version of the input sentence');
    }
}

async function test9(model) {
    const text = 'Hola, ¿cómo estás?';
    const aiData = await aiFunction({
        args: {
            text: text
        },
        functionName: 'detect_language',
        description: 'This function should detect the language of the provided text and return the language code.',
        // funcReturn: 'str',
        funcReturn: {
            languageCode: {
                type: "string"
            }
        },
        temperature: 0,
        model: model,
        showDebug: showDebug,
    });

    const result = aiData.languageCode;

    console.log(`Output: ${result}`);

    // Assert the result is a string
    if (typeof result !== 'string') {
        throw new Error('Result is not a string');
    }

    // Assert the result is the correct language code for the input
    if (result !== 'es') {
        throw new Error('Result is not the correct language code for the input');
    }
}

// Helper function to check if two arrays are equal
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
// Run the tests for both GPT-4 and GPT-3.5-turbo
// runTests('gpt-4');
runTests('gpt-3.5-turbo');