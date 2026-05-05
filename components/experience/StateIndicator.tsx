"use client";

import { motion } from "framer-motion";

type StateIndicatorProps = {
  missionProgress: number;
  stress: number;
  energy: number;
  awareness: number;
};

type Metric = {
  label: string;
  value: number;
  tone: string;
};

function MetricBar({ label, value, tone }: Metric) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] text-white/55">
        <span>{label}</span>
        <span className="text-[#F4F1EA]">{value}</span>
      </div>
      <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${tone}`}
        />
      </div>
    </div>
  );
}

export default function StateIndicator({
  missionProgress,
  stress,
  energy,
  awareness,
}: StateIndicatorProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
    >
      <div className="mb-4 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.32em] text-white/42">
          Crew State
        </p>
      </div>

      <div className="space-y-4">
        <MetricBar
          label="Mission Progress"
          value={missionProgress}
          tone="bg-[#8FD3FF]"
        />
        <MetricBar
          label="Energy"
          value={energy}
          tone="bg-[#8FD3FF]"
        />
        <MetricBar
          label="Stress"
          value={stress}
          tone="bg-[#FFB86B]"
        />
        <MetricBar
          label="Awareness"
          value={awareness}
          tone="bg-[#8FD3FF]"
        />
      </div>
    </motion.aside>
  );
}
