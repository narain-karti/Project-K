'use client';

import StackedCards from '@/components/StackedCards';
import AnimatedCounter from '@/components/AnimatedCounter';
import ProjectKStory from '@/components/ProjectKStory';
import FluidBackground from '@/components/FluidBackground';
import { AlertTriangle, Brain, Zap, Shield, TrendingUp, Activity, ArrowRight, Clock, DollarSign, Wifi, Heart, Target, Users, Award, ChevronDown, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import Link from 'next/link';

export default function Home() {
  const [cityCount, setCityCount] = useState(10);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stackedCards = [
    {
      id: 1,
      title: "The Crisis",
      description: "Every 24 hours, 415 lives are lost on Indian roads. 13 lakh cameras are watching, but they are blind. We face a paradox of infrastructure without intelligence.",
      icon: AlertTriangle,
      color: "from-red-500 to-orange-500"
    },
    {
      id: 2,
      title: "Hybrid Intelligence",
      description: "A revolutionary 3-tier architecture combining edge resilience with cloud optimization. 85-90% efficiency maintained even during total cloud failure.",
      icon: Brain,
      color: "from-teal-400 to-blue-500"
    },
    {
      id: 3,
      title: "Real-Time Response",
      description: "Detection in <2 seconds vs 5-15 minutes. Instant signal overrides for ambulances. Zero bandwidth waste with metadata-only transmission.",
      icon: Zap,
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 4,
      title: "Why We Win",
      description: "The only solution with sub-500ms latency, 99.94% bandwidth savings, and complete data sovereignty. Competitors are either too slow or too expensive.",
      icon: Shield,
      color: "from-purple-500 to-indigo-500"
    },
    {
      id: 5,
      title: "Market Opportunity",
      description: "Targeting ₹48,000 Cr Smart Cities mission. Multiple revenue streams: Gov SaaS, Insurance Data, and Fleet APIs.",
      icon: TrendingUp,
      color: "from-green-400 to-emerald-600"
    },
    {
      id: 6,
      title: "Measurable Impact",
      description: "Projected to save 23,000-37,000 lives annually. Halving road deaths by 2030 in alignment with UN SDG 3.6.",
      icon: Activity,
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <main className="min-h-screen pt-20 relative">
      <FluidBackground />

      {/* SECTION 1: HERO - THE CRISIS */}
      <section className="relative min-h-screen flex items-center justify-center p-8 md:p-24 overflow-hidden">
        <div className="relative z-10 w-full max-w-6xl flex flex-col items-center text-center">
          <motion.h1
            className="text-4xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="block">Every 24 Hours in India,</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
              415 Lives Are Lost on Our Roads
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            13 Lakh Cameras Are Watching. <br />
            <span className="text-text-primary font-semibold">But They're Blind. Until Now.</span>
          </motion.p>

          {/* Death Counter */}
          <motion.div
            className="glass-card rounded-3xl p-8 mb-12 max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-text-secondary text-sm">Lives Lost Today</span>
            </div>
            <div className="text-5xl font-bold text-red-500">
              <AnimatedCounter end={Math.floor((new Date().getHours() * 60 + new Date().getMinutes()) * 415 / 1440)} duration={3} />
            </div>
            <div className="text-xs text-text-secondary mt-2">One death every 3.8 minutes</div>
          </motion.div>

          {/* Key Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="glass-card rounded-2xl p-6">
              <DollarSign className="w-8 h-8 text-accent-orange mb-3" />
              <div className="text-3xl font-bold mb-1">₹3-5 Lakh Cr</div>
              <div className="text-sm text-text-secondary">Economic Loss Annually</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <Wifi className="w-8 h-8 text-accent-teal mb-3" />
              <div className="text-3xl font-bold mb-1">13,00,000+</div>
              <div className="text-sm text-text-secondary">Passive Cameras</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <Zap className="w-8 h-8 text-accent-purple mb-3" />
              <div className="text-3xl font-bold mb-1">&lt;2 Sec</div>
              <div className="text-sm text-text-secondary">Detection Time</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link href="/demo" className="px-8 py-4 rounded-full bg-accent-teal text-white font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-accent-teal/50 interactive flex items-center gap-2">
              Watch Live Demo <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="px-8 py-4 rounded-full glass-card text-text-primary font-semibold hover:bg-white/10 transition-all interactive flex items-center gap-2">
              Explore Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              opacity: { delay: 1.2, duration: 0.5 },
              y: { repeat: Infinity, duration: 1.5 }
            }}
          >
            <span className="text-sm text-text-secondary">Scroll to discover how we solve this</span>
            <ChevronDown className="w-6 h-6 text-accent-teal" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section className="py-24 px-8 md:px-24 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            The Paradox India Faces
          </h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {/* Card 1 */}
            <motion.div
              className="glass-card rounded-2xl p-6 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:border-red-500/40 group-hover:bg-gradient-to-br group-hover:from-red-500/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300">Accidents Go Undetected for Minutes</h3>
              </div>
              <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300">
                India currently detects most road accidents 5–15 minutes late, relying on human reporting or chance observation. In emergencies, these minutes cost lives.
              </p>
              <p className="text-accent-teal text-sm font-medium">
                ✓ Project K solves this with &lt;2-second accident detection, triggering instant alerts and emergency routing the moment a crash occurs.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="glass-card rounded-2xl p-6 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:border-orange-500/40 group-hover:bg-gradient-to-br group-hover:from-orange-500/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300">Ambulances Get Stuck in Traffic</h3>
              </div>
              <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300">
                Emergency vehicles fight the same congestion as everyone else, leading to 20–45 minute delays in cities and even longer in peri-urban areas.
              </p>
              <p className="text-accent-teal text-sm font-medium">
                ✓ Project K auto-creates dynamic green corridors, clearing intersections ahead of ambulances and accelerating response during the golden hour.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="glass-card rounded-2xl p-6 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:border-yellow-500/40 group-hover:bg-gradient-to-br group-hover:from-yellow-500/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300">Traffic Signals Are Blind & Fixed</h3>
              </div>
              <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300">
                Most intersections run on rigid 30–30 second timers, ignoring real-time traffic, rush hours, or emergencies.
              </p>
              <p className="text-accent-teal text-sm font-medium">
                ✓ Project K replaces this with adaptive AI-driven signal timing, optimizing every light based on actual queue lengths and conditions.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              className="glass-card rounded-2xl p-6 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:border-purple-500/40 group-hover:bg-gradient-to-br group-hover:from-purple-500/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300">Potholes & Waterlogging Go Unreported</h3>
              </div>
              <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300">
                Cities depend on slow citizen complaints or manual surveys. Potholes can take 1–3 weeks to be flagged and fixed, causing crashes and congestion.
              </p>
              <p className="text-accent-teal text-sm font-medium">
                ✓ Project K's cameras detect potholes, road defects, and waterlogging automatically and alert authorities instantly for faster repair.
              </p>
            </motion.div>

            {/* Card 5 */}
            <motion.div
              className="glass-card rounded-2xl p-6 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:border-blue-500/40 group-hover:bg-gradient-to-br group-hover:from-blue-500/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Wifi className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300">Cameras Only Record, They Don't Respond</h3>
              </div>
              <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300">
                India has installed more than 13 lakh traffic cameras, but 99% are passive, with no intelligence or automated action.
              </p>
              <p className="text-accent-teal text-sm font-medium">
                ✓ Project K gives these cameras a brain — enabling real-time analysis, incident detection, and autonomous decision-making right at the intersection.
              </p>
            </motion.div>

            {/* Card 6 */}
            <motion.div
              className="glass-card rounded-2xl p-6 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(244,63,94,0.4)] hover:border-rose-500/40 group-hover:bg-gradient-to-br group-hover:from-rose-500/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300">One Cloud Failure Can Paralyze a City</h3>
              </div>
              <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300">
                Pure cloud-based traffic systems fail when the network fails — leading to city-wide gridlocks and massive cascading delays.
              </p>
              <p className="text-accent-teal text-sm font-medium">
                ✓ Project K's hybrid architecture ensures every intersection keeps working autonomously, even during full cloud outages, maintaining up to 90% efficiency.
              </p>
            </motion.div>

            {/* Card 7 */}
            <motion.div
              className="glass-card rounded-2xl p-6 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 group-hover:bg-gradient-to-br group-hover:from-accent-teal/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-teal-500" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300">No City-Wide Optimization Today</h3>
              </div>
              <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300">
                Each intersection works like an island with no coordination, causing backups that ripple across the city.
              </p>
              <p className="text-accent-teal text-sm font-medium">
                ✓ Project K uses cloud intelligence to coordinate 50+ downstream intersections, preventing jams before they happen.
              </p>
            </motion.div>

            {/* Card 8 */}
            <motion.div
              className="glass-card rounded-2xl p-6 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:border-amber-500/40 group-hover:bg-gradient-to-br group-hover:from-amber-500/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300">No Real-Time Infrastructure Awareness</h3>
              </div>
              <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300">
                Authorities have no automatic system to monitor accident hotspots, seasonal traffic patterns, or rising risks.
              </p>
              <p className="text-accent-teal text-sm font-medium">
                ✓ Project K builds a live city-wide safety map, identifying danger zones, peak accident times, and patterns invisible without AI.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: THE SOLUTION - INTRODUCING PROJECT K */}
      <section className="py-12 px-8 md:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Introducing Project K: <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">Hybrid Intelligence</span>
          </h2>
          <p className="text-xl text-text-secondary text-center mb-16 max-w-3xl mx-auto">
            Watch how our revolutionary technology transforms traffic safety in real-time
          </p>

          {/* Video Player with Glowing Effect */}
          <div className="relative max-w-5xl mx-auto mb-16">
            {/* Glowing Background */}
            <div className="absolute -inset-8 bg-gradient-to-r from-accent-teal via-accent-purple to-accent-rose rounded-3xl blur-[100px] opacity-40 animate-pulse scale-110" />

            {/* Video Container */}
            <div className="relative glass-card rounded-3xl overflow-hidden shadow-2xl group">
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover"
                preload="metadata"
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                onEnded={() => setIsVideoPlaying(false)}
                controls={isVideoPlaying}
              >
                <source src="/Project_K__Saving_India_s_Roads.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Custom Play Button Overlay */}
              {!isVideoPlaying && (
                <motion.button
                  onClick={() => {
                    videoRef.current?.play();
                    setIsVideoPlaying(true);
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm cursor-pointer group-hover:bg-black/40 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30 shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-12 h-12 text-white ml-1" fill="white" />
                  </div>
                </motion.button>
              )}
            </div>
          </div>

          {/* Subheading for Stacked Cards */}
          <p className="text-xl text-text-secondary text-center mb-16 max-w-3xl mx-auto">
            Explore how our revolutionary 3-tier architecture solves India's traffic crisis
          </p>

          <StackedCards />
        </div>
      </section>

      {/* SECTION 3.5: HOW PROJECT K SAVES LIVES - STORY SECTIONS */}
      <section className="py-12 px-8 md:px-24 bg-gradient-to-b from-transparent via-black/20 to-transparent">
        <ProjectKStory />
      </section>

      {/* SECTION 4: KEY INNOVATIONS */}
      <section className="py-24 px-8 md:px-24 bg-gradient-to-b from-black/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Revolutionary Innovations
          </h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div
              className="glass-card rounded-2xl p-8 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 group-hover:bg-gradient-to-br group-hover:from-accent-teal/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <Brain className="w-12 h-12 text-accent-teal mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors duration-300">Hybrid Architecture</h3>
              <p className="text-text-secondary mb-4 group-hover:text-gray-300 transition-colors duration-300">Best of both worlds: Edge resilience + Cloud optimization. 85-90% uptime even during cloud failures.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="text-accent-teal">✓</span> Local processing (fast)</li>
                <li className="flex items-center gap-2"><span className="text-accent-teal">✓</span> Global learning (smart)</li>
                <li className="flex items-center gap-2"><span className="text-accent-teal">✓</span> Minimal bandwidth (cheap)</li>
                <li className="flex items-center gap-2"><span className="text-accent-teal">✓</span> Resilient design (reliable)</li>
              </ul>
            </motion.div>

            <motion.div
              className="glass-card rounded-2xl p-8 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:border-accent-orange/40 group-hover:bg-gradient-to-br group-hover:from-accent-orange/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <DollarSign className="w-12 h-12 text-accent-orange mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors duration-300">99.94% Bandwidth Savings</h3>
              <p className="text-text-secondary mb-4 group-hover:text-gray-300 transition-colors duration-300">Traditional systems stream video → ₹1-2 crores/month. Project K sends metadata → ₹1.4 lakhs/month.</p>
              <div className="bg-gradient-to-r from-accent-orange/10 to-transparent p-4 rounded-lg group-hover:bg-accent-orange/20 transition-colors duration-300">
                <div className="text-3xl font-bold text-accent-orange">₹228 Cr</div>
                <div className="text-sm text-text-secondary">Annual savings per city</div>
              </div>
            </motion.div>

            <motion.div
              className="glass-card rounded-2xl p-8 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:border-accent-purple/40 group-hover:bg-gradient-to-br group-hover:from-accent-purple/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <Zap className="w-12 h-12 text-accent-purple mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors duration-300">Multi-Model AI Fusion</h3>
              <p className="text-text-secondary mb-4 group-hover:text-gray-300 transition-colors duration-300">Four specialized AI models working together for comprehensive coverage.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="text-accent-purple">•</span> YOLO v11: Vehicle & accident (94.6%)</li>
                <li className="flex items-center gap-2"><span className="text-accent-purple">•</span> Custom CNN: Pothole detection (91%)</li>
                <li className="flex items-center gap-2"><span className="text-accent-purple">•</span> Audio fusion: Emergency sirens (98%)</li>
                <li className="flex items-center gap-2"><span className="text-accent-purple">•</span> Traffic flow: Adaptive signals (96%)</li>
              </ul>
            </motion.div>

            <motion.div
              className="glass-card rounded-2xl p-8 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:border-green-500/40 group-hover:bg-gradient-to-br group-hover:from-green-500/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <Clock className="w-12 h-12 text-green-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors duration-300">Real-Time Response</h3>
              <p className="text-text-secondary mb-4 group-hover:text-gray-300 transition-colors duration-300">Every millisecond counts in emergency response.</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Detection</span>
                  <span className="text-green-500 font-bold">&lt;500ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Alert</span>
                  <span className="text-green-500 font-bold">&lt;1 sec</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Total response</span>
                  <span className="text-green-500 font-bold">&lt;2 sec</span>
                </div>
                <div className="text-xs text-text-secondary pt-2 border-t border-white/10">
                  vs. 5-15 minutes traditional
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: GOVERNMENT ALIGNMENT */}
      <section className="py-24 px-8 md:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Perfect Fit with India's National Priorities
          </h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div
              className="glass-card rounded-2xl p-8 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:border-accent-teal/40 group-hover:bg-gradient-to-br group-hover:from-accent-teal/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <Target className="w-12 h-12 text-accent-teal mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors duration-300">SDG 3.6 - Halve Road Deaths by 2030</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Current progress</span>
                    <span className="text-accent-orange">33%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-accent-orange h-2 rounded-full" style={{ width: '33%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Target</span>
                    <span className="text-yellow-500">50%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>With Project K</span>
                    <span className="text-green-500">65% ✓</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="glass-card rounded-2xl p-8 group hover:bg-white/10 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:border-accent-purple/40 group-hover:bg-gradient-to-br group-hover:from-accent-purple/10 group-hover:to-transparent"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <Award className="w-12 h-12 text-accent-purple mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors duration-300">Smart Cities Mission</h3>
              <p className="text-text-secondary mb-4 group-hover:text-gray-300 transition-colors duration-300">₹48,000 crores allocated for 100 smart cities</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="text-accent-purple">✓</span> Project K deployment: ₹15-27L per city</li>
                <li className="flex items-center gap-2"><span className="text-accent-purple">✓</span> Perfect use of allocated funds</li>
                <li className="flex items-center gap-2"><span className="text-accent-purple">✓</span> Technology-driven urban transformation</li>
              </ul>
            </motion.div>

            <motion.div
              className="glass-card rounded-2xl p-8 group hover:bg-white/10 transition-colors duration-300"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <Shield className="w-12 h-12 text-green-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors duration-300">National Road Safety Policy 2023</h3>
              <p className="text-text-secondary mb-4 group-hover:text-gray-300 transition-colors duration-300">Target: 50% reduction in fatalities</p>
              <p className="text-sm">Project K contribution: <span className="text-green-500 font-bold">25-40% per city</span></p>
              <p className="text-sm text-text-secondary mt-2">Measurable impact aligned with policy goals</p>
            </motion.div>

            <motion.div
              className="glass-card rounded-2xl p-8 group hover:bg-white/10 transition-colors duration-300"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <Users className="w-12 h-12 text-accent-orange mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors duration-300">Make in India</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><span className="text-accent-orange">✓</span> 100% indigenous solution</li>
                <li className="flex items-center gap-2"><span className="text-accent-orange">✓</span> Edge hardware: Indian manufacturing</li>
                <li className="flex items-center gap-2"><span className="text-accent-orange">✓</span> Software: Developed in India</li>
                <li className="flex items-center gap-2"><span className="text-accent-orange">✓</span> Job creation: 500+ by Year 3</li>
                <li className="flex items-center gap-2"><span className="text-accent-orange">✓</span> Export potential: ₹1000+ crores</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: IMPACT CALCULATOR */}
      <section className="py-24 px-8 md:px-24 bg-gradient-to-b from-black/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            The Impact We'll Create
          </h2>
          <p className="text-text-secondary text-center mb-12">
            Select the number of cities to see projected impact
          </p>

          <motion.div
            className="glass-card rounded-3xl p-8 md:p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <label className="block text-center mb-4">
                <span className="text-6xl font-bold text-accent-teal">{cityCount}</span>
                <span className="text-text-secondary ml-2">cities</span>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={cityCount}
                onChange={(e) => setCityCount(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-teal"
              />
              <div className="flex justify-between text-sm text-text-secondary mt-2">
                <span>1 city</span>
                <span>100 cities</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:from-green-500/20">
                <Heart className="w-8 h-8 text-green-500 mb-2" />
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter end={Math.floor(cityCount * 350)} duration={1} />
                </div>
                <div className="text-sm text-text-secondary">Lives Saved Annually</div>
              </div>

              <div className="bg-gradient-to-br from-accent-orange/10 to-transparent rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:from-accent-orange/20">
                <DollarSign className="w-8 h-8 text-accent-orange mb-2" />
                <div className="text-3xl font-bold mb-1">
                  ₹<AnimatedCounter end={Math.floor(cityCount * 450)} duration={1} /> Cr
                </div>
                <div className="text-sm text-text-secondary">Economic Value Created</div>
              </div>

              <div className="bg-gradient-to-br from-accent-purple/10 to-transparent rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:from-accent-purple/20">
                <AlertTriangle className="w-8 h-8 text-accent-purple mb-2" />
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter end={Math.floor(cityCount * 1200)} duration={1} />
                </div>
                <div className="text-sm text-text-secondary">Accidents Prevented</div>
              </div>

              <div className="bg-gradient-to-br from-accent-teal/10 to-transparent rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:from-accent-teal/20">
                <Users className="w-8 h-8 text-accent-teal mb-2" />
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter end={Math.floor(cityCount * 1500)} duration={1} />
                </div>
                <div className="text-sm text-text-secondary">Families Protected</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: CALL TO ACTION */}
      <section className="py-24 px-8 md:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            See Project K in Action
          </h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
              <Link href="/demo" className="glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-300 interactive group block h-full">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-teal to-accent-purple flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Watch Live Demo</h3>
                <p className="text-text-secondary mb-4">See real AI-powered video analysis</p>
                <div className="flex items-center gap-2 text-accent-teal group-hover:gap-4 transition-all">
                  <span className="font-semibold">Explore Demo</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
              <Link href="/dashboard" className="glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-300 interactive group block h-full">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-orange to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">View Control Dashboard</h3>
                <p className="text-text-secondary mb-4">Ultra-functional analytics center</p>
                <div className="flex items-center gap-2 text-accent-orange group-hover:gap-4 transition-all">
                  <span className="font-semibold">Open Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
              <Link href="/about" className="glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-300 interactive group block h-full">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-purple to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Request Pilot Deployment</h3>
                <p className="text-text-secondary mb-4">Bring Project K to your city</p>
                <div className="flex items-center gap-2 text-accent-purple group-hover:gap-4 transition-all">
                  <span className="font-semibold">Contact Us</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
