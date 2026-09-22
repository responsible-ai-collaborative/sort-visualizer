#!/usr/bin/env python3
"""Build assessments.xlsx from assessments.jsonl, summary.json and incidents.csv.

Usage:  python build_workbook.py [--jsonl assessments.jsonl] [--summary summary.json]
                                 [--incidents incidents.csv] [--out assessments.xlsx]
Makes no judgements: it only lays out what is in the JSON files and adds dropdowns and formulas.
"""
import argparse, json, os, shutil, subprocess, sys, tempfile
import pandas as pd
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.utils import get_column_letter as L

ap = argparse.ArgumentParser()
ap.add_argument('--jsonl', default='assessments.jsonl'); ap.add_argument('--summary', default='summary.json')
ap.add_argument('--incidents', default='incidents.csv'); ap.add_argument('--out', default='assessments.xlsx')
ap.add_argument('--notes', default='assessment_notes.txt', help='optional text file: one note per line, shown under "About this assessment"')
args = ap.parse_args()

F = 'Arial'
MAP = {'true': 'Yes', 'false': 'No', 'indeterminate': 'Indeterminate'}
TV = ['Yes', 'No', 'Indeterminate']; DUPV = ['duplicate', 'not duplicate']
INC = ['include harm count', 'do not include harm count']
BAND = {'T1': 'DDEBF7', 'T2': 'E2EFDA'}; BANNER = {'T1': '9DC3E6', 'T2': 'A9D08E'}
HD = PatternFill('solid', fgColor='1F3864')
def fill(c): return PatternFill('solid', fgColor=c, bgColor=c)

# ---------- load ----------
recs = [json.loads(l) for l in open(args.jsonl) if l.strip()]
summ = json.load(open(args.summary))
inc = pd.read_csv(args.incidents)[['incident_id', 'date', 'title']]
d = pd.DataFrame(recs).merge(inc, on='incident_id', how='left')
for col, default in [('duplicate_of', None), ('ongoing_harm', False), ('ongoing_harm_reasoning', ''),
                     ('other_period_harm_lower', None), ('other_period_harm_upper', None), ('other_period_basis', '')]:
    if col not in d: d[col] = default
d['date'] = d['date'].astype(str).str[:10]
d = d.sort_values('incident_id').reset_index(drop=True)
rng = {p: summ[p]['date_range'].split(' to ') for p in ('T1', 'T2')}
def period(dt):
    for p, (a, b) in rng.items():
        if a <= dt <= b: return p
    return ''
d['period'] = d.date.map(period)
d['S'] = d.S_match.map(MAP); d['R'] = d.R_match.map(MAP)
d['proxy'] = d.proxy_sources.apply(lambda x: '; '.join(x) if isinstance(x, list) else str(x))
d['url'] = 'https://incidentdatabase.ai/cite/' + d.incident_id.astype(str)
isnull = lambda v: v is None or (isinstance(v, float) and pd.isna(v))
d['is_dup'] = d.duplicate_of.map(lambda v: not isnull(v))

def reason(r):
    s, q = r.S, r.R
    if s == 'Yes' and q == 'Indeterminate': return 'R indeterminate (S Yes)'
    if s == 'Indeterminate' and q == 'Yes': return 'S indeterminate (R Yes)'
    if s == 'Indeterminate' and q == 'Indeterminate': return 'S and R both indeterminate'
    return None
d['reason'] = d.apply(reason, axis=1)
d['on_ext'] = d.ongoing_harm.astype(bool) & ~d.is_dup & (d.S != 'No') & (d.R != 'No')
dup = d[d.is_dup]; ext = d[d.on_ext]
rv = d[d.reason.notna() & ~d.is_dup & ~d.on_ext].sort_values(['reason', 'date'])
N = len(d) + 1

# ---------- helpers ----------
wb = Workbook()
def hdr(ws, row, cols, widths):
    for j, h in enumerate(cols, 1):
        c = ws.cell(row, j, h); c.alignment = Alignment(wrap_text=True, vertical='center')
        if '(edit)' in h: c.fill = fill('FFFF00'); c.font = Font(name=F, bold=True, color='000000')
        else: c.fill = HD; c.font = Font(name=F, bold=True, color='FFFFFF')
    for j, w in enumerate(widths, 1): ws.column_dimensions[L(j)].width = w
def body(ws, r0):
    for row in ws.iter_rows(min_row=r0):
        for c in row:
            link = c.hyperlink is not None
            c.font = Font(name=F, color='0563C1', underline='single') if link else Font(name=F, bold=bool(c.font and c.font.bold))
            c.alignment = Alignment(wrap_text=True, vertical='top')
def dv_list(vals):
    return DataValidation(type='list', formula1='"' + ','.join(vals) + '"', allow_blank=False, showErrorMessage=True,
                          errorTitle='Pick from list', error='Choose one of: ' + ', '.join(vals))
def colour(ws, rng_):
    for v, col in [('Yes', 'C6EFCE'), ('No', 'FFC7CE'), ('Indeterminate', 'FFEB9C'), ('duplicate', 'F4B183'),
                   ('not duplicate', 'E7E6E6'), ('include harm count', 'C6EFCE'), ('do not include harm count', 'FFC7CE')]:
        ws.conditional_formatting.add(rng_, CellIsRule(operator='equal', formula=[f'"{v}"'], fill=fill(col)))
def intro(ws, text, last_col, height):
    ws['A1'].font = Font(name=F, bold=True, size=12)
    ws['A2'] = text; ws['A2'].alignment = Alignment(wrap_text=True, vertical='top')
    ws.merge_cells(f'A2:{last_col}2'); ws.row_dimensions[2].height = height
def nonefound(ws, row): ws.cell(row, 1, 'None found').font = Font(name=F, italic=True)
def num(v): return None if isnull(v) else int(v)
ctrl = {}   # incident_id -> {column letter on All incidents: cell reference on a review tab}

# ---------- Review - S and R ----------
r1 = wb.active; r1.title = 'Review - S and R'
r1['A1'] = 'Review: S and/or R marked indeterminate'
intro(r1, 'What to do: read the reasoning and (if needed) the incident page, then set S and R to Yes, No or Indeterminate using the dropdowns. The Summary updates automatically. An incident is a full match only if both S and R are Yes.', 'J', 45)
hdr(r1, 4, ['incident_id', 'date', 'title', 'why it is here', 'S (edit)', 'R (edit)', 'S reasoning', 'R reasoning', 'harm estimate (lower-upper)', 'incident page'], [11, 12, 40, 24, 14, 14, 45, 45, 14, 30])
for i, r in enumerate(rv.itertuples(), 5):
    r1.append([r.incident_id, r.date, r.title, r.reason, r.S, r.R, r.S_reasoning, r.R_reasoning, f"{r.harm_quantity_lower}-{r.harm_quantity_upper}", r.url])
    r1.cell(i, 10).hyperlink = r.url
    ctrl[r.incident_id] = {'E': f"'Review - S and R'!E{i}", 'F': f"'Review - S and R'!F{i}"}
if len(rv):
    v = dv_list(TV); r1.add_data_validation(v); v.add(f'E5:F{4+len(rv)}'); colour(r1, f'E5:F{4+len(rv)}')
else: nonefound(r1, 5)
body(r1, 5); r1.freeze_panes = 'C5'

# ---------- Review - Duplicates ----------
r2 = wb.create_sheet('Review - Duplicates'); r2['A1'] = 'Review: incidents flagged as duplicating an earlier incident'
intro(r2, 'What to do: check the incidents describe the same events. If they do, leave as "duplicate" (the earlier incident is counted, this one is not). If they are different events, switch to "not duplicate". You can also edit S and R here. A harm count is included only if S and R are Yes, the incident is "not duplicate", and (if it appears on the extrapolation tab) it is set to "include harm count".', 'K', 48)
hdr(r2, 4, ['incident_id', 'date', 'title', 'appears to duplicate', 'S (edit)', 'R (edit)', 'S reasoning', 'R reasoning', 'harm estimate (lower-upper)', 'duplicate? (edit)', 'incident page'], [11, 12, 40, 18, 14, 14, 45, 45, 14, 18, 30])
for i, r in enumerate(dup.itertuples(), 5):
    r2.append([r.incident_id, r.date, r.title, int(r.duplicate_of), r.S, r.R, r.S_reasoning, r.R_reasoning, f"{r.harm_quantity_lower}-{r.harm_quantity_upper}", 'duplicate', r.url])
    r2.cell(i, 11).hyperlink = r.url
    ctrl[r.incident_id] = {'E': f"'Review - Duplicates'!E{i}", 'F': f"'Review - Duplicates'!F{i}", 'G': f"'Review - Duplicates'!J{i}"}
if len(dup):
    e = 4 + len(dup); v = dv_list(TV); v2 = dv_list(DUPV); r2.add_data_validation(v); r2.add_data_validation(v2)
    v.add(f'E5:F{e}'); v2.add(f'J5:J{e}'); colour(r2, f'E5:F{e}'); colour(r2, f'J5:J{e}')
else: nonefound(r2, 5)
body(r2, 5); r2.freeze_panes = 'C5'

# ---------- Review - Extrapolation ----------
xs = wb.create_sheet('Review - Extrapolation'); xs['A1'] = 'Review: incidents that appear to describe ongoing harm'
intro(xs, 'What to do: shaded "home" columns show harm in the period the incident is dated in; lighter columns show the assistant\'s suggested harm for the OTHER period. '
      '(1) Check S and R and, if you wish, the home-period harm figures (editable). (2) Set "include harm count" or "do not include harm count" to keep or drop this incident\'s harm from the figures altogether. '
      '(3) Set "extrapolate to other period" to Yes to add the suggested other-period harm. Harm counts only if S and R are Yes, the incident is not marked duplicate, and it is set to include. The Status column says what is happening.', 'U', 62)
hdr(xs, 5, ['incident_id', 'date', 'title', 'home period', 'why harm is ongoing', 'S (edit)', 'R (edit)', 'S reasoning', 'R reasoning',
            'home-period harm lower (edit)', 'home-period harm upper (edit)', 'other period', 'other-period harm lower (edit; suggested)', 'other-period harm upper (edit; suggested)',
            'basis for other-period figures', 'include harm count? (edit)', 'extrapolate to other period? (edit)', 'Status', 'other-period counted: lower', 'other-period counted: upper', 'incident page'],
    [11, 12, 36, 9, 40, 14, 14, 40, 40, 11, 11, 9, 13, 13, 40, 20, 15, 34, 12, 12, 30])
xs.row_dimensions[5].height = 60
row = 6; XR = []
if len(ext):
    for per in ('T1', 'T2'):
        sub = ext[ext.period == per]
        if not len(sub): continue
        xs.cell(row, 1, f'Incidents dated in {rng[per][0]} to {rng[per][1]} ({per})'); xs.merge_cells(start_row=row, start_column=1, end_row=row, end_column=21)
        xs.cell(row, 1).font = Font(name=F, bold=True); xs.cell(row, 1).fill = fill(BANNER[per]); row += 1
        for r in sub.itertuples():
            other = 'T2' if per == 'T1' else 'T1'
            why = r.ongoing_harm_reasoning + (f' Also: {r.reason}.' if isinstance(r.reason, str) else '')
            full = f"INDEX('All incidents'!$I$2:$I${N},MATCH(A{row},'All incidents'!$A$2:$A${N},0))"
            cond = f'AND({full}="Yes",P{row}="include harm count",Q{row}="Yes")'
            vals = [r.incident_id, r.date, r.title, per, why, r.S, r.R, r.S_reasoning, r.R_reasoning, int(r.harm_quantity_lower), int(r.harm_quantity_upper), other,
                    num(r.other_period_harm_lower), num(r.other_period_harm_upper), r.other_period_basis, 'include harm count', 'No',
                    f'=IF({full}<>"Yes","Not counted: S and R not both Yes, or duplicate",IF(P{row}<>"include harm count","Not counted: excluded by you",IF(Q{row}="Yes",IF(M{row}="","Extrapolation chosen but no other-period figure: enter one in M and N","Counted in home and other period"),"Counted in home period only")))',
                    f'=IF({cond},N(M{row}),0)', f'=IF({cond},N(N{row}),0)', r.url]
            for j, v_ in enumerate(vals, 1): xs.cell(row, j, v_)
            xs.cell(row, 21).hyperlink = r.url
            for j in (4, 10, 11): xs.cell(row, j).fill = fill(BAND[per])
            for j in (12, 13, 14): xs.cell(row, j).fill = fill(BAND[other])
            ctrl[r.incident_id] = {'E': f"'Review - Extrapolation'!F{row}", 'F': f"'Review - Extrapolation'!G{row}", 'H': f"'Review - Extrapolation'!P{row}",
                                   'J': f"'Review - Extrapolation'!J{row}", 'K': f"'Review - Extrapolation'!K{row}"}
            XR.append(row); row += 1
    v1, v2, v3 = dv_list(TV), dv_list(INC), dv_list(['Yes', 'No'])
    for v_ in (v1, v2, v3): xs.add_data_validation(v_)
    for r_ in XR: v1.add(f'F{r_}:G{r_}'); v2.add(f'P{r_}'); v3.add(f'Q{r_}')
    colour(xs, f'F6:G{row-1}'); colour(xs, f'P6:P{row-1}'); colour(xs, f'Q6:Q{row-1}')
    body(xs, 6)
else:
    nonefound(xs, 6); row = 7
XE = max(row - 1, 6); xs.freeze_panes = 'D6'

# ---------- All incidents ----------
ws = wb.create_sheet('All incidents')
cols = ['incident_id', 'date', 'period', 'title', 'S_match (edit)', 'R_match (edit)', 'duplicate (edit)', 'harm_include (edit)', 'full_match', 'harm_lower', 'harm_upper',
        'harm_counted_lower', 'harm_counted_upper', 'S_reasoning', 'R_reasoning', 'harm_reasoning', 'proxy_sources', 'url']
hdr(ws, 1, cols, [11, 12, 8, 40, 14, 14, 15, 20, 10, 10, 10, 11, 11, 45, 45, 45, 30, 30])
lock = DataValidation(type='custom', formula1='FALSE', allow_blank=False, showErrorMessage=True, errorStyle='stop',
                      errorTitle='Edit on the review tab', error='This incident is controlled from its review tab. Change it there.')
dS, dD, dH = dv_list(TV), dv_list(DUPV), dv_list(INC)
for v_ in (lock, dS, dD, dH): ws.add_data_validation(v_)
for i, r in enumerate(d.itertuples(), 2):
    c = ctrl.get(r.incident_id, {})
    vals = {'E': r.S, 'F': r.R, 'G': 'duplicate' if r.is_dup else 'not duplicate', 'H': 'include harm count', 'J': int(r.harm_quantity_lower), 'K': int(r.harm_quantity_upper)}
    for k in c: vals[k] = '=' + c[k]
    ws.append([r.incident_id, r.date, r.period, r.title, vals['E'], vals['F'], vals['G'], vals['H'],
               f'=IF(AND(E{i}="Yes",F{i}="Yes",G{i}="not duplicate"),"Yes","No")', vals['J'], vals['K'],
               f'=IF(AND(I{i}="Yes",H{i}="include harm count"),J{i},0)', f'=IF(AND(I{i}="Yes",H{i}="include harm count"),K{i},0)',
               r.S_reasoning, r.R_reasoning, r.harm_quantity_reasoning, r.proxy, r.url])
    ws.cell(i, 18).hyperlink = r.url
    for col in 'EFGH': (lock if col in c else dS if col in 'EF' else dD if col == 'G' else dH).add(f'{col}{i}')
    for col in 'JK':
        if col in c: lock.add(f'{col}{i}')
grey = dict(fill=fill('D9D9D9'), font=Font(italic=True, color='7F7F7F'))
ws.conditional_formatting.add(f'E2:H{N}', FormulaRule(formula=['ISFORMULA(E2)'], stopIfTrue=True, **grey))
ws.conditional_formatting.add(f'J2:K{N}', FormulaRule(formula=['ISFORMULA(J2)'], **grey))
colour(ws, f'E2:H{N}')
ws.conditional_formatting.add(f'I2:I{N}', CellIsRule(operator='equal', formula=['"Yes"'], fill=fill('C6EFCE')))
body(ws, 2); ws.freeze_panes = 'E2'; ws.auto_filter.ref = f'A1:R{N}'

# ---------- Summary ----------
s = wb.create_sheet('Summary', 0)
s['A1'] = 'Full matches (S = Yes, R = Yes, not a duplicate) by period'; s['A1'].font = Font(name=F, bold=True, size=12)
s['A2'] = 'Updates automatically when you change dropdowns on the review tabs or All incidents.'
notes = ['Harm is counted only where S = Yes, R = Yes, the incident is "not duplicate" and it is set to "include harm count". Duplicate / include dropdowns have equal say.',
         'If you switch an S or R verdict to Yes, check the incident has a harm estimate (columns J/K on All incidents); rows that were No have 0.',
         'Grey cells on All incidents are controlled from a review tab (S and R, Duplicates or Extrapolation); edit them there.',
         'Extrapolated harm is added to the other period only where you set "extrapolate to other period" to Yes on the extrapolation tab.']
s['A3'] = 'Notes'
for i, t in enumerate(notes, 4): s.cell(i, 1, t)
T0 = 9
hdr(s, T0, ['Period', 'Date range', 'Incidents assessed', 'Full matches', 'Harm lower (incl. extrapolation)', 'Harm upper (incl. extrapolation)', 'Still indeterminate (S and/or R)',
            'Duplicates flagged', 'of which extrapolated: lower', 'of which extrapolated: upper'], [10, 26, 12, 12, 14, 14, 20, 12, 14, 14])
A = "'All incidents'!"; X = "'Review - Extrapolation'!"
for r, p in enumerate(('T1', 'T2'), T0 + 1):
    C = f'{A}$C$2:$C${N}'
    row_ = [p, f'{rng[p][0]} to {rng[p][1]}', f'=COUNTIFS({C},"{p}")', f'=COUNTIFS({C},"{p}",{A}$I$2:$I${N},"Yes")',
            f'=SUMIFS({A}$L$2:$L${N},{C},"{p}")+I{r}', f'=SUMIFS({A}$M$2:$M${N},{C},"{p}")+J{r}',
            f'=SUMPRODUCT(({C}="{p}")*((({A}$E$2:$E${N}="Indeterminate")+({A}$F$2:$F${N}="Indeterminate"))>0)*({A}$E$2:$E${N}<>"No")*({A}$F$2:$F${N}<>"No"))',
            f'=COUNTIFS({C},"{p}",{A}$G$2:$G${N},"duplicate")',
            f'=SUMIFS({X}$S$6:$S${XE},{X}$L$6:$L${XE},"{p}")', f'=SUMIFS({X}$T$6:$T${XE},{X}$L$6:$L${XE},"{p}")']
    for j, v_ in enumerate(row_, 1): s.cell(r, j, v_)
for row_ in s.iter_rows(min_row=1):
    for c in row_:
        if c.row > T0 or (c.row < T0 and not (c.font and c.font.bold)): c.font = Font(name=F)
s['A3'].font = Font(name=F, bold=True)
for c in s[T0]: c.alignment = Alignment(wrap_text=True, vertical='center')
s.row_dimensions[T0].height = 45

# ---------- User guide ----------
nt = wb.create_sheet('User guide'); nt.column_dimensions['A'].width = 150
H, P = 'h', 'p'
guide = [
 (H, 'User guide'),
 (P, 'What this workbook is. It is a spreadsheet version of the assistant\'s results, for review. Every incident in the two periods is on the "All incidents" tab. The assistant\'s verdicts are a first pass; you decide the final answer. Edits here do not change the JSON files, so save your own copy if you want to keep your decisions.'),
 (H, 'Step 1: Start at the Summary'),
 (P, 'For each period it shows incidents assessed, full matches (S = Yes, R = Yes, not a duplicate), harm counted (a range, lower to upper), how many incidents still have an indeterminate S or R, and how many are flagged as duplicates. It updates by itself whenever you change a dropdown.'),
 (H, 'Step 2: Work through the review tabs'),
 (P, 'Each incident that needs a decision is on one tab only, and it is controlled from there. Cells you should edit have a yellow header. Where an incident could be on several tabs, it appears on the first that applies (Duplicates, then Extrapolation, then S and R).'),
 (P, 'Review - S and R: the assistant could not decide whether the incident matches the Subject (S) or the Risk event (R). This covers S Yes with R Indeterminate, S Indeterminate with R Yes, and both Indeterminate. Read the reasoning and, if needed, the incident page, then set S and R to Yes, No or Indeterminate.'),
 (P, 'Review - Duplicates: incidents that appear to describe the same event as an earlier incident. If they are the same event, leave "duplicate" (the earlier incident is counted and this one is not). If they are different events, change it to "not duplicate". You can also edit S and R here.'),
 (P, 'Review - Extrapolation: incidents that seem to describe harm that continued beyond the period they are dated in. Check S and R and the home-period harm figures. "Include harm count" or "do not include harm count" keeps or drops the incident\'s harm from the totals. "Extrapolate to other period" adds the suggested harm to the other period, and you can type in your own figure. The Status column says what is happening. These figures are estimates for you to judge. Caution! - Extrapolating figures requires careful reasoning and arithmetic.'),
 (H, 'Step 3 (optional): Spot-check "All incidents"'),
 (P, 'You can filter and search all incidents. Incidents not on a review tab can also be changed here. Grey cells correspond to incidents that appear in one of the review tabs - these can only be modified from the review tabs. Green rows correspond to full matches (S Yes and R Yes).'),
 (H, 'How harm is counted'),
 (P, 'Harm counts only where S = Yes, R = Yes, the incident is "not duplicate" and, for any incidents that appear in the "Review - Extrapolation" tab, the dropdown is set to "include harm count". The "duplicate" and "include" dropdowns have equal say. (Every incident also has a harm_include dropdown on All incidents; for incidents on the Extrapolation tab it is set there instead.) If you change a No verdict to Yes, you may need to manually (or with a fresh prompt of your LLM) assess the harm count, as rows that were assessed to be a non-match have a zero harm count by default.'),
 (H, 'Labels to treat with care'),
 (P, '"Quick screen only (R is false)" means S was judged from a quick read only because R was previously judged to be false. These S judgements are less reliable than thorough checks, but because R was judged to be false, the S judgement alone cannot influence the full match count. "Screened:" at the start of an R reason means R was judged from a quick screen plus a keyword check, not a full read. "Extrapolated:" means the harm figure goes beyond reported counts and rests on stated assumptions.'),
 (H, 'Colours'),
 (P, 'Yellow header: edit this column. Grey italic cell: controlled from a review tab. Green: Yes or include. Red: No or do not include. Amber: Indeterminate. Orange: duplicate.'),
 (H, 'About this assessment (counts from the JSON files)'),
 (P, f"Incidents assessed: {len(d)} (T1 {int((d.period=='T1').sum())}, T2 {int((d.period=='T2').sum())}). Rows whose R reason begins \"Screened:\": {int(d.R_reasoning.str.startswith('Screened').sum())}. Rows with a \"Quick screen only\" S reason: {int(d.S_reasoning.str.contains('Quick screen only').sum())}. Rows with an \"Extrapolated:\" harm reason: {int(d.harm_quantity_reasoning.str.startswith('Extrapolated').sum())}."),
 (P, f"Rows on the review tabs: S and R {len(rv)}, Duplicates {len(dup)}, Extrapolation {len(ext)}."),
]
if os.path.exists(args.notes):
    lines = [l.strip() for l in open(args.notes, encoding='utf-8') if l.strip()]
    if lines:
        guide.append((H, 'About this assessment (written by the assistant for this question)'))
        guide += [(P, l) for l in lines]
for i, (kind, text) in enumerate(guide, 1):
    c = nt.cell(i, 1, text); c.alignment = Alignment(wrap_text=True, vertical='top')
    c.font = Font(name=F, bold=True, size=13 if i == 1 else 11) if kind == H else Font(name=F)

wb._sheets = [wb['Summary'], wb['Review - S and R'], wb['Review - Duplicates'], wb['Review - Extrapolation'], wb['All incidents'], wb['User guide']]
wb.save(args.out)

# ---------- recalculate (so values show in previewers) and verify ----------
soffice = shutil.which('soffice') or shutil.which('libreoffice')
if soffice:
    tmp = tempfile.mkdtemp()
    subprocess.run([soffice, '--headless', '--convert-to', 'xlsx', '--outdir', tmp, args.out], capture_output=True, timeout=180)
    fixed = os.path.join(tmp, os.path.basename(args.out))
    if os.path.exists(fixed):
        v = load_workbook(fixed, data_only=True); errs = 0
        for w in v:
            for row_ in w.iter_rows(values_only=True):
                errs += sum(1 for x in row_ if isinstance(x, str) and x.startswith('#'))
        ok = errs == 0
        for r, p in enumerate(('T1', 'T2'), T0 + 1):
            got = [v['Summary'].cell(r, c).value for c in (4, 5, 6)]
            want = [summ[p]['full_matches'], summ[p]['total_harm_lower'], summ[p]['total_harm_upper']]
            if got != want: ok = False; print(f'MISMATCH {p}: workbook {got} vs summary.json {want}')
        if errs: print(f'{errs} formula error cells found')
        if ok: shutil.copy(fixed, args.out); print('Recalculated; no errors; Summary matches summary.json.')
        else: print('Not replaced with recalculated copy because of the problems above.')
    else: print('LibreOffice recalculation failed; workbook written without cached values (Excel will calculate on opening).')
else:
    print('LibreOffice not found; workbook written without cached values (Excel will calculate on opening).')
print(f'Wrote {args.out}: {len(d)} incidents; review tabs: S/R {len(rv)}, duplicates {len(dup)}, extrapolation {len(ext)}.')
