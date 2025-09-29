export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          company: string
          created_at: string
          description: string
          id: string
          location: string
          posted_at: string
          salary: string
          tags: string[]
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description: string
          id?: string
          location: string
          posted_at?: string
          salary: string
          tags?: string[]
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string
          id?: string
          location?: string
          posted_at?: string
          salary?: string
          tags?: string[]
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentor_bookings: {
        Row: {
          amount: number
          booked_at: string | null
          created_at: string
          currency: string | null
          id: string
          mentor_id: string | null
          notes: string | null
          session_date: string | null
          session_duration: number | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          booked_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          mentor_id?: string | null
          notes?: string | null
          session_date?: string | null
          session_duration?: number | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          booked_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          mentor_id?: string | null
          notes?: string | null
          session_date?: string | null
          session_duration?: number | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentor_bookings_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          bio: string | null
          company: string
          created_at: string
          expertise: string[]
          id: string
          image_url: string | null
          name: string
          price: string
          rating: number
          sessions: number
          title: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          company: string
          created_at?: string
          expertise?: string[]
          id?: string
          image_url?: string | null
          name: string
          price: string
          rating?: number
          sessions?: number
          title: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          company?: string
          created_at?: string
          expertise?: string[]
          id?: string
          image_url?: string | null
          name?: string
          price?: string
          rating?: number
          sessions?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          bio: string | null
          certificates: Json | null
          created_at: string | null
          date_of_birth: string | null
          declaration: string | null
          degree: string | null
          email: string | null
          experience_years: number | null
          full_name: string | null
          github_url: string | null
          graduation_year: number | null
          id: string
          interests: string[] | null
          languages: Json | null
          linkedin_url: string | null
          phone: string | null
          portfolio_url: string | null
          professional_experience: Json | null
          projects: Json | null
          role: string | null
          skills: string[] | null
          university: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          certificates?: Json | null
          created_at?: string | null
          date_of_birth?: string | null
          declaration?: string | null
          degree?: string | null
          email?: string | null
          experience_years?: number | null
          full_name?: string | null
          github_url?: string | null
          graduation_year?: number | null
          id: string
          interests?: string[] | null
          languages?: Json | null
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          professional_experience?: Json | null
          projects?: Json | null
          role?: string | null
          skills?: string[] | null
          university?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          certificates?: Json | null
          created_at?: string | null
          date_of_birth?: string | null
          declaration?: string | null
          degree?: string | null
          email?: string | null
          experience_years?: number | null
          full_name?: string | null
          github_url?: string | null
          graduation_year?: number | null
          id?: string
          interests?: string[] | null
          languages?: Json | null
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          professional_experience?: Json | null
          projects?: Json | null
          role?: string | null
          skills?: string[] | null
          university?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_purchases: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          project_id: string | null
          purchased_at: string | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          project_id?: string | null
          purchased_at?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          project_id?: string | null
          purchased_at?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_purchases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          author: string
          category: string
          contributors: number
          created_at: string
          demo_url: string | null
          description: string
          github_url: string | null
          id: string
          image_url: string | null
          stars: number
          tags: string[]
          title: string
          updated_at: string
          zip_file_url: string | null
        }
        Insert: {
          author: string
          category: string
          contributors?: number
          created_at?: string
          demo_url?: string | null
          description: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          stars?: number
          tags?: string[]
          title: string
          updated_at?: string
          zip_file_url?: string | null
        }
        Update: {
          author?: string
          category?: string
          contributors?: number
          created_at?: string
          demo_url?: string | null
          description?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          stars?: number
          tags?: string[]
          title?: string
          updated_at?: string
          zip_file_url?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
