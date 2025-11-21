import type { BookingRequest, BookingResponse } from '../types'

const BOOKING_URL = 'https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com/booking'
const KEY_URL = 'https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com/key'

type ApiKeyPayload = {
  key?: unknown
  apiKey?: unknown
  data?: unknown
  [key: string]: unknown
}

type BookingDetailsPayload = {
  when?: string
  lanes?: number
  people?: number
  shoes?: number[]
  price?: number
  id?: string
  bookingId?: string
  active?: boolean
  [key: string]: unknown
}

type BookingApiResponse =
  | BookingDetailsPayload
  | {
      bookingDetails?: BookingDetailsPayload
      data?: BookingDetailsPayload
      success?: boolean
      [key: string]: unknown
    }

// Spara nyckeln i minnet så jag slipper hämta den varje gång

let cachedKey: string | null = null

const extractKey = (payload: unknown): string | null => {
  if (!payload) {
    return null
  }

  if (typeof payload === 'string') {
    try {
      return extractKey(JSON.parse(payload))
    } catch {
      return null
    }
  }

  if (typeof payload === 'object') {
    const record = payload as ApiKeyPayload
    const directKey = record.key ?? record.apiKey

    if (typeof directKey === 'string' && directKey.length > 0) {
      return directKey
    }

    if (record.data) {
      return extractKey(record.data)
    }
  }

  return null
}

async function fetchApiKey(): Promise<string> {
  if (cachedKey) {
    return cachedKey
  }


  // Endpoint ger ett engångsnyckel som används i nästa request
  const response = await fetch(KEY_URL)

  if (!response.ok) {
    throw new Error('Unable to reach the booking server. Please try again.')
  }

const data = (await response.json()) as ApiKeyPayload
  const key = extractKey(data)

  if (!key) {
    throw new Error('Server did not provide an API key.')
  }

  cachedKey = key
  return key
}

export async function createBooking(request: BookingRequest): Promise<BookingResponse> {
  const apiKey = await fetchApiKey()

  // Skicka bokningen till backend med nyckeln i header

  const response = await fetch(BOOKING_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const message = await response.text()

    // Om Backend misslyckas, då skickar det ett error message
    
    throw new Error(message || 'The booking could not be completed. Please try again.')
  }

  const raw = (await response.json()) as BookingApiResponse
  const normalized = normalizeBooking(raw)
  return normalized
}
//unwrap data från API response
const normalizeBooking = (payload: BookingApiResponse): BookingResponse => {
  const details = extractBookingDetails(payload)

  const id = details.id ?? details.bookingId
  if (!id) {
    throw new Error('Booking confirmation is missing an id.')
  }

  if (typeof details.when !== 'string') {
    throw new Error('Booking confirmation is missing a valid date.')
  }

  if (typeof details.lanes !== 'number' || typeof details.people !== 'number') {
    throw new Error('Booking confirmation is missing lane or player info.')
  }

  if (!Array.isArray(details.shoes)) {
    throw new Error('Booking confirmation is missing shoe data.')
  }

  if (typeof details.price !== 'number') {
    throw new Error('Booking confirmation is missing the total price.')
  }

  return {
    when: details.when,
    lanes: details.lanes,
    people: details.people,
    shoes: details.shoes as number[],
    price: details.price,
    id,
    active: details.active ?? true,
  }
}

//kolla om objekt finns

const extractBookingDetails = (payload: BookingApiResponse): BookingDetailsPayload => {
  if (!payload) {
    return {} as BookingDetailsPayload
  }

  if ('bookingDetails' in payload) {
    const details = payload.bookingDetails
    if (details && typeof details === 'object') {
      return details as BookingDetailsPayload
    }
  }

  if ('data' in payload) {
    const details = payload.data
    if (details && typeof details === 'object') {
      return details as BookingDetailsPayload
    }
  }

  return payload as BookingDetailsPayload
}

