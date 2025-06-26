"use client";

import { motion } from "framer-motion";
import { WebsiteBuilder } from "@/components/WebsiteBuilder";
import { pageVariants } from "@/utils/animations";

export default function Home() {
  return (
    <motion.main
      className="h-screen bg-gray-50"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
    >
      <WebsiteBuilder />
    </motion.main>
  );
}
