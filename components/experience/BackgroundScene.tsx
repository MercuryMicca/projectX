"use client";

import { memo } from "react";
import { motion } from "framer-motion";

type BackgroundSceneProps = {
  backgroundImage: string;
};

function BackgroundScene({
  backgroundImage,
}: BackgroundSceneProps) {
  return (
    <>
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        initial={{ scale: 1.03, opacity: 0.76 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="absolute inset-0 bg-[#02040A]/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_38%_28%,rgba(143,211,255,0.16),transparent_32%),radial-gradient(circle_at_74%_74%,rgba(255,184,107,0.10),transparent_34%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#02040A]/30 via-[#02040A]/62 to-[#02040A]/92" />
      <div className="absolute inset-0 backdrop-blur-[1.5px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_256_256%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noise%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.9%22_numOctaves=%224%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22256%22_height=%22256%22_filter=%22url(%23noise)%22_opacity=%220.8%22/%3E%3C/svg%3E')]" />
    </>
  );
}

export default memo(BackgroundScene);
