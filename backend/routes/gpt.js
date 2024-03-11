const express = require('express');
const openai = require('openai');
const router = express.Router();
const util = require('util');
const {
    USER_PROMPT_COMPILE_ERROR, SYSTEM_PROMPT_COMPILE_ERROR,
    USER_PROMPT_EXPLAIN_CODE_WITH_ASSIGNMENT, USER_PROMPT_EXPLAIN_CODE, SYSTEM_PROMPT_EXPLAIN_CODE,
    SYSTEM_PROMPT_GENERATE_TASK, USER_PROMPT_SOLUTION_CODE_WITH_ASSIGNMENT, SYSTEM_PROMPT_SOLUTION
} = require("../constants/GptPrompts");
const {mapTaskToChathistory, generatePromptHistory} = require("../service/GenerateTaskService");
require('dotenv').config();


const config = new openai.Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openaiApi = new openai.OpenAIApi(config);

/**
 * Endpoint for "Fehlerinspektor" in frontend.
 * Calls the gpt api with system and user prompt to generate a better error message.
 * ---
 * Required: Code and compile error.
 * Optional: Gpt model id to use a specific gpt model
 * Returns: Generated better error message
 */
router.post('/compiler-error', async (req, res) => {
    const {code, error, model} = req.body;
    const modelToUse = model || process.env.DEFAULT_CHAT_GPT_MODEL;

    try {
        const response = await openaiApi.createChatCompletion({
            model: modelToUse,
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT_COMPILE_ERROR
                },
                {
                    role: 'user',
                    content: util.format(USER_PROMPT_COMPILE_ERROR, code, error)
                }
            ]
        });
        res.json({message: response.data.choices[0].message.content});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

/**
 * Endpoint to retrieve current gpt models.
 * ---
 * Returns: list of all current gpt model ids
 */
router.get('/models', async (req, res) => {
    try {
        const response = await openaiApi.listModels();
        const gptModels = response.data.data
            .filter(item => item.id.includes('gpt'))
            .map(item => item.id);
        res.json({models: gptModels});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.post('/generateTask', async (req, res) => {
    // TODO: change model conditially
    const modelToUse = process.env.DEFAULT_CHAT_GPT_MODEL;
    const collectionName = 'exercises';

    // Extract mappedData to a constant
    const chatHistory = await generatePromptHistory(collectionName, req);
    console.log("ChatHistory - Backend");
    console.log(chatHistory);

    try {
        const response = await openaiApi.createChatCompletion({
            //'gpt-4-turbo-preview'
            model: modelToUse,
            messages: chatHistory,
            temperature: 0.9
        });
        const gptResponse = response.data.choices[0].message.content;

        const task = {
            task: gptResponse,
            aufgabentyp: req.body.aufgabentyp,
            schwierigkeitsgrad: req.body.schwierigkeitsgrad,
            experience: req.body.experience
        }

        res.status(200).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.post('/solution', async (req, res) => {
    const modelToUse = process.env.DEFAULT_CHAT_GPT_MODEL;
    const promptToUse = util.format(USER_PROMPT_SOLUTION_CODE_WITH_ASSIGNMENT, req.body.code, req.body.aufgabe)
    console.log(promptToUse);
    try {
        const response = await openaiApi.createChatCompletion({
            model: modelToUse,
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT_SOLUTION
                },
                {
                    role: 'user',
                    content: promptToUse
                }
            ],
            temperature: 0.2
        });
        const gptResponse = response.data.choices[0].message.content;

        res.status(200).json(gptResponse);
    } catch (err) {

    }
});
/**
 * Endpoint for "Fehlerkommentator" in frontend.
 * Calls the gpt api with system and user prompt to let gpt explain user code.
 * ---
 * Required: Code
 * Optional gpt model, assignment
 * Returns: Code explanation
 */
router.post('/explain', async (req, res) => {
    const {code, assignment, model} = req.body;
    const modelToUse = model || process.env.DEFAULT_CHAT_GPT_MODEL;
    console.log(modelToUse);

    const promptToUse = assignment
        ? util.format(USER_PROMPT_EXPLAIN_CODE_WITH_ASSIGNMENT, code, assignment)
        : util.format(USER_PROMPT_EXPLAIN_CODE, code);

    try {
        const response = await openaiApi.createChatCompletion({
            model: modelToUse,
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT_EXPLAIN_CODE
                },
                {
                    role: 'user',
                    content: promptToUse
                }
            ],
            temperature: 0.2
        });
        const gptResponse = response.data.choices[0].message.content;

        res.json({message: gptResponse});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;
