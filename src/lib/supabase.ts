import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://gcmmufnfcnzjjurcotev.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbW11Zm5mY256amp1cmNvdGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDQ0NDAsImV4cCI6MjA2ODQ4MDQ0MH0.eDrHtt9Uu_5HA4y6FObfb5jcPCsIzWQ_nORbErGYZFw',
);
