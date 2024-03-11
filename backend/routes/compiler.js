const express = require('express');
const axiosR = require('axios');
const router = express.Router();

const axios = axiosR.create({
  baseURL: process.env.RAPID_API_JUDGE0_URL,
  headers: {
    "content-type": "application/json",
    "X-RapidAPI-Host": process.env.RAPID_API_JUDGE0_HOST,
    "X-RapidAPI-Key": process.env.RAPID_API_JUDGE0_KEY,
  }
});

/**
 * Sends code to an external compiler to compile Javacode.
 * ---
 * Required: Code
 * Returns: Token to retrieve the result later
 */
router.post('/compile-token', async (req, res) => {
  const { code } = req.body;
  const data = {
    language_id: 62, // Java code
    source_code: btoa(code),
  };

  try {
    const response = await axios.post('/', data, { params: { base64_encoded: 'true', fields: '*' } });
    res.json({token: response.data.token});
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Returns compilation result for a compile token.
 * ---
 * Required: Token
 * Returns: Compilation result
 */
router.post('/compile-result', (req, res, next) => {
  sendCodeCompileStatusRequest(req, res, next, 0);
});

/**
 * Helper function for /compile-result endpoint.
 * Looks up if compilation is finished every two seconds. Max retries: 9 times
 */
async function sendCodeCompileStatusRequest(req, res, next, attempt) {
  const { token } = req.body;

  try {
    const response = await axios.get(`/${token}`, { params: { base64_encoded: "true", fields: "*" } });
    const statusId = response.data.status?.id;

    if ((statusId === 1 || statusId === 2) && attempt < 10 ) {
      console.log('Not ready yet, retrying in 2 seconds');
      setTimeout(() => sendCodeCompileStatusRequest(req, res, next, attempt + 1), 2000);
    }
    else if (attempt >= 10) {
      console.log('Attempt limit reached');
      res.status(500).json({ error: 'Attempt limit reached' });
    }
    else {
      res.json(response.data);
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = router;
