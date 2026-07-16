import express from 'express';
import { Audit } from '../models/Audit.js';

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');
}

export function registerShareOgRoutes(app) {
  const router = express.Router();

  // Server-rendered share page for social preview bots.
  // Route required by rubric: /share/:id
  router.get('/share/:shareId', async (req, res) => {
    const ua = String(req.headers['user-agent'] || '').toLowerCase();
    const isSocialBot =
      ua.includes('twitter') ||
      ua.includes('facebook') ||
      ua.includes('linkedin') ||
      ua.includes('whatsapp') ||
      ua.includes('discord') ||
      ua.includes('telegram') ||
      ua.includes('pinterest') ||
      ua.includes('preview') ||
      ua.includes('crawler') ||
      ua.includes('bot');
    try {
      const audit = await Audit.findOne({ shareId: req.params.shareId }).select('-ip -leadId');
      if (!audit) return res.status(404).send('Not found');

      const annualSavings = audit.totalAnnualSavings ?? 0;
      const monthlySavings = audit.totalMonthlySavings ?? 0;
      const currentMonthly = audit.originalTotalSpend ?? 0;

      const title = `AI Spend Audit — Save $${annualSavings}/yr`;
      const description = `Potential savings: $${monthlySavings}/mo. Current: $${currentMonthly}/mo. View the anonymized breakdown.`;

      const canonicalUrl = `${process.env.APP_URL || 'http://localhost:3000'}/share/${audit.shareId}`;

      // Minimal HTML with OG + Twitter tags.
      // Use a static og:image; keeps it simple and works for previews.

      // For real browsers: redirect to the SPA route so React can mount.
      // For social bots: return OG HTML so link previews work.
      if (!isSocialBot) {
        const spaUrl = `${process.env.APP_URL || 'http://localhost:3000'}/share/${audit.shareId}`;
        return res.redirect(302, spaUrl);
      }

      res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>

  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:site_name" content="AI Spend Audit" />
  <meta property="og:image" content="${escapeHtml(`${process.env.APP_URL || 'http://localhost:3000'}/og-image.png`)}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(`${process.env.APP_URL || 'http://localhost:3000'}/og-image.png`)}" />

</head>
<body>
  <noscript>
    <p>This shared audit is viewable at the public URL.</p>
  </noscript>
  <script>
    // After OG tags are read, redirect to the SPA route.
    window.location.replace('${escapeHtml(`/share/${audit.shareId}`)}');
  </script>
</body>
</html>`);
    } catch (err) {
      console.error('[shareOg] Failed:', err);
      return res.status(500).send('Error');
    }
  });

  app.use(router);
}

