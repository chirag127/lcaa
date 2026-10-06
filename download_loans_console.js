/**
 * LenDenClub Active & Closed Loans In-Browser Downloader
 * 
 * Instructions:
 * 1. Log in to https://app.lendenclub.com/ in your browser.
 * 2. Open Chrome/Edge DevTools (F12 or Ctrl + Shift + I).
 * 3. Go to the "Console" tab.
 * 4. Paste this entire script and press Enter.
 * 5. It will fetch all Active (OPEN) and Closed (CLOSED) loans and trigger
 *    an automatic download of 'lendenclub_loans_active_and_closed.json'.
 */
(async function downloadAllLenDenLoans() {
  console.log('%c[LenDenClub] Starting Active & Closed Loans Downloader...', 'color:#10B981;font-weight:bold;font-size:14px;');

  const API_BASE = 'https://investor-api.lendenclub.com/api/ims/retail-investor/v5/web/investor-loan-list';

  // 1. Resolve FE_TOKEN (x-ldc-key)
  let feToken = 'ZZtHBuU9DvRAO3INLXqoiDHN/48VFLWttVHXe+Zz/l6ZKWVlFN8CF3nkQjqZ4/je';
  try {
    const rawFE = localStorage.getItem('FE_TOKEN');
    if (rawFE) feToken = JSON.parse(rawFE);
  } catch (e) {}

  // 2. Resolve Investor ID and Auth Token
  let investorId = '5XDIOTZGEZ';
  let authToken = '';

  async function decryptToken(encToken) {
    if (!encToken || typeof encToken !== 'string' || encToken.length < 50) return encToken;
    try {
      const rawStr = atob(encToken);
      const rawBytes = new Uint8Array(rawStr.length);
      for (let i = 0; i < rawStr.length; i++) rawBytes[i] = rawStr.charCodeAt(i);
      const iv = rawBytes.slice(0, 16);
      const ciphertext = rawBytes.slice(16);
      const keyHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('q2l4f6z9o7j1'));
      const cryptoKey = await crypto.subtle.importKey('raw', keyHash, { name: 'AES-CBC' }, false, ['decrypt']);
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, cryptoKey, ciphertext);
      return new TextDecoder().decode(decrypted);
    } catch (err) {
      return encToken;
    }
  }

  // Check localStorage first
  try {
    const localUser = localStorage.getItem('user-data');
    if (localUser) {
      const u = JSON.parse(localUser);
      if (u?.data?.investor_id) investorId = u.data.investor_id;
      const rawTok = u?.data?.token?.access_token || u?.response?.token?.access_token;
      if (rawTok) authToken = await decryptToken(rawTok);
    }
  } catch (e) {}

  // Check Cookie fallback
  if (!authToken) {
    try {
      const cookieMatch = document.cookie.match(/user-data=([^;]+)/);
      if (cookieMatch) {
        const u = JSON.parse(decodeURIComponent(cookieMatch[1]));
        if (u?.data?.investor_id) investorId = u.data.investor_id;
        const rawTok = u?.data?.token?.access_token || u?.response?.token?.access_token;
        if (rawTok) authToken = await decryptToken(rawTok);
      }
    } catch (e) {}
  }

  console.log(`[LenDenClub] Authenticated as Investor ID: ${investorId}`);

  function getHeaders() {
    const h = {
      'Accept': 'application/json, text/plain, */*',
      'x-ldc-key': feToken
    };
    if (authToken) {
      h['Authorization'] = `Token ${authToken}`;
    }
    return h;
  }

  // 3. Build UI Progress HUD Badge
  let hud = document.getElementById('ldc-loan-downloader-hud');
  if (hud) hud.remove();
  hud = document.createElement('div');
  hud.id = 'ldc-loan-downloader-hud';
  hud.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999999;background:#0F172A;border:2px solid #10B981;border-radius:12px;padding:16px 22px;color:#F8FAFC;font-family:system-ui,-apple-system,sans-serif;font-size:13px;box-shadow:0 20px 40px rgba(0,0,0,0.8);width:360px;';
  hud.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <div style="display:flex;align-items:center;gap:8px;font-weight:700;color:#10B981;font-size:14px;">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#10B981;box-shadow:0 0 10px #10B981;"></span>
        LenDenClub Loan Downloader
      </div>
      <span id="ldc-hud-timer" style="color:#64748B;font-size:11px;">00:00</span>
    </div>
    <div id="ldc-hud-msg" style="color:#CBD5E1;font-size:12px;margin-bottom:10px;">Initializing API connection...</div>
    <div style="background:#1E293B;border-radius:6px;height:8px;overflow:hidden;margin-bottom:8px;">
      <div id="ldc-hud-bar" style="background:#10B981;height:100%;width:0%;transition:width 0.2s;"></div>
    </div>
    <div id="ldc-hud-stats" style="display:flex;justify-content:space-between;color:#94A3B8;font-size:11px;">
      <span id="ldc-hud-counts">Active: 0 | Closed: 0</span>
      <span id="ldc-hud-pct">0%</span>
    </div>
  `;
  document.body.appendChild(hud);

  const startTime = Date.now();
  const timerInt = setInterval(() => {
    const el = document.getElementById('ldc-hud-timer');
    if (el) {
      const s = Math.floor((Date.now() - startTime) / 1000);
      const m = Math.floor(s / 60);
      el.textContent = String(m).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
    }
  }, 1000);

  function updateHUD(msg, countsText, pct) {
    const m = document.getElementById('ldc-hud-msg');
    const b = document.getElementById('ldc-hud-bar');
    const p = document.getElementById('ldc-hud-pct');
    const c = document.getElementById('ldc-hud-counts');
    if (m) m.textContent = msg;
    if (b) b.style.width = Math.min(100, Math.max(0, pct)) + '%';
    if (p) p.textContent = Math.round(pct) + '%';
    if (c && countsText) c.textContent = countsText;
  }

  // 4. Generic fetcher for a given loan type ('OPEN' or 'CLOSED')
  const PAGE_LIMIT = 50; // 50 loans per request for fast retrieval

  async function fetchLoansForType(loanType, investmentType = 'MANUAL_LENDING') {
    const results = [];
    let offset = 0;
    let totalCount = null;

    while (true) {
      const url = `${API_BASE}?limit=${PAGE_LIMIT}&offset=${offset}&investor_id=${investorId}&partner_code=LDC&partner_id=&investment_type=${investmentType}&type=${loanType}`;
      
      let res;
      try {
        res = await fetch(url, { headers: getHeaders() });
      } catch (err) {
        console.warn(`[LenDenClub] Fetch error at offset ${offset}, retrying in 500ms...`, err);
        await new Promise(r => setTimeout(r, 500));
        res = await fetch(url, { headers: getHeaders() });
      }

      if (!res.ok) {
        console.error(`[LenDenClub] HTTP error ${res.status} at offset ${offset}`);
        break;
      }

      const json = await res.json();
      if (json?.success !== 1 || !json?.data) {
        console.warn(`[LenDenClub] Unexpected response at offset ${offset}:`, json);
        break;
      }

      const data = json.data;
      const typeKey = loanType.toLowerCase(); // 'open' or 'closed'
      const typeData = data[typeKey] || {};
      const batchLoans = typeData.loans || [];

      if (totalCount === null) {
        totalCount = typeData[`${typeKey}_count`] ?? data.total_count ?? 0;
        console.log(`[LenDenClub] Total ${loanType} Loans to fetch: ${totalCount}`);
      }

      results.push(...batchLoans);

      // Progress calculation
      const displayTotal = totalCount || (results.length + 1);
      const pct = Math.min(100, (results.length / displayTotal) * 100);
      updateHUD(
        `Fetching ${loanType} loans: ${results.length} / ${totalCount}`,
        null,
        pct
      );

      if (batchLoans.length === 0 || results.length >= totalCount) {
        break;
      }

      offset += PAGE_LIMIT;
      // Brief pause to keep network responsive
      await new Promise(r => setTimeout(r, 60));
    }

    return { totalCount: totalCount ?? results.length, loans: results };
  }

  // 5. Execute Extraction
  try {
    updateHUD('Fetching Active (OPEN) loans...', 'Starting...', 0);
    const activeResult = await fetchLoansForType('OPEN');
    console.log(`%c[LenDenClub] Fetched ${activeResult.loans.length} Active loans.`, 'color:#10B981;');

    updateHUD('Fetching Closed (CLOSED) loans...', `Active: ${activeResult.loans.length} | Closed: 0`, 50);
    const closedResult = await fetchLoansForType('CLOSED');
    console.log(`%c[LenDenClub] Fetched ${closedResult.loans.length} Closed loans.`, 'color:#10B981;');

    clearInterval(timerInt);

    // 6. Assemble Final Payload
    const outputData = {
      investor_id: investorId,
      exported_at: new Date().toISOString(),
      summary: {
        total_loans: activeResult.loans.length + closedResult.loans.length,
        active_loans_count: activeResult.loans.length,
        closed_loans_count: closedResult.loans.length
      },
      active_loans: activeResult.loans,
      closed_loans: closedResult.loans
    };

    // Store globally in window for easy inspection
    window.LDC_LOANS = outputData;

    // 7. Auto-download JSON File
    const blob = new Blob([JSON.stringify(outputData, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `lendenclub_loans_${investorId}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);

    // Update HUD to Success
    updateHUD(
      'Download Complete!',
      `Active: ${activeResult.loans.length} | Closed: ${closedResult.loans.length}`,
      100
    );
    const msgEl = document.getElementById('ldc-hud-msg');
    if (msgEl) {
      msgEl.innerHTML = `<strong style="color:#10B981;">&#10003; Successfully Downloaded!</strong><br><span style="color:#94A3B8;font-size:11px;">Saved to Downloads and stored in <code>window.LDC_LOANS</code></span>`;
    }

    console.log(`%c[LenDenClub] SUCCESS! Exported ${outputData.summary.total_loans} total loans to Downloads.`, 'color:#10B981;font-weight:bold;font-size:14px;');
  } catch (err) {
    clearInterval(timerInt);
    console.error('[LenDenClub] Error scraping loans:', err);
    updateHUD('Error occurred during scraping. Check console.', 'Error', 0);
  }
})();
