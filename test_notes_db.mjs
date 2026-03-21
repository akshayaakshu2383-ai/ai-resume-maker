import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testNotesTable() {
    console.log("Checking 'notes' table...");
    const { data, error } = await supabase.from('notes').select('*').limit(1);
    if (error) {
        console.error("Error checking 'notes' table:", error.message);
        if (error.message.includes('relation "notes" does not exist')) {
            console.log("SUGGESTION: User needs to run the SQL for the 'notes' table.");
        }
    } else {
        console.log("'notes' table exists and is reachable.");
    }
}

testNotesTable();
