"use client";

type AmbientControlsProps = {
  isAudioEnabled: boolean;
  onToggleAudio: () => void | Promise<void>;
};

export default function AmbientControls({
  isAudioEnabled,
  onToggleAudio,
}: AmbientControlsProps) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={() => {
          void onToggleAudio();
        }}
        className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/18 px-4 py-2 text-sm text-white/74 backdrop-blur-md transition hover:bg-black/28"
      >
        <span
          className={`h-2 w-2 rounded-full ${
            isAudioEnabled ? "bg-emerald-300" : "bg-white/35"
          }`}
        />
        {isAudioEnabled ? "Ambient On" : "Ambient Off"}
      </button>
    </div>
  );
}
