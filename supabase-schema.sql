-- CLEAR Platform Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- ============================================================
-- PROFILES TABLE
-- Stores user profile information
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================
-- TRANSLATIONS TABLE
-- Stores user translation history
-- ============================================================
CREATE TABLE IF NOT EXISTS translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  reading_level TEXT DEFAULT 'general',
  document_type TEXT,
  risk_score INTEGER,
  risk_concerns JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Policies for translations
CREATE POLICY "Users can view own translations" ON translations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own translations" ON translations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own translations" ON translations
  FOR DELETE USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_translations_user_id ON translations(user_id);
CREATE INDEX IF NOT EXISTS idx_translations_created_at ON translations(created_at DESC);


-- ============================================================
-- USER_PROCESSES TABLE
-- Tracks user progress on government processes
-- ============================================================
CREATE TABLE IF NOT EXISTS user_processes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  process_id TEXT NOT NULL,
  completed_steps INTEGER[] DEFAULT '{}',
  notes TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, process_id)
);

-- Enable Row Level Security
ALTER TABLE user_processes ENABLE ROW LEVEL SECURITY;

-- Policies for user_processes
CREATE POLICY "Users can view own processes" ON user_processes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own processes" ON user_processes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own processes" ON user_processes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own processes" ON user_processes
  FOR DELETE USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_processes_user_id ON user_processes(user_id);


-- ============================================================
-- PROCESS_SUBMISSIONS TABLE
-- Crowdsourced process complexity data
-- ============================================================
CREATE TABLE IF NOT EXISTS process_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Basic info
  process_name TEXT NOT NULL,
  category TEXT NOT NULL,
  state TEXT NOT NULL,
  agency TEXT,
  description TEXT,
  
  -- Complexity data
  step_count TEXT,
  time_estimate TEXT,
  documents JSONB,
  fees DECIMAL(10,2),
  online_availability TEXT,
  
  -- Experience
  challenges TEXT,
  suggestions TEXT,
  
  -- Metadata
  submitter_name TEXT,
  submitter_email TEXT,
  wants_updates BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id)
);

-- Enable Row Level Security
ALTER TABLE process_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for process_submissions
CREATE POLICY "Anyone can submit" ON process_submissions
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can view own submissions" ON process_submissions
  FOR SELECT USING (auth.uid() = user_id OR status = 'approved');

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_status ON process_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_state ON process_submissions(state);


-- ============================================================
-- COMPLEXITY_ASSESSMENTS TABLE
-- Stores complexity calculator results
-- ============================================================
CREATE TABLE IF NOT EXISTS complexity_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  process_name TEXT NOT NULL,
  state TEXT,
  
  -- Dimension scores (1-10)
  step_count_score INTEGER,
  time_required_score INTEGER,
  document_burden_score INTEGER,
  agency_touchpoints_score INTEGER,
  cost_score INTEGER,
  language_complexity_score INTEGER,
  error_risk_score INTEGER,
  accessibility_score INTEGER,
  
  -- Calculated
  weighted_score DECIMAL(3,1),
  
  -- Notes
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE complexity_assessments ENABLE ROW LEVEL SECURITY;

-- Policies for complexity_assessments
CREATE POLICY "Users can view own assessments" ON complexity_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" ON complexity_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments" ON complexity_assessments
  FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- FEEDBACK TABLE
-- User feedback and bug reports
-- ============================================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- bug, feature, general
  page TEXT,
  message TEXT NOT NULL,
  email TEXT,
  status TEXT DEFAULT 'new', -- new, reviewed, resolved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policies for feedback
CREATE POLICY "Anyone can submit feedback" ON feedback
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can view own feedback" ON feedback
  FOR SELECT USING (auth.uid() = user_id);


-- ============================================================
-- VIEWS FOR ANALYTICS
-- ============================================================

-- Translation stats per user
CREATE OR REPLACE VIEW user_translation_stats AS
SELECT 
  user_id,
  COUNT(*) as total_translations,
  AVG(risk_score) as avg_risk_score,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as this_week,
  MAX(created_at) as last_translation
FROM translations
GROUP BY user_id;

-- Popular processes
CREATE OR REPLACE VIEW popular_processes AS
SELECT 
  process_id,
  COUNT(*) as user_count,
  AVG(array_length(completed_steps, 1)) as avg_completion
FROM user_processes
GROUP BY process_id
ORDER BY user_count DESC;

-- Submission stats by state
CREATE OR REPLACE VIEW submission_stats_by_state AS
SELECT 
  state,
  COUNT(*) as total_submissions,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'pending') as pending
FROM process_submissions
GROUP BY state
ORDER BY total_submissions DESC;


-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_processes_updated_at
  BEFORE UPDATE ON user_processes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- INITIAL DATA
-- ============================================================

-- You can add initial/seed data here if needed
-- Example: INSERT INTO ... VALUES ...;


-- ============================================================
-- NOTES
-- ============================================================
-- 
-- After running this schema:
-- 1. Enable Email auth in Supabase Dashboard > Authentication > Providers
-- 2. Enable Google OAuth if desired
-- 3. Enable GitHub OAuth if desired
-- 4. Set up email templates in Authentication > Email Templates
-- 5. Add your site URL to Authentication > URL Configuration
-- 
-- Environment variables needed:
-- VITE_SUPABASE_URL=https://your-project.supabase.co
-- VITE_SUPABASE_ANON_KEY=your-anon-key
-- ============================================================
