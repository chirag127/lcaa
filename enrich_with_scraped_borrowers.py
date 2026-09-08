"""
Merge Scraped 4,000 Borrower Details into lending_data.json & dist/
"""

import os
import json
import time

DATA_JSON_PATH = r"c:\g\lcaa\lending_data.json"
DIST_DATA_PATH = r"c:\g\lcaa\dist\lending_data.json"
PUBLIC_DATA_PATH = r"c:\g\lcaa\public\lending_data.json"
MASTER_FILE = r"c:\g\lcaa\borrower_details_master.json"
DOWNLOADS_FILE = os.path.join(os.path.expanduser("~"), "Downloads", "all_4000_borrower_details.json")

def load_profiles():
    # Check master file first
    if os.path.exists(MASTER_FILE):
        try:
            with open(MASTER_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                profiles = data.get('profiles', {})
                if profiles:
                    print(f"[INFO] Loaded {len(profiles)} profiles from {MASTER_FILE}")
                    return profiles
        except Exception as e:
            print(f"[WARN] Error loading {MASTER_FILE}: {e}")

    # Check downloads folder
    for fn in ["borrower_details_master.json", "all_4000_borrower_details.json"]:
        dl_path = os.path.join(os.path.expanduser("~"), "Downloads", fn)
        if os.path.exists(dl_path):
            try:
                with open(dl_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    profiles = data.get('profiles', {}) or data.get('borrower_details', {})
                    if profiles:
                        print(f"[INFO] Loaded {len(profiles)} profiles from {dl_path}")
                        return profiles
            except Exception as e:
                print(f"[WARN] Error loading {dl_path}: {e}")

    return {}

def enrich():
    profiles = load_profiles()
    if not profiles:
        print("[INFO] No profiles available to merge yet.")
        return False

    with open(DATA_JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    loans = data.get('loans', [])
    enriched_count = 0

    for l in loans:
        lid = l.get('id')
        p = profiles.get(lid)
        if p:
            personal = p.get('personal', {})
            professional = p.get('professional', {})
            agreement = p.get('agreement', {})
            bureau = p.get('bureau', {})
            loan_info = p.get('loan', {})

            if personal.get('age'): l['borrower_age'] = personal['age']
            if personal.get('gender'): l['borrower_gender'] = personal['gender']
            if personal.get('city'): l['borrower_city'] = personal['city']
            if personal.get('marital_status') and personal.get('marital_status') != '-':
                l['borrower_marital_status'] = personal['marital_status']
            if personal.get('stay_type') and personal.get('stay_type') != '-':
                l['borrower_stay_type'] = personal['stay_type']

            if professional.get('income') and professional.get('income') != '-':
                try:
                    l['borrower_income'] = float(professional['income'])
                except:
                    l['borrower_income'] = professional['income']
            if professional.get('profession') and professional.get('profession') != '-':
                l['borrower_profession'] = professional['profession']
            if professional.get('employer') and professional.get('employer') != '-':
                l['borrower_employer'] = professional['employer']
            if professional.get('employment_status') and professional.get('employment_status') != '-':
                l['borrower_employment_status'] = professional['employment_status']

            if agreement.get('link'): l['agreement_url'] = agreement['link']
            if bureau.get('score_range') and bureau.get('score_range') != '-':
                l['bureau_score_exact'] = bureau['score_range']
            if loan_info.get('lenden_score') and loan_info.get('lenden_score') != '-':
                l['lenden_score'] = loan_info['lenden_score']
            if loan_info.get('loan_purpose') and loan_info.get('loan_purpose') != '-':
                l['loan_purpose'] = loan_info['loan_purpose']

            enriched_count += 1

    print(f"[SUCCESS] Enriched {enriched_count} / {len(loans)} loans with deep borrower profiles!")

    # Write to all 3 locations
    for path in [DATA_JSON_PATH, DIST_DATA_PATH, PUBLIC_DATA_PATH]:
        if os.path.exists(os.path.dirname(path)):
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f)
            print(f"[UPDATED] Saved enriched data to {path}")

    return True

if __name__ == '__main__':
    enrich()
