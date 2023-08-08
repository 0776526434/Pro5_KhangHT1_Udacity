import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getComputerGroupByUserId } from '../../businessLogic/computerGroup'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(getUserId(event))
    const computerGroups = await getComputerGroupByUserId(getUserId(event))
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items: computerGroups
      })
    }
  })
handler.use(
  cors({
    credentials: true
  })
)
