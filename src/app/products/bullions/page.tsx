"use client";

import BullionListingPage from '../../../components/bullions/BullionListingPage';
import { bullionService } from '../../../services/bullionService';

export default function BullionsPage() {
  return (
    <BullionListingPage
      title="Precious Metal Bullions"
      fetchBullions={bullionService.getBullions.bind(bullionService)}
    />
  );
}
