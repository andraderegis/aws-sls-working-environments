'use strict';
const { DynamoDB } = require('aws-sdk');
const axios = require('axios');
const cheerio = require('cheerio');
const uuid = require('uuid');

const { API_COMMIT_MESSAGES_URL, DB_TABLE_NAME, NODE_ENV } = require('./config/settings');

const dynamoDB = new DynamoDB.DocumentClient();

class Handler {
  static async main(event) {
    console.log('at', new Date().toISOString(), JSON.stringify(event, null, 2));

    const { data } = await axios.get(API_COMMIT_MESSAGES_URL);

    const $ = cheerio.load(data);
    const [commitMessage] = $('#content').text().trim().split('\n');

    console.log({ commitMessage });

    const params = {
      TableName: DB_TABLE_NAME,
      Item: {
        commitMessage,
        id: uuid.v4(),
        createdAt: new Date().toISOString()
      }
    }

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200
    }
  }
}

module.exports = {
  scheduler: Handler.main
}