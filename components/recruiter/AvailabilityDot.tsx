export default function AvailabilityDot() {
  return (
    <span
      aria-hidden
      className="inline-block h-2 w-2 rounded-full animate-pulse-dot"
      style={{
        background: '#22c55e',
        boxShadow: '0 0 6px #22c55e, 0 0 12px rgba(34, 197, 94, 0.6)',
      }}
    />
  );
}
