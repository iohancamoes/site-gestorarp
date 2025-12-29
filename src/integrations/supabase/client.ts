import { createClient } from "@supabase/supabase-js";

// As chaves fornecidas pelo usuário estão sendo usadas para configurar o cliente.
// Em um ambiente de produção, é altamente recomendável usar variáveis de ambiente.
const supabaseUrl = "https://abspgzjessdcewkgxfzw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFic3Bnemplc3NkY2V3a2d4Znp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNTM4NjcsImV4cCI6MjA4MTcyOTg2N30.UI4BeCXJJke3IJ102qpnuqYKjslMiItiGOpsWy-G1pk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);