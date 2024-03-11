import Service from "./Service";

/**
 * Implements the service to call the database in the backend
 */
class DbService extends Service {

    static errorMessage = 'Fehler beim Erstellen der Sitzung';

    /**
     * Creates a session in the database
     * @returns {Promise<string>} Returns the newly created sitzung_id
     * @param excercise
     */
    static async updateTask(excercise) {
        const response = await this.request('db/addOrUpdateTask', {
            method: 'post',
            data: excercise
        });

        return response;
    }
}

export default DbService;