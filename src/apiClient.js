import axios from 'axios';

class ApiClient {
  constructor() {
    if (!ApiClient.instance) {
      this.client = axios.create({ baseURL: 'https://bot.pcremote.my.id/api' });
      ApiClient.instance = this;
    }
    return ApiClient.instance;
  }

  async postMessage(message) {
    return await this.client.post('/message', { message });
  }
}

const instance = new ApiClient();
Object.freeze(instance);

export default instance;
