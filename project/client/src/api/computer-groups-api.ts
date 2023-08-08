import { apiEndpoint } from '../config'
import { ComputerGroup } from '../types/ComputerGroup';
import { CreateComputerGroupRequest } from '../types/CreateComputerGroupRequest';
import Axios from 'axios'
import { UpdateComputerGroupRequest } from '../types/UpdateComputerGroupRequest';

export async function getComputerGroups(idToken: string): Promise<ComputerGroup[]> {
  console.log('Fetching computer groups')

  const response = await Axios.get(`${apiEndpoint}/computer-groups`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('ComputerGroup:', response.data)
  return response.data.items
}

export async function createComputerGroup(
  idToken: string,
  newComputerGroup: CreateComputerGroupRequest
): Promise<ComputerGroup> {
  const response = await Axios.post(`${apiEndpoint}/computer-groups`,  JSON.stringify(newComputerGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.newItem
}

export async function patchComputerGroup(
  idToken: string,
  computerGroupId: string,
  updatedComputerGroup: UpdateComputerGroupRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/computer-groups/${computerGroupId}`, JSON.stringify(updatedComputerGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteComputerGroup(
  idToken: string,
  computerGroupId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/computer-groups/${computerGroupId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  computerGroupId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/computer-groups/${computerGroupId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
