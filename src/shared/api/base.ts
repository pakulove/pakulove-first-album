export const BASE_URL = process.env.BACKEND_URL || 'https://album.pakulove.ru:8000'

export const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

export const fetchConfig = {
  credentials: 'include' as const,
  mode: 'cors' as const,
  headers: defaultHeaders,
  referrerPolicy: 'no-referrer-when-downgrade' as const,
}
