// backend/lib/email.js
// Transactional email via Resend (free tier: 3,000 emails/mo)

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = process.env.EMAIL_FROM || 'AI Spend Audit <audit@aispendaudit.com>';

// ── Audit confirmation email ─────────────────────────────────────────────────
export async function sendAuditEmail({ to, name, auditResult, shareUrl }) {
  const { totalMonthlySavings, totalAnnualSavings, toolBreakdown, hasHighSavings } = auditResult;

  const toolRows = toolBreakdown.map(t =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #1e293b">${t.toolName}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1e293b">$${t.currentSpend}/mo</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1e293b;color:#34d399">$${t.recommendedSpend}/mo</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1e293b;color:#a78bfa">-$${t.savings}/mo</td>
    </tr>`
  ).join('');

  const consultBlock = hasHighSavings
    ? `<div style="background:#1e1b4b;border:1px solid #4c1d95;border-radius:12px;padding:20px;margin:24px 0">
        <p style="color:#a78bfa;font-weight:700;margin:0 0 8px">💡 High-savings opportunity detected</p>
        <p style="color:#c4b5fd;margin:0 0 12px">Your stack has $${totalMonthlySavings}/mo ($${totalAnnualSavings}/yr) in savings. TechVruk experts can implement these optimisations for you.</p>
        <a href="https://aispendaudit.com/consult" style="background:#7c3aed;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">Book a Free Consultation →</a>
      </div>`
    : '';

  const html = `
    <!DOCTYPE html><html><body style="font-family:Inter,sans-serif;background:#020817;color:#f8fafc;margin:0;padding:24px">
      <div style="max-width:600px;margin:0 auto">
        <h1 style="font-size:24px;margin:0 0 4px">Your AI Spend Audit Report</h1>
        <p style="color:#94a3b8;margin:0 0 24px">Hi ${name || 'there'} — here's your personalised breakdown.</p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px">
          <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:16px">
            <p style="color:#94a3b8;font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:.05em">Monthly Savings</p>
            <p style="color:#34d399;font-size:28px;font-weight:700;margin:0">$${totalMonthlySavings}</p>
          </div>
          <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:16px">
            <p style="color:#94a3b8;font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:.05em">Annual Savings</p>
            <p style="color:#a78bfa;font-size:28px;font-weight:700;margin:0">$${totalAnnualSavings}</p>
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;background:#0f172a;border-radius:12px;overflow:hidden">
          <thead><tr style="background:#1e293b">
            <th style="padding:10px 12px;text-align:left;color:#94a3b8;font-size:12px">Tool</th>
            <th style="padding:10px 12px;text-align:left;color:#94a3b8;font-size:12px">Current</th>
            <th style="padding:10px 12px;text-align:left;color:#94a3b8;font-size:12px">Optimised</th>
            <th style="padding:10px 12px;text-align:left;color:#94a3b8;font-size:12px">Saving</th>
          </tr></thead>
          <tbody>${toolRows}</tbody>
        </table>

        ${consultBlock}

        <p style="margin-top:24px">
          <a href="${shareUrl}" style="color:#a78bfa">View your shareable audit →</a>
        </p>

        <p style="color:#475569;font-size:12px;margin-top:32px">
          AI Spend Audit · Built by TechVruk · <a href="https://aispendaudit.com/unsubscribe" style="color:#475569">Unsubscribe</a>
        </p>
      </div>
    </body></html>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Your AI stack saves $${totalAnnualSavings}/yr — here's how`,
      html,
    });
    return { ok: true };
  } catch (err) {
    console.error('[email] Resend error:', err.message);
    return { ok: false, error: err.message };
  }
}
