import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    let body = {}
    try {
      body = await request.json()
    } catch (e) { }

    const { userId, user_id, country, countryId, token } = body || {}
    const userVal = (userId || user_id || '').toString()
    const countryVal = (country || countryId || '2').toString()

    const rawToken = token || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || ''
    const bearerHeader = rawToken ? (rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`) : ''

    const holidaysApiBaseUrl = process.env.NEXT_PUBLIC_HOLIDAYS_API_BASE_URL || 'https://jenideals.com/jeniNewVersion/holidays/api'
    const targetUrl = `${holidaysApiBaseUrl}/booking/list`

    // Build FormData
    const formData = new FormData()
    formData.append('user_id', userVal)
    formData.append('userId', userVal)
    formData.append('country', countryVal)
    formData.append('countryId', countryVal)
    if (rawToken) {
      formData.append('token', rawToken)
    }

    const headers = {
      'Accept': 'application/json',
    }
    if (bearerHeader) {
      headers['Authorization'] = bearerHeader
    }

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: formData,
      cache: 'no-store'
    })

    const text = await res.text()

    try {
      const data = JSON.parse(text)
      return NextResponse.json(data, { status: 200 })
    } catch (parseErr) {
      return NextResponse.json({
        status: false,
        rawStatus: res.status,
        rawResponse: text
      }, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 })
  }
}
