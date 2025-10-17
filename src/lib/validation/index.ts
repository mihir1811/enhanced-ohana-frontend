// Form validation schemas and utilities

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  email?: boolean
  phone?: boolean
  numeric?: boolean
  min?: number
  max?: number
  custom?: (value: unknown, data?: Record<string, unknown>) => string | null
}

export interface ValidationError {
  field: string
  message: string
}

export class FormValidator {
  private rules: Record<string, ValidationRule> = {}

  constructor(rules: Record<string, ValidationRule>) {
    this.rules = rules
  }

  validate(data: Record<string, unknown>): ValidationError[] {
    const errors: ValidationError[] = []

    for (const [field, rule] of Object.entries(this.rules)) {
      const value = data[field]
      const error = this.validateField(field, value, rule)
      if (error) {
        errors.push(error)
      }
    }

    return errors
  }

  validateField(field: string, value: unknown, rule: ValidationRule): ValidationError | null {
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return { field, message: `${this.formatFieldName(field)} is required` }
    }

    // If field is empty and not required, skip other validations
    if (!value) return null

    const stringValue = String(value).trim()

    // Email validation
    if (rule.email && !this.isValidEmail(stringValue)) {
      return { field, message: 'Please enter a valid email address' }
    }

    // Phone validation
    if (rule.phone && !this.isValidPhone(stringValue)) {
      return { field, message: 'Please enter a valid phone number' }
    }

    // Numeric validation
    if (rule.numeric && isNaN(Number(stringValue))) {
      return { field, message: `${this.formatFieldName(field)} must be a number` }
    }

    // Min/Max for numbers
    if (rule.numeric && !isNaN(Number(stringValue))) {
      const numValue = Number(stringValue)
      if (rule.min !== undefined && numValue < rule.min) {
        return { field, message: `${this.formatFieldName(field)} must be at least ${rule.min}` }
      }
      if (rule.max !== undefined && numValue > rule.max) {
        return { field, message: `${this.formatFieldName(field)} must be no more than ${rule.max}` }
      }
    }

    // Length validation
    if (rule.minLength && stringValue.length < rule.minLength) {
      return { 
        field, 
        message: `${this.formatFieldName(field)} must be at least ${rule.minLength} characters` 
      }
    }

    if (rule.maxLength && stringValue.length > rule.maxLength) {
      return { 
        field, 
        message: `${this.formatFieldName(field)} must be no more than ${rule.maxLength} characters` 
      }
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      return { field, message: `${this.formatFieldName(field)} format is invalid` }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value)
      if (customError) {
        return { field, message: customError }
      }
    }

    return null
  }

  private formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '')
    return phoneRegex.test(cleanPhone)
  }
}

// Common validation schemas
export const authValidationRules = {
  name: { required: true, minLength: 2, maxLength: 50 },
  userName: { 
    required: true, 
    minLength: 3, 
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/
  },
  email: { required: true, email: true },
  password: { 
    required: true, 
    minLength: 8,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter'
      if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter'
      if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number'
      return null
    }
  },
  confirmPassword: {
    required: true,
    custom: (value: string, data: Record<string, unknown>) => {
      if (value !== data.password) return 'Passwords do not match'
      return null
    }
  },
  phone: { phone: true }
}

export const productValidationRules = {
  name: { required: true, minLength: 3, maxLength: 100 },
  description: { required: true, minLength: 10, maxLength: 1000 },
  category: { required: true },
  subcategory: { required: true },
  price: { required: true, numeric: true, min: 0 },
  carat: { numeric: true, min: 0.01, max: 50 },
  clarity: { maxLength: 20 },
  color: { maxLength: 20 },
  cut: { maxLength: 20 },
  certification: { maxLength: 50 },
  sku: { required: true, minLength: 3, maxLength: 50 },
  quantity: { required: true, numeric: true, min: 0 }
}

export const orderValidationRules = {
  // Shipping address
  'shippingAddress.street': { required: true, minLength: 5, maxLength: 100 },
  'shippingAddress.city': { required: true, minLength: 2, maxLength: 50 },
  'shippingAddress.state': { required: true, minLength: 2, maxLength: 50 },
  'shippingAddress.zipCode': { required: true, pattern: /^\d{5}(-\d{4})?$/ },
  'shippingAddress.country': { required: true },
  
  // Billing address
  'billingAddress.street': { required: true, minLength: 5, maxLength: 100 },
  'billingAddress.city': { required: true, minLength: 2, maxLength: 50 },
  'billingAddress.state': { required: true, minLength: 2, maxLength: 50 },
  'billingAddress.zipCode': { required: true, pattern: /^\d{5}(-\d{4})?$/ },
  'billingAddress.country': { required: true },
  
  // Payment
  paymentMethod: { required: true },
  cardNumber: { 
    required: true, 
    pattern: /^\d{16}$/,
    custom: (value: string) => {
      // Basic Luhn algorithm check
      const digits = value.replace(/\D/g, '')
      if (digits.length !== 16) return 'Card number must be 16 digits'
      
      let sum = 0
      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i])
        if ((digits.length - i) % 2 === 0) {
          digit *= 2
          if (digit > 9) digit -= 9
        }
        sum += digit
      }
      
      return sum % 10 === 0 ? null : 'Invalid card number'
    }
  },
  expiryMonth: { required: true, numeric: true, min: 1, max: 12 },
  expiryYear: { 
    required: true, 
    numeric: true,
    custom: (value: number) => {
      const currentYear = new Date().getFullYear()
      if (value < currentYear || value > currentYear + 20) {
        return 'Invalid expiry year'
      }
      return null
    }
  },
  cvv: { required: true, pattern: /^\d{3,4}$/ },
  cardHolderName: { required: true, minLength: 2, maxLength: 50 }
}

// Helper function to create validator instances
export const createValidator = (rules: Record<string, ValidationRule>) => {
  return new FormValidator(rules)
}

// Validation hook for React components
export const useFormValidation = (rules: Record<string, ValidationRule>) => {
  const validator = new FormValidator(rules)
  
  const validate = (data: Record<string, unknown>) => {
    const errors = validator.validate(data)
    const errorMap = errors.reduce((acc, error) => {
      acc[error.field] = error.message
      return acc
    }, {} as Record<string, string>)
    
    return {
      isValid: errors.length === 0,
      errors: errorMap,
      errorList: errors
    }
  }
  
  const validateField = (field: string, value: unknown) => {
    const rule = rules[field]
    if (!rule) return null
    
    return validator.validateField(field, value, rule)
  }
  
  return { validate, validateField }
}
