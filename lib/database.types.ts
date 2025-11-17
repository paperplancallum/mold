export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      batches: {
        Row: {
          id: string
          user_id: string
          created_at: string
          submitted_at: string
          estimated_completion_time: string
          status: 'in_review' | 'completed' | 'failed'
          technician_name: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          submitted_at: string
          estimated_completion_time: string
          status?: 'in_review' | 'completed' | 'failed'
          technician_name: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          submitted_at?: string
          estimated_completion_time?: string
          status?: 'in_review' | 'completed' | 'failed'
          technician_name?: string
        }
      }
      tests: {
        Row: {
          id: string
          user_id: string
          created_at: string
          location: string
          duration: string | null
          temperature: number | null
          humidity: number | null
          notes: string | null
          status: 'pending' | 'ready_for_review' | 'in_review' | 'analyzing' | 'completed' | 'failed'
          batch_id: string | null
          submitted_at: string | null
          estimated_completion_time: string | null
          reviewed_by_technician: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          location: string
          duration?: string | null
          temperature?: number | null
          humidity?: number | null
          notes?: string | null
          status?: 'pending' | 'ready_for_review' | 'in_review' | 'analyzing' | 'completed' | 'failed'
          batch_id?: string | null
          submitted_at?: string | null
          estimated_completion_time?: string | null
          reviewed_by_technician?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          location?: string
          duration?: string | null
          temperature?: number | null
          humidity?: number | null
          notes?: string | null
          status?: 'pending' | 'ready_for_review' | 'in_review' | 'analyzing' | 'completed' | 'failed'
          batch_id?: string | null
          submitted_at?: string | null
          estimated_completion_time?: string | null
          reviewed_by_technician?: string | null
        }
      }
      test_images: {
        Row: {
          id: string
          test_id: string
          storage_path: string
          public_url: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          test_id: string
          storage_path: string
          public_url: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          storage_path?: string
          public_url?: string
          uploaded_at?: string
        }
      }
      analysis_results: {
        Row: {
          id: string
          test_id: string
          mold_types: Json
          confidence: number
          severity: 'low' | 'moderate' | 'high'
          colony_count_estimate: string | null
          growth_density: string | null
          health_implications: string | null
          recommendations: string | null
          raw_response: Json
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          mold_types: Json
          confidence: number
          severity: 'low' | 'moderate' | 'high'
          colony_count_estimate?: string | null
          growth_density?: string | null
          health_implications?: string | null
          recommendations?: string | null
          raw_response: Json
          created_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          mold_types?: Json
          confidence?: number
          severity?: 'low' | 'moderate' | 'high'
          colony_count_estimate?: string | null
          growth_density?: string | null
          health_implications?: string | null
          recommendations?: string | null
          raw_response?: Json
          created_at?: string
        }
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
  }
}

export type Batch = Database['public']['Tables']['batches']['Row']
export type BatchInsert = Database['public']['Tables']['batches']['Insert']
export type BatchUpdate = Database['public']['Tables']['batches']['Update']

export type Test = Database['public']['Tables']['tests']['Row']
export type TestInsert = Database['public']['Tables']['tests']['Insert']
export type TestUpdate = Database['public']['Tables']['tests']['Update']

export type TestStatus = Test['status']
export type BatchStatus = Batch['status']

export type TestImage = Database['public']['Tables']['test_images']['Row']
export type AnalysisResult = Database['public']['Tables']['analysis_results']['Row']

export interface TestWithImage extends Test {
  image: TestImage | null
}

export interface TestWithAnalysis extends Test {
  analysis: AnalysisResult | null
  image: TestImage | null
}

export interface BatchWithTests extends Batch {
  tests: TestWithImage[]
}