import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { ComputerGroupItem } from '../models/ComputerGroupItem'
import { ComputerGroupUpdate } from '../models/ComputerGroupUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

export class ComputerGroupAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly computerIndex = process.env.COMPUTER_GROUP_TABLE_GSI,
    private readonly computerGroupTable = process.env.COMPUTER_GROUP_TABLE) {
  }

  async deleteComputerGroupById(computerGroupId: string, userId: string) {
    await this.docClient.delete({
      TableName: this.computerGroupTable,
      Key: {
        'computerGroupId': computerGroupId,
        'userId': userId
      }
    }).promise()
  }

  async updateComputerGroup(computerGroupId: string, userId: string, updatedComputerGroup: ComputerGroupUpdate){

    await this.docClient.update({
        TableName: this.computerGroupTable,
        Key: {
            "computerGroupId": computerGroupId,
            "userId": userId
        },
        UpdateExpression: "set #name = :name, description = :description",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": updatedComputerGroup.name,
            ":description": updatedComputerGroup.description
        }
    }).promise()
}

  async getComputerGroupByUserId(userId: string): Promise<ComputerGroupItem[]> {
    console.log("Called function get computer")
    const result = await this.docClient.query({
      TableName: this.computerGroupTable,
      IndexName: this.computerIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
    const items = result.Items
    return items as ComputerGroupItem[]
  }

  async createComputerGroup(computerGroup: ComputerGroupItem): Promise<ComputerGroupItem> {
    await this.docClient.put({
      TableName: this.computerGroupTable,
      Item: computerGroup
    }).promise()

    return computerGroup
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
