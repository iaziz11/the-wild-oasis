import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://myhligvdhdrgncayhwyh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15aGxpZ3ZkaGRyZ25jYXlod3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkxNjcyNzUsImV4cCI6MjAyNDc0MzI3NX0.7_QyxxeJAYsPcmiAqRZvmlgiajX42r9ioidSIJu3Ezo";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
