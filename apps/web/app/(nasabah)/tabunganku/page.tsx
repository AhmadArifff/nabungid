'use client';

import React, { useState, useEffect } from 'react';
import { useNasabahStore } from '../../../stores/useNasabahStore';
import { WeeklyCheckinCard } from '../../../components/nasabah/WeeklyCheckinCard';
import { UploadProofModal } from '../../../components/nasabah/UploadProofModal';
import { WeeklyLedgerItem } from '@nabungid/shared';
import { useAutoSync } from '../../../hooks/useAutoSync';

export default function TabungankuPage() {
  const { ledgers, payWeek, fetchMySavings } = useNasabahStore();
  const [selectedLedger, setSelectedLedger] = useState<WeeklyLedgerItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchMySavings();
  }, [fetchMySavings]);

  // Real-time background sync every 1 minute
  useAutoSync(fetchMySavings, 60000);

  const handleOpenCheckin = (ledger: WeeklyLedgerItem) => {
    setSelectedLedger(ledger);
    setIsUploadOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Interactive 50-Week Check-in Stamp Pass Card */}
      <WeeklyCheckinCard
        ledgers={ledgers}
        onOpenCheckin={handleOpenCheckin}
      />

      {/* Upload Proof & Check-in Modal */}
      <UploadProofModal
        isOpen={isUploadOpen}
        ledger={selectedLedger}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={payWeek}
      />
    </div>
  );
}
