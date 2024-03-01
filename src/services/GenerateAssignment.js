import Service from "./Service";

class GenerateAssignmentService extends Service {

    static errorMessage = 'Fehler beim Abruf des Kompilier-Service';

    static async sendAssignmentRequest(data) {

        const response = await this.request('ai/generateTask', {
            method: 'post',
            data: data
        });
        console.log(response?.message);
        return response?.message;
    }
}

export default GenerateAssignmentService;