# AI Spend Audit - Metrics Strategy

This document outlines the performance indicators, instrumentation plans, and key pivot triggers for the AI Spend Audit product, treated as a B2B lead-generation tool.

---

## 1. The North Star Metric
Our single North Star metric is **Qualified Lead Conversion Count**.

### Why this metric?
This app is a lead-generation funnel for Techvruk. Traffic counts or raw "audits run" are vanity metrics if they don't capture emails from high-value prospects. Tracking qualified leads (defined as email capture submissions from companies with team size >= 3 or monthly spend >= $200) ensures that we are acquiring users who have real SaaS waste and could plausibly convert to Techvruk consulting clients.

---

## 2. Three Key Input Metrics
To drive our North Star metric, we monitor and optimize three input metrics:

1. **Audit Completion Rate (Form Submission %)**
   - *Formula*: (Audits Submitted / Total Landing Page Visitors)
   - *Why*: Measures the UX friction of our spend input form. If users bounce here, they never see value and cannot convert.
2. **Value Gate Conversion Rate**
   - *Formula*: (Emails Captured / Audits Displayed)
   - *Why*: Measures the value of the on-screen audit results. If this is too low, our copy is weak or our savings recommendations are not compelling enough to trade an email for.
3. **Viral Share Multiplier (K-Factor)**
   - *Formula*: (Visits via Public Share Links / Total Audits Completed)
   - *Why*: Measures the efficiency of our viral loop (the shareable URL). A higher K-factor brings free referral traffic without paid acquisition.

---

## 3. Instrumentation Plan
To start, we would instrument the following events using a lightweight privacy-focused analytics engine (like **Plausible** or **PostHog**):

1. `landing_page_view`: Track baseline referral sources (Twitter, Hacker News).
2. `audit_form_step_added`: Monitor how many tools are input (indicates stack size).
3. `audit_calculated`: Log audit totals, savings bracket (low, med, high).
4. `lead_captured`: Log email submissions, company size, and role.
5. `share_link_copied`: Track copy-to-clipboard clicks on public links.

---

## 4. Pivot Trigger Number
If the **Value Gate Conversion Rate** falls below **8%** after the first 500 completed audits, we trigger a product pivot decision. 

A conversion rate below 8% indicates that users are seeing their spend results but do not perceive the report or optimization alerts as valuable enough to share their work email. In this case, we would pivot from an "email gate on results" model to an interactive "downgrade assistant" chrome extension or a direct API integrations model (connecting Google Workspace / Slack to ingest stacks automatically).
