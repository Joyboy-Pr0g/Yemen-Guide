import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await params
    const res = await fetch(`${API_URL}/visuals/${key}`, {
      headers: { Accept: 'application/json' },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch visual',
    }, { status: 500 })
  }
}
