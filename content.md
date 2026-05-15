# SORT Framework Scrollytelling — Site Copy

A scrollytelling explainer of the SORT framework from Slattery et al. (2026), *Classification of AI incident trajectories*.

---

## Site metadata

- **Title:** Separating harm from exposure — a walk through the SORT framework
- **Description:** A scrollytelling explainer of the SORT framework for classifying AI incident trajectories, using the conversational-AI self-harm case study and an autonomous-vehicle contrast.

---

## Header

> AI Incident Monitoring · A walk through the SORT framework

# AI incident reports are climbing.
## *What does that actually mean?*

Raw incident counts conflate three things: more deployed AI, more reporting infrastructure, and more harm per use. A new framework from Slattery et al. (2026) separates them — and in doing so produces opposite verdicts on two harms that look superficially similar.

— Scroll to begin —

---

## Act 1 — The problem

### Step 01: Reports are climbing.

The chart on the right is the most-cited evidence in current AI-risk discourse: monthly counts from the two major public incident databases, climbing year over year. By 2026 the curve looks alarming.

But before reacting to the slope, ask what it is actually measuring.

### Step 02: A climbing line has three competing readings.

The line might rise because AI is being deployed more widely, with each system functioning as it always did. It might rise because journalists and researchers have become better at noticing and reporting AI-related harms that were always happening. Or it might rise because each use of AI is now more likely to cause harm than it used to be.

These three readings imply very different policy responses.

**Chart annotations:**
- *More deployment?*
- *More reporting?*
- *More harm per use?*

### Step 03: Separate harm from exposure.

Slattery et al. (2026) propose a pipeline that refuses to pick between those three readings until *exposure* — how many people actually interact with the system — has been estimated separately from *harm*.

The framework has four steps: define a precise monitoring question, estimate harm and exposure independently, take their ratio, and classify the resulting trajectory.

**Pipeline caption (left-to-right):**

- Deployed AI systems — *Internal or external*
- Recorded incidents — *AIID · OECD AIM*
- Monitoring questions — *SORT framework*
- Harm · Exposure — *Estimation procedure*
- Classification — *2 × 2 trajectory*

---

## Act 2 — Building the monitoring question

### Step 04: A monitoring question has four parts.

SORT — *Subject, Opportunity, Risk event, Timeframe* — is the paper's structured analogue to PICO in evidence-based medicine. It forces analytical choices to be explicit rather than buried in framing.

Each box on the right holds one piece of the question. They will fill in one at a time using the case study at the centre of this piece: conversational AI and self-harm.

**Box prompts (initial state):**
- **S — Subject:** Who or what is at risk?
- **O — Opportunity:** What creates the exposure?
- **R — Risk event:** What specific harm?
- **T — Timeframe:** Over what period?

**Template caption:** Among [S] that [O], how many [R] per [T]?

### Step 05: Subject: who or what is at risk.

The subject is the population whose welfare is at stake — not the system causing the harm, but the people the harm reaches. Choose a population narrow enough to be measurable, broad enough to capture the phenomenon you actually care about.

For this case: *people living in the United States*. The choice of country fixes the available denominators downstream — census, regulatory filings, survey instruments.

### Step 06: Opportunity: what creates the exposure.

Opportunity isolates the specific mechanism through which the subject is exposed to the harm. It is not "uses AI" — that would cast too wide a net. It is the precise interaction pattern that makes the risk event possible.

Here: *using conversational AI systems for emotional support*. That tightens scope considerably and tightens the proxy choices we can use to estimate exposure later.

### Step 07: Risk event: the specific harm.

The risk event is the countable harm itself — phrased so an incident report can be matched against it. The paper specifies: *receiving responses that encourage, or fail to discourage, suicidal ideation or self-harm*.

A vaguer phrasing — "AI causes mental health harms" — would inflate the number of partial matches and make the trend signal noisier.

### Step 08: Timeframe: the unit of comparison.

Timeframe defines the observation window. *Per calendar year* is the default chosen here because the underlying databases publish in year-resolution and trends are what the framework is trying to surface.

### Step 09: Assembled, the monitoring question reads:

> Among *people living in the United States* *who use conversational AI systems for emotional support*, how many *receive responses that encourage, or fail to discourage, suicidal ideation or self-harm* *per calendar year*?

That single sentence is the unit of analysis. Everything downstream — which databases to search, which proxies to allow, what counts as a full match — flows from its exact phrasing.

> **Why this matters.** A monitoring question that is too narrow yields too few matches for a reliable trend. Too broad and the matches blur unrelated harms. The paper's interactive SORT tool exists to help analysts iterate toward questions that are both precise *and* answerable from available data.

---

## Act 3 — Estimating the two trends

### Step 10: Harm, source one: the AI Incident Database.

With no authoritative single source for this monitoring question, the procedure begins at *Tier 2* — combining proxy measures to construct bounds.

An LLM-assisted scan of the AIID returns *2 full matches in 2024* and *17 in 2025*. Two matches in 2024 is below the threshold for a reliable signal, so this database alone cannot resolve the trend. A second source is needed.

### Step 11: Source two: OECD AIM joins the lower bound.

The OECD AI Incidents Monitor uses a different sourcing pipeline. After filtering for US-based incidents involving conversational AI resulting in physical or psychological injury, the LLM analysis yields *8 full matches in 2024* (harm count range 9–17) and *55 in 2025* with a harm count in the hundred-thousand range — an explosive increase in the implied severity.

Two independent lower bounds, both directionally consistent. The trend claim begins to firm up.

### Step 12: An upper bound from a single proxy.

For an upper-bound estimate, the paper draws on OpenAI's own disclosure: approximately *0.15% of weekly active users* engage in conversations indicating potential suicidal planning or intent — more than one million people per week globally.

That number is not a lower-bound match count. It is a ceiling derived from a proxy proportion. The visual treatment on the right shows the two kinds of evidence differently for that reason.

> **Confidence tier — harm.** Both bounds move in the same direction, but the AIID count for 2024 falls below the three-match threshold and the OpenAI ceiling reflects global rather than US use. The trend claim is *increasing — Tier 2 · Low*. Expert elicitation or close monitoring of 2026 data would tighten this considerably.

### Step 13: Exposure has no direct measurement.

We rarely know how many people interact with a particular AI system, how many decisions are automated, or how many conversations take place. Exposure estimation typically relies on *Tier 2 methods* that combine multiple partial sources.

For this case the paper proxies emotional-support use via Pew Research data on adjacent ChatGPT uses, then scales by an estimate of ChatGPT's share of the broader LLM market.

### Step 14: The Pew proxy, plus a scaling assumption.

Pew Research data on ChatGPT use *"to learn new things"* and *"for entertainment"* by age group serves as the proxy frontier. The mid-point of those two shares becomes the point estimate; the shares are taken separately for the lower and upper bounds.

To extend from ChatGPT to all conversational AI, the paper applies a market-share scalar: *80%* at the point estimate, *90%* and *70%* for the upper and lower bounds.

> **Assumption stack — exposure.** The Pew share answering "for entertainment" serves as the lower bound on emotional-support use; the share answering "to learn new things" serves as the upper bound; the mid-point of the two serves as the central estimate. These shares are then applied uniformly to the US census population in matching age groups, and scaled by an assumed ChatGPT market share of LLM personal use.

### Step 15: Exposure: 64M in 2024, 88M in 2025.

Combining the assumption stack with the Pew bucket data and the US census yields a central estimate of *64 million* people in 2024 (plausible range 54–73M) and *88 million* in 2025 (75–99M). Order-of-magnitude estimate: 10⁸.

The trend is *increasing — approximately 40% year on year*. Confidence tier 2 · Medium: the bounds are derived from reasonable sources, the assumptions are explicit, and the directional reading is robust to the moves used to construct them.

---

## Act 4 — Classification (chatbot)

### Step 16: The simplest classification is a 2 × 2 grid.

The grid on the right takes the exposure trend (E) and the harm-per-exposure trend (Ĥ) as its two axes, producing four governance-relevant categories:

- *Escalating* — both Ĥ and E are increasing. Urgent attention.
- *Mitigating* — Ĥ is decreasing while E is increasing. Continue monitoring.
- *Concentrating* — Ĥ is increasing while E is decreasing. Targeted measures.
- *Receding* — neither dimension is worsening. Continue strategy.

### Step 17: The chatbot case lands in the top-right.

The OECD AIM signal grew sharply between 2024 and 2025, while exposure grew by approximately 40%. Harm rose faster than exposure — so harm-per-exposure is *increasing* against a rising exposure base.

Both arrows point up. The dot sits in the escalating quadrant.

### Step 18: Verdict: Escalating.

Both the population at risk and the harm per unit exposure are growing. The framework's recommendation: *urgent attention* — expanded monitoring, active investigation into causal drivers, and possibly regulatory intervention.

The confidence tier is Low; tightening it would require either mandatory disclosure of conversational-AI use or a dedicated survey instrument. Both fall outside the current data environment.

---

## Pivot

> Same framework · Different case · Different verdict

## AV crashes are rising too. Why does the framework call them *mitigating*?

The same procedure — define a monitoring question, estimate harm and exposure separately, classify — is now applied to a second case. The numbers come from NHTSA's mandatory reporting and the Autonomous Vehicle Industry Association. Watch where the dot lands.

---

## Act 5 — AV contrast

### Step 19: Now apply the same framework to autonomous vehicles.

NHTSA's mandatory reporting puts the procedure at *Tier 1* for harm: ADS incidents rose from *526 in 2024* to *975 in 2025*, an 85.4% increase — primarily driven by property-damage cases.

A headline that, by itself, would suggest the framework's most urgent classification. The chatbot dot from the previous section is ghosted for comparison.

### Step 20: But exposure doubled in the same period.

The Autonomous Vehicle Industry Association reports 145M miles driven on US public roads from June 2024 to May 2025, compared to 75M the previous year — roughly a doubling. Waymo's paid-ride velocity grew 80% in eight months in 2025.

The point estimate puts AV miles at *78M in 2024* and *156M in 2025*. Exposure grew approximately 100%.

> **Exposure assumption stack — AV.** The point estimate uses the AVIA anchor and assumes the monthly growth rate implied by Waymo's 2025 trajectory. The lower bound uses AVIA's May 2024 and May 2025 totals as whole-year proxies. The upper bound increases the point estimate by 10%.

### Step 21: Verdict: Mitigating.

Exposure growth (≈100%) outpaces harm growth (≈85%), yielding a *decreasing* harm-per-exposure trend against rising exposure. Fewer incidents occur per million vehicle-miles than the year before.

Same procedure. Comparable headline counts. Opposite governance implication. The framework's value is that it makes the second number — the exposure denominator — visible enough to change the verdict.

---

## Closing

> What the framework reveals

## Two harms with comparable headline counts, two opposite trajectories.

Conversational AI and self-harm gets *escalating*: both exposure and harm-per-exposure are rising. Autonomous vehicle crashes get *mitigating*: exposure is rising faster than harm. The headline count alone could not have told the difference between them.

The point of the framework isn't to settle the verdict. It's to make the assumption stack visible — the bound construction, the proxy choices, the confidence tier — so that policy makers and practitioners can argue about the moves, not just the conclusion.

— Slattery et al. (2026) · Classification of AI incident trajectories —

---

## Reference data

### Chatbot case study

**Monitoring question:** Among people living in the United States who use conversational AI systems for emotional support, how many receive responses that encourage, or fail to discourage, suicidal ideation or self-harm per calendar year?

#### Harm sources

| Source | Type | 2024 | 2025 |
|---|---|---|---|
| AIID (AI Incident Database) | Count — lower bound | 2 full matches | 17 full matches |
| OECD AIM (AI Incidents Monitor) | Count — lower bound | 8 full matches (harm count 9–17) | 55 full matches (harm count ~100k range) |
| OpenAI weekly-user report | Ceiling — upper bound | — | ≈ 1M / week globally (0.15% of WAU) |

**Harm trend:** Increasing — Tier 2 · Low confidence.

**Harm summary:** OECD AIM results increase over consecutive time periods. The limited AIID matches and upper-bound proxy likely reflect limited awareness and detection methods in 2024. Given the shifts in measurement and mitigation, expert elicitation or close monitoring of 2026 data is necessary before drawing high-confidence conclusions.

#### Exposure sources

- **Pew Research (Sidoti & McClain, 2025)** — ChatGPT use "to learn new things" and "for entertainment" by age bucket, 2024–2025. Lower bound: "for entertainment" only. Upper bound: "to learn new things" only.
- **FATJOE — LLM market-share statistics** — ChatGPT holds ≈ 80% market share of LLM personal use. Point: 80%. Lower: 70%. Upper: 90%.

#### Exposure assumption stack (verbatim)

1. The Pew share answering "for entertainment" serves as the lower bound on emotional-support use; the share answering "to learn new things" serves as the upper bound; the mid-point of the two serves as the central estimate.
2. These shares apply uniformly to the US census population in matching age groups.
3. ChatGPT accounts for 80% of LLM personal use (90% upper / 70% lower) — applied as a scalar to extend ChatGPT shares to all conversational AI use.

#### Exposure estimates

| Year | Central | Plausible range |
|---|---|---|
| 2024 | 64M | 54–73M |
| 2025 | 88M | 75–99M |

**Exposure trend:** Increasing (~40% YoY) — Tier 2 · Medium confidence. Order of magnitude: 10⁸.

**Classification:** *Escalating*.

**Verdict:** Both the population at risk and the harm per unit exposure are growing. This demands an urgent response: expanded monitoring, active investigation into causal drivers, and possibly regulatory intervention.

---

### AV case study

**Monitoring question:** Among autonomous vehicles (SAE Levels 3 through 5) on US public roads, how many experience incidents involving injury or property damage per million vehicle-miles, per calendar year?

#### Harm source

| Source | Type | 2024 | 2025 |
|---|---|---|---|
| NHTSA (US National Highway Traffic Safety Administration) | Mandatory — Tier 1 | 526 ADS incidents | 975 ADS incidents (~85.4% increase) |

**Harm trend:** Increasing — Tier 1 · High confidence.

**Harm summary:** Tier 1 — mandatory reporting ensures NHTSA provides a comprehensive dataset for analysis.

#### Exposure sources

- **AVIA — 2025 State of AV report** — 145M miles on US public roads from June 2024 to May 2025, vs. 75M in 2023–2024 — roughly doubling. Used as the point estimate's anchor for whole-year totals.
- **Waymo / CNBC paid-ride reports** — ≈ 250,000 rides/week April 2025 → ≈ 450,000 by December 2025 (80% in eight months). Implies a monthly growth rate applied to the AVIA central estimate.

#### Exposure assumption stack (verbatim)

1. The point estimate uses the AVIA anchor and assumes the monthly growth rate implied by Waymo's 2025 trajectory.
2. The lower bound uses AVIA's May 2024 and May 2025 endpoint totals for the whole years 2024 and 2025 respectively.
3. The upper bound increases the point estimate by 10%, mirroring the gap between the lower bound and the point estimate.

#### Exposure estimates

| Year | Central | Plausible range |
|---|---|---|
| 2024 | 78M miles | 75–86M |
| 2025 | 156M miles | 145–171M |

**Exposure trend:** Increasing (~100%) — Tier 2 · Medium confidence. Order of magnitude: 10⁸.

**Classification:** *Mitigating*.

**Verdict:** Exposure growth (≈ 100%) outpaces harm growth (≈ 85%), yielding a decreasing harm-per-exposure trend [Ĥ ↓] against rising exposure [E ↑]. Fewer incidents occur per million vehicle-miles, suggesting current safeguards keep pace with deployment. Absolute harm may still rise and warrants continued monitoring.

---

### Quadrant copy

| Quadrant | Trend signature | Subtitle | Summary |
|---|---|---|---|
| **Escalating** | Ĥ ↑ · E ↑ | Urgent attention | Both the population at risk and the harm per unit exposure are growing. Demands urgent response: expanded monitoring, active investigation, possibly regulatory intervention. |
| **Mitigating** | Ĥ ↓ · E ↑ | Monitor closely | More people are exposed, but harm per unit exposure is decreasing — existing safeguards appear to be working. Continued monitoring warranted; a failure of current controls could shift the trajectory to escalating. |
| **Concentrating** | Ĥ ↑ · E ↓ | Targeted measures | Fewer people are exposed, but those who face exposure face worse outcomes. Calls for targeted protective measures and investigation into why harm is intensifying. |
| **Receding** | Ĥ ↓ · E ↓ | Continue strategy | Neither dimension is worsening. Additional intervention may not be required; where specific measures preceded this trajectory, maintaining or extending them to related domains may be worthwhile. |

---

### Visualization labels

#### Act 1 — Incidents chart
- **Y axis label:** COUNT / MO
- **X axis:** 2020 — 2026
- **Series legend:** Incidents (6-mo avg) · Hazards (6-mo avg) · Total (monthly)
- **Reference line:** CHATGPT LAUNCH (Dec 2022)

#### Act 2 — SORT assembly
- **Caption when monitoring question is shown:** The monitoring question

#### Act 3 — Estimation panels
- **Panel headings:** Harm · Exposure
- **Panel sub-labels:** Variable H · Variable E
- **AIID card tag:** AIID — *AI Incident Database* — "Tier 2 · proxy construction · lower bound"
- **OECD card tag:** OECD AIM — *AI Incidents Monitor* — "Harm count 9–17 (2024) → ~100k range (2025)"
- **OpenAI card tag:** OpenAI — *Weekly user report* — "≈ 1M / week globally · Upper bound" — "Upper bound — proxy from disclosed proportion. No upper bound for 2024 was disclosed."
- **Pew card tag:** Pew — *Sidoti & McClain, 2025* — "Category-adjacent proxy"
- **Pew chart legend:** "For entertainment" · "To learn new things"
- **Market-share card tag:** FATJOE — *LLM market share* — "Lower 70% / Point 80% / Upper 90%" — "Applied as scalar to extend ChatGPT shares to all conversational AI use."
- **Harm conclusion label:** Trend → Increasing · Ĥ ↑ — Tier 2 · Low
- **Exposure conclusion label:** Trend → Increasing · E ↑ — Tier 2 · Medium
- **Exposure intro (before Pew loads):** No direct survey data on emotional-support use exists. Exposure must be approximated from partial proxies.

#### Acts 4 & 5 — Quadrant chart
- **Axes:** Ĥ trend → (decreasing ← → increasing) · E trend ↑ (decreasing ← → increasing)
- **Chatbot dot label:** Chatbot · self-harm
- **AV dot label:** AV · injury/damage
- **Classification caption label:** Classification

---

### UI / navigation

- **Nav arrow labels:** Previous step · Next step
- **Tuning panel:**
  - Heading: TUNE SNAP
  - Snap type: Mandatory / Proximity / Off
  - Snap stop: Always / Normal
  - Landmark snap: Off / On
  - JS force-snap: Off / On
  - Idle (slider, ms) · Anim (slider, ms)
  - Reset
- **Open-panel trigger:** ⚙ Tune
