import json

d = json.load(open('lending_data.json', encoding='utf-8'))
loan_ids = [l['id'] for l in d['loans'] if l.get('id')]
print(f'Embedding {len(loan_ids)} loan IDs...')

script = f'''// LenDenClub 4,000 Borrower Details In-Browser Extractor
(async function runExtractor() {{
  console.log("%c[LenDenClub] Extractor started...", "color:#10B981;font-weight:bold;font-size:14px;");

  const loanIds = {json.dumps(loan_ids)};
  const userData = JSON.parse(localStorage.getItem('user-data') || '{{}}');
  const investorId = userData?.data?.investor_id || '5XDIOTZGEZ';

  // Create UI overlay badge
  const box = document.createElement('div');
  box.id = 'ldc-scraper-badge';
  box.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;background:#0F172A;border:2px solid #10B981;border-radius:12px;padding:16px 20px;color:#F8FAFC;font-family:sans-serif;font-size:13px;box-shadow:0 10px 30px rgba(0,0,0,0.7);width:340px;';
  box.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;font-weight:700;color:#10B981;margin-bottom:6px;">
      <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#10B981;box-shadow:0 0 10px #10B981;"></span>
      LenDenClub Extractor Active
    </div>
    <div id="ldc-scraper-text" style="color:#CBD5E1;font-size:12px;">Starting extraction for ${{loanIds.length}} loans...</div>
    <div style="background:#1E293B;border-radius:6px;height:8px;margin-top:10px;overflow:hidden;">
      <div id="ldc-scraper-bar" style="background:#10B981;height:100%;width:0%;transition:width 0.2s;"></div>
    </div>
  `;
  document.body.appendChild(box);

  const profiles = {{}};
  const batchSize = 15;
  let completed = 0;

  for (let i = 0; i < loanIds.length; i += batchSize) {{
    const batch = loanIds.slice(i, i + batchSize);
    await Promise.all(batch.map(async (id) => {{
      try {{
        const res = await fetch(`/api/ims/retail-investor/v5/web/borrower-details?partner_code=LDC&loan_id=${{id}}&source=LMS&investor_id=${{investorId}}&is_upcoming_investments_details=False&partner_id=`);
        const json = await res.json();
        if (json?.success === 1 && json?.data) {{
          profiles[id] = json.data;
        }}
      }} catch (err) {{}}
      finally {{ completed++; }}
    }}));

    const pct = ((completed / loanIds.length) * 100).toFixed(1);
    const txt = document.getElementById('ldc-scraper-text');
    const bar = document.getElementById('ldc-scraper-bar');
    if (txt) txt.textContent = `Progress: ${{completed}} / ${{loanIds.length}} profiles (${{pct}}%)`;
    if (bar) bar.style.width = pct + '%';
  }}

  // Auto-download result JSON
  const blob = new Blob([JSON.stringify({{ investor_id: investorId, total: Object.keys(profiles).length, profiles: profiles }}, null, 2)], {{ type: 'application/json' }});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'all_4000_borrower_details.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  const txt = document.getElementById('ldc-scraper-text');
  if (txt) txt.innerHTML = '<strong style="color:#10B981;">&#10003; Complete!</strong> Downloaded all_4000_borrower_details.json to Downloads.';
  setTimeout(() => box.remove(), 12000);
}})();
'''

with open('public/extract_borrowers.js', 'w', encoding='utf-8') as f:
    f.write(script)

with open('dist/extract_borrowers.js', 'w', encoding='utf-8') as f:
    f.write(script)

print('Successfully created public/extract_borrowers.js and dist/extract_borrowers.js')
