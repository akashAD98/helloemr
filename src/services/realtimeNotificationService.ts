
import { supabaseDataService, DatabaseNotification } from "./supabaseDataService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface NotificationRule {
  id: string;
  name: string;
  trigger: 'before_appointment' | 'appointment_created' | 'appointment_updated' | 'appointment_cancelled';
  timeOffset?: number; // minutes before appointment
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

class RealtimeNotificationService {
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
      id: 'appointment_created',
      name: 'New Appointment Created',
      trigger: 'appointment_created',
      message: 'New appointment scheduled for {date} at {time} with {provider}',
      priority: 'medium'
    },
    {
      id: 'appointment_updated',
      name: 'Appointment Updated',
      trigger: 'appointment_updated',
      message: 'Appointment on {date} at {time} has been updated',
      priority: 'medium'
    },
    {
      id: 'appointment_cancelled',
      name: 'Appointment Cancelled',
      trigger: 'appointment_cancelled',
      message: 'Appointment on {date} at {time} has been cancelled',
      priority: 'high'
    }
  ];

  private notificationChannel: any;
  private appointmentChannel: any;
  private isInitialized = false;

  constructor() {
    if (!this.isInitialized) {
      this.setupRealtimeSubscriptions();
      this.isInitialized = true;
    }
  }

  private setupRealtimeSubscriptions() {
    // Clean up existing channels first
    this.cleanup();

    // Subscribe to appointment changes
    this.appointmentChannel = supabaseDataService.subscribeToAppointments((appointment) => {
      this.handleAppointmentChange(appointment);
    });

    // Subscribe to new notifications
    this.notificationChannel = supabaseDataService.subscribeToNotifications((notification) => {
      this.displayNotification(notification);
    });
  }

  private async handleAppointmentChange(appointment: any) {
    console.log('Handling appointment change:', appointment);
    
    // Create notifications based on the change
    await this.createNotificationForAppointment(appointment, 'appointment_created');
    
    // Schedule reminder notifications
    await this.scheduleReminderNotifications(appointment);
  }

  private async createNotificationForAppointment(appointment: any, trigger: string) {
    const rule = this.rules.find(r => r.trigger === trigger);
    if (!rule) return;

    const notification: Partial<DatabaseNotification> = {
      appointment_id: appointment.id,
      type: 'appointment_reminder' as const,
      title: 'Appointment Notification',
      message: this.formatMessage(rule.message, appointment),
      priority: rule.priority,
      delivery_method: 'system' as const
    };

    await supabaseDataService.createNotification(notification);
  }

  private async scheduleReminderNotifications(appointment: any) {
    const reminderRule = this.rules.find(r => r.trigger === 'before_appointment');
    if (!reminderRule || !reminderRule.timeOffset) return;

    const appointmentDateTime = this.parseAppointmentDateTime(appointment.date, appointment.time);
    if (!appointmentDateTime) return;

    const reminderTime = new Date(appointmentDateTime.getTime() - (reminderRule.timeOffset * 60 * 1000));
    
    // Only schedule if the reminder time is in the future
    if (reminderTime > new Date()) {
      const notification: Partial<DatabaseNotification> = {
        appointment_id: appointment.id,
        type: 'appointment_reminder' as const,
        title: 'Appointment Reminder',
        message: this.formatMessage(reminderRule.message, appointment),
        scheduled_for: reminderTime.toISOString(),
        priority: reminderRule.priority,
        delivery_method: 'system' as const
      };

      await supabaseDataService.createNotification(notification);
    }
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

  private formatMessage(template: string, appointment: any): string {
    let message = template;
    
    message = message.replace('{patientName}', appointment.patientName || 'Unknown Patient');
    message = message.replace('{time}', appointment.time || '');
    message = message.replace('{provider}', appointment.provider || '');
    message = message.replace('{date}', appointment.date || '');
    
    return message;
  }

  private displayNotification(notification: DatabaseNotification) {
    console.log('Displaying notification:', notification);
    
    // Show toast notification based on priority
    const variant = notification.priority === 'critical' || notification.priority === 'high' ? 'destructive' : 'default';
    
    toast(notification.title, {
      description: notification.message,
    });
  }

  // Get current user's notifications
  async getUserNotifications(): Promise<DatabaseNotification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    return supabaseDataService.getNotifications(user.id);
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    return supabaseDataService.markNotificationAsRead(notificationId);
  }

  // Cleanup subscriptions
  cleanup() {
    if (this.notificationChannel) {
      supabase.removeChannel(this.notificationChannel);
      this.notificationChannel = null;
    }
    if (this.appointmentChannel) {
      supabase.removeChannel(this.appointmentChannel);
      this.appointmentChannel = null;
    }
  }
}

export const realtimeNotificationService = new RealtimeNotificationService();
