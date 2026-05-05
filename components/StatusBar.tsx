type StatusBarProps = {
  missionProgress: number;
  stress: number;
  teamTrust: number;
  energy: number;
};

export default function StatusBar({
  missionProgress,
  stress,
  teamTrust,
  energy,
}: StatusBarProps) {
  const items = [
    { label: "Mission Progress", value: missionProgress },
    { label: "Stress", value: stress },
    { label: "Team Trust", value: teamTrust },
    { label: "Energy", value: energy },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <p className="mb-1 text-sm text-white/50">{item.label}</p>
          <p className="text-xl font-semibold text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
