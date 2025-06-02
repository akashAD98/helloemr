
import { Patient } from "@/types/patient";
import { patients as initialPatients, appointments as initialAppointments, Appointment } from "@/data/mockData";

// Simple in-memory data store with localStorage persistence
class DataStore {
  private patients: Patient[] = [];
  private appointments: Appointment[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const savedPatients = localStorage.getItem('emr-patients');
    const savedAppointments = localStorage.getItem('emr-appointments');
    
    this.patients = savedPatients ? JSON.parse(savedPatients) : [...initialPatients];
    this.appointments = savedAppointments ? JSON.parse(savedAppointments) : [...initialAppointments];
  }

  private saveToStorage() {
    localStorage.setItem('emr-patients', JSON.stringify(this.patients));
    localStorage.setItem('emr-appointments', JSON.stringify(this.appointments));
  }

  // Patient methods
  getPatients(): Patient[] {
    return [...this.patients];
  }

  getPatientById(id: string): Patient | undefined {
    return this.patients.find(p => p.id === id);
  }

  addPatient(patient: Patient): void {
    this.patients.push(patient);
    this.saveToStorage();
  }

  updatePatient(id: string, updates: Partial<Patient>): void {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.patients[index] = { ...this.patients[index], ...updates };
      this.saveToStorage();
    }
  }

  // Appointment methods
  getAppointments(): Appointment[] {
    return [...this.appointments];
  }

  getAppointmentById(id: string): Appointment | undefined {
    return this.appointments.find(a => a.id === id);
  }

  addAppointment(appointment: Appointment): void {
    this.appointments.push(appointment);
    this.saveToStorage();
  }

  updateAppointment(id: string, updates: Partial<Appointment>): void {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments[index] = { ...this.appointments[index], ...updates };
      this.saveToStorage();
    }
  }

  deleteAppointment(id: string): void {
    this.appointments = this.appointments.filter(a => a.id !== id);
    this.saveToStorage();
  }

  // Generate unique IDs
  generatePatientId(): string {
    const maxId = Math.max(...this.patients.map(p => parseInt(p.id.substring(1))), 0);
    return `p${maxId + 1}`;
  }

  generateAppointmentId(): string {
    const maxId = Math.max(...this.appointments.map(a => parseInt(a.id.substring(1))), 0);
    return `a${maxId + 1}`;
  }
}

export const dataStore = new DataStore();
