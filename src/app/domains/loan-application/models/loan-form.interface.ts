import { Loan } from './loan';

export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  propertyValue: number;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  vin: string;
  mileage: number;
  value: number;
}

export interface LoanFormData extends Partial<Loan> {
  purpose?: string;
  propertyAddress?: PropertyAddress;
  vehicleInfo?: VehicleInfo;
  downPayment?: number;
}

export interface LoanTypeConfiguration {
  minAmount: number;
  maxAmount: number;
  maxTermMonths: number;
  fields: string[];
}
