"use client";

import { useEffect, useMemo, useState } from "react";

type TypewriterTextProps = {
  lines: string[];
  speed?: number;
  pauseBetweenLines?: number;
  className?: string;
};

export default function TypewriterText({
  lines,
  speed = 24,
  pauseBetweenLines = 900,
  className = "",
}: TypewriterTextProps) {
  const normalizedLines = useMemo(() => lines.filter((line) => line.length > 0), [lines]);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>(() =>
    normalizedLines.length > 0 ? [""] : []
  );

  useEffect(() => {
    if (lineIndex >= normalizedLines.length) {
      return;
    }

    const currentLine = normalizedLines[lineIndex] ?? "";

    if (charIndex < currentLine.length) {
      const timer = window.setTimeout(() => {
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[lineIndex] = currentLine.slice(0, charIndex + 1);
          return next;
        });
        setCharIndex((prev) => prev + 1);
      }, speed);

      return () => window.clearTimeout(timer);
    }

    if (lineIndex >= normalizedLines.length - 1) {
      return;
    }

    const pause = window.setTimeout(() => {
      setDisplayedLines((prev) => [...prev, ""]);
      setLineIndex((prev) => prev + 1);
      setCharIndex(0);
    }, pauseBetweenLines);

    return () => window.clearTimeout(pause);
  }, [charIndex, lineIndex, normalizedLines, pauseBetweenLines, speed]);

  return (
    <div className={className}>
      {displayedLines.map((line, index) => (
        <p key={`${index}-${normalizedLines[index] ?? ""}`} className="mb-4 last:mb-0">
          {line}
          {index === lineIndex && lineIndex < normalizedLines.length ? (
            <span className="ml-1 animate-pulse text-[#8FD3FF]">▌</span>
          ) : null}
        </p>
      ))}
    </div>
  );
}
