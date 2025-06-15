
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/types/patient";
import { Appointment } from "@/data/mockData";
import { toast } from "sonner";

export interface DatabasePatient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  pronouns?: string;
  email?: string;
  phone?: string;
  address?: string;
  insurance?: string;
  insurance_id?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_history?: string[];
  primary_provider?: string;
  status?: 'active' | 'inactive' | 'pending';
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseAppointment {
  id: string;
  patient_id: string;
  provider: string;
  appointment_date: string;
  appointment_time: string;
  duration?: number;
  type?: string;
  status?: 'pending' | 'booked' | 'completed' | 'cancelled';
  reason_for_visit?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseNotification {
  id: string;
  user_id?: string;
  appointment_id?: string;
  type: 'appointment_reminder' | 'appointment_update' | 'appointment_cancelled' | 'system';
  title: string;
  message: string;
  scheduled_for?: string;
  sent_at?: string;
  read_at?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  delivery_method?: 'system' | 'email' | 'sms';
  created_at?: string;
}

class SupabaseDataService {
  // Patient operations
  async getPatients(): Promise<Patient[]> {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(this.transformPatientFromDB);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
      return [];
    }
  }

  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return this.transformPatientFromDB(data);
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast.error('Failed to load patient');
      return null;
    }
  }

  async createPatient(patient: Partial<Patient>): Promise<Patient | null> {
    try {
      const dbPatient: Partial<DatabasePatient> = {
        first_name: patient.firstName || '',
        last_name: patient.lastName || '',
        date_of_birth: patient.dateOfBirth || '',
        gender: patient.gender,
        pronouns: patient.pronouns,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        insurance: patient.insurance,
        insurance_id: patient.insuranceId,
        emergency_contact: patient.emergencyContact,
        emergency_phone: patient.emergencyPhone,
        medical_history: patient.medicalHistory,
        primary_provider: patient.primaryProvider,
        status: patient.status || 'active'
      };

      const { data, error } = await supabase
        .from('patients')
        .insert(dbPatient)
        .select()
        .single();

      if (error) throw error;

      toast.success('Patient created successfully');
      return this.transformPatientFromDB(data);
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Failed to create patient');
      return null;
    }
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
    try {
      const dbUpdates: Partial<DatabasePatient> = {
        first_name: updates.firstName,
        last_name: updates.lastName,
        date_of_birth: updates.dateOfBirth,
        gender: updates.gender,
        pronouns: updates.pronouns,
        email: updates.email,
        phone: updates.phone,
        address: updates.address,
        insurance: updates.insurance,
        insurance_id: updates.insuranceId,
        emergency_contact: updates.emergencyContact,
        emergency_phone: updates.emergencyPhone,
        medical_history: updates.medicalHistory,
        primary_provider: updates.primaryProvider,
        status: updates.status
      };

      const { data, error } = await supabase
        .from('patients')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Patient updated successfully');
      return this.transformPatientFromDB(data);
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient');
      return null;
    }
  }

  // Appointment operations
  async getAppointments(): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      return data.map(this.transformAppointmentFromDB);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
      return [];
    }
  }

  async createAppointment(appointment: Partial<Appointment>): Promise<Appointment | null> {
    try {
      const dbAppointment: Partial<DatabaseAppointment> = {
        patient_id: appointment.patientId,
        provider: appointment.provider || '',
        appointment_date: appointment.date || '',
        appointment_time: appointment.time || '',
        duration: appointment.duration || 30,
        type: appointment.type || 'consultation',
        status: appointment.status || 'pending',
        reason_for_visit: appointment.reason,
        notes: appointment.notes
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert(dbAppointment)
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .single();

      if (error) throw error;

      toast.success('Appointment created successfully');
      return this.transformAppointmentFromDB(data);
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment');
      return null;
    }
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | null> {
    try {
      const dbUpdates: Partial<DatabaseAppointment> = {
        provider: updates.provider,
        appointment_date: updates.date,
        appointment_time: updates.time,
        duration: updates.duration,
        type: updates.type,
        status: updates.status,
        reason_for_visit: updates.reason,
        notes: updates.notes
      };

      const { data, error } = await supabase
        .from('appointments')
        .update(dbUpdates)
        .eq('id', id)
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .single();

      if (error) throw error;

      toast.success('Appointment updated successfully');
      return this.transformAppointmentFromDB(data);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
      return null;
    }
  }

  // Notification operations
  async createNotification(notification: Partial<DatabaseNotification>): Promise<DatabaseNotification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  async getNotifications(userId?: string): Promise<DatabaseNotification[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Transform functions
  private transformPatientFromDB(dbPatient: DatabasePatient): Patient {
    return {
      id: dbPatient.id,
      firstName: dbPatient.first_name,
      lastName: dbPatient.last_name,
      name: `${dbPatient.first_name} ${dbPatient.last_name}`,
      dateOfBirth: dbPatient.date_of_birth,
      gender: dbPatient.gender || '',
      pronouns: dbPatient.pronouns,
      email: dbPatient.email,
      phone: dbPatient.phone,
      address: dbPatient.address,
      insurance: dbPatient.insurance,
      insuranceId: dbPatient.insurance_id,
      emergencyContact: dbPatient.emergency_contact,
      emergencyPhone: dbPatient.emergency_phone,
      medicalHistory: dbPatient.medical_history,
      primaryProvider: dbPatient.primary_provider,
      provider: dbPatient.primary_provider,
      status: dbPatient.status,
      active: dbPatient.status === 'active',
      lastVisit: dbPatient.updated_at,
      age: this.calculateAge(dbPatient.date_of_birth)
    };
  }

  private transformAppointmentFromDB(dbAppointment: any): Appointment {
    const patient = dbAppointment.patients;
    return {
      id: dbAppointment.id,
      patientId: dbAppointment.patient_id,
      patientName: patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient',
      provider: dbAppointment.provider,
      date: dbAppointment.appointment_date,
      time: dbAppointment.appointment_time,
      duration: dbAppointment.duration || 30,
      type: dbAppointment.type || 'consultation',
      status: dbAppointment.status || 'pending',
      reason: dbAppointment.reason_for_visit,
      notes: dbAppointment.notes
    };
  }

  private calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Real-time subscriptions
  subscribeToAppointments(callback: (appointment: Appointment) => void) {
    return supabase
      .channel('appointments-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments'
      }, async (payload) => {
        console.log('Appointment change:', payload);
        
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          // Fetch the full appointment with patient data
          const { data } = await supabase
            .from('appointments')
            .select(`
              *,
              patients (
                first_name,
                last_name
              )
            `)
            .eq('id', payload.new.id)
            .single();
          
          if (data) {
            callback(this.transformAppointmentFromDB(data));
          }
        }
      })
      .subscribe();
  }

  subscribeToNotifications(callback: (notification: DatabaseNotification) => void) {
    return supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        console.log('New notification:', payload);
        callback(payload.new as DatabaseNotification);
      })
      .subscribe();
  }
}

export const supabaseDataService = new SupabaseDataService();
