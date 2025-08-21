// Shared user-related types

export interface BaseUser {
	id: string
	name: string
	email: string
	userName: string
	profilePicture?: string
	phone?: string
	address?: {
		street: string
		city: string
		state: string
		zipCode: string
		country: string
	}
	createdAt: string
	updatedAt: string
	isVerified: boolean
}

export interface SellerData {
	addressLine1: string
	addressLine2: string
	city: string
	companyLogo: string
	companyName: string
	country: string
	createdAt: string
	gstNumber: string
	id: string
	isBlocked: boolean
	isDeleted: boolean
	isVerified: boolean
	panCard: string
	sellerType: string
	state: string
	updatedAt: string
	userId: string
	zipCode: string
}

export interface User extends BaseUser {
	role: 'user' | 'seller' | 'admin'
	sellerData?: SellerData
}


