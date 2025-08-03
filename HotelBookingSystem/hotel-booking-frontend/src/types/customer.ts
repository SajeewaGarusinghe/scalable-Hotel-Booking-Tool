export interface Customer {
  customerId: string;
  googleId?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  googleId?: string;
}
