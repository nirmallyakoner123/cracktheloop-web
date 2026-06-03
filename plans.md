# CrackTheLoop: Pricing Plans & Credit Consumption Model

This document outlines the subscription tiers, credit metrics, consumption limits, and referral logic for **CrackTheLoop**.

---

## 💳 1. Subscription & Plan Catalog

We offer three paid plans and a free trial tier. Newly registered users enter the **Free Trial** by default (or can immediately subscribe to a paid tier).

| Plan Name | Price (USD) | Fuel Credits Provided | Duration / Cycle | Key Features |
| :--- | :--- | :--- | :--- | :--- |
| **Free Trial** | $0 | **15 Credits** (18 if referred) | 7-day expiration | Limit: 1 Interview & 1 Analysis |
| **Starter Pass** | $19 | **100 Credits** (120 if referred) | Monthly | Basic voice capture, Llama-3.1 |
| **Pro Pass** | $39 | **300 Credits** (360 if referred) | Monthly | Screen-sharing evasion, Groq & xAI |
| **Elite Pass** | $79 | **1000 Credits** (1200 if referred) | Monthly | GPT-4o-mini & Claude, resume parser |

---

## ⚡ 2. Credit Consumption Rules

Fuel credits are consumed based on active platform usage instead of per-API request:

### 🎙️ A. Real-Time Interview Sessions
* **Rate**: **1 credit per minute** of recorded interview.
* **Minimum Charge**: **10 credits** per saved interview session (even if the session is under 10 minutes).
* **Overage Calculation**: Any time exceeding 10 minutes is charged at 1 credit per minute, rounded up to the nearest minute.
  * *Example 1*: You run an interview for 45 seconds $\rightarrow$ Charged **10 credits** (minimum).
  * *Example 2*: You run an interview for 9 minutes 30 seconds $\rightarrow$ Charged **10 credits** (minimum).
  * *Example 3*: You run an interview for 12 minutes 20 seconds $\rightarrow$ Charged **13 credits** (10 minutes minimum + 2 minutes 20 seconds rounded up to 3 minutes).

### 🤖 B. AI Evaluation Report Analyses
* **Rate**: **5 credits** per evaluation report compilation.
* *Note*: Free Trial users can only run **1 analysis** (which costs 5 credits) and **1 interview** (costs 10 credits), exactly consuming their 15 credits.

---

## 🎁 3. Referral Program (Multiplier System)

When a user signs up using a referral link (`/ref?code=REF-XXXXXX`):

* **New Signups (Referred User)**:
  * Receives **+20% bonus credits** on their initial chosen package.
  * *Free Trial*: $15 \times 1.2 =$ **18 credits**
  * *Starter Pass*: $100 \times 1.2 =$ **120 credits**
  * *Pro Pass*: $300 \times 1.2 =$ **360 credits**
  * *Elite Pass*: $1000 \times 1.2 =$ **1200 credits**
* **Referrers (Recommending User)**:
  * Receives **+50% bonus credits** of the referred user's package base credits credited to their account.
  * *Referred User joins Trial*: Referrer receives $+8$ credits ($15 \times 0.5 = 7.5$, rounded up).
  * *Referred User purchases Starter*: Referrer receives $+50$ credits ($100 \times 0.5 = 50$).
  * *Referred User purchases Pro*: Referrer receives $+150$ credits ($300 \times 0.5 = 150$).
  * *Referred User purchases Elite*: Referrer receives $+500$ credits ($1000 \times 0.5 = 500$).
