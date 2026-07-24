export interface ProjectInitialFilters {
    search?: string
    category_id?: string
    sub_category_id?: string
    city_id?: string
    neighborhood_id?: string
    status?: string
    page?: number
    per_page?: string | number
    lat_min?: string | number
    lat_max?: string | number
    lng_min?: string | number
    lng_max?: string | number
}

const NUMERIC_KEYS = ['city_id', 'neighborhood_id', 'category_id', 'sub_category_id', 'page', 'per_page'] as const
const FLOAT_KEYS = ['lat_min', 'lat_max', 'lng_min', 'lng_max'] as const

function normalizeParam(value?: string | number | null): string {
    if (value === undefined || value === null || value === '') return ''
    return String(value)
}

export function matchesInitialParams(
    filters: ProjectInitialFilters,
    initialParams: Record<string, string | undefined> = {},
): boolean {
    return (
        normalizeParam(filters.search) === normalizeParam(initialParams.search) &&
        normalizeParam(filters.city_id) === normalizeParam(initialParams.city_id) &&
        normalizeParam(filters.neighborhood_id) === normalizeParam(initialParams.neighborhood_id) &&
        normalizeParam(filters.category_id) === normalizeParam(initialParams.category_id) &&
        normalizeParam(filters.sub_category_id) === normalizeParam(initialParams.sub_category_id) &&
        normalizeParam(filters.lat_min) === normalizeParam(initialParams.lat_min) &&
        normalizeParam(filters.lat_max) === normalizeParam(initialParams.lat_max) &&
        normalizeParam(filters.lng_min) === normalizeParam(initialParams.lng_min) &&
        normalizeParam(filters.lng_max) === normalizeParam(initialParams.lng_max)
    )
}

export function sanitizeFilters(filters: ProjectInitialFilters): ProjectInitialFilters {
    const out: ProjectInitialFilters = { ...filters }
    for (const key of NUMERIC_KEYS) {
        const val = out[key]
        if (val !== undefined && val !== '') {
            const n = parseInt(String(val), 10)
            if (isNaN(n) || n < 1) delete out[key]
            else out[key] = n as never
        } else {
            delete out[key]
        }
    }
    for (const key of FLOAT_KEYS) {
        const val = out[key]
        if (val !== undefined && val !== '') {
            const n = parseFloat(String(val))
            if (isNaN(n)) delete out[key]
            else out[key] = String(n) as never
        } else {
            delete out[key]
        }
    }
    if (out.search) out.search = out.search.slice(0, 100)
    else delete out.search
    return out
}
