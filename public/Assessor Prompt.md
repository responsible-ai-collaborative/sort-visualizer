# SORT Assessment — Hand-off Prompt

Give this to anyone who has the AIID export (`incidents.csv`, and optionally `reports.csv`)
and access to a capable agent (Claude Code, Claude with file upload, ChatGPT with the file
attached, etc.). They fill in the six lines under MONITORING QUESTION, attach the file(s),
and paste the rest as-is. No API key, no pipeline checkout needed.

---

I'm attaching the AI Incident Database export (`incidents.csv`; `reports.csv` if available). I need you to assess it against one monitoring question. Please work through this brief end to end and give me the two output files at the end.

MONITORING QUESTION: <paste the full question sentence here>

This question has the following SORT components:
- S (Subject): <paste S>
- R (Risk Event): <paste R>
- T (Timeframe): <paste T>
- Harm unit: <what you want counted, e.g. "injuries or significant damage events". If unsure, reuse R.>

Periods to cover:
- Current period: <YYYY-MM-DD> to <YYYY-MM-DD>
- Previous period: <YYYY-MM-DD> to <YYYY-MM-DD>

INCIDENTS TO ASSESS:

Assess **every** incident in `incidents.csv` whose `date` falls inside either period above — both periods, one pass, no sampling. Tell me up front how many that is, and don't stop early or summarise a subset; if it's a lot, work in chunks and keep going until every one is done.

For each incident, use these fields:
- Incident ID (`incident_id`)
- Title (`title`)
- Description (`description`)
- Alleged deployer (`Alleged deployer of AI system`)
- Alleged developer (`Alleged developer of AI system`)
- Alleged harmed parties (`Alleged harmed or nearly harmed parties`)
- Full report text (optional): if `reports.csv` is attached, join `incidents.reports` (a list like `[242,243,244]`) to `reports.report_number` and take the first non-empty `text`, truncated to ~4000 characters. Pull it only for borderline cases — the description is usually sufficient.

Judge each incident on its own. Do not let one incident's verdict influence the next, and do not try to hit any particular match rate.

INSTRUCTIONS:

For each SORT component (S, R), determine if the incident matches. BE GENEROUS — the goal is to surface every plausibly related incident for a human reviewer, not to filter strictly on wording. Prefer "indeterminate" over "false" whenever there is ANY chance the incident could be relevant.

- "true": The incident plausibly matches this component. Exact wording is NOT required. Broader terms, near-synonyms, or overlapping categories count as "true" when the match is reasonable (e.g., MQ subject is "teenagers" and the incident says "minors" or "high-school students" → true; MQ subject is "AI chatbots" and the incident says "conversational AI" or "virtual assistant" → true).
- "indeterminate": Use this liberally. Use it whenever the incident is topically adjacent, uses broader or vaguer language that could include the MQ's target, or simply does not give enough detail to rule it in or out (e.g., MQ subject is "teenagers" and the incident says "young people" or "students" without specifying ages → indeterminate; MQ risk is "injury" and the incident describes a collision but does not specify whether anyone was hurt → indeterminate). This is the default when you are unsure.
- "false": Reserve for clear categorical mismatches where the incident is obviously about something else (e.g., MQ subject is "autonomous vehicles" and the incident is about a chatbot producing offensive text; MQ risk is "financial loss from scams" and the incident is about physical injury in a factory). Use "false" only when no reasonable reader would consider the incident related.

When in doubt, choose "indeterminate". Over-inclusion is preferable to over-exclusion — full matches and partial ones are separated downstream.

Then estimate the quantity of the specific harm described in R.
The harm unit is the one given above.

CRITICAL: Count INSTANCES of this specific harm, not incidents. If one incident caused 5 injuries, harm_quantity = 5. If it caused 1 death but the question asks about injuries, count only injuries. If a report says "thousands affected", estimate a plausible range.

- If R_match is "false", set harm_quantity_lower and harm_quantity_upper both to 0.
- If R_match is "true" or "indeterminate", estimate the harm quantity even if uncertain (use a range).
- If the report gives no numbers, use 1 as the lower bound if R_match is true.

List any data sources, statistics, deployment scale figures, or institutional references ACTUALLY MENTIONED in the incident text that could help estimate exposure (the denominator). Only list what is explicitly stated — do not suggest sources from general knowledge.

OUTPUT:

Give me a file `assessments.jsonl` with one JSON object per assessed incident, one per line, with EXACTLY these fields (no nesting, no extra fields):
{
  "incident_id": <integer>,
  "S_match": "true" | "false" | "indeterminate",
  "S_reasoning": "...",
  "R_match": "true" | "false" | "indeterminate",
  "R_reasoning": "...",
  "harm_quantity_lower": <integer>,
  "harm_quantity_upper": <integer>,
  "harm_quantity_reasoning": "...",
  "proxy_sources": ["source1", "source2"]
}

Every in-period incident gets exactly one line, including clear non-matches. Do NOT wrap the lines in markdown fences.

Then give me a second file `summary.json`. A "full match" is an incident where S_match and R_match are both "true". For each of the two periods report:
- `date_range`
- `full_matches`: count of full matches in that period
- `total_harm_lower` / `total_harm_upper`: sums of `harm_quantity_lower` / `harm_quantity_upper` over those full matches

Plus, across both:
- `direction`: whether current-period harm is up, down, or flat versus the previous period
- `data_sufficiency`: your judgement of whether these counts are adequate to support that direction

Think through each component carefully. At the end, tell me how many incidents you assessed, and flag any you couldn't read or had to guess on.
