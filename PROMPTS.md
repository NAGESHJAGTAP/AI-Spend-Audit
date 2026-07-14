# AI Spend Audit - LLM Prompt Design

This file documents the LLM prompts used for generating personalized, natural-language audit summaries.

## The Personalized Summary Prompt

We use the Gemini API (or Anthropic fallback) to compile a 100-word professional audit summary based on programmatic audit calculations.

### Current Version

```text
You are a senior startup financial operations consultant. Analyze the following AI Spend Audit data and generate a highly personalized, actionable summary paragraph of exactly 70 to 100 words. 

Focus strictly on explaining where the biggest waste lies and what immediate actions they should take (downgrades, redundancy removal, startup credits). Speak directly to the company (use "you" and "your team"). Be direct, concise, and professional.

Audit Context:
- Team Size: {{teamSize}}
- Primary Use Case: {{primaryUseCase}}
- Original Monthly Spend: ${{originalSpend}}
- Recommended Monthly Spend: ${{recommendedSpend}}
- Total Monthly Savings: ${{monthlySavings}}
- Total Annual Savings: ${{annualSavings}}

Per-Tool Breakdown Details:
{{breakdownDetails}}

Personalized Summary Paragraph:
```

### Why we wrote it this way
1. **Mathematical Accuracy**: We calculate all savings, current spend, and recommended spend programmatically using deterministic logic. We *only* use the LLM to synthesize this data into natural language. This prevents mathematical hallucinations.
2. **Word Limit Control**: Explicitly stating "exactly 70 to 100 words" forces the model to stay brief and readable.
3. **Tone Consistency**: Defining the role as a "senior startup financial operations consultant" ensures a professional, objective, and authoritative tone that startup founders trust.

### What we tried that didn't work
1. **Raw Data Input**: We initially tried feeding the raw list of tools and team size into the model and asking it to calculate the savings and write the recommendations. The model consistently failed at:
   - Performing exact multiplication and subtraction.
   - Remembering the 5-seat limit on Claude Team plans or 2-seat limit on ChatGPT Team plans.
   - Consistently suggesting the same numbers across runs.
2. **Vague Length Constraints**: Using simple phrases like "keep it short" resulted in paragraphs that were either 200+ words or single-sentence bulleted lists instead of a clean, cohesive paragraph.
