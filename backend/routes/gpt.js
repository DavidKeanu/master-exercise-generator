const express = require('express');
const openai = require('openai');
const router = express.Router();
const util = require('util');
const {USER_PROMPT_COMPILE_ERROR, SYSTEM_PROMPT_COMPILE_ERROR,
  USER_PROMPT_EXPLAIN_CODE_WITH_ASSIGNMENT, USER_PROMPT_EXPLAIN_CODE, SYSTEM_PROMPT_EXPLAIN_CODE,
  SYSTEM_PROMPT_GENERATE_TASK
} = require("../constants/GptPrompts");
const {getTask} = require("../constants/PrompsExcerciseGenerator");
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

router.post('/generateTask', async (req, res) => {

  const modelToUse = process.env.DEFAULT_CHAT_GPT_MODEL;

  console.log("test", req.body);

  console.log("schwierigkeitsgrad", req.body.schwierigkeitsgrad);

  const aufgabentyp = req.body.aufgabentyp;
  const schwierigkeitsgrad = req.body.schwierigkeitsgrad;

  const aufgabentyp2 = getTask(aufgabentyp);
  console.log(aufgabentyp2);

  const chatHistory = [
    { role: 'system', content: 'Du bist ein hilfreiches Programm und sollst Programmieraufgaben für Anfänger generieren.' },
    { role: 'assistant', content: 'Deklariere eine Variable mit dem Variablennamen `zahl` vom Datentyp `int` und initialisiere sie mit dem Wert 5.' },
    { role: 'user', content: 'Das ist eine gute Aufgabe für Anfänger, weil sie leicht ist.' },
    { role: 'assistant', content: 'Bestimme den Datentyp und den Wert der folgenden Ausdrücke: 7 % 2'},
    { role: 'user', content: 'Das ist eine gute Aufgabe für Anfänger, weil sie mittel ist.'},
    { role: 'system', content: 'Generiere eine komplett neue Aufgaben, die gut für Anfänger ist!' },
  ];


  try {
    const response = await openaiApi.createChatCompletion({
      model: modelToUse,
      messages:
        chatHistory,
      temperature: 0.2
    });
    const gptResponse = response.data.choices[0].message.content;

    res.json({ message: gptResponse });
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
