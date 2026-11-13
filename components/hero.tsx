"use client";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="card overflow-hidden p-6 sm:p-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease: [0.16, 1, 0.3, 1] }}>
        <span className="chip">Полная футбольная аналитика</span>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
          Каждый матч. Каждый игрок.<br /><span className="text-accent">Каждая деталь.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          Топ-5 лиг, Лига чемпионов, xG, shotmaps, события, passing networks, давление, оборона и полная история игроков.
        </p>
      </motion.div>
    </section>
  );
}
