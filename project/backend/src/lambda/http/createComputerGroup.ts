import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateComputerGroupRequest } from '../../requests/CreateComputerGroupRequest'
import { getUserId } from '../utils';
import { createComputerGroup } from '../../businessLogic/computerGroup'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newComputerGroup: CreateComputerGroupRequest = JSON.parse(event.body)
    console.log('Processing event: ', event)
    const newItem = await createComputerGroup(newComputerGroup, getUserId(event))

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
      })
    }
  }
)


handler.use(
  cors({
    credentials: true
  })
)
