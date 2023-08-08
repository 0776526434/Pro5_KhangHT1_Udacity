import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils';
import { deleteComputerGroupById } from '../../businessLogic/computerGroup'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const computerGroupId = event.pathParameters.computerGroupId
        await deleteComputerGroupById(computerGroupId, getUserId(event));
        return {
            statusCode: 202,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify("Deleted successfully!")
        }
    }
)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
