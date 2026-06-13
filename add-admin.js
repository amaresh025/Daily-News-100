const SUPABASE_URL = 'https://nshbfkgkvwtpbygxazpf.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zaGJma2drdnd0cGJ5Z3hhenBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTMxMTUzNSwiZXhwIjoyMDk2ODg3NTM1fQ.0OrtvpOpa08S2ayvr5P_q2iTCRf6OOeKntlLMqYi10w';
const USER_ID = 'f3bc5823-4a87-4de2-b3e0-f7014c82c952';

async function addAdminRole() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/user_roles`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      user_id: USER_ID,
      role: 'admin'
    })
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));
}

addAdminRole().catch(console.error);