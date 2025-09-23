// API Services
export { default as apiService } from './api'
export { default as productService } from './products'
export { authService, userService, sellerService } from './auth'
export { userService as userProfileService } from './user.service'
export { auctionService } from './auctionService'
export { cartService } from './cartService'

// Types
export type { ApiResponse } from './api'
export type { Product, ProductFilters, CreateProductData } from './products'
export type { User, SellerProfile, LoginCredentials, RegisterData } from './auth'
export type { User as AuthUser, BaseUser, SellerData } from '../features/auth/authSlice'
export type { UserProfileUpdateData, SellerRegistrationData } from './user.service'
export type { AuctionData, BidData, AuctionFilter } from './auctionService'
export type { Cart, CartItem, AddToCartData, UpdateCartItemData } from './cartService'
