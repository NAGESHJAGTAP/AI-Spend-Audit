// src/App.jsx
// Main app shell — reads step from context and renders the right view

import { AuditProvider, useAuditContext } from './context/AuditContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/HeroSection';
import { SpendForm } from './components/SpendForm';
import { AuditResults } from './components/AuditResults';
import { LeadCaptureModal } from './components/LeadCaptureModal';

function AppContent() {
  const { step } = useAuditContext();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <Navbar />

      <main className="pt-20">
        {/* Always show hero on first load */}
        {step === 'form' && <HeroSection />}

        {/* Audit form section */}
        <div className="py-16">
          {step === 'form' && <SpendForm />}
          {step === 'results' && <AuditResults />}
        </div>
      </main>

      <Footer />

      {/* Lead modal renders on top of everything */}
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
