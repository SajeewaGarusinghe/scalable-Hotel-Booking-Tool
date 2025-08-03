import { apiClient } from './apiClient';
import { 
  Customer, 
  CreateCustomerDto 
} from '../types/customer';
import { QueryParams } from '../types/api';

export class CustomerService {
  private static readonly CUSTOMERS_BASE = '/api/customers';

  static async getCustomers(params?: QueryParams): Promise<Customer[]> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    const url = queryString ? `${this.CUSTOMERS_BASE}?${queryString}` : this.CUSTOMERS_BASE;
    return apiClient.get<Customer[]>(url);
  }

  static async getCustomerById(customerId: string): Promise<Customer> {
    return apiClient.get<Customer>(`${this.CUSTOMERS_BASE}/${customerId}`);
  }

  static async getCustomerByEmail(email: string): Promise<Customer> {
    return apiClient.get<Customer>(`${this.CUSTOMERS_BASE}/by-email/${encodeURIComponent(email)}`);
  }

  static async createCustomer(customerData: CreateCustomerDto): Promise<Customer> {
    return apiClient.post<Customer>(this.CUSTOMERS_BASE, customerData);
  }

  static async updateCustomer(customerId: string, customerData: Partial<CreateCustomerDto>): Promise<Customer> {
    return apiClient.put<Customer>(`${this.CUSTOMERS_BASE}/${customerId}`, customerData);
  }

  static async deleteCustomer(customerId: string): Promise<void> {
    return apiClient.delete<void>(`${this.CUSTOMERS_BASE}/${customerId}`);
  }

  static async getCurrentCustomer(): Promise<Customer | null> {
    try {
      const { user } = JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.email) {
        return await this.getCustomerByEmail(user.email);
      }
      return null;
    } catch (error) {
      console.error('Error getting current customer:', error);
      return null;
    }
  }
}

export default CustomerService;
