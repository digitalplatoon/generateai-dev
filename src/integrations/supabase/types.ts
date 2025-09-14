export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_audit_logs: {
        Row: {
          action_type: string
          conversation_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          processing_time_ms: number | null
          request_data: Json | null
          response_data: Json | null
          status: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          conversation_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          processing_time_ms?: number | null
          request_data?: Json | null
          response_data?: Json | null
          status: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          conversation_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          processing_time_ms?: number | null
          request_data?: Json | null
          response_data?: Json | null
          status?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_audit_logs_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ai_audit_logs_conversation_id"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ai_audit_logs_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_response_cache: {
        Row: {
          cache_key: string
          created_at: string
          expires_at: string
          id: string
          model_used: string
          response_data: Json
          settings_hash: string
        }
        Insert: {
          cache_key: string
          created_at?: string
          expires_at: string
          id?: string
          model_used: string
          response_data: Json
          settings_hash: string
        }
        Update: {
          cache_key?: string
          created_at?: string
          expires_at?: string
          id?: string
          model_used?: string
          response_data?: Json
          settings_hash?: string
        }
        Relationships: []
      }
      conversation_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          model_used: string | null
          role: string
          temperature: number | null
          tokens_used: number | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          model_used?: string | null
          role: string
          temperature?: number | null
          tokens_used?: number | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          model_used?: string | null
          role?: string
          temperature?: number | null
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conversation_messages_conversation_id"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_shares: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          permission_level: string | null
          shared_by: string | null
          shared_with: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          permission_level?: string | null
          shared_by?: string | null
          shared_with?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          permission_level?: string | null
          shared_by?: string | null
          shared_with?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_shares_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conversation_shares_shared_by"
            columns: ["shared_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conversation_shares_shared_with"
            columns: ["shared_with"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          context_data: Json | null
          created_at: string | null
          do_not_train: boolean | null
          id: string
          is_shared: boolean | null
          share_token: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          context_data?: Json | null
          created_at?: string | null
          do_not_train?: boolean | null
          id?: string
          is_shared?: boolean | null
          share_token?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          context_data?: Json | null
          created_at?: string | null
          do_not_train?: boolean | null
          id?: string
          is_shared?: boolean | null
          share_token?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_conversations_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          published: boolean | null
          slug: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          published?: boolean | null
          slug?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          published?: boolean | null
          slug?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      project_contexts: {
        Row: {
          created_at: string | null
          description: string | null
          file_structure: Json | null
          id: string
          last_accessed: string | null
          project_name: string
          technologies_used: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_structure?: Json | null
          id?: string
          last_accessed?: string | null
          project_name: string
          technologies_used?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_structure?: Json | null
          id?: string
          last_accessed?: string | null
          project_name?: string
          technologies_used?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          active: boolean
          created_at: string
          features: Json
          id: string
          limits: Json
          name: string
          price_monthly: number | null
          price_yearly: number | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          features?: Json
          id?: string
          limits?: Json
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          features?: Json
          id?: string
          limits?: Json
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      user_ai_settings: {
        Row: {
          created_at: string | null
          custom_instructions: string | null
          data_retention_days: number | null
          do_not_train_consent: boolean | null
          id: string
          max_tokens: number | null
          preferred_model: string | null
          stop_sequences: string[] | null
          streaming_enabled: boolean | null
          temperature: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          custom_instructions?: string | null
          data_retention_days?: number | null
          do_not_train_consent?: boolean | null
          id?: string
          max_tokens?: number | null
          preferred_model?: string | null
          stop_sequences?: string[] | null
          streaming_enabled?: boolean | null
          temperature?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          custom_instructions?: string | null
          data_retention_days?: number | null
          do_not_train_consent?: boolean | null
          id?: string
          max_tokens?: number | null
          preferred_model?: string | null
          stop_sequences?: string[] | null
          streaming_enabled?: boolean | null
          temperature?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          item_description: string | null
          item_id: string
          item_title: string
          item_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_description?: string | null
          item_id: string
          item_title: string
          item_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_description?: string | null
          item_id?: string
          item_title?: string
          item_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          step_id: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          step_id: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          step_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          learning_pace: string | null
          notifications_enabled: boolean | null
          preferred_role: string | null
          preferred_tech_stack: string | null
          profile_visibility: string | null
          theme: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          learning_pace?: string | null
          notifications_enabled?: boolean | null
          preferred_role?: string | null
          preferred_tech_stack?: string | null
          profile_visibility?: string | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          learning_pace?: string | null
          notifications_enabled?: boolean | null
          preferred_role?: string | null
          preferred_tech_stack?: string | null
          profile_visibility?: string | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          learning_path_id: string
          module_id: string
          progress_percentage: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          learning_path_id: string
          module_id: string
          progress_percentage?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          learning_path_id?: string
          module_id?: string
          progress_percentage?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string
          started_at: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id: string
          started_at?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string
          started_at?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_usage: {
        Row: {
          created_at: string
          date: string
          feature_type: string
          id: string
          usage_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          feature_type: string
          id?: string
          usage_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          feature_type?: string
          id?: string
          usage_count?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_usage_limit: {
        Args: { _feature_type: string; _user_id: string }
        Returns: boolean
      }
      get_user_subscription: {
        Args: { _user_id: string }
        Returns: {
          expires_at: string
          features: Json
          limits: Json
          plan_name: string
          status: string
          tier: Database["public"]["Enums"]["subscription_tier"]
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      record_usage: {
        Args: { _count?: number; _feature_type: string; _user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      subscription_tier: "free" | "basic" | "premium" | "enterprise"
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
      app_role: ["admin", "moderator", "user"],
      subscription_tier: ["free", "basic", "premium", "enterprise"],
    },
  },
} as const
