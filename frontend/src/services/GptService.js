import Service from "./Service";

/**
 * Implements the service to call gpt in the backend
 */
class GptService extends Service {

  static errorMessage = 'Fehler beim Abruf des AI-Service';

  /**
   * Calls gpt to retrieve an explanation for a compile/runtime error message.
   * @param code Code
   * @param compileError Compilation/runtime error message from compiler
   * @param gptModel (optional) gpt model to use
   * @returns {Promise<string>} Generated gpt explanation
   */
  static async getCompileErrorHelp(code, compileError, gptModel) {
    const data = {
      code: code,
      error: compileError,
      model: gptModel
    }

    const response = await this.request('ai/compiler-error', {
      method: 'post',
      data: data
    });

    return response?.message;
  }

  /**
   * Calls gpt to load all available models
   * @returns {Promise<number[]>} all available model id's
   */
  static async getGptModels() {
    const response = await this.request('ai/models');
    return response?.models;
  }

  /**
   * Calls gpt to evaluate code
   * @param code Code
   * @param gptModel (optional) gpt model to use
   * @param assignment (optional) assignment to give the model some context
   * @param session Current session id
   * @returns {Promise<string>} Generated evaluation text in json format
   */
  static async evaluateCode(code, gptModel, assignment, session) {
    const data = {
      code: code,
      model: gptModel,
      assignment: assignment.trim() !== '' ? assignment : undefined,
      session: session
    }

    const response = await this.request('ai/evaluate', {
      method: 'post',
      data: data
    });

    return response?.evaluation;
  }

  /**
   * Calls gpt to get explanation for code
   * @param code Code
   * @param gptModel (optional) gpt model to use
   * @param assignment (optional) assignment to evaluate if it is fulfilled
   * @returns {Promise<string>} Generated explanation
   */
  static async explainCode(code, gptModel, assignment) {
    const data = {
      code: code,
      model: gptModel,
      assignment: assignment.trim() !== '' ? assignment : undefined
    }

    const response = await this.request('ai/explain', {
      method: 'post',
      data: data
    });

    return response?.message;
  }
}

export default GptService;