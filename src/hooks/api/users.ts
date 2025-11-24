import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type {
  CreateUserRequest,
  UpdateUserProfileRequest,
  UpdateUserStatusRequest,
  User,
} from '@/api'

import {
  createUser,

  getUserByEmail,
  getUserById,
  searchUsers,
  updateUserProfile,

  updateUserStatus,

} from '@/api'

import { queryKeys } from './queryKeys'

export function useUser(userId?: string) {
  return useQuery<User>({
    queryKey: userId ? queryKeys.users.detail(userId) : queryKeys.users.detail(''),
    queryFn: () => getUserById(userId!),
    enabled: Boolean(userId),
  })
}

export function useUserByEmail(email?: string) {
  return useQuery<User>({
    queryKey: email ? queryKeys.users.email(email) : queryKeys.users.email(''),
    queryFn: () => getUserByEmail(email!),
    enabled: Boolean(email),
  })
}

export function useSearchUsers(keyword?: string) {
  const trimmed = keyword?.trim() ?? ''

  return useQuery<User[]>({
    queryKey: queryKeys.users.search(trimmed),
    queryFn: () => searchUsers(trimmed),
    enabled: trimmed.length > 0,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.users.detail(user.id), user)
    },
  })
}

export function useUpdateUserStatus(userId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserStatusRequest) => updateUserStatus(userId!, data),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.users.detail(user.id), user)
    },
    meta: { userId },
  })
}

export function useUpdateUserProfile(userId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserProfileRequest) => updateUserProfile(userId!, data),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.users.detail(user.id), user)
    },
    meta: { userId },
  })
}
