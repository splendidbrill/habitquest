import openpyxl, json

base = "meals and exercise plan/"

def sheet_records(path, sheetname, header_row_idx=1, first_data_idx=3):
    wb = openpyxl.load_workbook(base + path, data_only=True)
    ws = wb[sheetname]
    rows = [[("" if c is None else str(c)).strip() for c in r] for r in ws.iter_rows(values_only=True)]
    header = rows[header_row_idx]
    records = []
    for r in rows[first_data_idx:]:
        if not any(r):
            continue
        # skip if first cell empty (id)
        if not r[0]:
            continue
        rec = {}
        for i, h in enumerate(header):
            if h:
                rec[h] = r[i] if i < len(r) else ""
        records.append(rec)
    return records

meals = sheet_records("HabitQuest Meal Database.xlsx", "Meal Database")
acts = sheet_records("HabitQuest Activity Database.xlsx", "Activity Database")

with open(base + "_meals.json", "w", encoding="utf-8") as f:
    json.dump(meals, f, ensure_ascii=False, indent=1)
with open(base + "_activities.json", "w", encoding="utf-8") as f:
    json.dump(acts, f, ensure_ascii=False, indent=1)

print("MEALS:", len(meals), "ACTIVITIES:", len(acts))
print("\n--- MEAL NAMES ---")
for m in meals:
    print(f"  {m.get('meal_id')} | {m.get('meal_occasion')} | {m.get('cultural_cuisine_tags')} | {m.get('meal_name')}")
print("\n--- ACTIVITY NAMES ---")
for a in acts:
    print(f"  {a.get('activity_id')} | {a.get('interest_category')} | step {a.get('progression_step')} | {a.get('activity_name')}")
