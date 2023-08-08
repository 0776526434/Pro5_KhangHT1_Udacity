import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils';

import { updateComputerGroup } from '../../businessLogic/computerGroup'
import { UpdateComputerGroupRequest } from '../../requests/UpdateComputerGroupRequest'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const computerGroupId = event.pathParameters.computerGroupId
        const updatedComputerGroup: UpdateComputerGroupRequest = JSON.parse(event.body)
        await updateComputerGroup(computerGroupId,getUserId(event), updatedComputerGroup)
        return {
            statusCode: 202,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(updatedComputerGroup)
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
