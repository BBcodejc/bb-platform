import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { type NextRequest } from 'next/server';

// Lazy-loaded Supabase client instances
let _supabase: SupabaseClient | null = null;

// Client-side Supabase client (browser only)
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Backwards compatibility export
export const supabase = {
  get client() {
    return getSupabase();
  }
};

/**
 * AUTHENTICATED route handler client — uses ANON_KEY + user session cookies.
 * This client RESPECTS Row Level Security (RLS).
 * Use this in ALL protected API routes after requireAdmin() passes.
 */
export function createRouteHandlerClient(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set() {},
      remove() {},
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, { ...options, cache: 'no-store' });
      },
    },
  });
}

/**
 * SERVICE ROLE client — bypasses RLS entirely.
 * ⚠️  ONLY use for:
 *   - Webhook handlers (no user session available)
 *   - Cron jobs
 *   - Elite player token auth (players don't use Supabase auth)
 *   - Operations that MUST bypass RLS
 * NEVER use for routes where a user session exists — use createRouteHandlerClient instead.
 */
export function createServiceRoleClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, { ...options, cache: 'no-store' });
      },
    },
  });
}

/**
 * @deprecated Use createRouteHandlerClient(request) for protected routes,
 * or createServiceRoleClient() for webhooks/cron. This alias exists only
 * for backwards compatibility during migration.
 */
export function createServerSupabaseClient(): SupabaseClient {
  return createServiceRoleClient();
}

// Database types
export type Database = {
  public: {
    Tables: {
      prospects: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          role: string;
          assessment_type: string | null;
          email: string;
          phone: string | null;
          first_name: string;
          last_name: string;
          player_age: number | null;
          player_level: string | null;
          player_height: string | null;
          player_position: string | null;
          three_pt_percentage: number | null;
          ft_percentage: number | null;
          shot_volume: string | null;
          primary_struggle: string[] | null;
          deep_distance_breakdown: string | null;
          previous_coaching: boolean | null;
          previous_coaching_details: string | null;
          goals: string | null;
          commitment_level: string | null;
          parent_child_age: number | null;
          parent_child_level: string | null;
          parent_goals: string | null;
          coaching_level: string | null;
          team_organization: string | null;
          certification_interest: boolean | null;
          org_name: string | null;
          org_player_count: number | null;
          org_goals: string | null;
          pipeline_status: string;
          high_ticket_prospect: boolean;
          notes: string | null;
        };
        Insert: Omit<Database['public']['Tables']['prospects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['prospects']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          prospect_id: string;
          stripe_payment_intent_id: string | null;
          stripe_checkout_session_id: string | null;
          amount: number;
          currency: string;
          status: string;
          product_type: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      test_results: {
        Row: {
          id: string;
          prospect_id: string;
          test_type: string;
          total_attempts: number | null;
          makes: number | null;
          spot_data: Record<string, unknown> | null;
          deep_distance_feet: number | null;
          rim_contacts: number | null;
          short_misses: number | null;
          consecutive_back_rim: number | null;
          target_arc: string | null;
          good_reps: number | null;
          oversized_score: number | null;
          release_time_avg: number | null;
          bb_level_achieved: number | null;
          notes: string | null;
          video_links: string[] | null;
          submitted_at: string;
        };
        Insert: Omit<Database['public']['Tables']['test_results']['Row'], 'id' | 'submitted_at'>;
        Update: Partial<Database['public']['Tables']['test_results']['Insert']>;
      };
      video_uploads: {
        Row: {
          id: string;
          prospect_id: string;
          google_drive_folder_id: string | null;
          google_drive_folder_url: string | null;
          video_type: string;
          file_count: number;
          uploaded_at: string;
        };
        Insert: Omit<Database['public']['Tables']['video_uploads']['Row'], 'id' | 'uploaded_at'>;
        Update: Partial<Database['public']['Tables']['video_uploads']['Insert']>;
      };
      evaluations: {
        Row: {
          id: string;
          prospect_id: string;
          current_bb_level: number | null;
          miss_profile: Record<string, unknown> | null;
          deep_distance_analysis: string | null;
          ball_flight_analysis: string | null;
          energy_transfer_notes: string | null;
          constraints_identified: string[] | null;
          priority_protocols: string[] | null;
          weekly_plan_summary: string | null;
          four_week_focus: string | null;
          full_assessment: string | null;
          profile_pdf_url: string | null;
          mentorship_fit_score: number | null;
          mentorship_recommendation: string | null;
          status: string;
          reviewed_by: string | null;
          reviewed_at: string | null;
          delivered_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['evaluations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['evaluations']['Insert']>;
      };
      mentorships: {
        Row: {
          id: string;
          prospect_id: string;
          evaluation_id: string | null;
          program_type: string;
          price: number;
          start_date: string | null;
          end_date: string | null;
          equipment_shipped: boolean;
          equipment_tracking: string | null;
          equipment_items: string[] | null;
          check_in_frequency: string;
          next_check_in: string | null;
          signwell_document_id: string | null;
          contract_signed: boolean;
          contract_signed_at: string | null;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['mentorships']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['mentorships']['Insert']>;
      };
    };
  };
};
