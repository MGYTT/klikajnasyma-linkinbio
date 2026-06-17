"use client";

export function useTrackClick() {
  return function trackClick(label: string) {
    // Fire & forget — nie blokuje nawigacji
    navigator.sendBeacon(
      "/api/track",
      JSON.stringify({ link: label })
    );
  };
}