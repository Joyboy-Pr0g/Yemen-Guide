import { bbfFetch } from '@/lib/api'

export const reportProject = async (slug: string, report_type: string, report: string): Promise<string> => {
    const response = await bbfFetch<{ message: string }>(`/projects/${slug}/report`, {
        method: 'POST',
        body: JSON.stringify({ report_type: report_type, report: report }),
    })
    return response.message
}