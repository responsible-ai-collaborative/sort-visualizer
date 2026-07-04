# SORT Framework Scrollytelling — Site Copy

A scrollytelling explainer of the SORT framework from Mengesha et al. (2026), *A Pragmatic Classification Framework for AI Incident Monitoring*.

This file is the prose reference for the site. It is not consumed at build time; the step copy lives in `src/content/`. Keep the two in sync.

---

## Site metadata

- **Title:** Separating harm from exposure — a walk through the SORT framework
- **Description:** A scrollytelling explainer of a pragmatic classification framework for AI incident monitoring, walked through its conversational-AI self-harm case study — from raw incident counts to a probabilistic trajectory classification.

---

## Header

> AI Incident Monitoring · A walk through the SORT framework

# AI incident reports are climbing.
## *What does that actually mean?*

Raw incident counts conflate three things: more deployed AI, more reporting infrastructure, and more harm per use. A new framework from Mengesha et al. (2026) separates them — and reaches a verdict on AI chatbots and self-harm that the headlines would never suggest.

— Scroll to begin —

---

## Act 1 — The problem

### Step 01: Reports are climbing.

The chart on the right is the most-cited evidence in current AI-risk discourse: monthly counts of AI incidents and hazards from the OECD's public monitor, climbing year over year. By late 2025 the curve looks alarming.

But before reacting to the slope, ask what it is actually measuring.

### Step 02: A climbing line has three competing readings.

The line might rise because AI is being deployed more widely, with each system functioning as it always did. It might rise because journalists and researchers have become better at noticing and reporting AI-related harms that were always happening. Or it might rise because each use of AI is now more likely to cause harm than it used to be.

These three readings imply very different policy responses.

**Chart annotations:**
- *More deployment?*
- *More reporting?*
- *More harm per use?*

### Step 03: Separate harm from exposure.

Mengesha et al. (2026) propose a pipeline that refuses to pick between those three readings until *exposure* — the opportunity for harm to occur — has been estimated separately from *harm*.

The framework proceeds in three parts: define a precise monitoring question, estimate harm and exposure trends independently, and classify the resulting pair of trends into a governance-relevant trajectory.

**Pipeline caption (left-to-right):**

- Deployed AI systems — *Internal or external*
- Recorded incidents — *AIID · OECD AIM*
- Monitoring questions — *SORT framework*
- Harm · Exposure — *Estimation procedure*
- Classification — *Trajectory category*

---

## Framework output preview

### Step 04: The output is a trajectory, not a number.

Every monitoring question ends up in one of four trajectory categories, built from two directional trends: harm-per-exposure and exposure. Each category carries a distinct governance implication — from *continue strategy* to *urgent attention*.

And when the evidence cannot support even a directional call, the framework does something raw counts never do: it *abstains*. Keep that fifth outcome in mind — it returns at the end.

---

## Act 2 — Building the monitoring question

### Step 05: A monitoring question has four parts.

SORT — *Subject, Opportunity, Risk event, Timeframe* — is the paper's structured analogue to PICO in evidence-based medicine. It forces analytical choices to be explicit rather than buried in framing.

Each box on the right holds one piece of the question. They will fill in one at a time using the case study at the centre of this piece: conversational AI and self-harm.

**Box prompts (initial state):**
- **S — Subject:** Who or what is at risk?
- **O — Opportunity:** What creates the exposure?
- **R — Risk event:** What specific harm?
- **T — Timeframe:** Over what period?

**Template caption:** Among [S] that [O], how many [R] per [T]?

### Step 06: Subject: who or what is at risk.

The subject need not be a population of people — it can be systems, content, deployments, or *conversations*. The paper's choice here is deliberately fine-grained: *conversations between US users and conversational AI systems*.

Counting conversations rather than people fixes the unit of analysis for everything downstream. Exposure will be a conversation count, and harm a count of conversations that go wrong.

### Step 07: Opportunity: what creates the exposure.

Opportunity isolates the specific mechanism through which the subject is exposed to the harm. It is not "uses AI" — that would cast too wide a net. It is the precise interaction pattern that makes the risk event possible.

Here: conversations *in which users seek support regarding suicidal ideation or self-harm*. That tightens scope considerably and pins down which proxy sources can stand in for exposure later.

### Step 08: Risk event: the specific harm.

The risk event is the countable harm itself — phrased so an incident report can be matched against it. The paper specifies: the AI system *encourages, or fails to discourage, suicidal ideation or self-harm*.

A vaguer phrasing — "AI causes mental health harms" — would inflate the number of partial matches and make the trend signal noisier.

### Step 09: Timeframe: the unit of comparison.

Timeframe defines the observation window. *Per calendar year* is chosen here, comparing T1 = 2024 against T2 = 2025 — the framework always compares two periods to produce a trend, not an absolute level.

### Step 10: Assembled, the monitoring question reads:

> Among *conversations between US users and conversational AI systems* *in which users seek support regarding suicidal ideation or self-harm*, in how many does the AI *encourage, or fail to discourage, suicidal ideation or self-harm* *per calendar year*?

That single sentence is the unit of analysis. Everything downstream — which databases to search, which proxies to allow, what counts as a full match — flows from its exact phrasing.

> **Why this matters.** A monitoring question that is too narrow yields too few matches for a reliable trend. Too broad and the matches blur unrelated harms. A high ratio of partial to full matches in the databases is the framework's built-in warning that a question may be overspecified.

---

## Estimation tiers

### Step 11: Four tiers of evidence.

Answering the monitoring question means estimating harm and exposure across both periods. The paper grades every estimate by the strength of its evidence:

- **Tier 1 — Direct measurement.** An authoritative source: crash filings, pharmacovigilance registries, platform transparency reports. High confidence.
- **Tier 2 — Combine proxy measures.** No single source suffices; partial sources are combined into a point estimate. Medium confidence.
- **Tier 3 — Expert elicitation.** No quantitative sources at all; domain experts bound a plausible range. Low confidence.
- **Tier 4 — Abstain.** The plausible range spans orders of magnitude, or experts cannot converge. Principled abstention is a valid finding in its own right.

---

## Act 3 — Estimating harm

### Step 12: Harm, source one: the AI Incident Database.

Authoritative single sources rarely exist for AI harms, so the procedure starts with what incident databases can supply: a hard *lower bound* — the true harm cannot fall below what has already been recorded.

An LLM-assisted scan of the AIID returns *2 full matches in 2024* (assessed harm count: two) and *12 in 2025* — but the 2025 harm count explodes to *10,014–110,025*, because three of the matches are composite narratives: an APA warning about AI chatbots on Character.AI, an OpenAI statement on users showing signs of suicidal ideation, and an assessment of chatbot personas designed to promote self-harm.

### Step 13: Source two: OECD AIM joins the lower bound.

The OECD AI Incidents Monitor uses a different sourcing pipeline. Filtered for US-based incidents involving chatbots or content generation resulting in death or physical or psychological injury, LLM analysis yields *8 full matches in 2024* and *77 in 2025*.

Most matching entries are duplicates, lawsuits, or composite narratives. Removing them leaves *1 individual case of suicide in 2024* and *3 individual cases of suicide, murder-suicide or self-harm in 2025*. Two independent floors, both rising — but floors this sparse cannot carry a trend claim alone.

### Step 14: From floor to point estimate.

For a Tier 2 point estimate, the paper turns to OpenAI's own disclosures: around *0.15% of weekly active users* have conversations with explicit indicators of potential suicidal planning or intent — and, crucially, the disclosed ratio of *desired to undesired* model responses on self-harm conversations improved from roughly *40:60* (January 2024 – July 2025) to *80:20* (August–September 2025) to *92:8* (October–December 2025).

Combining those ratios with estimated conversation volumes gives a point estimate of total harm: conversations in which the model's response was undesired.

### Step 15: Harm: ≈2.4M in 2024, ≈4M in 2025.

The point estimate lands at roughly *2.4 million* harmful conversations in 2024 and *4 million* in 2025 — a trend of *increasing, ×~1.7*.

> **Confidence tier — harm.** Tier 2 · Medium: derived from reasonable publicly available proxy sources. The lower-bound estimates, although individually unrepresentative, are directionally consistent with the point estimate. The choice of harm type has a low inclusion probability in incident databases, which is why the floors sit six orders of magnitude below the point estimate.

---

## Act 3 — Estimating exposure

### Step 16: Exposure: a funnel of proxies.

Exposure is *the opportunity for harm to occur* — here, the number of conversations matching the opportunity, not the number of users. No one publishes that number, so it is assembled from a funnel of partial sources:

- ChatGPT weekly active users: *140M* (Jan 2024) → *300M* (Jan 2025) → *≈850M* (Dec 2025)
- Scaled up by OpenAI's share of generative-AI web traffic (*~75% falling to ~60%*) to cover all conversational AI
- Scaled down to the *~18%* of users based in the US

Interpolating monthly gives *≈34 million* US weekly active users across conversational AI platforms in January 2024, rising to *≈243 million* by December 2025.

### Step 17: Exposure: ≈4M conversations in 2024, ≈12M in 2025.

Applying OpenAI's 0.15% rate to those user counts, week by week, and summing each year: approximately *4 million* conversations matching the opportunity in 2024 and *12 million* in 2025.

The trend is *increasing, ×~3*.

> **Confidence tier — exposure.** Tier 2 · Medium: reasonable public proxies, explicit assumptions. The main limitation is aggregation bias: ChatGPT data proxies for all conversational AI platforms, and conversations are treated as equivalent regardless of user age — while OpenAI's share of a sharply growing market fell from ~80% to ~60% over the period.

---

## Act 4 — Classification

### Step 18: Take the ratio: the dot lands in Mitigating.

The grid takes the exposure trend (E) and the harm-per-exposure trend (Ĥ) as its two axes. Harm grew ×1.7 while exposure grew ×3 — so harm *per unit of exposure* fell by a factor of about *0.55*, against a rising exposure base.

Ĥ down, E up: the dot lands in the *mitigating* quadrant. Per conversation, these systems are getting safer — even as more people than ever have the conversations.

- *Escalating* — Ĥ ↑ · E ↑. Urgent attention.
- *Mitigating* — Ĥ ↓ · E ↑. Monitor closely.
- *Concentrating* — Ĥ ↑ · E ↓. Targeted measures.
- *Receding* — Ĥ ↓ · E ↓. Continue strategy.

### Step 19: How confident is that placement?

The estimates behind the dot carry real uncertainty — a factor of ~2 on each harm estimate, ~1.5 on each exposure estimate. The paper treats each quantity as log-normal, samples all four by Monte Carlo, and classifies every draw. The result is not a cell but a *distribution*:

- **Mitigating — 58.6%**
- **Unclassifiable — 31.6%**
- **Escalating — 9.8%**

The fifth outcome, *Unclassifiable*, absorbs the draws where a trend is too weak to call. Uncertainty appears as probability mass, not as false confidence.

### Step 20: Verdict: Mitigating — read alongside absolute harm.

Per-unit-exposure harm is decreasing while more people are exposed: existing safeguards appear to be working, and the classification is *Mitigating* at Medium confidence.

But the classification says nothing about absolute scale. Roughly four million harmful conversations is *more* than the year before — a Mitigating trajectory can coexist with large and growing absolute harm. The framework's instruction: always read the trajectory alongside the absolute estimates. A naive reading of the incident counts would have called this system more dangerous; the framework says it is becoming safer per use while the harm still grows.

---

## Closing

> What the framework reveals

## The headlines say chatbot harm is exploding. The framework says both more and less than that.

Incident counts for conversational AI and self-harm rose sharply between 2024 and 2025 — the naive reading is that chatbots are becoming more dangerous. Separate exposure from harm and the picture inverts: use grew three times over while harm grew 1.7×, so each conversation became meaningfully *safer*. And yet absolute harm still rose. Both facts are true at once, and only the decomposition can hold them together.

The point of the framework isn't to settle the verdict — nearly a third of the probability mass lands on *Unclassifiable*, and the paper says so. It's to make the assumption stack visible — the bound construction, the proxy choices, the uncertainty factors — so that policy makers and practitioners can argue about the moves, not just the conclusion.

— Mengesha et al. (2026) · A Pragmatic Classification Framework for AI Incident Monitoring —

---

## Reference data

### Chatbot case study

**Monitoring question:** Among conversations between US users and conversational AI systems in which users seek support regarding suicidal ideation or self-harm, in how many does the AI encourage, or fail to discourage, suicidal ideation or self-harm, per calendar year?

**Time periods:** T1 = 2024 (1 Jan–31 Dec 2024); T2 = 2025 (1 Jan–31 Dec 2025).

#### Harm sources

| Source | Type | 2024 | 2025 |
|---|---|---|---|
| AIID (AI Incident Database) | Count — lower bound | 2 full matches (harm count 2) | 12 full matches (harm count 10,014–110,025, driven by composite narratives) |
| OECD AIM (AI Incidents Monitor) | Count — lower bound | 8 full matches; de-duplicated: 1 suicide case | 77 full matches; de-duplicated: 3 cases of suicide, murder-suicide or self-harm |
| OpenAI disclosures | Point estimate — Tier 2 | desired:undesired ≈ 40:60 | 40:60 → 80:20 (Aug–Sep) → 92:8 (Oct–Dec) |

#### Harm point estimate

| Year | Estimate |
|---|---|
| 2024 | ≈2.4M harmful conversations |
| 2025 | ≈4M harmful conversations |

**Harm trend:** Increasing ×~1.7 — Tier 2 · Medium confidence.

**Harm summary:** Derived from reasonable publicly available proxy sources. The lower-bound estimates, although individually unrepresentative, are directionally consistent with the point estimates. Composite narratives account for the four-to-five order-of-magnitude spread in the AIID harm counts.

#### Exposure funnel (proxy stack)

1. ChatGPT weekly active users: 140M (Jan 2024) → 300M (Jan 2025) → ≈850M (Dec 2025).
2. OpenAI share of generative-AI web traffic ~75% → ~60% — scales ChatGPT figures to all conversational AI platforms.
3. ~18% of ChatGPT users are US-based → ≈34M (Jan 2024) → ≈243M (Dec 2025) US weekly active users across conversational AI.
4. ≈0.15% of weekly active users have conversations matching the opportunity (OpenAI disclosure), summed weekly across each year.

#### Exposure estimates

| Year | Estimate |
|---|---|
| 2024 | ≈4M conversations |
| 2025 | ≈12M conversations |

**Exposure trend:** Increasing ×~3 — Tier 2 · Medium confidence.

**Classification:** *Mitigating* — Ĥ ↓ ×~0.55 (1.7/3) against E ↑ ×~3. Confidence: Medium (lowest of the contributing estimates).

**Probabilistic weights** (uncertainty factors ~2 on harm, ~1.5 on exposure): Mitigating 58.6% · Unclassifiable 31.6% · Escalating 9.8%.

**Verdict:** Per-unit-exposure harm is decreasing while exposure rises — existing safeguards appear to be working. Absolute harm is still increasing; a Mitigating classification must always be read alongside the absolute estimates.

---

### Quadrant copy

| Quadrant | Trend signature | Subtitle | Summary |
|---|---|---|---|
| **Escalating** | Ĥ ↑ · E ↑ | Urgent attention | Both the population at risk and the harm per unit exposure are growing. Demands urgent response: expanded monitoring, active investigation, possibly regulatory intervention. |
| **Mitigating** | Ĥ ↓ · E ↑ | Monitor closely | More people are exposed, but harm per unit exposure is decreasing — existing safeguards appear to be working. Continued monitoring warranted; a failure of current controls could shift the trajectory to escalating. |
| **Concentrating** | Ĥ ↑ · E ↓ | Targeted measures | Fewer people are exposed, but those who face exposure face worse outcomes. Calls for targeted protective measures and investigation into why harm is intensifying. |
| **Receding** | Ĥ ↓ · E ↓ | Continue strategy | Neither dimension is worsening. Additional intervention may not be required; where specific measures preceded this trajectory, maintaining or extending them to related domains may be worthwhile. |
| **Unclassifiable** | — | Principled abstention | One or both trends cannot be determined with enough certainty to place the question on the grid. A valid finding in its own right: current evidence cannot support even a directional estimate. |

---

### Visualization labels

#### Design voice (site-wide)

- Display face: Newsreader (serif, italic voice for labels/annotations); body: Figtree; mono: JetBrains Mono, **data only** — no all-caps tracked eyebrow labels anywhere.
- Every viz carries a paper-style figure caption: *Fig. N — caption*, numbered by section order (1–7).
- Labels, roles, and captions are sentence case, set in italic Newsreader.

#### Act 1 — Incidents chart
- **Y axis label:** count / month
- **X axis:** Dec 2020 — Dec 2025
- **Series legend:** Incidents (6-mo avg) · Hazards (6-mo avg) · Total (monthly)
- **Reference line:** ChatGPT launch (Dec 2022), italic annotation
- **Data note:** monthly series exported from the OECD AI Incidents and Hazards Monitor (AIM) — actual counts, not the old Figure-1 approximation. Hovering a bar shows a tooltip with that month's incidents / hazards / total.

#### Act 2 — SORT assembly
- **Caption when monitoring question is shown:** The monitoring question

#### Act 3 — Estimation panels
- **Panel headings:** Harm · Exposure
- **Panel sub-labels:** Variable H · Variable E
- **AIID card tag:** AIID — *AI Incident Database* — "Lower bound · 2 → 12 full matches" — "2025 harm count 10,014–110,025, driven by composite narratives."
- **OECD card tag:** OECD AIM — *AI Incidents Monitor* — "Lower bound · 8 → 77 full matches" — "De-duplicated individual cases: 1 → 3."
- **Point-estimate card tag:** OpenAI — *Disclosed response quality* — "0.15% of WAU · desired:undesired 40:60 → 80:20 → 92:8"
- **Harm conclusion label:** Trend → Increasing ×~1.7 · H ↑ — Tier 2 · Medium
- **Exposure funnel row labels:** ChatGPT WAU · ÷ traffic share (~75%→~60%) · × ~18% US-based · × 0.15% weekly
- **Exposure conclusion label:** Trend → Increasing ×~3 · E ↑ — Tier 2 · Medium
- **Exposure intro note:** Exposure counts conversations matching the opportunity — not people.
- **Harm carryover chip (exposure panel):** H ✓ · Increasing ×~1.7 / Tier 2 · Medium

#### Act 4 — Quadrant chart
- **Axes:** Ĥ trend → (decreasing ← → increasing) · E trend ↑ (decreasing ← → increasing)
- **Chatbot dot label:** Chatbot · self-harm
- **Weight chips (step 19):** Mitigating 58.6% · Escalating 9.8%
- **Unclassifiable pill:** Unclassifiable · 31.6% — evidence too uncertain to place
- **Classification caption label:** Classification

---

### UI / navigation

- **Nav arrow labels:** Previous step · Next step
- **Progress stepper:** Stage N of 4 — Monitoring question · Harm · Exposure · Classification
