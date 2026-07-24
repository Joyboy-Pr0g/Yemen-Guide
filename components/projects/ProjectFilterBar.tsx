'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { useDebounce } from '@/hooks/use-debounce'
import { useInfiniteUsers } from '@/hooks/use-admin'
import type { ProjectFilters, Category, City, User, PaginatedMeta } from '@/types'

interface ProjectsFilterBarProps {
    filters: ProjectFilters
    setFilters: React.Dispatch<React.SetStateAction<ProjectFilters>>
    cities: City[]
    categories: Category[]
    traders?: { users: User[]; meta: PaginatedMeta } | null
    can_select_trader?: boolean
    can_select_status?: boolean
    can_select_approval_status?: boolean
    can_select_featured?: boolean
    can_select_verified?: boolean
}

const EMPTY_TRADERS: { users: User[]; meta: PaginatedMeta } = {
    users: [],
    meta: { current_page: 1, last_page: 1, total: 0, hasMorePages: false },
}

const STATUS_OPTIONS = [
    { value: 'public', label: 'منشور' },
    { value: 'draft', label: 'مسودة' },
]

const APPROVAL_STATUS_OPTIONS = [
    { value: 'pending', label: 'قيد المراجعة' },
    { value: 'approved', label: 'موافق عليه' },
    { value: 'rejected', label: 'مرفوض' },
]

const BOOL_OPTIONS = [
    { value: '1', label: 'نعم' },
    { value: '0', label: 'لا' },
]

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 block">{label}</label>
            {children}
        </div>
    )
}

export function ProjectsFilterBar({
    filters,
    setFilters,
    cities,
    categories,
    traders,
    can_select_trader = false,
    can_select_status = false,
    can_select_approval_status = false,
    can_select_featured = false,
    can_select_verified = false,
}: ProjectsFilterBarProps) {
    const [tradersSearch, setTradersSearch] = useState('')
    const debouncedTradersSearch = useDebounce(tradersSearch, 300)

    const {
        data: tradersData,
        isFetchingNextPage,
        isFetching: isFetchingTraders,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteUsers(traders ?? EMPTY_TRADERS, debouncedTradersSearch)

    const traderOptions = (tradersData?.pages.flatMap((page) => page.users) ?? []).map((trader) => ({
        value: trader.id,
        label: trader.name,
    }))

    const cityOptions = cities.map((city) => ({ value: city.id, label: city.name }))
    const neighborhoodOptions = (cities.find((c) => String(c.id) === filters.city_id)?.neighborhoods ?? []).map((n) => ({
        value: n.id,
        label: n.name,
    }))
    const categoryOptions = categories.map((cat) => ({ value: cat.id, label: cat.name }))
    const subCategoryOptions = (categories.find((c) => String(c.id) === filters.category_id)?.sub_categories ?? []).map((sub) => ({
        value: sub.id,
        label: sub.name,
    }))

    return (
        <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-card border border-gray-100 p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {can_select_trader && (
                    <FilterField label="التاجر">
                        <SearchableSelect
                            options={traderOptions}
                            value={filters.trader_id ?? ''}
                            onChange={(trader_id) => setFilters((prev) => ({ ...prev, trader_id }))}
                            placeholder="كل التجار"
                            remoteSearch
                            onSearchChange={setTradersSearch}
                            hasMore={!!hasNextPage}
                            isLoadingMore={isFetchingNextPage || isFetchingTraders}
                            onLoadMore={() => fetchNextPage()}
                        />
                    </FilterField>
                )}

                {can_select_status && (
                    <FilterField label="الحالة">
                        <SearchableSelect
                            options={STATUS_OPTIONS}
                            value={filters.status ?? ''}
                            onChange={(status) => setFilters((prev) => ({ ...prev, status }))}
                            placeholder="كل الحالات"
                        />
                    </FilterField>
                )}

                {can_select_approval_status && (
                    <FilterField label="موافقة الإدارة">
                        <SearchableSelect
                            options={APPROVAL_STATUS_OPTIONS}
                            value={filters.admin_approval_status ?? ''}
                            onChange={(admin_approval_status) => setFilters((prev) => ({ ...prev, admin_approval_status }))}
                            placeholder="كل الحالات"
                        />
                    </FilterField>
                )}

                {can_select_featured && (
                    <FilterField label="مميز">
                        <SearchableSelect
                            options={BOOL_OPTIONS}
                            value={filters.featured ?? ''}
                            onChange={(featured) => setFilters((prev) => ({ ...prev, featured }))}
                            placeholder="الكل"
                        />
                    </FilterField>
                )}

                {can_select_verified && (
                    <FilterField label="موثّق">
                        <SearchableSelect
                            options={BOOL_OPTIONS}
                            value={filters.verified ?? ''}
                            onChange={(verified) => setFilters((prev) => ({ ...prev, verified }))}
                            placeholder="الكل"
                        />
                    </FilterField>
                )}


                <FilterField label="التصنيف">
                    <SearchableSelect
                        options={categoryOptions}
                        value={filters.category_id ?? ''}
                        onChange={(category_id) => setFilters((prev) => ({ ...prev, category_id, sub_category_id: '' }))}
                        placeholder="كل التصنيفات"
                    />
                </FilterField>

                <FilterField label="التصنيف الفرعي">
                    <SearchableSelect
                        options={subCategoryOptions}
                        value={filters.sub_category_id ?? ''}
                        onChange={(sub_category_id) => setFilters((prev) => ({ ...prev, sub_category_id }))}
                        placeholder="كل التصنيفات الفرعية"
                        disabled={!filters.category_id}
                    />
                </FilterField>

                <FilterField label="المدينة">
                    <SearchableSelect
                        options={cityOptions}
                        value={filters.city_id ?? ''}
                        onChange={(city_id) => setFilters((prev) => ({ ...prev, city_id, neighborhood_id: '' }))}
                        placeholder="كل المدن"
                    />
                </FilterField>

                <FilterField label="الحي">
                    <SearchableSelect
                        options={neighborhoodOptions}
                        value={filters.neighborhood_id ?? ''}
                        onChange={(neighborhood_id) => setFilters((prev) => ({ ...prev, neighborhood_id }))}
                        placeholder="كل الأحياء"
                        disabled={!filters.city_id}
                    />
                </FilterField>
            </div>
        </motion.div>
    )
}

export default ProjectsFilterBar
