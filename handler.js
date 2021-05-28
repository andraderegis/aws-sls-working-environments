'use strict';
const axios = require('axios');

const { API_COMMIT_MESSAGES_URL, DB_TABLE_NAME, NODE_ENV } = require('./config/settings');

class Handler {
  static async main(event) {
    console.log('at', new Date().toISOString(), JSON.stringify(event, null, 2));

    const { data } = await axios.get(API_COMMIT_MESSAGES_URL);

    console.log({ data });

    return {
      statusCode: 200
    }
  }
}

module.exports = {
  scheduler: Handler.main
}