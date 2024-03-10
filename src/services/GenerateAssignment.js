import Service from "./Service";

class GenerateAssignmentService extends Service {

    static errorMessage = 'Fehler beim Abruf des Kompilier-Service';

    static async sendAssignmentRequest(data) {

        const response = await this.request('ai/generateTask', {
            method: 'post',
            data: data
        });
        return response;
    }

    static async checkSolution(data) {
        const response = await this.request('ai/solution', {
            method: 'post',
            data: data
        })
        return response;
    }
}

export default GenerateAssignmentService;