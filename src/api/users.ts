import { apiClient } from './client'
import { buildQuery } from './utils'

export type UserStatus = 'ONLINE' | 'OFFLINE' | 'AWAY'

export interface User {
  id: string
  email: string
  nickname: string
  profileImageUrl?: string | null
  status?: UserStatus
  lastSeenAt?: string | null
  createdAt?: string
  [key: string]: unknown
}

export interface CreateUserRequest {
  nickname: string
  profileImageUrl?: string
}

export interface UpdateUserStatusRequest {
  status: UserStatus
}

export interface UpdateUserProfileRequest {
  nickname?: string
  profileImageUrl?: string
}

export function createUser(data: CreateUserRequest) {
  return apiClient.post<User>('/api/users', data)
}

export function getUserById(userId: string) {
  return apiClient.get<User>(`/api/users/${userId}`)
}

export function getUserByEmail(email: string) {
  return apiClient.get<User>(`/api/users/email/${encodeURIComponent(email)}`)
}

export function searchUsers(keyword: string) {
  const query = buildQuery({ keyword })
  return apiClient.get<User[]>(`/api/users/search${query}`)
}

export function updateUserStatus(userId: string, data: UpdateUserStatusRequest) {
  return apiClient.patch<User>(`/api/users/${userId}/status`, data)
}

export function updateUserProfile(userId: string, data: UpdateUserProfileRequest) {
  return apiClient.patch<User>(`/api/users/${userId}/profile`, data)
}
