import axios from "axios";
import {toast} from "react-toastify";

/**
 * Base service class. Each service should extend this class
 */
class Service {

  static baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
  static errorMessage = 'Fehler beim Abruf des Services';

  /**
   * Make a request to an url. Each service should call this function for requests.
   * @param url Url to make a request to
   * @param config config
   * @returns {Promise<any>}
   */
  static async request(url, config = {}) {
    try {
      const response = await axios(`${(Service.baseUrl)}/${url}`, config);
      return response.data;
    } catch (err) {
      let error = err.response ? err.response.data : err;
      console.log(error);
      toast.error(this.errorMessage);
      return Promise.reject(error);
    }
  }
}

export default Service;