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
  
  const status = searchParams.get('status')
  const severity = searchParams.get('severity')
  const email = searchParams.get('email')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const sortBy = searchParams.get('sortBy') || 'created_at'
  const sortOrder = searchParams.get('sortOrder') || 'desc'

  try {
    const supabase = await createClient()

    let query = supabase
      .from('tests')
      .select(`
        display_id,
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
      `)

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

    const { data: tests, error: queryError } = await query

    if (queryError) {
      console.error('Database query error:', queryError)
      return NextResponse.json(
        { error: 'Failed to fetch tests' },
        { status: 500 }
      )
    }

    const csvHeader = 'Display ID,Customer Email,Location,Status,Severity,Duration,Temperature (°F),Humidity (%),Created Date\n'
    
    const csvRows = tests?.map(test => {
      const userEmail = (test.users as any)?.email || ''
      const severity = (test.analysis_results as any[])?.[0]?.severity || ''
      const temperature = test.temperature !== null ? test.temperature : ''
      const humidity = test.humidity !== null ? test.humidity : ''
      const createdDate = new Date(test.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })

      return `${test.display_id},"${userEmail}","${test.location}",${test.status},${severity},${test.duration},${temperature},${humidity},${createdDate}`
    }).join('\n') || ''

    const csvContent = csvHeader + csvRows

    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `moldscope-tests-${timestamp}.csv`

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}