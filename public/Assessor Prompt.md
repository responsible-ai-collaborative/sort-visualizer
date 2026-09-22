I'm attaching the AI Incident Database export (`incidents.csv`; `reports.csv` if available). I need you to assess it against one monitoring question ("MQ"). Work through this brief from top to bottom and give me the output files, then a final message as specified in PART 6.

PART 1: MONITORING QUESTION

MONITORING QUESTION: <paste the full question sentence here>

This monitoring question has the following "SORT" components:
- S (Subject): <paste S>
- O (Opportunity): <paste O, or leave blank>
- R (Risk Event): <paste R>
- T (Timeframe): <paste T>
- Harm unit: <what you want counted, e.g. "injuries and/or significant damage events". If unsure, reuse R.>

NOTE ON O: O is listed so that all SORT components can be entered, but it is not assessed, scored or reported on. Any recorded incident of harm already implies its subjects were exposed to the opportunity for harm. (O is normally used later, to narrow S when calculating exposure.) The exception is where O contains details that should narrow S or R, such as the subjects' location, a specific type of AI system, or a specific type of harm; see the last check in PART 2.

Time periods to cover (dates should be formatted as YYYY-MM-DD):
- First time period (T1): <YYYY-MM-DD> to <YYYY-MM-DD>
- Second time period (T2): <YYYY-MM-DD> to <YYYY-MM-DD>

SETTINGS (edit if you wish; the defaults apply if left unchanged)

Confirm my reading before starting: <yes | no> (default: yes)
- yes: before any analysis, you post how you have read the question (see PART 2) and stop until I reply. Reply "go" to accept it, or tell me what to change.
- no: you post your reading and carry straight on. Choose this for unattended or scheduled runs.

S-check depth for rows where R is false: <quick | full> (default: quick)
- quick: where R is false, S gets a fast screen and is labelled "Quick screen only (R is false)". This is much faster and cheaper. These rows can never be full matches or need review, so quick S labels cannot change your results.
- full: S is assessed for these rows with the same care as all others. It is slower and uses more tokens (roughly 100,000 more per 750 incidents; this is an estimate). Choose this if you are exploring, for example if you expect to widen R later or want a careful S label on every incident.

R-check depth: <screened | full> (default: full)
- full (the default): every incident's description is read and each R_reasoning is specific to it. This is more thorough but slower and uses more tokens (roughly 100,000 more per 750 incidents; this is an estimate).
- screened: R is judged from the title and a quick read for clearly unrelated incidents, and every incident is also put through the keyword safety net in 4.2. Rows decided this way are labelled "Screened:" in R_reasoning. It is cheaper and faster, but may miss an incident described in unusual words. Choose this for exploratory work or a very large export.

PART 2: CHECKS (before starting the analysis)

- Check that the user has completed the details of the monitoring question and there are no placeholder "<paste>" instructions remaining in the prompt (O may be left blank, and the S-check and R-check depth settings may be left as they are).
- Check that S, R and T match the full sentence (the precise phrasing may be slightly different).
- Check that the time periods T1 and T2 are contiguous AND the same length (consider a leap year to be the same length as a non-leap year; accuracy beyond this level is not required).
- Check that the harm unit is a countable noun and is unambiguous about what counts. If a type of event could reasonably be included or excluded (e.g. whether "injuries" includes deaths, or whether "self-harm" includes suicide), ask the user before starting.
- Check whether O contains details that should narrow S or R (see NOTE ON O). These can be subtle (for example who the users are or what they were doing, as well as location, type of system or type of harm), so read O closely and be cautious. If so, tell the user how you would incorporate them and ask them to confirm before starting. (The user may decline to incorporate these details if doing so would overcomplicate or unnecessarily narrow the analysis; O can always be reviewed manually afterwards. Offer a recommendation if that would help them decide.)

If any check fails, or if you are unsure or find any part of the monitoring question ambiguous, pause and query the user. If the checks pass and you find no ambiguities, no extra question is needed (but see the confirmation setting below).

Whether or not any check failed, post this short reading of the question for the user before starting the analysis:

"Here is how I have read your question. S: <...>. O: <not assessed / used to narrow S or R as follows: ...>. I may have missed something in O, so please check whether any aspect of it could narrow S or R. R: <...>. Harm unit: <what counts, and what does not; how repeated instances for the same person will be counted; and, if incidents rarely report this unit directly, say so and that counts will be sparse and rest on stated assumptions>. Periods: T1 <dates>, T2 <dates>. Settings: <the depth settings in use>. Please confirm, or tell me to change any of this; nothing here is fixed. If you change something after I have started, I will redo the affected parts."

Some harm units are reported far more often than others: deaths and injuries tend to be stated in incident descriptions and news reports, whereas units such as individual conversations, messages or exposures usually are not. Where the harm unit is of the second kind, say so in the reading above.

If the setting "Confirm my reading before starting" is "yes" (the default), stop after posting the reading and wait for the user's reply before doing any analysis. If it is "no", carry straight on. In either case, if the user replies with a change while you are working, apply it and redo whatever it affects.

After the user answers any question about these checks, restate in one line how you have interpreted their answer, and wait for confirmation before starting the analysis.

PART 3: INCIDENTS TO ASSESS

Assess **every** incident in `incidents.csv` whose `date` falls inside either period above: both periods, one pass, no sampling. Before starting the assessments, tell the user how many incidents that is. Don't stop early or summarise a subset; if it's a lot, work in chunks and keep going until every one is done.

Fields to use for each incident:
- Incident ID (`incident_id`)
- Title (`title`)
- Description (`description`)
- Alleged deployer (`Alleged deployer of AI system`)
- Alleged developer (`Alleged developer of AI system`)
- Alleged harmed parties (`Alleged harmed or nearly harmed parties`)
- Full report text (optional): if `reports.csv` is attached, join `incidents.reports` (a list like `[242,243,244]`) to `reports.report_number`. Use the first non-empty `text`, truncated to ~4000 characters, for borderline cases; for other purposes use the targeted searches described in 4.2 and 4.5 rather than reading whole reports.

Judge S and R for each incident on its own. Do not let one incident's verdict influence the next, and do not try to hit any particular match rate. (The one exception is the duplicate check in PART 4.)

Proceed with your best judgement on how to order and organise the work; the minimum reading required in 4.2 still applies. Do not ask the user to choose an approach up front unless a check has failed.

PART 4: ASSESSMENT RULES

4.1 Matching S and R (O is not assessed, other than in so far as it modifies S or R, as agreed with the user prior to analysis)

BE GENEROUS. The goal is to surface every plausibly related incident for a human reviewer, not to filter strictly on wording. Prefer "indeterminate" over "false" whenever there is ANY chance the incident could be relevant.

- "true": The incident plausibly matches this component. Exact wording is NOT required. Broader terms, near-synonyms, or overlapping categories count as "true" when the match is reasonable (e.g., IF MQ subject is "teenagers" and the incident says "minors" or "high-school students", THEN true; IF MQ subject is "AI chatbots" and the incident says "conversational AI" or "virtual assistant", THEN true).
- "indeterminate": Use this liberally. Use it whenever the incident is topically adjacent, uses broader or vaguer language that could include the MQ's target, or simply does not give enough detail to rule it in or out (e.g., IF MQ subject is "teenagers" and the incident says "young people" or "students" without specifying ages, THEN indeterminate; IF MQ risk is "injury" and the incident describes a collision but does not specify whether anyone was hurt, THEN indeterminate). This is the default when you are unsure.
- "false": Reserve for clear categorical mismatches where the incident is obviously about something else (e.g., IF MQ subject is "autonomous vehicles" and the incident is about a chatbot producing offensive text, THEN false; IF MQ risk is "financial loss from scams" and the incident is about physical injury in a factory, THEN false). Use "false" only when no reasonable reader would consider the incident related.

When in doubt, choose "indeterminate". Over-inclusion is preferable to over-exclusion; full matches and partial ones are separated downstream.

4.2 Additional rules for S and R

- Keyword safety net (always, whichever R-check depth is chosen): before finalising, search every in-period incident's title, description and, where `reports.csv` is attached, report text for broad terms taken from R and its near-synonyms (for example, for a suicide or self-harm question: suicide, suicidal, self-harm, kill himself or herself, end their life, overdose, and similar). Also run a second, broader search on the wider topic around R (for example, for a suicide or self-harm question: mental health, therapy, companion or romantic chatbots, depression, eating disorders, vulnerable or teenage users), and state the terms you used for both searches. Read every incident that matches either search and judge it individually; its R_reasoning must cite what you found. Do not decide R_match "false" for an incident that matches without reading the matching passage.
- If the R-check depth setting is "screened": for incidents with no safety-net match that are clearly unrelated to R from their title and a quick read, R_match may be "false" without a specific reading. Begin R_reasoning with "Screened:" and say how the verdict was reached (for example, "Screened: title and description unrelated; no R keywords found"). If any doubt remains, read the description and choose "indeterminate" or a specific reasoning. If the setting is "full" (the default), read the description of every in-period incident and make each R_reasoning refer to something specific in it, not just the title.
- If the S-check depth setting is "quick" (the default), then where R_match is "false" a quick screen for S is acceptable (keyword matching allowed): "true" if the incident clearly matches every part of S; "indeterminate" if it matches some parts of S but others cannot be judged from a quick read (e.g. the type of system matches but the users' location is not stated); "false" if it clearly does not match. Begin S_reasoning with "Quick screen only (R is false)" for these rows. If the setting is "full", assess S for these rows with the same care as all others.
- Where S depends on a detail the incident does not state (e.g. the user's country, age or sector), you may infer it from the report text or clear context (e.g. a named US state or court). Say "inferred" in S_reasoning. Mark "true" only if the inference is strong; otherwise "indeterminate". Do not infer it from the developer's or deployer's home country alone.
- Where a detail needed to assess S or R, to estimate harm, or to find exposure information is missing from the description and first report, search the full report text for terms relevant to that specific detail (drawn from the MQ; e.g. location, age, counts, usage figures) and read only the matching passages. Do this only where the answer could change a verdict or estimate, or would be a useful exposure lead. Do not read whole reports. If a search returns nothing, record "not stated" and move on. Skip the search for details the MQ does not involve or that reports rarely state.

4.3 Harm quantity

Estimate the quantity of the specific harm described in R, using the harm unit given in PART 1.

Which incidents get an estimate:
- S_match "false" or R_match "false": set harm_quantity_lower and harm_quantity_upper to 0, and state in harm_quantity_reasoning that no estimate was made and why.
- S_match and R_match both "true" or "indeterminate": estimate the harm quantity even if uncertain (use a range). If the report gives no numbers, use 1 as the lower bound when R_match is "true".

How to count:
- Use the tag "Extrapolated:" at the start of harm_quantity_reasoning for ANY harm figure, lower or upper bound, that goes beyond the instances actually reported in the incident or its reports (for example, an assumed number of further cases from a vague phrase such as "several", as well as rate-based estimates), and state the assumption. Figures that are only reported counts are not tagged.
- Count INSTANCES of this specific harm, not incidents. If one incident caused 5 injuries, harm quantity = 5. If it caused property damage but the question asks about injuries, count only injuries.
- If a report says "thousands affected", estimate a plausible range.
- If an incident reports an ongoing rate ("10 injuries per week"), estimate the harm from its start (or the incident `date` if no start is stated) through the end of the period (T1 or T2) that the incident's `date` falls in, or to the date the report says the harm ended or was fixed, if earlier. If the end of the period is later than the latest date in `incidents.csv`, use that latest date instead. Count only harm inside that period, even if the harm began earlier or is likely to have continued into the other period. Set the lower bound to the instances actually reported (or the rate over the period the report covers) and the upper bound to the extended estimate. Begin harm_quantity_reasoning with "Extrapolated:" and state the rate, dates and assumptions used, and note if the harm plausibly began before or continued after the incident's period. Where the report or first report also gives what is needed to estimate the harm in the OTHER period (for example, the rate and a stated or clearly implied end date), suggest a lower and upper figure for that period in the `other_period_*` fields (see 5.1), using only stated figures and the no-invented-factors rule below. Otherwise leave them null and say what is missing. Never count these suggested figures in `total_harm_lower` / `total_harm_upper`; the user decides in the workbook.
- Also treat any figure that implies a harm rate, such as a population or exposure count combined with a failure, error or prevalence rate, as an ongoing rate: derive a range from it, applying the same period limits as the bullet above and the same "Extrapolated:" tag. Use only figures stated in the incident or report text; do not supply a missing rate or factor from general knowledge or your own assumption. (Assumptions about timing, or about how the stated figures combine, are acceptable, but state them in harm_quantity_reasoning.) If a factor is missing (for example, how often the AI failed), say which one in harm_quantity_reasoning, do not use the exposure figure itself as the harm estimate, base the bounds on the instances actually reported, and flag the incident in PART 6 (item 4).
- Any ambiguity about what counts as the harm unit should already have been resolved in PART 2. If a new one arises mid-analysis, choose the most reasonable interpretation, record it in harm_quantity_reasoning, and report it in the final message (PART 6).

4.4 Duplicates

Although the AIID does its best to de-duplicate, different incidents sometimes describe the same underlying event. Assess S and R for each incident on its own, but when estimating harm, check whether the incident describes the same event(s) as another incident anywhere in `incidents.csv` (inside or outside the periods). Only check incidents where a harm estimate is being made. Use a search or script (for example, shared named individuals or places, or similar dates and wording) to find candidates across the whole file, then read only the candidates to confirm.

If a duplicate is confirmed:
- The incident with the earliest `date` (tie-break: lowest incident_id) is the "counted" incident.
- For each later duplicate, set both harm quantities to 0 and write "Duplicate of incident <ID>; counted there" in harm_quantity_reasoning.
- If only part of an incident overlaps an earlier one, count only the harm instances the earlier incident does not already cover.
- If the earliest incident falls outside both periods, the event belongs to that earlier period, so the in-period duplicate is still not counted.
- Later duplicates are excluded from full-match counts and harm totals, and are flagged for human review (see PART 5).

4.5 Exposure information (proxy_sources)

For incidents where a harm estimate is made, list anything ACTUALLY MENTIONED in the incident text or report text that could help the user estimate exposure (the denominator for a rate). This includes both figures (user counts, usage rates, survey results) and named sources the user could look up (reports, surveys, datasets, regulators, company disclosures, websites). Give equal weight to each kind. Search the report text using the targeted approach in 4.2. Only list what is explicitly stated; do not suggest sources from general knowledge. Use an empty list if there are none or no harm estimate was made.

PART 5: OUTPUT FILES

5.1 `assessments.jsonl`

One JSON object per assessed incident, one per line, with EXACTLY these fields (no nesting, no extra fields). Every in-period incident gets exactly one line, including clear non-matches. Do NOT wrap the lines in markdown fences.

{
  "incident_id": <integer>,
  "S_match": "true" | "false" | "indeterminate",
  "S_reasoning": "...",
  "R_match": "true" | "false" | "indeterminate",
  "R_reasoning": "...",
  "harm_quantity_lower": <integer>,
  "harm_quantity_upper": <integer>,
  "harm_quantity_reasoning": "...",
  "proxy_sources": ["...", "..."],
  "duplicate_of": <integer> | null,
  "ongoing_harm": true | false,
  "ongoing_harm_reasoning": "...",
  "other_period_harm_lower": <integer> | null,
  "other_period_harm_upper": <integer> | null,
  "other_period_basis": "..."
}

Field rules:
- `duplicate_of`: the incident_id of the earlier incident this one duplicates (see 4.4), otherwise null.
- `ongoing_harm`: true for every incident where neither S nor R is "false", it is not a later duplicate, and it seems to imply harm continuing beyond the incident's own period (rate-based or "Extrapolated:" rows, ongoing exposure or prevalence figures, harm described as continuing or recurring), even if no figure can be estimated. Otherwise false. `ongoing_harm_reasoning` says why the incident is included (quote the rate, duration or wording) AND whether harm in the other period could be calculated, naming any missing factor; use "" when false.
- `other_period_harm_lower` / `other_period_harm_upper`: your suggested harm for the OTHER period (T2 if the incident is dated in T1, otherwise T1), only where ongoing_harm is true and 4.3 allows an estimate (no invented factors); otherwise null, and other_period_basis says what is missing. `other_period_basis` gives the working and assumptions, or says what is missing; use "" when ongoing_harm is false.

5.2 `summary.json`

One object per period, with EXACTLY these fields:

{
  "T1": {
    "date_range": "<YYYY-MM-DD> to <YYYY-MM-DD>",
    "full_matches": <integer>,
    "total_harm_lower": <integer>,
    "total_harm_upper": <integer>,
    "review_needed": <integer>,
    "duplicates_flagged": [{"incident_id": <integer>, "duplicate_of": <integer>}]
  },
  "T2": { ...same fields... }
}

Definitions:
- A "full match" is an incident where S_match and R_match are both "true", excluding later duplicates. `full_matches` counts them; `total_harm_lower` / `total_harm_upper` sum harm_quantity_lower / harm_quantity_upper over them.
- `review_needed` counts each incident once if it meets ANY of these:
  - S is "true" and R is "indeterminate"
  - S is "indeterminate" and R is "true"
  - S and R are both "indeterminate"
  - Neither S nor R is "false" and the incident is a later duplicate
- An incident does not need review if S and R are both "true" (although a human may want to review it in any case), or if either S or R is "false".
- `duplicates_flagged` lists each later duplicate in that period with the incident it duplicates.
- These figures use the default settings: duplicates excluded, all harm counts included, and no other-period extrapolation. The workbook (5.3) lets the user change those settings.
- Totals cover full matches only. Incidents needing review are not in the totals; if a reviewer resolves one to a full match, its estimate is already in `assessments.jsonl` and can be added.

5.3 `assessments.xlsx` (spreadsheet version, for non-technical users)

Also produce an Excel workbook built from the JSON files. The JSON files remain the source of truth; make no new judgements in the workbook.

How to build it: if a file named `build_workbook.py` is attached, do not write your own workbook code. First write `assessment_notes.txt` (plain text, one note per line, about 6 to 12 lines, written for a non-technical reader): your reading of the question (S, O, R, harm unit, periods), the settings used, how repeated instances for the same person were counted, any exclusions made because of O, the specific judgement calls the user should check first, and which labels are least reliable. Then, after writing `assessments.jsonl` and `summary.json`, run `python build_workbook.py --jsonl assessments.jsonl --summary summary.json --incidents incidents.csv --notes assessment_notes.txt --out assessments.xlsx`, read its output, and fix any problem it reports (for example a mismatch with summary.json) by correcting the JSON files or the input paths, not by editing the workbook by hand. If the script is not attached, or fails and cannot be fixed, build the workbook yourself from the specification below. Its purpose is to let a non-technical reviewer change verdicts using dropdowns and see the Summary update by itself. Follow this specification exactly; the details exist because simpler designs failed in testing.

General rules
- Use live formulas for everything that depends on a dropdown. Never write a calculated total as a typed number. Use only long-established functions (IF, AND, COUNTIFS, SUMIFS, SUMPRODUCT, INDEX, MATCH). Use Arial. Do not add demonstration or placeholder rows.
- Dropdown vocabulary. Use "Yes" / "No" / "Indeterminate" for S and R (mapping to true / false / indeterminate in the JSON). Do NOT use "true" / "false" in dropdowns: Excel converts them to TRUE / FALSE values and the formulas then stop matching. Other dropdowns: "duplicate" / "not duplicate"; "include harm count" / "do not include harm count"; "Yes" / "No" (extrapolate to other period). Give each dropdown a list validation and colour the values (Yes green, No red, Indeterminate amber, duplicate orange, not duplicate grey, include green, do not include red).
- Every column header containing "(edit)" marks a column the user is meant to change: fill it bright yellow (FFFF00) with black bold text. All other headers are dark blue with white text.
- Freeze the header rows, wrap text, and make the incident page a clickable link (https://incidentdatabase.ai/cite/<incident_id>).
- Sheet order: Summary, Review - S and R, Review - Duplicates, Review - Extrapolation, All incidents, User guide. Create every review sheet even if it has no rows (headers plus a line saying "None found").

Which tab controls an incident
- Each incident is edited on ONE tab only, so two copies can never disagree. Priority: Review - Duplicates (duplicate_of is not null), then Review - Extrapolation (ongoing_harm is true), then Review - S and R (the review rules in 5.2 apply). Incidents matching none are edited on All incidents.
- On All incidents, any cell controlled from a review tab is a formula pointing at that tab's cell. Show it in grey italic (conditional formatting using ISFORMULA, placed first and set to stop further rules) and block typing in it with a custom data validation of FALSE and the error message "This incident is controlled from its review tab. Change it there."
- An incident on the Extrapolation tab that also has an S or R indeterminate issue stays on the Extrapolation tab; add "Also: S indeterminate" (or similar) to its ongoing-harm text.

All incidents (one row per incident, sorted by incident_id; columns in this order)
A incident_id, B date, C period (T1 or T2), D title, E S_match (edit), F R_match (edit), G duplicate (edit), H harm_include (edit), I full_match, J harm_lower, K harm_upper, L harm_counted_lower, M harm_counted_upper, N S_reasoning, O R_reasoning, P harm_reasoning, Q proxy_sources, R url.
- G starts as "duplicate" where duplicate_of is not null, otherwise "not duplicate". H starts as "include harm count".
- I = IF(AND(E="Yes",F="Yes",G="not duplicate"),"Yes","No")
- L = IF(AND(I="Yes",H="include harm count"),J,0); M is the same using K.
- J and K hold harm_quantity_lower and harm_quantity_upper (0 where S or R is false).
- Add filters and shade rows green where I is "Yes". Rows whose harm is 0 because S or R was "false" will not gain harm if a user switches the verdict; the Summary notes say so.

Review - S and R
Incidents meeting the review rules in 5.2 (not on the two tabs below), sorted by reason then date. Columns: incident_id, date, title, why it is here (S indeterminate with R true / R indeterminate with S true / both indeterminate), S (edit), R (edit), S reasoning, R reasoning, harm estimate (lower-upper, as text), incident page. Put a one-line instruction above the table.

Review - Duplicates
Columns: incident_id, date, title, appears to duplicate (the duplicate_of id), S (edit), R (edit), S reasoning, R reasoning, harm estimate (text), duplicate? (edit; starts "duplicate"), incident page. Instruction above the table: check both incidents describe the same events; if not, switch to "not duplicate". State that harm counts only if S and R are Yes, the incident is "not duplicate", and (on the extrapolation tab) it is set to include.

Review - Extrapolation
Rows are all incidents with ongoing_harm true that are not later duplicates and where neither S nor R is "No" (including those with no suggested figures), in two groups under banner rows: "Incidents dated in <T1 year> (T1)" then "... (T2)". Data rows start at row 6 (banner rows sit in between; formulas below ignore them). Columns: A incident_id, B date, C title, D home period, E why harm is ongoing (ongoing_harm_reasoning), F S (edit), G R (edit), H S reasoning, I R reasoning, J home-period harm lower (edit), K home-period harm upper (edit), L other period, M other-period harm lower (edit; suggested), N other-period harm upper (edit; suggested), O basis (other_period_basis), P include harm count? (edit), Q extrapolate to other period? (edit), R Status, S other-period counted: lower, T other-period counted: upper, U incident page.
- Colour: shade D, J, K in the home period's colour and L, M, N in the other period's colour (T1 light blue DDEBF7, T2 light green E2EFDA), so the home period is obvious.
- J and K are typed numbers (harm_quantity_lower/upper) and are the master values: on All incidents, J and K for these incidents are formulas pointing here (grey, locked as above).
- P starts "include harm count"; Q starts "No". M and N hold other_period_harm_lower/upper (leave empty if null; the basis says why). The user may type their own figures here.
- Let FM = the incident's full_match from All incidents (found with INDEX/MATCH on incident_id).
- S = IF(AND(FM="Yes",P="include harm count",Q="Yes"),M,0); T is the same with N.
- R (Status) = IF(FM<>"Yes","Not counted: S and R not both Yes, or duplicate",IF(P<>"include harm count","Not counted: excluded by you",IF(Q="Yes",IF(M="","Extrapolation chosen but no other-period figure: enter one in M and N","Counted in home and other period"),"Counted in home period only"))).
- Put an instruction above the table: check S and R and the home figures; choose include or do not include to keep or drop the incident's harm entirely; choose Yes to add the suggested other-period harm; figures are estimates for the user to judge.

Summary
- Title row, a one-line subtitle ("Updates automatically when you change dropdowns"), then a "Notes" line and one note per row, each written as a single unwrapped line in column A so it runs across the sheet, ABOVE the table. Notes to include: harm counts only where S = Yes, R = Yes, "not duplicate" and "include harm count" (the duplicate and include dropdowns have equal say); if a user switches a verdict to Yes they should check the incident has a harm estimate; grey cells are controlled from a review tab; extrapolated harm is added to the other period only where the user sets Yes.
- Table: one row per period. Columns: Period, Date range, Incidents assessed (COUNTIFS on period), Full matches (COUNTIFS on I = "Yes"), Harm lower and Harm upper (SUMIFS of L and M by period, plus the extrapolated amounts in the last two columns), Still indeterminate (S and/or R) (count of the period's incidents with S or R "Indeterminate" and neither "No"), Duplicates flagged (COUNTIFS on G = "duplicate"), of which extrapolated: lower and upper (SUMIFS of the Extrapolation tab's S and T columns where its other-period column equals the period).

User guide sheet
The fixed guide is written in `build_workbook.py` and is the same for every question, so if you are building the workbook yourself, reproduce it faithfully in plain language, in this order: what the workbook is (a first pass; the user decides; edits do not change the JSON files); Step 1 start at the Summary; Step 2 work through the review tabs (S and R, Duplicates, Extrapolation, with what to do on each and the note that an incident appears on the first tab that applies); Step 3 spot-check All incidents (grey cells are controlled from a review tab, green rows are full matches); how harm is counted (S Yes, R Yes, "not duplicate", and "include harm count"; the duplicate and include dropdowns have equal say; switching a No verdict to Yes may need a fresh harm estimate because those rows have zero harm by default); labels to treat with care ("Quick screen only (R is false)", "Screened:", "Extrapolated:"); the colours. Add a section "About this assessment" with counts taken from the JSON files, then a further section with the lines of `assessment_notes.txt`.

Check before delivering: recalculate the workbook (for example with LibreOffice) and confirm there are no formula errors and that the Summary matches summary.json at the default settings. Then, on a temporary copy that you do not deliver, change one incident's verdict on a review tab, recalculate, and confirm the Summary changes as expected.

PART 6: FINAL MESSAGE

After writing the files, first list the files you created, with one line explaining each. Explain that `assessments.xlsx` is a spreadsheet version of the same results for easier reading and review, that its yellow-headed columns are the ones to edit (dropdowns on the review tabs update the Summary automatically), and that the JSON files are the source data and are not updated by edits in the workbook. Then restate, in two or three lines, the reading of the question you worked to (S, O, R, harm unit, periods, settings), including any changes the user made. Then reply with the following, in this order:
1. Number of incidents assessed, and any you could not read. Also give the number of incidents with an indeterminate S or R label (these are labels for review, not guesses).
2. Results per period: full matches, total harm range (lower to upper), and number needing review, using exactly the definitions in 5.2. State how much of each period's total harm range comes from rows tagged "Extrapolated:", so the user can see how far the totals depend on estimates rather than reported counts.
3. Duplicates flagged: each later duplicate and the incident it duplicates.
4. Extrapolated and implied harm counts: list each incident whose harm estimate was extended beyond what was reported, or derived from a rate or prevalence figure, with the incident ID, the rate and dates assumed, and the resulting range. Make clear that these are your assumptions, not findings, and name the assumption each result is most sensitive to, so the user can judge or replace it. Then list every other incident on the extrapolation tab (ongoing_harm true), one line each: why it is there, and whether harm in the other period could be calculated, naming the missing factor and the implied scale where there is one (for example, "1.2 million users a week expressing suicidal ideation; failure rate not given"). Later duplicates receive zero and are not treated as ongoing. These incidents are counted only in their own period unless the user opts in on the extrapolation tab, so a comparison of T1 with T2 may be affected. Invite the user to review them there.
5. Any new ambiguity you met mid-analysis and how you resolved it.
6. A short "Method and design choices" section, in plain language for a non-technical reader, covering:
   - The order in which you completed the steps.
   - Any shortcuts, heuristics or keyword rules you used, and which incidents they affected (give counts). State how many incidents' descriptions you read in full and how many were only screened for R (and, with the "screened" setting, how many the keyword safety net flagged). If the R-check depth setting was "screened", briefly offer the user a full R read, with the cost. If the S-check depth setting was "quick", this includes the quick S screen (4.2): how many rows it covered, and that their S_match is less reliable but cannot change any full-match or review count. In that case, briefly offer the user a more thorough S review of these rows (by switching the setting to "full"), and note that it is mainly useful for exploratory work, for example if they later decide to widen R.
   - Where you used judgement instead of a rule, and where you read the full report text.
   - Any labels the user should treat as less reliable, and why.
   - Choices the user may want to change, with a one-line note on the cost of changing each (for example, time or token use).
   Invite the user to question or change any of these choices. Do not present shortcuts as full case-by-case judgement.
7. Promising exposure data: point out up to five of the most useful exposure leads stated in the incidents, whether figures or sources the user could look up, with the incident ID and what each says, so the user does not have to search for them. Do not add sources from outside the incidents. Restate each lead in full (incident ID and what it says); do not refer back to earlier items. If there are none, say so.
