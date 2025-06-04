
import { toast } from "sonner";
import { dataStore } from "@/lib/dataStore";
import { Appointment } from "@/data/mockData";
import { Patient } from "@/types/patient";

export interface NotificationRule {
  id: string;
  name: string;
  trigger: 'before_appointment' | 'missed_appointment' | 'follow_up_due' | 'high_risk_patient';
  timeOffset?: number; // minutes before appointment
  condition?: (patient: Patient, appointment?: Appointment) => boolean;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ScheduledNotification {
  id: string;
  ruleId: string;
  patientId: string;
  appointmentId?: string;
  scheduledFor: Date;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  sent: boolean;
  type: 'email' | 'sms' | 'system' | 'call';
}

class NotificationService {
  private notifications: ScheduledNotification[] = [];
  private rules: NotificationRule[] = [
    {
      id: 'appointment_reminder_24h',
      name: '24 Hour Appointment Reminder',
      trigger: 'before_appointment',
      timeOffset: 24 * 60, // 24 hours in minutes
      message: 'Reminder: You have an appointment tomorrow at {time} with {provider}',
      priority: 'medium'
    },
    {
      id: 'appointment_reminder_15min',
      name: '15 Minute Appointment Reminder',
      trigger: 'before_appointment',
      timeOffset: 15, // 15 minutes
      message: 'Your appointment with {provider} is starting in 15 minutes',
      priority: 'high'
    },
    {
      id: 'high_risk_patient_alert',
      name: 'High Risk Patient Alert',
      trigger: 'high_risk_patient',
      condition: (patient) => this.calculateRiskScore(patient) > 7,
      message: 'High-risk patient {patientName} requires immediate attention',
      priority: 'critical'
    },
    {
      id: 'follow_up_overdue',
      name: 'Follow-up Overdue',
      trigger: 'follow_up_due',
      condition: (patient) => this.isFollowUpOverdue(patient),
      message: 'Patient {patientName} has overdue follow-up appointments',
      priority: 'high'
    }
  ];

  constructor() {
    this.loadNotifications();
    this.startNotificationChecker();
  }

  private loadNotifications() {
    const saved = localStorage.getItem('emr-notifications');
    this.notifications = saved ? JSON.parse(saved) : [];
  }

  private saveNotifications() {
    localStorage.setItem('emr-notifications', JSON.stringify(this.notifications));
  }

  // Calculate patient risk score based on various factors
  private calculateRiskScore(patient: Patient): number {
    let score = 0;
    
    // Age factor
    if (patient.age && patient.age > 65) score += 2;
    if (patient.age && patient.age > 80) score += 2;
    
    // Medical history factors
    const highRiskConditions = ['diabetes', 'hypertension', 'heart disease', 'copd', 'cancer'];
    const patientHistory = patient.medicalHistory?.map(h => h.toLowerCase()) || [];
    
    highRiskConditions.forEach(condition => {
      if (patientHistory.some(h => h.includes(condition))) {
        score += 3;
      }
    });
    
    // Recent visits factor
    const lastVisit = patient.lastVisit ? new Date(patient.lastVisit) : null;
    if (lastVisit) {
      const daysSinceLastVisit = Math.floor((Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastVisit > 90) score += 2;
      if (daysSinceLastVisit > 180) score += 3;
    }
    
    return Math.min(score, 10); // Cap at 10
  }

  private isFollowUpOverdue(patient: Patient): boolean {
    const lastVisit = patient.lastVisit ? new Date(patient.lastVisit) : null;
    if (!lastVisit) return false;
    
    const daysSinceLastVisit = Math.floor((Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));
    const riskScore = this.calculateRiskScore(patient);
    
    // High-risk patients need follow-up within 30 days
    if (riskScore > 7 && daysSinceLastVisit > 30) return true;
    
    // Medium-risk patients need follow-up within 90 days
    if (riskScore > 4 && daysSinceLastVisit > 90) return true;
    
    // Low-risk patients need follow-up within 180 days
    if (daysSinceLastVisit > 180) return true;
    
    return false;
  }

  // Schedule notifications for all appointments
  scheduleAppointmentNotifications() {
    const appointments = dataStore.getAppointments();
    const patients = dataStore.getPatients();
    
    appointments.forEach(appointment => {
      if (appointment.status === 'cancelled' || appointment.status === 'completed') {
        return; // Skip cancelled or completed appointments
      }
      
      const patient = patients.find(p => p.id === appointment.patientId);
      if (!patient) return;
      
      // Schedule 24-hour reminder
      this.scheduleNotification(
        'appointment_reminder_24h',
        patient,
        appointment,
        24 * 60 // 24 hours in minutes
      );
      
      // Schedule 15-minute reminder
      this.scheduleNotification(
        'appointment_reminder_15min',
        patient,
        appointment,
        15 // 15 minutes
      );
    });
    
    this.saveNotifications();
  }

  private scheduleNotification(
    ruleId: string,
    patient: Patient,
    appointment: Appointment,
    minutesBefore: number
  ) {
    const appointmentDateTime = this.parseAppointmentDateTime(appointment.date, appointment.time);
    if (!appointmentDateTime) return;
    
    const notificationTime = new Date(appointmentDateTime.getTime() - (minutesBefore * 60 * 1000));
    
    // Don't schedule notifications for past times
    if (notificationTime <= new Date()) return;
    
    const rule = this.rules.find(r => r.id === ruleId);
    if (!rule) return;
    
    // Check if notification already exists
    const exists = this.notifications.some(n => 
      n.ruleId === ruleId && 
      n.patientId === patient.id && 
      n.appointmentId === appointment.id
    );
    
    if (exists) return;
    
    const notification: ScheduledNotification = {
      id: `${ruleId}_${patient.id}_${appointment.id}_${Date.now()}`,
      ruleId,
      patientId: patient.id,
      appointmentId: appointment.id,
      scheduledFor: notificationTime,
      message: this.formatMessage(rule.message, patient, appointment),
      priority: rule.priority,
      sent: false,
      type: minutesBefore > 60 ? 'email' : 'system' // Email for long-term, system for immediate
    };
    
    this.notifications.push(notification);
  }

  private parseAppointmentDateTime(date: string, time: string): Date | null {
    try {
      const [timePart, period] = time.split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) hour24 += 12;
      if (period === 'AM' && hours === 12) hour24 = 0;
      
      const appointmentDate = new Date(date);
      appointmentDate.setHours(hour24, minutes, 0, 0);
      
      return appointmentDate;
    } catch (error) {
      console.error('Error parsing appointment date/time:', error);
      return null;
    }
  }

  private formatMessage(template: string, patient: Patient, appointment?: Appointment): string {
    let message = template;
    
    message = message.replace('{patientName}', patient.name || `${patient.firstName} ${patient.lastName}`);
    
    if (appointment) {
      message = message.replace('{time}', appointment.time);
      message = message.replace('{provider}', appointment.provider);
      message = message.replace('{date}', appointment.date);
    }
    
    return message;
  }

  // Check for due notifications and send them
  private checkNotifications() {
    const now = new Date();
    const dueNotifications = this.notifications.filter(n => 
      !n.sent && n.scheduledFor <= now
    );
    
    dueNotifications.forEach(notification => {
      this.sendNotification(notification);
      notification.sent = true;
    });
    
    if (dueNotifications.length > 0) {
      this.saveNotifications();
    }
  }

  private sendNotification(notification: ScheduledNotification) {
    console.log(`Sending ${notification.type} notification:`, notification);
    
    // For demo purposes, we'll show system toasts
    // In a real app, this would integrate with email/SMS services
    if (notification.type === 'system') {
      const variant = notification.priority === 'critical' ? 'destructive' : 'default';
      toast(notification.message, {
        description: `Priority: ${notification.priority}`,
      });
    } else if (notification.type === 'email') {
      toast(`Email sent: ${notification.message}`, {
        description: `Notification sent to patient`,
      });
    }
  }

  // Start the notification checker (runs every minute)
  private startNotificationChecker() {
    setInterval(() => {
      this.checkNotifications();
    }, 60000); // Check every minute
    
    // Also check immediately
    this.checkNotifications();
  }

  // Analyze patient risk and generate alerts
  analyzePatientRisks() {
    const patients = dataStore.getPatients();
    const alerts: Array<{
      patient: Patient;
      riskScore: number;
      alerts: string[];
      recommendedActions: string[];
    }> = [];
    
    patients.forEach(patient => {
      const riskScore = this.calculateRiskScore(patient);
      const patientAlerts: string[] = [];
      const recommendedActions: string[] = [];
      
      if (riskScore > 7) {
        patientAlerts.push('High risk patient - requires immediate attention');
        recommendedActions.push('Schedule follow-up within 2 weeks');
        recommendedActions.push('Consider care manager assignment');
      }
      
      if (this.isFollowUpOverdue(patient)) {
        patientAlerts.push('Follow-up appointment overdue');
        recommendedActions.push('Contact patient to schedule appointment');
      }
      
      if (patient.age && patient.age > 75 && !patient.emergencyContact) {
        patientAlerts.push('Elderly patient missing emergency contact');
        recommendedActions.push('Update emergency contact information');
      }
      
      if (patientAlerts.length > 0) {
        alerts.push({
          patient,
          riskScore,
          alerts: patientAlerts,
          recommendedActions
        });
      }
    });
    
    return alerts;
  }

  // Get upcoming notifications
  getUpcomingNotifications(): ScheduledNotification[] {
    const now = new Date();
    const upcoming = this.notifications.filter(n => 
      !n.sent && n.scheduledFor > now
    );
    
    return upcoming.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
  }

  // Get sent notifications history
  getNotificationHistory(): ScheduledNotification[] {
    return this.notifications.filter(n => n.sent);
  }

  // Manually trigger notification check (for testing)
  triggerNotificationCheck() {
    this.checkNotifications();
  }

  // Get patient risk assessment
  getPatientRiskAssessment(patientId: string) {
    const patient = dataStore.getPatientById(patientId);
    if (!patient) return null;
    
    const riskScore = this.calculateRiskScore(patient);
    const isFollowUpOverdue = this.isFollowUpOverdue(patient);
    
    return {
      patient,
      riskScore,
      riskLevel: riskScore > 7 ? 'High' : riskScore > 4 ? 'Medium' : 'Low',
      isFollowUpOverdue,
      recommendedFollowUpDays: riskScore > 7 ? 14 : riskScore > 4 ? 30 : 90
    };
  }
}

export const notificationService = new NotificationService();
