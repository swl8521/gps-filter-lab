import { useMemo, useState } from "react";
import type { GpsSpeedComparison } from "../utils/gpsSpeedComparison";

interface UseGpsSelectionParams {
  speedComparisons: GpsSpeedComparison[];
}

export function useGpsSelection({
  speedComparisons,
}: UseGpsSelectionParams) {
  const [selectedSequence, setSelectedSequence] = useState<number | null>(null);
  const [selectionRequestId, setSelectionRequestId] = useState(0);

  const validSelectedSequence = useMemo(() => {
    if (selectedSequence === null) return null;

    const isExist = speedComparisons.some(comparison => comparison.sequence === selectedSequence);

    if (isExist)
      return selectedSequence;
    else
      return null;
  }, [selectedSequence, speedComparisons]);

  const handleSequenceSelect = (sequence: number) => {
    setSelectedSequence(sequence);
    setSelectionRequestId(prev => prev + 1);
  };

  const resetSelection = () => {
    setSelectedSequence(null);
  };

  return {
    selectionRequestId,
    validSelectedSequence,
    handleSequenceSelect,
    resetSelection,
  };
}