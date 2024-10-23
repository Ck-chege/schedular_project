export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      businesses: {
        Row: {
          business_type: string
          created_at: string
          description: string | null
          email: string
          id: string
          industry: string
          location: string
          name: string
          phone: string
          social_media: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          business_type: string
          created_at?: string
          description?: string | null
          email: string
          id?: string
          industry: string
          location: string
          name: string
          phone: string
          social_media?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          business_type?: string
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          industry?: string
          location?: string
          name?: string
          phone?: string
          social_media?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          business_id: string
          created_at: string | null
          email: string
          id: string
          is_auth_set: boolean
          max_hours: number
          name: string
          phone: string
          primary_task: string
          secondary_tasks: string[]
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          email: string
          id?: string
          max_hours: number
          name: string
          phone: string
          primary_task: string
          secondary_tasks?: string[]
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          email?: string
          id?: string
          is_auth_set?: boolean
          max_hours?: number
          name?: string
          phone?: string
          primary_task?: string
          secondary_tasks?: string[]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_tasks: {
        Row: {
          employee_id: string
          is_primary: boolean
          task_id: string
        }
        Insert: {
          employee_id: string
          is_primary?: boolean
          task_id: string
        }
        Update: {
          employee_id?: string
          is_primary?: boolean
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_employee_tasks_employee_id__id"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employee_tasks_task_id__id"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_cycles: {
        Row: {
          business_id: string
          created_at: string
          end_date: string
          id: string
          num_work_days: number
          start_date: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          end_date: string
          id?: string
          num_work_days: number
          start_date: string
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          end_date?: string
          id?: string
          num_work_days?: number
          start_date?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_shift_cycles_business_id__id"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_tasks: {
        Row: {
          created_at: string
          employees_required: number
          id: string
          shift_id: string
          task_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          employees_required: number
          id?: string
          shift_id: string
          task_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          employees_required?: number
          id?: string
          shift_id?: string
          task_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_shift_tasks_shift_id__id"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_shift_tasks_task_id__id"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_templates: {
        Row: {
          business_id: string
          created_at: string | null
          duration: number
          end_time: string
          id: string
          shift_type: string
          shifts: Json
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          duration: number
          end_time: string
          id?: string
          shift_type: string
          shifts: Json
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          duration?: number
          end_time?: string
          id?: string
          shift_type?: string
          shifts?: Json
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_templates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          created_at: string
          duration: number
          end_time: string
          id: string
          start_time: string
          title: string
          updated_at: string | null
          workday_id: string
        }
        Insert: {
          created_at?: string
          duration: number
          end_time: string
          id?: string
          start_time: string
          title: string
          updated_at?: string | null
          workday_id: string
        }
        Update: {
          created_at?: string
          duration?: number
          end_time?: string
          id?: string
          start_time?: string
          title?: string
          updated_at?: string | null
          workday_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_shifts_workday_id__id"
            columns: ["workday_id"]
            isOneToOne: false
            referencedRelation: "workdays"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          business_id: string
          created_at: string
          description: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          description: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tasks_business_id__id"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          business_id: string
          created_at: string
          email: string
          full_name: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          email: string
          full_name: string
          role: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      workdays: {
        Row: {
          created_at: string
          date: string
          end_time: string
          id: string
          shift_cycle_id: string
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          date: string
          end_time: string
          id?: string
          shift_cycle_id: string
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          shift_cycle_id?: string
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_workdays_shift_cycle_id__id"
            columns: ["shift_cycle_id"]
            isOneToOne: false
            referencedRelation: "shift_cycles"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
