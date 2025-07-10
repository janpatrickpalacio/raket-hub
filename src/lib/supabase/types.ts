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
      categories: {
        Row: {
          created_at: string
          id: number
          name: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          slug?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          id: number
          name: string
          province_id: number
          slug: string
        }
        Insert: {
          id?: number
          name: string
          province_id: number
          slug: string
        }
        Update: {
          id?: number
          name?: string
          province_id?: number
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: number
          message_text: string
          sender_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: number
          message_text: string
          sender_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: number
          message_text?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          kliyente_id: string
          raketero_id: string
          requirements: string | null
          service_id: string
          status: Database["public"]["Enums"]["order_status_enum"] | null
          total_price: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          kliyente_id: string
          raketero_id: string
          requirements?: string | null
          service_id: string
          status?: Database["public"]["Enums"]["order_status_enum"] | null
          total_price: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          kliyente_id?: string
          raketero_id?: string
          requirements?: string | null
          service_id?: string
          status?: Database["public"]["Enums"]["order_status_enum"] | null
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_kliyente_id_fkey"
            columns: ["kliyente_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_raketero_id_fkey"
            columns: ["raketero_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      provinces: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          order_id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          cover_image_url: string | null
          created_at: string
          delivery_days: number
          description: string
          fts: unknown | null
          gallery_image_urls: string[] | null
          id: string
          number_of_revisions: number | null
          price: number
          pricing_type: Database["public"]["Enums"]["pricing_type_enum"]
          raketero_id: string
          rejection_reason: string | null
          slug: string
          status: Database["public"]["Enums"]["service_status_enum"]
          subcategory_id: number
          title: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          delivery_days?: number
          description: string
          fts?: unknown | null
          gallery_image_urls?: string[] | null
          id?: string
          number_of_revisions?: number | null
          price?: number
          pricing_type: Database["public"]["Enums"]["pricing_type_enum"]
          raketero_id: string
          rejection_reason?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["service_status_enum"]
          subcategory_id: number
          title: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          delivery_days?: number
          description?: string
          fts?: unknown | null
          gallery_image_urls?: string[] | null
          id?: string
          number_of_revisions?: number | null
          price?: number
          pricing_type?: Database["public"]["Enums"]["pricing_type_enum"]
          raketero_id?: string
          rejection_reason?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["service_status_enum"]
          subcategory_id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_raketero_id_fkey"
            columns: ["raketero_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: number
          created_at: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          category_id: number
          created_at?: string
          id?: number
          name: string
          slug: string
        }
        Update: {
          category_id?: number
          created_at?: string
          id?: number
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          average_rating: number
          bio: string | null
          city_id: number | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_raketero: boolean | null
          last_name: string
          level: Database["public"]["Enums"]["user_level_enum"]
          role: Database["public"]["Enums"]["user_role"]
          total_reviews: number | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          average_rating?: number
          bio?: string | null
          city_id?: number | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_raketero?: boolean | null
          last_name: string
          level?: Database["public"]["Enums"]["user_level_enum"]
          role?: Database["public"]["Enums"]["user_role"]
          total_reviews?: number | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          average_rating?: number
          bio?: string | null
          city_id?: number | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_raketero?: boolean | null
          last_name?: string
          level?: Database["public"]["Enums"]["user_level_enum"]
          role?: Database["public"]["Enums"]["user_role"]
          total_reviews?: number | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reindex_user_services: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      update_raketero_levels: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      order_status_enum:
        | "Pending"
        | "In Progress"
        | "Delivered"
        | "Completed"
        | "Cancelled"
        | "Disputed"
      pricing_type_enum: "Fixed" | "Hourly" | "Per Quote"
      service_status_enum: "pending" | "approved" | "rejected" | "paused"
      user_level_enum: "New" | "Rising" | "Top-Rated"
      user_role: "user" | "admin"
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
    Enums: {
      order_status_enum: [
        "Pending",
        "In Progress",
        "Delivered",
        "Completed",
        "Cancelled",
        "Disputed",
      ],
      pricing_type_enum: ["Fixed", "Hourly", "Per Quote"],
      service_status_enum: ["pending", "approved", "rejected", "paused"],
      user_level_enum: ["New", "Rising", "Top-Rated"],
      user_role: ["user", "admin"],
    },
  },
} as const
