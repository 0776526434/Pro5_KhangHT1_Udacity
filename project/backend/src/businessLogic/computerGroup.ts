import { ComputerGroupAccess } from '../dataLayer/computerGroupAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { ComputerGroupItem } from '../models/ComputerGroupItem'
import { CreateComputerGroupRequest } from '../requests/CreateComputerGroupRequest'
import { UpdateComputerGroupRequest } from '../requests/UpdateComputerGroupRequest'
import * as uuid from 'uuid'

const computerGroupAccess = new ComputerGroupAccess()
const attachmentUtils = new AttachmentUtils()


export async function getComputerGroupByUserId(userId: string): Promise<ComputerGroupItem[]> {
  return computerGroupAccess.getComputerGroupByUserId(userId)
}

export async function deleteComputerGroupById(computerGroupId: string, userId: string) {
  computerGroupAccess.deleteComputerGroupById(computerGroupId, userId)
}

export async function updateComputerGroup(computerGroupId: string, userId: string, updateComputerGroup: UpdateComputerGroupRequest) {
  computerGroupAccess.updateComputerGroup(computerGroupId, userId, updateComputerGroup)
}

export async function createComputerGroup(
  createComputerGroupRequest: CreateComputerGroupRequest,
  jwtToken: string
): Promise<ComputerGroupItem> {

  const itemId = uuid.v4()

  return await computerGroupAccess.createComputerGroup({
    computerGroupId: itemId,
    createdAt: new Date().toISOString(),
    name: createComputerGroupRequest.name,
    description: createComputerGroupRequest.description,
    attachmentUrl: await attachmentUtils.createAttachmentURL(itemId),
    userId: jwtToken
  })
}