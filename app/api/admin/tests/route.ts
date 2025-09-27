import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { isAdmin, error } = await checkAdminAccess()

  if (!isAdmin) {
    return NextResponse.json(
      { error: error || 'Unauthorized' },
      { status: 401 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
  const status = searchParams.get('status')
  const severity = searchParams.get('severity')
  const email = searchParams.get('email')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const sortBy = searchParams.get('sortBy') || 'created_at'
  const sortOrder = searchParams.get('sortOrder') || 'desc'

  if (page < 1 || limit < 1) {
    return NextResponse.json(
      { error: 'Invalid pagination parameters' },
      { status: 400 }
    )
  }

  const validSortFields = ['created_at', 'status', 'display_id']
  if (!validSortFields.includes(sortBy)) {
    return NextResponse.json(
      { error: 'Invalid sort field' },
      { status: 400 }
    )
  }

  if (!['asc', 'desc'].includes(sortOrder)) {
    return NextResponse.json(
      { error: 'Invalid sort order' },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient()

    let query = supabase
      .from('tests')
      .select(`
        id,
        display_id,
        user_id,
        location,
        status,
        duration,
        temperature,
        humidity,
        created_at,
        users!inner (
          email
        ),
        analysis_results (
          severity
        )
      `, { count: 'exact' })

    if (status) {
      query = query.eq('status', status)
    }

    if (severity) {
      query = query.eq('analysis_results.severity', severity)
    }

    if (email) {
      query = query.ilike('users.email', `%${email}%`)
    }

    if (startDate) {
      query = query.gte('created_at', startDate)
    }

    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: tests, error: queryError, count } = await query

    if (queryError) {
      console.error('Database query error:', queryError)
      return NextResponse.json(
        { error: 'Failed to fetch tests' },
        { status: 500 }
      )
    }

    const formattedTests = tests?.map(test => ({
      id: test.id,
      display_id: test.display_id,
      user_id: test.user_id,
      user_email: (test.users as any)?.email || 'Unknown',
      location: test.location,
      status: test.status,
      severity: (test.analysis_results as any[])?.[0]?.severity || null,
      duration: test.duration,
      temperature: test.temperature,
      humidity: test.humidity,
      created_at: test.created_at,
      has_analysis: (test.analysis_results as any[])?.length > 0
    })) || []

    const totalPages = count ? Math.ceil(count / limit) : 0

    return NextResponse.json({
      tests: formattedTests,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}