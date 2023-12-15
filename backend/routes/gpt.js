const express = require('express');
const openai = require('openai');
const router = express.Router();
const util = require('util');
const {loadMistakesAsMarkdown, addFehler, load, loadFehlerhistorieAsMarkdown} = require("../services/dbService");
const {USER_PROMPT_COMPILE_ERROR, SYSTEM_PROMPT_COMPILE_ERROR,
  USER_PROMPT_EVALUATE_WITH_ASSIGNMENT_DEFAULT, USER_PROMPT_EXPLAIN_CODE_WITH_ASSIGNMENT, USER_PROMPT_EXPLAIN_CODE,
  SYSTEM_PROMPT_EXPLAIN_CODE, USER_PROMPT_EVALUATE_DEFAULT, SYSTEM_PROMPT_EVALUATION_FIND_MISTAKES, USER_PROMPT_EVALUATE_HELP,
  USER_PROMPT_EVALUATE_HELP_WITH_ASSIGNMENT,
  SYSTEM_PROMPT_EVALUATE_HELP
} = require("../constants/GptPrompts");
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
  const { code, error, model } = req.body;
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
    res.json({ message: response.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.json({ models: gptModels });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Endpoint for "Evaluierer" in frontend.
 * Calls the gpt api with system and user prompt to evaluate user code.
 * ---
 * Required: Code, session
 * Optional: gpt model, assignment
 * Returns: Generated evaluation in json format
 */
router.post('/evaluate', async(req, res) => {
  const { code, model, assignment, session } = req.body;
  const modelToUse = model || process.env.DEFAULT_CHAT_GPT_MODEL;

  const markdownMistakes = await loadMistakesAsMarkdown();

  try {
    const response = await openaiApi.createChatCompletion({
      model: modelToUse,
      messages: [
        {
          role: 'system',
          content: util.format(SYSTEM_PROMPT_EVALUATION_FIND_MISTAKES, markdownMistakes)
        },
        {
          role: 'user',
          content: assignment ? util.format(USER_PROMPT_EVALUATE_WITH_ASSIGNMENT_DEFAULT, code, assignment) : util.format(USER_PROMPT_EVALUATE_DEFAULT, code)
        }
      ]
    });
    const gptResponse = response.data.choices[0].message.content;

    await addFehler(gptResponse, session);

    try {
      const fehlerhistorie = await loadFehlerhistorieAsMarkdown(session);

      const response2 = await openaiApi.createChatCompletion({
        model: modelToUse,
        messages: [
          {
            role: 'system',
            content: util.format(SYSTEM_PROMPT_EVALUATE_HELP, fehlerhistorie)
          },
          {
            role: 'user',
            content: assignment ? util.format(USER_PROMPT_EVALUATE_HELP_WITH_ASSIGNMENT, code, assignment) : util.format(USER_PROMPT_EVALUATE_HELP, code)
          }
        ]
      });

      res.json({ evaluation: response2.data.choices[0].message.content });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }

    //res.json({ evaluation: gptResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
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
  const { code, assignment, model } = req.body;
  const modelToUse = model || process.env.DEFAULT_CHAT_GPT_MODEL;

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

    res.json({ message: gptResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
