export const BASE_URL = process.env.BACKEND_URL || 'https://80.87.98.111:8000'

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
