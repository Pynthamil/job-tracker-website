import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const url = urlMatch[1].trim();
const key = keyMatch[1].trim();

async function clean() {
  console.log('Fetching applications for Supabase...');
  const res = await fetch(`${url}/rest/v1/applications?company=eq.Supabase&select=id`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  const data = await res.json();
  
  if (data.length > 1) {
    const toDelete = data.slice(1).map(d => d.id);
    console.log(`Found ${data.length} entries. Deleting ${toDelete.length} duplicates...`);
    
    const deleteRes = await fetch(`${url}/rest/v1/applications?id=in.(${toDelete.join(',')})`, {
      method: 'DELETE',
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
    });
    
    console.log(`Deleted duplicates. Status:`, deleteRes.status);
  } else {
    console.log('No duplicates found.');
  }
}
clean();
