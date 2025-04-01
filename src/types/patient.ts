
export interface Patient {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  dateOfBirth: string;
  gender: string;
  pronouns?: string;
  email?: string;
  phone?: string;
  address?: string;
  age?: number;
  provider?: string;
  image?: string;
  active?: boolean;
  contactInfo?: {
    email: string;
    phone: string;
    address: string;
  };
  insurance?: string;
  insuranceId?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  profileImage?: string;
  status?: "active" | "inactive" | "pending";
  lastVisit?: string;
  preferredPharmacy?: string;
  primaryProvider?: string;
  medicalHistory?: string[];
}
