export interface ExchangeRate {
  result: string
  base_code: string
  time_last_update_unix: number
  conversion_rates: Record<string, number>
}

export interface ConversionResult {
  amount: number
  from: string
  to: string
  rate: number
  result: number
  timestamp: string
}

export interface ConversionResponse {
  success: true
  data: ConversionResult
}

export interface ConversionError {
  success: false
  error: string
  message?: string[]
}