-- Create resource_views table to track dynamic view counts
CREATE TABLE IF NOT EXISTS resource_views (
  id SERIAL PRIMARY KEY,
  resource_id INTEGER NOT NULL UNIQUE,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE resource_views ENABLE ROW LEVEL SECURITY;

-- Create policies for resource_views table
CREATE POLICY "Anyone can view resource views" ON resource_views
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update resource views" ON resource_views
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can insert resource views" ON resource_views
  FOR INSERT WITH CHECK (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(resource_id_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE resource_views 
  SET view_count = view_count + 1 
  WHERE resource_id = resource_id_param
  RETURNING view_count INTO new_count;
  
  RETURN COALESCE(new_count, 2500);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_resource_views_updated_at ON resource_views;
CREATE TRIGGER update_resource_views_updated_at
  BEFORE UPDATE ON resource_views
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial view counts for all resources (17 resources)
-- Random values between 2500-3000 for credibility
INSERT INTO resource_views (resource_id, view_count) VALUES
  (1, 2750),  -- Resume Template
  (2, 2890),  -- PM Roadmap
  (3, 3120),  -- 400+ HR & Hiring Database
  (4, 2980),  -- Consulting Resource Pack
  (5, 2670),  -- Winner's Decks
  (6, 2840),  -- Deloitte Online Assessment Kit
  (7, 2910),  -- PwC Online Assessment Kit
  (8, 2760),  -- BCG Online Assessment Kit 1
  (9, 2830),  -- BCG Online Assessment Kit 2
  (10, 2950), -- SQL Handwritten Notes
  (11, 3010), -- 500+ HR Database
  (12, 2780), -- Top Product Companies Hiring
  (13, 2860), -- Software Hiring Database
  (14, 2930), -- Product Hiring Database
  (15, 2970), -- Realtime HR Database
  (16, 3040), -- McKinsey Interview Kit
  (17, 2820)  -- Excel Financial Model Template
ON CONFLICT (resource_id) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.resource_views TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE resource_views_id_seq TO anon, authenticated; 
