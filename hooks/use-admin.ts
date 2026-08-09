'use client'

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type {
  Category,
  VerificationApplication,
  SiteSettings,
  PaginatedMeta,
  ProjectFilters,
  User,
  ReportFilters,
  ProjectReport,
  AuditProject,
  Visual,
} from '@/types'
import {
  getUsers,
  blockUser,
  unblockUser,
  createUser,
  updateUser,
  getAdminProjects,
  createProject,
  approveProject, rejectProject, setProjectFeatured, getVerifications, reviewVerification,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getCategories,
  getAds,
  createAd,
  updateAd,
  deleteAd,
  getSettings,
  updateSettings,
  uploadLogo,
  getVisuals,
  createVisual,
  updateVisual,
  deleteVisual,
  getAdminPendingProjects,
  getAdminReports,
  getAdminAuditProjects,
  deleteAuditProject,
  deleteAuditProjectMainImage,
  deleteAuditProjectFeaturedImage,
} from '@/lib/admin/admin-api'

function sanitizeSearch(search: string): string {
  return search.trim().slice(0, 100)
}

export function useAdminUsers(
  page = 1,
  search = '',
  role = '',
  initialData?: Awaited<ReturnType<typeof getUsers>>
) {
  return useQuery({
    queryKey: ['admin', 'users', page, search, role],
    queryFn: () => getUsers(page, search, role),
    initialData,
    staleTime: 0,
    refetchOnMount: false,
  })
}

function isEmptyFilters(filters: ProjectFilters): boolean {
  return Object.values(filters).every((value) => !value)
}

// Users hooks
export function useInfiniteUsers(
  initialData: { users: User[]; meta: PaginatedMeta },
  search = '',
  role = 'trader',
) {
  const safeSearch = sanitizeSearch(search)
  const isInitialQuery = safeSearch === ''

  return useInfiniteQuery({
    queryKey: ['admin', 'users', 'infinite', safeSearch, role],
    initialPageParam: 1,
    initialData: isInitialQuery
      ? {
        pages: [{ users: initialData.users, meta: initialData.meta }],
        pageParams: [1],
      }
      : undefined,
    queryFn: ({ pageParam = 1 }: { pageParam: number }) =>
      getUsers(pageParam, safeSearch, role),
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
    staleTime: 0,
    refetchOnMount: false,
  })
}
export function useBlockUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => blockUser(id),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}
export function useUnblockUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => unblockUser(id),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}
export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; email: string; role: string; password: string; password_confirmation: string }) => createUser(data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    onError: (error: any) => {
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((msg: any) => {
          toast.error(msg)
        })
      }
    },
  })
}
export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; name: string; email: string; password?: string; password_confirmation?: string; role: string }) => updateUser(id, data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    onError: (error: any) => {
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((msg: any) => {
          toast.error(msg)
        })
      }
    },
  })
}

// Projects hooks
export function useAdminProjects(
  page = 1,
  search = '',
  filters: ProjectFilters,
  initialData?: Awaited<ReturnType<typeof getAdminProjects>>,
  enabled = true,
) {
  const safeSearch = sanitizeSearch(search)
  const isInitialQuery = page === 1 && !safeSearch && isEmptyFilters(filters)

  return useQuery({
    queryKey: ['admin', 'projects', page, safeSearch, filters],
    queryFn: () => getAdminProjects(page, safeSearch, filters),
    initialData: enabled && isInitialQuery ? initialData : undefined,
    staleTime: 0,
    refetchOnMount: false,
    enabled,
  })
}
export function useAdminPendingProjects(
  page = 1,
  search = '',
  initialData?: Awaited<ReturnType<typeof getAdminProjects>>,
  enabled = true,
) {
  const safeSearch = sanitizeSearch(search)

  return useQuery({
    queryKey: ['admin', 'projects', 'pending', page, safeSearch],
    queryFn: () => getAdminPendingProjects(page, safeSearch),
    initialData: initialData ? initialData : undefined,
    staleTime: 0,
    refetchOnMount: false,
    enabled,
  })
}

export function useAdminPendingProjectsCount(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'projects', 'pending', 'count'],
    queryFn: async () => {
      const { meta } = await getAdminPendingProjects(1)
      return meta.total
    },
    staleTime: 30_000,
    enabled,
  })
}

function isEmptyReportFilters(filters: ReportFilters): boolean {
  return !filters.status && !filters.report_type
}

export function useAdminReports(
  page = 1,
  search = '',
  filters: ReportFilters = {},
  initialData?: { reports: ProjectReport[]; meta: PaginatedMeta },
  enabled = true,
) {
  const safeSearch = sanitizeSearch(search)
  const isInitialQuery = page === 1 && !safeSearch && isEmptyReportFilters(filters)

  return useQuery({
    queryKey: ['admin', 'reports', page, safeSearch, filters],
    queryFn: () => getAdminReports(page, safeSearch, filters),
    initialData: enabled && isInitialQuery ? initialData : undefined,
    staleTime: 0,
    refetchOnMount: false,
    enabled,
  })
}

export function useAdminAuditProjects(
  page = 1,
  search = '',
  initialData?: { projects: AuditProject[]; meta: PaginatedMeta },
  enabled = true,
) {
  const safeSearch = sanitizeSearch(search)
  const isInitialQuery = page === 1 && !safeSearch

  return useQuery({
    queryKey: ['admin', 'projects', 'audit', page, safeSearch],
    queryFn: () => getAdminAuditProjects(page, safeSearch),
    initialData: enabled && isInitialQuery ? initialData : undefined,
    staleTime: 0,
    refetchOnMount: false,
    enabled,
  })
}

export function useDeleteAuditProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAuditProject(id),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects', 'audit'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteAuditProjectMainImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAuditProjectMainImage(id),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects', 'audit'] })
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteAuditProjectFeaturedImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, imageId }: { projectId: number; imageId: number }) =>
      deleteAuditProjectFeaturedImage(projectId, imageId),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects', 'audit'] })
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => createProject(data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((error: any) => {
          toast.error(error)
        })
      }
    },
  })
}
export function useApproveProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, slug }: { id: number; slug: string }) => approveProject(id, slug),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
}
export function useRejectProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, slug, reason }: { id: number; slug: string; reason?: string }) =>
      rejectProject(id, slug, reason),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
}
export function useSetProjectFeatured() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, slug, is_featured, featured_until }: { id: number; slug: string; is_featured: boolean; featured_until?: string | null }) =>
      setProjectFeatured(id, slug, is_featured, featured_until),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
}

// Verifications hooks
export function useAdminVerifications(initialData: { applications: VerificationApplication[], meta: PaginatedMeta }, page = 1) {
  return useQuery({
    queryKey: ['admin', 'verifications', page],
    queryFn: () =>
      getVerifications(page),
    initialData: initialData ? initialData : undefined,
    staleTime: 0,
    refetchOnMount: false,
  })
}
export function useReviewAdminVerification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action, admin_notes }: { id: number; action: string; admin_notes?: string }) =>
      reviewVerification(id, action, admin_notes),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((error: any) => {
          toast.error(error)
        })
      }
    },
  })
}

export function useAdminCategories(initialCategories?: Category[]) {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => getCategories(),
    initialData: initialCategories ? initialCategories : undefined,
    staleTime: 0,
    refetchOnMount: false,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; slug: string; icon: string }) =>
      createCategory(data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((error: any) => {
          toast.error(error)
        })
      }
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; name: string; slug: string; icon: string }) =>
      updateCategory(id, data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((error: any) => {
          toast.error(error)
        })
      }
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((error: any) => {
          toast.error(error)
        })
      }
    },
  })
}

export function useCreateSubCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { category_id: number; name: string; slug: string }) =>
      createSubCategory(data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((error: any) => {
          toast.error(error)
        })
      }
    },
  })
}

export function useUpdateSubCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; name: string; slug: string }) =>
      updateSubCategory(id, data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((error: any) => {
          toast.error(error)
        })
      }
    },
  })
}

export function useDeleteSubCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteSubCategory(id),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((error: any) => {
          toast.error(error)
        })
      }
    },
  })
}

export function useAdminAds(page = 1, initialData?: Awaited<ReturnType<typeof getAds>>) {
  return useQuery({
    queryKey: ['admin', 'ads', page],
    queryFn: () =>
      getAds(page),
    initialData: initialData ? initialData : undefined,
    staleTime: 0,
    refetchOnMount: false,
  })
}

export function useCreateAd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) =>
      createAd(data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'ads'] })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((error: any) => {
          toast.error(error)
        })
      }
    },
  })
}

export function useUpdateAd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      updateAd(id, data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'ads'] })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((error: any) => {
          toast.error(error)
        })
      }
    },
  })
}

export function useDeleteAd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAd(id),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'ads'] })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((error: any) => {
          toast.error(error)
        })
      }
    },
  })
}

export function useAdminSettings(initialSettings?: SiteSettings) {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () =>
      getSettings(),
    initialData: initialSettings ? initialSettings : undefined,
    staleTime: 0,
    refetchOnMount: false,
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (settings: Omit<SiteSettings, 'logo'>) =>
      updateSettings(settings),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.setQueryData(['admin', 'settings'], data.settings)
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((error: any) => {
          toast.error(error)
        })
      }
    },
  })
}

export function useUploadLogo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (logo: FormData) =>
      uploadLogo(logo),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((error: any) => {
          toast.error(error)
        })
      }
    },
  })
}

export function useAdminVisuals(initialData?: Visual[]) {
  return useQuery({
    queryKey: ['admin', 'visuals'],
    queryFn: () => getVisuals().then((data) => data.visuals),
    initialData,
    staleTime: 0,
    refetchOnMount: false,
  })
}

export function useCreateVisual() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => createVisual(data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'visuals'] })
      queryClient.invalidateQueries({ queryKey: ['visual'] })
    },
    onError: (error: any) => {
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((err: any) => toast.error(err))
      }
    },
  })
}

export function useUpdateVisual() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => updateVisual(id, data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'visuals'] })
      queryClient.invalidateQueries({ queryKey: ['visual'] })
    },
    onError: (error: any) => {
      toast.error(error.message)
      if (error.errors) {
        Object.values(error.errors).flat().forEach((err: any) => toast.error(err))
      }
    },
  })
}

export function useDeleteVisual() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteVisual(id),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['admin', 'visuals'] })
      queryClient.invalidateQueries({ queryKey: ['visual'] })
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })
}
