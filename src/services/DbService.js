import Service from "./Service";

/**
 * Implements the service to call the database in the backend
 */
class DbService extends Service {

  static errorMessage = 'Fehler beim Erstellen der Sitzung';

  /**
   * Creates a session in the database
   * @param matrikelnummer Matrikelnummer of the student
   * @returns {Promise<string>} Returns the newly created sitzung_id
   */
  static async createSession(matrikelnummer) {
    const data = {
      matrikelnummer: matrikelnummer
    }

    const response = await this.request('db/create-session', {
      method: 'post',
      data: data
    });

    return response.sitzung_id;
  }
}

export default DbService;