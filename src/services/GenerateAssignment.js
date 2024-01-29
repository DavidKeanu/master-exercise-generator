import Service from "./Service";

class GenerateAssignmentService extends Service {

    static errorMessage = 'Fehler beim Abruf des Kompilier-Service';

    static async sendAssignmentRequest() {

        const data = {
            prompt: "schreibe mir eine programmieraufgabe, die so ähnlich ist wie diese ***Deklarieren Sie eine Variable mit dem Variablennamen zaehler vom Datentyp int und\n" +
                "initialisieren Sie die Variable mit dem Wert 5**"
        }

        const response = await this.request('ai/generateTask', {
            method: 'post',
            data: data
        });

        return response?.message;
    }
}

export default GenerateAssignmentService;