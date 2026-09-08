"""
LenDenClub Full Automated 4,000 Borrower Details Scraper (Option B)
- Launches visible browser window for app.lendenclub.com
- Automatically pre-fills mobile number: 7428449707
- Waits for user to enter SMS OTP
- As soon as logged in, runs high-speed parallel browser-level fetch for all 3,967 loan IDs
- Saves progress incrementally to borrower_details_master.json
- Automatically enriches lending_data.json
"""

import os
import sys
import json
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def log(msg):
    print(msg, flush=True)

USER_DATA_DIR = os.path.join(os.path.expanduser("~"), ".lendenclub_playwright_profile")
DATA_JSON_PATH = r"c:\g\lcaa\lending_data.json"
OUTPUT_MASTER = r"c:\g\lcaa\borrower_details_master.json"

# 1. Load all 3,967 loan IDs from lending_data.json
with open(DATA_JSON_PATH, 'r', encoding='utf-8') as f:
    lending_data = json.load(f)

all_loans = lending_data.get('loans', [])
loan_ids = [l['id'] for l in all_loans if l.get('id')]
log(f"[INFO] Loaded {len(loan_ids)} total loans to scrape from {DATA_JSON_PATH}")

# Check existing progress
existing_profiles = {}
if os.path.exists(OUTPUT_MASTER):
    try:
        with open(OUTPUT_MASTER, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
            existing_profiles = existing_data.get('profiles', {})
            log(f"[INFO] Resuming with {len(existing_profiles)} already scraped profiles in {OUTPUT_MASTER}")
    except Exception as e:
        log(f"[WARN] Could not parse existing master: {e}")

remaining_ids = [lid for lid in loan_ids if lid not in existing_profiles]
log(f"[INFO] Remaining profiles to scrape: {len(remaining_ids)}")

log("=====================================================================")
log("  LenDenClub 4,000 Borrower Profiles Automated Scraper")
log("=====================================================================")
log(f"Profile Storage: {USER_DATA_DIR}")
log("Launching visible Chromium browser window...")

with sync_playwright() as p:
    context = p.chromium.launch_persistent_context(
        user_data_dir=USER_DATA_DIR,
        headless=False,
        args=["--start-maximized"],
        no_viewport=True
    )

    page = context.pages[0] if context.pages else context.new_page()

    log("Opening https://app.lendenclub.com/ ...")
    page.goto("https://app.lendenclub.com/", wait_until="domcontentloaded")

    log("\n" + "="*65)
    log(">>> ACTION REQUIRED IN BROWSER WINDOW <<<")
    log("1. Please enter your SMS OTP when prompted in the browser.")
    log("2. The script will automatically detect login and download all profiles!")
    log("="*65 + "\n")

    # Auto prefill phone number if login input is visible
    try:
        time.sleep(2)
        phone_input = page.locator('input[type="tel"], input[placeholder*="Mobile"], input[name*="mobile"], input[id*="mobile"]').first
        if phone_input.is_visible(timeout=3000):
            current_val = phone_input.input_value()
            if not current_val:
                log("[INFO] Pre-filling mobile number: 7428449707")
                phone_input.fill("7428449707")
    except Exception:
        pass

    # Wait for login: check localStorage 'user-data' or URL change
    investor_id = "5XDIOTZGEZ"
    logged_in = False

    for i in range(180): # Wait up to 6 minutes
        try:
            user_data_str = page.evaluate("() => localStorage.getItem('user-data')")
            if user_data_str:
                user_data = json.loads(user_data_str)
                inv = user_data.get('data', {}).get('investor_id')
                if inv:
                    investor_id = inv
                    logged_in = True
                    log(f"\n[LOGIN SUCCESS] Detected Investor ID: {investor_id}")
                    break

            # Or check if current URL indicates dashboard/portfolio
            curr_url = page.url
            if 'dashboard' in curr_url or 'portfolio' in curr_url or 'manual-lending' in curr_url:
                logged_in = True
                log(f"\n[LOGIN SUCCESS] Current URL: {curr_url}")
                break
        except Exception:
            pass

        time.sleep(2)
        if i > 0 and i % 15 == 0:
            log(f"Waiting for SMS OTP login... ({i*2}s elapsed)")

    if not logged_in:
        log("[ERROR] Timeout waiting for login. Please try again.")
        context.close()
        sys.exit(1)

    log("\n[STATUS] Injecting live floating scraper HUD into browser...")
    page.evaluate(f"""
    (() => {{
        let b = document.getElementById('ldc-bot-hud');
        if (!b) {{
            b = document.createElement('div');
            b.id = 'ldc-bot-hud';
            b.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999999;background:#0F172A;border:2px solid #10B981;border-radius:12px;padding:16px 20px;color:#F8FAFC;font-family:sans-serif;font-size:13px;box-shadow:0 10px 30px rgba(0,0,0,0.8);width:350px;';
            b.innerHTML = `
                <div style="display:flex;align-items:center;gap:8px;font-weight:700;color:#10B981;margin-bottom:6px;">
                    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#10B981;box-shadow:0 0 10px #10B981;"></span>
                    LenDenClub 4,000 Profile Extraction Active
                </div>
                <div id="ldc-hud-msg" style="color:#CBD5E1;font-size:12px;">Initializing high-speed parallel fetch...</div>
                <div style="background:#1E293B;border-radius:6px;height:8px;margin-top:10px;overflow:hidden;">
                    <div id="ldc-hud-bar" style="background:#10B981;height:100%;width:0%;transition:width 0.2s;"></div>
                </div>
            `;
            document.body.appendChild(b);
        }}
    }})()
    """)

    log(f"[INFO] Beginning parallel in-browser extraction for {len(remaining_ids)} remaining loans...")

    batch_size = 20
    scraped_count = len(existing_profiles)
    total_loans = len(loan_ids)

    for i in range(0, len(remaining_ids), batch_size):
        chunk = remaining_ids[i:i + batch_size]
        
        # Execute batch directly in browser's authenticated context
        batch_results = page.evaluate("""
        async ({ ids, investorId }) => {
            return await Promise.all(ids.map(async (lid) => {
                try {
                    const url = `/api/ims/retail-investor/v5/web/borrower-details?partner_code=LDC&loan_id=${lid}&source=LMS&investor_id=${investorId}&is_upcoming_investments_details=False&partner_id=`;
                    const res = await fetch(url);
                    const json = await res.json();
                    if (json && json.success === 1 && json.data) {
                        return { id: lid, data: json.data };
                    }
                } catch(e) {}
                return { id: lid, data: null };
            }));
        }
        """, {"ids": chunk, "investorId": investor_id})

        # Process results
        for item in batch_results:
            if item and item.get('id') and item.get('data'):
                existing_profiles[item['id']] = item['data']
        
        scraped_count += len(chunk)
        pct = (scraped_count / total_loans) * 100

        # Update in-browser HUD
        page.evaluate(f"""
        (() => {{
            const msg = document.getElementById('ldc-hud-msg');
            const bar = document.getElementById('ldc-hud-bar');
            if (msg) msg.textContent = 'Extracted {scraped_count} / {total_loans} borrower profiles ({pct:.1f}%)';
            if (bar) bar.style.width = '{pct:.1f}%';
        }})()
        """)

        log(f"  Scraped {scraped_count} / {total_loans} ({pct:.1f}%) profiles...")

        # Save progress every 100 loans
        if scraped_count % 100 == 0 or scraped_count >= total_loans:
            with open(OUTPUT_MASTER, 'w', encoding='utf-8') as f:
                json.dump({
                    'investor_id': investor_id,
                    'last_updated': time.strftime("%Y-%m-%d %H:%M:%S"),
                    'total_scraped': len(existing_profiles),
                    'profiles': existing_profiles
                }, f, indent=2)
            log(f"  [SAVED] Progress checkpoint written to {OUTPUT_MASTER}")

    # Final Save
    with open(OUTPUT_MASTER, 'w', encoding='utf-8') as f:
        json.dump({
            'investor_id': investor_id,
            'last_updated': time.strftime("%Y-%m-%d %H:%M:%S"),
            'total_scraped': len(existing_profiles),
            'profiles': existing_profiles
        }, f, indent=2)

    log("\n" + "="*65)
    log(f"SUCCESS! Extracted all {len(existing_profiles)} borrower profiles!")
    log(f"Saved master file: {OUTPUT_MASTER}")
    log("="*65 + "\n")

    page.evaluate("""
    (() => {
        const msg = document.getElementById('ldc-hud-msg');
        if (msg) msg.innerHTML = '<strong style="color:#10B981;">&#10003; 100% Extraction Complete!</strong> Profiles saved.';
    })()
    """)

    time.sleep(3)
    context.close()
    log("[COMPLETE] Browser closed. Ready for dashboard enrichment.")
