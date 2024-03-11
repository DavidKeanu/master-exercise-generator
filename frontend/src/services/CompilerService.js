import Service from "./Service";

/**
 * Implements the service to call the external compiler in the backend.
 */
class CompilerService extends Service {

  static errorMessage = 'Fehler beim Abruf des Kompilier-Service';

  /**
   * Sends code to compile to the compiler.
   * @param code Code to compile
   * @returns {Promise<string>} token to retrieve the result
   */
  static async sendCodeCompileRequest(code) {
    const data = {
      code: code
    }
    console.log(code);
    const response = await this.request('compiler/compile-token', {
      method: 'post',
      data: data
    });

    return response?.token;
  }

  /**
   * Sends a token to the compiler to get the compilation result
   * @param token Token to get result
   * @returns {Promise<*>} Result in json format
   */
  static async sendCodeCompileStatusRequest(token) {
    const data = {
      token: token
    };

    return await this.request('compiler/compile-result', {
      method: 'post',
      data: data
    });
  }
}

export default CompilerService;

