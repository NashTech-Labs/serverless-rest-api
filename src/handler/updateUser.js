'use strict'

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.updateUser = (event, context, callback) => {

    const datetime = new Date().toISOString();
    const data = JSON.parse(event.body);

    if( typeof data.fullname !== 'string' || typeof data.designation !== 'string') {
        console.error('Invalid Input');
        const response = {
            statusCode: 400,
            body: JSON.stringify({ "message":"Invalid Input" })
        }

        return;
    }

    const params = {
        TableName: 'users',
        Key: {
            id: event.pathParameters.id
        },
        ExpressionAttributeValues: {
            ':f': data.fullname,
            ':d': data.designation,
            ':u': datetime
        },
        UpdateExpression: 'set fullname = :f, designation = :d, updatedAt = :u'
    };

    dynamoDb.update(params, (error, data) => {
        if(error) {
            console.error(error);
            callback(new Error(error));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };

        callback(null, response);
    });
}