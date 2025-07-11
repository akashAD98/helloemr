export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string | null
          created_by: string | null
          duration: number | null
          id: string
          notes: string | null
          patient_id: string
          provider: string
          reason_for_visit: string | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          provider: string
          reason_for_visit?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          provider?: string
          reason_for_visit?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_transcriptions: {
        Row: {
          ai_summary: string | null
          audio_url: string
          created_at: string
          id: string
          processing_error: string | null
          processing_status: string
          transcript: string | null
          visit_id: string
        }
        Insert: {
          ai_summary?: string | null
          audio_url: string
          created_at?: string
          id?: string
          processing_error?: string | null
          processing_status?: string
          transcript?: string | null
          visit_id: string
        }
        Update: {
          ai_summary?: string | null
          audio_url?: string
          created_at?: string
          id?: string
          processing_error?: string | null
          processing_status?: string
          transcript?: string | null
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audio_transcriptions_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          delivery_method: string | null
          id: string
          message: string
          priority: string | null
          read_at: string | null
          scheduled_for: string | null
          sent_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          delivery_method?: string | null
          id?: string
          message: string
          priority?: string | null
          read_at?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          delivery_method?: string | null
          id?: string
          message?: string
          priority?: string | null
          read_at?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          created_at: string | null
          created_by: string | null
          date_of_birth: string
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          first_name: string
          gender: string | null
          id: string
          insurance: string | null
          insurance_id: string | null
          last_name: string
          medical_history: string[] | null
          phone: string | null
          primary_provider: string | null
          pronouns: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth: string
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          first_name: string
          gender?: string | null
          id?: string
          insurance?: string | null
          insurance_id?: string | null
          last_name: string
          medical_history?: string[] | null
          phone?: string | null
          primary_provider?: string | null
          pronouns?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          insurance?: string | null
          insurance_id?: string | null
          last_name?: string
          medical_history?: string[] | null
          phone?: string | null
          primary_provider?: string | null
          pronouns?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      visits: {
        Row: {
          ai_generated_summary: string | null
          audio_recording_url: string | null
          created_at: string
          created_by: string | null
          documents: Json | null
          exam_findings: Json | null
          id: string
          medications: Json | null
          notes: string | null
          patient_id: string
          provider: string
          reason: string
          status: string
          summary: string | null
          transcript: string | null
          updated_at: string
          visit_date: string
          visit_time: string
          vital_signs: Json | null
        }
        Insert: {
          ai_generated_summary?: string | null
          audio_recording_url?: string | null
          created_at?: string
          created_by?: string | null
          documents?: Json | null
          exam_findings?: Json | null
          id?: string
          medications?: Json | null
          notes?: string | null
          patient_id: string
          provider: string
          reason: string
          status?: string
          summary?: string | null
          transcript?: string | null
          updated_at?: string
          visit_date: string
          visit_time: string
          vital_signs?: Json | null
        }
        Update: {
          ai_generated_summary?: string | null
          audio_recording_url?: string | null
          created_at?: string
          created_by?: string | null
          documents?: Json | null
          exam_findings?: Json | null
          id?: string
          medications?: Json | null
          notes?: string | null
          patient_id?: string
          provider?: string
          reason?: string
          status?: string
          summary?: string | null
          transcript?: string | null
          updated_at?: string
          visit_date?: string
          visit_time?: string
          vital_signs?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
