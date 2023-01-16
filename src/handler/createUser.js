'use strict'

const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createUser = (event, context, callback) => {

    const datetime = new Date().toISOString();
    const data = JSON.parse(event.body);

    if( typeof data.fullname !== 'string' && typeof data.designation !== 'string') {
        console.error('Invalid Input');
        const response = {
            statusCode: 400,
            body: JSON.stringify({ "message":"Invalid Input" })
        }

        return;
    }

    const params = {
        TableName: 'users',
        Item: {
            id: uuid.v1(),
            fullname: data.fullname,
            designation: data.designation,
            createdAt: datetime,
            updatedAt: datetime
        }
    };

    dynamoDb.put(params, (error, data) => {
        if(error) {
            console.error(error);
            callback(new Error(error));
            return;
        }

        const response = {
            statusCode: 201,
            body: JSON.stringify(data.Item)
        };

        callback(null, response);
    });
}