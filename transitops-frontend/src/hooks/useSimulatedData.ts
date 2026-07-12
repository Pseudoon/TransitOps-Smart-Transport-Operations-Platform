"use client";

import { useState, useEffect } from "react";
import { computeKpis } from "@/lib/mock-data";

export function useSimulatedData() {
  const [kpis, setKpis] = useState(computeKpis());

  useEffect(() => {
    // Simulate real-time data fluctuations every 3.5 seconds
    const interval = setInterval(() => {
      setKpis((prev) => {
        // Randomly adjust the active trips up or down by 1, occasionally
        const tripChange = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        
        // Randomly adjust available vehicles inversely
        const newActiveTrips = Math.max(0, prev.activeTrips + tripChange);
        const newOnTrip = prev.onTrip + tripChange;
        const newAvailable = Math.max(0, prev.available - tripChange);
        
        // Slight utilization fluctuation
        const utilizationChange = Math.random() > 0.5 ? (Math.random() > 0.5 ? 0.2 : -0.2) : 0;
        
        return {
          ...prev,
          activeTrips: newActiveTrips,
          onTrip: newOnTrip,
          available: newAvailable,
          utilization: parseFloat((prev.utilization + utilizationChange).toFixed(1)),
        };
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return { kpis };
}
