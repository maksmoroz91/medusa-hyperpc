import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CurrencyConversionService } from "../../../../services/currency-conversion"
import { z } from "zod"
import { ConversionResponse, ConversionError } from "../../../../types/currency"

const conversionSchema = z.object({
  amount: z.string()
    .transform(val => parseFloat(val))
    .refine(val => !isNaN(val) && val > 0, {
      message: "Amount must be a positive number"
    }),
  from: z.string()
    .toUpperCase()
    .refine(val => /^[A-Z]{3}$/.test(val), {
      message: "From currency must be a valid 3-letter currency code"
    }),
  to: z.string()
    .toUpperCase()
    .refine(val => /^[A-Z]{3}$/.test(val), {
      message: "To currency must be a valid 3-letter currency code"
    })
})

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const validationResult = conversionSchema.safeParse(req.query)

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: validationResult.error.issues.map(e => e.message)
      } as ConversionError)
    }

    const { amount, from, to } = validationResult.data

    const container = req.scope

    const currencyService = CurrencyConversionService.getInstance(container)

    const rates = await currencyService.getExchangeRates(from)
    const result = currencyService.convertCurrency(amount, from, to, rates)

    res.status(200).json({
      success: true,
      data: result
    } as ConversionResponse)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error"
    } as ConversionError)
  }
}