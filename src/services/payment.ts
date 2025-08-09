// Payment processing services and utilities

export interface PaymentMethod {
  id: string
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  holderName?: string
  isDefault: boolean
  billingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'succeeded' | 'canceled'
  clientSecret: string
  metadata: Record<string, any>
}

export interface PaymentResult {
  success: boolean
  paymentIntentId?: string
  error?: {
    code: string
    message: string
    type: 'card_error' | 'validation_error' | 'api_error'
  }
}

class PaymentService {
  private apiUrl: string

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
  }

  // Create payment intent
  async createPaymentIntent(amount: number, currency = 'USD', metadata: Record<string, any> = {}): Promise<PaymentIntent> {
    const response = await fetch(`${this.apiUrl}/payments/create-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency, metadata })
    })
    
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
    
    return data.data
  }

  // Confirm payment
  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentResult> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, paymentMethodId })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return { success: true, paymentIntentId: data.data.id }
      } else {
        return {
          success: false,
          error: {
            code: data.error?.code || 'payment_failed',
            message: data.message || 'Payment failed',
            type: 'api_error'
          }
        }
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'network_error',
          message: 'Network error occurred',
          type: 'api_error'
        }
      }
    }
  }

  // Process refund
  async processRefund(paymentIntentId: string, amount?: number, reason?: string): Promise<{
    success: boolean
    refundId?: string
    error?: string
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, amount, reason })
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      return {
        success: false,
        error: 'Failed to process refund'
      }
    }
  }

  // Get payment methods for user
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/methods`)
      const data = await response.json()
      return data.success ? data.data : []
    } catch (error) {
      console.error('Failed to load payment methods:', error)
      return []
    }
  }

  // Add payment method
  async addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id' | 'isDefault'>): Promise<PaymentMethod> {
    const response = await fetch(`${this.apiUrl}/payments/methods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentMethod)
    })
    
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
    
    return data.data
  }

  // Remove payment method
  async removePaymentMethod(methodId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/payments/methods/${methodId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message)
    }
  }

  // Set default payment method
  async setDefaultPaymentMethod(methodId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/payments/methods/${methodId}/default`, {
      method: 'POST'
    })
    
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message)
    }
  }
}

// Payment utility functions
export class PaymentUtils {
  // Format card number for display
  static formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '')
    const match = cleaned.match(/\d{4}/g)
    return match ? match.join(' ') : cleaned
  }

  // Mask card number
  static maskCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '')
    if (cleaned.length < 4) return cleaned
    
    const last4 = cleaned.slice(-4)
    const masked = '*'.repeat(cleaned.length - 4)
    return `${masked}${last4}`.match(/.{1,4}/g)?.join(' ') || cleaned
  }

  // Get card brand from number
  static getCardBrand(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\D/g, '')
    
    if (/^4/.test(cleaned)) return 'visa'
    if (/^5[1-5]/.test(cleaned)) return 'mastercard'
    if (/^3[47]/.test(cleaned)) return 'amex'
    if (/^6(?:011|5)/.test(cleaned)) return 'discover'
    
    return 'unknown'
  }

  // Validate expiry date
  static isExpiryValid(month: number, year: number): boolean {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    
    if (year < currentYear) return false
    if (year === currentYear && month < currentMonth) return false
    
    return true
  }

  // Format amount for display
  static formatAmount(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount / 100) // Assuming amount is in cents
  }

  // Calculate processing fee
  static calculateProcessingFee(amount: number, type: 'credit' | 'debit' = 'credit'): number {
    const rate = type === 'credit' ? 0.029 : 0.025 // 2.9% for credit, 2.5% for debit
    const fixedFee = 30 // 30 cents
    return Math.round(amount * rate + fixedFee)
  }
}

// React hook for payment processing
export const usePayment = () => {
  const paymentService = new PaymentService()

  const processPayment = async (
    amount: number,
    paymentMethodId: string,
    metadata: Record<string, any> = {}
  ): Promise<PaymentResult> => {
    try {
      // Create payment intent
      const intent = await paymentService.createPaymentIntent(amount, 'USD', metadata)
      
      // Confirm payment
      const result = await paymentService.confirmPayment(intent.id, paymentMethodId)
      
      return result
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'payment_error',
          message: error instanceof Error ? error.message : 'Payment failed',
          type: 'api_error'
        }
      }
    }
  }

  return {
    processPayment,
    createPaymentIntent: paymentService.createPaymentIntent.bind(paymentService),
    getPaymentMethods: paymentService.getPaymentMethods.bind(paymentService),
    addPaymentMethod: paymentService.addPaymentMethod.bind(paymentService),
    removePaymentMethod: paymentService.removePaymentMethod.bind(paymentService),
    setDefaultPaymentMethod: paymentService.setDefaultPaymentMethod.bind(paymentService),
    processRefund: paymentService.processRefund.bind(paymentService)
  }
}

export const paymentService = new PaymentService()
export default paymentService
