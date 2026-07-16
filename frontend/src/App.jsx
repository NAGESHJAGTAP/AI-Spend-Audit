// src/App.jsx
// Main app shell — reads step from context and renders the right page view

import { AuditProvider, useAuditContext } from './context/AuditContext';
import { Navbar }          from './components/layout/Navbar';
import { Footer }          from './components/layout/Footer';
import { HeroSection }     from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { CTASection }      from './components/CTASection';
import { SpendForm }       from './components/SpendForm';
import { AuditResults }    from './components/AuditResults';
import { SharePage }       from './components/SharePage';
import { LeadCaptureModal } from './components/LeadCaptureModal';

function AppContent() {
  const { step, isLoadingShared, shareError, isSharedView } = useAuditContext();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <Navbar />

      <main className="pt-20">
        {isLoadingShared ? (
          /* ── Full-page loading spinner for shared audit fetch ── */
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Loading Shared Audit Report</h2>
            <p className="text-slate-400 text-sm">Retrieving real-time spending insights…</p>
          </div>
        ) : (
          <>
            {/* ── Error banner (e.g. bad share ID) ─────────────── */}
            {shareError && (
              <div className="max-w-3xl mx-auto px-4 mt-6">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                  ⚠️ {shareError}
                </div>
              </div>
            )}

            {/* ── PAGE: Landing (/) ─────────────────────────────── */}
            {step === 'form' && (
              <>
                <HeroSection />
                <FeaturesSection />
                <div className="py-16" id="audit-section">
                  <SpendForm />
                </div>
                <CTASection />
              </>
            )}

            {/* ── PAGE: Results (/result) ───────────────────────── */}
            {step === 'results' && !isSharedView && (
              <div className="py-16">
                <AuditResults />
              </div>
            )}

            {/* ── PAGE: Public Share (/audit/:id or /share/:id) ─── */}
            {step === 'results' && isSharedView && (
              <div className="py-8">
                <SharePage />
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* ── Lead modal renders on top of everything ─── */}
      {step === 'lead' && <LeadCaptureModal />}
    </div>
  );
}

export default function App() {
  return (
    <AuditProvider>
      <AppContent />
    </AuditProvider>
  );
}
