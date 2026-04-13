type ChoiceButtonProps = {
  label: string;
};

export default function ChoiceButton({ label }: ChoiceButtonProps) {
  return (
    <div className="w-full rounded-xl bg-white/10 px-4 py-3 text-left text-white hover:bg-white/15 transition cursor-pointer">
      {label}
    </div>
  );
}