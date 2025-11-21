import axios from "axios"
import { ExchangeRate, ConversionResult } from "../types/currency"
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export class CurrencyConversionService {
  private static instance: CurrencyConversionService
  private cacheService: any
  private readonly API_URL = process.env.EXCHANGE_RATE_API_URL!
  private readonly API_KEY = process.env.EXCHANGE_RATE_API_KEY!
  private readonly CACHE_TTL: number = Number(process.env.CURRENCY_CACHE_TTL!)

  private constructor(container: MedusaContainer) {
    this.cacheService = container.resolve(Modules.CACHE)
  }

  public static getInstance(container: MedusaContainer): CurrencyConversionService {
    if (!CurrencyConversionService.instance) {
      CurrencyConversionService.instance = new CurrencyConversionService(container)
    }
    return CurrencyConversionService.instance
  }

  async getExchangeRates(baseCurrency: string): Promise<ExchangeRate> {
    const cacheKey = `exchange_rates:${baseCurrency}`

    try {
      const cachedData = await this.cacheService.get(cacheKey)

      if (cachedData) {
        return cachedData
      }

      const response = await axios.get<ExchangeRate>(
        `${this.API_URL}/${this.API_KEY}/latest/${baseCurrency}`
      )

      const data: ExchangeRate = response.data

      await this.cacheService.set(cacheKey, data, this.CACHE_TTL)

      return data
    } catch (error) {
      throw new Error(`Failed to fetch exchange rates for ${baseCurrency} and no cached data available`)
    }
  }

  convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: ExchangeRate
  ): ConversionResult {
    const conversionRates = rates.conversion_rates

    if (!(fromCurrency in conversionRates) || !(toCurrency in conversionRates)) {
      throw new Error(`Invalid currency code: ${fromCurrency} or ${toCurrency}`)
    }

    const rate = conversionRates[toCurrency] / conversionRates[fromCurrency]
    const result = amount * rate

    return {
      amount,
      from: fromCurrency,
      to: toCurrency,
      rate: parseFloat(rate.toFixed(4)),
      result: parseFloat(result.toFixed(4)),
      timestamp: new Date().toISOString()
    }
  }
}