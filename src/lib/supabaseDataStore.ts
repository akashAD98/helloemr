
import { Patient } from "@/types/patient";
import { Appointment } from "@/data/mockData";
import { supabaseDataService } from "@/services/supabaseDataService";

class SupabaseDataStore {
  private patients: Patient[] = [];
  private appointments: Appointment[] = [];
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    await this.loadData();
    this.initialized = true;
  }

  private async loadData() {
    // Load patients and appointments from Supabase
    this.patients = await supabaseDataService.getPatients();
    this.appointments = await supabaseDataService.getAppointments();
  }

  // Patient methods
  async getPatients(): Promise<Patient[]> {
    if (!this.initialized) await this.initialize();
    return this.patients;
  }

  async getPatientById(id: string): Promise<Patient | undefined> {
    if (!this.initialized) await this.initialize();
    
    let patient = this.patients.find(p => p.id === id);
    
    if (!patient) {
      // Try to fetch from database
      patient = await supabaseDataService.getPatientById(id);
      if (patient) {
        this.patients.push(patient);
      }
    }
    
    return patient;
  }

  async addPatient(patient: Partial<Patient>): Promise<Patient | null> {
    const newPatient = await supabaseDataService.createPatient(patient);
    
    if (newPatient) {
      this.patients.push(newPatient);
    }
    
    return newPatient;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
    const updatedPatient = await supabaseDataService.updatePatient(id, updates);
    
    if (updatedPatient) {
      const index = this.patients.findIndex(p => p.id === id);
      if (index !== -1) {
        this.patients[index] = updatedPatient;
      }
    }
    
    return updatedPatient;
  }

  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    if (!this.initialized) await this.initialize();
    return this.appointments;
  }

  async addAppointment(appointment: Partial<Appointment>): Promise<Appointment | null> {
    const newAppointment = await supabaseDataService.createAppointment(appointment);
    
    if (newAppointment) {
      this.appointments.push(newAppointment);
    }
    
    return newAppointment;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | null> {
    const updatedAppointment = await supabaseDataService.updateAppointment(id, updates);
    
    if (updatedAppointment) {
      const index = this.appointments.findIndex(a => a.id === id);
      if (index !== -1) {
        this.appointments[index] = updatedAppointment;
      }
    }
    
    return updatedAppointment;
  }

  // Real-time subscription methods
  subscribeToChanges(onUpdate: () => void) {
    // Subscribe to real-time updates
    supabaseDataService.subscribeToAppointments((appointment) => {
      const index = this.appointments.findIndex(a => a.id === appointment.id);
      if (index !== -1) {
        this.appointments[index] = appointment;
      } else {
        this.appointments.push(appointment);
      }
      onUpdate();
    });
  }

  // Refresh data from database
  async refresh() {
    await this.loadData();
  }
}

export const supabaseDataStore = new SupabaseDataStore();
