'use client';

import StackedCards from '@/components/StackedCards';
import AnimatedCounter from '@/components/AnimatedCounter';
import ProjectKStory from '@/components/ProjectKStory';
import Roadmap from '@/components/Roadmap';
import LifeSavingCarousel from '@/components/LifeSavingCarousel';
import { AlertTriangle, Brain, Zap, Shield, TrendingUp, Activity, ArrowRight, Clock, DollarSign, Wifi, Heart, Target, Users, Award, ChevronDown, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';


export default function Home() {
  const [cityCount, setCityCount] = useState(10);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullTitle = 'Project K';

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullTitle.length) {
        setTypedText(fullTitle.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setIsTypingComplete(true);
      }
    }, 150);
    return () => clearInterval(timer);
  }, []);

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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

        {/* SECTION 1: HERO - THE CRISIS */}
        <section className="relative min-h-screen flex items-center justify-center p-8 md:p-24 overflow-hidden">
          <div className="relative z-10 w-full max-w-6xl flex flex-col items-center text-center">

            {/* Typing "Project K" Title */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-6xl md:text-9xl font-bold tracking-tight">
                <span className="text-white">{typedText.slice(0, 8)}</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-teal via-accent-purple to-accent-cyan">{typedText.slice(8)}</span>
                {!isTypingComplete && (
                  <span
                    className="inline-block w-[4px] h-[0.8em] ml-1 align-baseline border-r-4 border-accent-teal"
                    style={{ animation: 'blink-caret 0.75s step-end infinite' }}
                  />
                )}
              </h1>
              <p className="text-lg md:text-xl text-text-secondary mt-3 tracking-widest uppercase">
                Hybrid Traffic Intelligence
              </p>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <span className="block text-white">Every 24 Hours in India,</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-accent-teal via-accent-rose to-accent-orange">
                415 Lives Are Lost on Our Roads
              </span>
            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl gpu-optimize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              13 Lakh Cameras Are Watching. <br />
              <span className="text-text-primary font-semibold">But They're Blind. Until Now.</span>
            </motion.p>

            {/* Death Counter */}
            <motion.div
              className="glass-card p-8 mb-12 max-w-md relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-teal/10 via-transparent to-accent-rose/5 rounded-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-accent-teal animate-pulse" />
                  <span className="text-text-secondary text-sm">Lives Lost Today</span>
                </div>
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-teal to-accent-rose">
                  <AnimatedCounter end={Math.floor((new Date().getHours() * 60 + new Date().getMinutes()) * 415 / 1440)} duration={3} />
                </div>
                <div className="text-xs text-text-secondary mt-2">One death every 3.8 minutes</div>
              </div>
            </motion.div>

            {/* Key Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12 gpu-optimize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="glass-card p-6 relative overflow-hidden group hover:shadow-[0_0_40px_rgba(255,171,0,0.2)] hover:border-accent-amber/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-amber/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="clay-icon w-12 h-12 bg-accent-amber/15 mb-3 relative z-10">
                  <DollarSign className="w-6 h-6 text-accent-amber" />
                </div>
                <div className="text-3xl font-bold mb-1 relative z-10">₹3-5 Lakh Cr</div>
                <div className="text-sm text-text-secondary relative z-10">Economic Loss Annually</div>
              </div>
              <div className="glass-card p-6 relative overflow-hidden group hover:shadow-[0_0_40px_rgba(0,240,255,0.2)] hover:border-accent-cyan/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="clay-icon w-12 h-12 bg-accent-cyan/15 mb-3 relative z-10">
                  <Wifi className="w-6 h-6 text-accent-cyan" />
                </div>
                <div className="text-3xl font-bold mb-1 relative z-10">13,00,000+</div>
                <div className="text-sm text-text-secondary relative z-10">Passive Cameras</div>
              </div>
              <div className="glass-card p-6 relative overflow-hidden group hover:shadow-[0_0_40px_rgba(213,0,249,0.2)] hover:border-accent-purple/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="clay-icon w-12 h-12 bg-accent-purple/15 mb-3 relative z-10">
                  <Zap className="w-6 h-6 text-accent-purple" />
                </div>
                <div className="text-3xl font-bold mb-1 relative z-10">&lt;2 Sec</div>
                <div className="text-sm text-text-secondary relative z-10">Detection Time</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link href="/demo" className="px-8 py-4 clay-button bg-gradient-to-r from-accent-teal to-accent-rose text-white hover:opacity-90 transition-all flex items-center gap-2">
                Watch Live Demo <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/dashboard" className="px-8 py-4 clay-button glass-card text-text-primary hover:bg-white/5 hover:border-accent-cyan/30 transition-all flex items-center gap-2">
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
        <section className="py-24 px-8 md:px-24">
          <div className="max-w-6xl mx-auto clay-section p-10">
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
                className="glass-card p-6 group hover:bg-white/5 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(255,23,68,0.3)] hover:border-accent-teal/30 relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-teal/8 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div className="clay-icon w-12 h-12 bg-gradient-to-br from-accent-teal/20 to-accent-rose/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-accent-teal" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300 break-words">Accidents Go Undetected for Minutes</h3>
                </div>
                <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                  India currently detects most road accidents 5–15 minutes late, relying on human reporting or chance observation. In emergencies, these minutes cost lives.
                </p>
                <p className="text-accent-teal text-sm font-medium relative z-10">
                  ✓ Project K solves this with &lt;2-second accident detection, triggering instant alerts and emergency routing the moment a crash occurs.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                className="glass-card p-6 group hover:bg-white/5 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(0,240,255,0.3)] hover:border-accent-cyan/30 relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/8 to-accent-blue/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div className="clay-icon w-12 h-12 bg-gradient-to-br from-accent-cyan/20 to-accent-blue/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Activity className="w-6 h-6 text-accent-cyan" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300 break-words">Ambulances Get Stuck in Traffic</h3>
                </div>
                <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                  Emergency vehicles fight the same congestion as everyone else, leading to 20–45 minute delays in cities and even longer in peri-urban areas.
                </p>
                <p className="text-accent-cyan text-sm font-medium relative z-10">
                  ✓ Project K auto-creates dynamic green corridors, clearing intersections ahead of ambulances and accelerating response during the golden hour.
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                className="glass-card p-6 group hover:bg-white/5 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(255,171,0,0.3)] hover:border-accent-amber/30 relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-amber/8 to-accent-orange/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div className="clay-icon w-12 h-12 bg-gradient-to-br from-accent-amber/20 to-accent-orange/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-accent-amber" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300 break-words">Traffic Signals Are Blind & Fixed</h3>
                </div>
                <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                  Most intersections run on rigid 30–30 second timers, ignoring real-time traffic, rush hours, or emergencies.
                </p>
                <p className="text-accent-amber text-sm font-medium relative z-10">
                  ✓ Project K replaces this with adaptive AI-driven signal timing, optimizing every light based on actual queue lengths and conditions.
                </p>
              </motion.div>

              {/* Card 4 */}
              <motion.div
                className="glass-card p-6 group hover:bg-white/5 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(213,0,249,0.3)] hover:border-accent-purple/30 relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/8 to-accent-violet/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div className="clay-icon w-12 h-12 bg-gradient-to-br from-accent-purple/20 to-accent-violet/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangle className="w-6 h-6 text-accent-purple" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300 break-words">Potholes & Waterlogging Go Unreported</h3>
                </div>
                <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                  Cities depend on slow citizen complaints or manual surveys. Potholes can take 1–3 weeks to be flagged and fixed, causing crashes and congestion.
                </p>
                <p className="text-accent-purple text-sm font-medium relative z-10">
                  ✓ Project K's cameras detect potholes, road defects, and waterlogging automatically and alert authorities instantly for faster repair.
                </p>
              </motion.div>

              {/* Card 5 */}
              <motion.div
                className="glass-card p-6 group hover:bg-white/5 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(61,90,254,0.3)] hover:border-accent-blue/30 relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/8 to-accent-cyan/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div className="clay-icon w-12 h-12 bg-gradient-to-br from-accent-blue/20 to-accent-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Wifi className="w-6 h-6 text-accent-blue" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300 break-words">Cameras Only Record, They Don't Respond</h3>
                </div>
                <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                  India has installed more than 13 lakh traffic cameras, but 99% are passive, with no intelligence or automated action.
                </p>
                <p className="text-accent-blue text-sm font-medium relative z-10">
                  ✓ Project K gives these cameras a brain — enabling real-time analysis, incident detection, and autonomous decision-making right at the intersection.
                </p>
              </motion.div>

              {/* Card 6 */}
              <motion.div
                className="glass-card p-6 group hover:bg-white/5 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(255,0,64,0.3)] hover:border-accent-rose/30 relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-rose/8 to-accent-teal/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div className="clay-icon w-12 h-12 bg-gradient-to-br from-accent-rose/20 to-accent-teal/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-accent-rose" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300 break-words">One Cloud Failure Can Paralyze a City</h3>
                </div>
                <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                  Pure cloud-based traffic systems fail when the network fails — leading to city-wide gridlocks and massive cascading delays.
                </p>
                <p className="text-accent-rose text-sm font-medium relative z-10">
                  ✓ Project K's hybrid architecture ensures every intersection keeps working autonomously, even during full cloud outages, maintaining up to 90% efficiency.
                </p>
              </motion.div>

              {/* Card 7 */}
              <motion.div
                className="glass-card p-6 group hover:bg-white/5 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(0,230,118,0.3)] hover:border-accent-green/30 relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-green/8 to-accent-cyan/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div className="clay-icon w-12 h-12 bg-gradient-to-br from-accent-green/20 to-accent-cyan/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-accent-green" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300">No City-Wide Optimization Today</h3>
                </div>
                <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                  Each intersection works like an island with no coordination, causing backups that ripple across the city.
                </p>
                <p className="text-accent-green text-sm font-medium relative z-10">
                  ✓ Project K uses cloud intelligence to coordinate 50+ downstream intersections, preventing jams before they happen.
                </p>
              </motion.div>

              {/* Card 8 */}
              <motion.div
                className="glass-card p-6 group hover:bg-white/5 transition-colors duration-300 hover:shadow-[0_0_40px_rgba(255,171,0,0.3)] hover:border-accent-amber/30 relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-amber/8 to-accent-orange/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-amber/20 to-accent-orange/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-6 h-6 text-accent-amber" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300">No Real-Time Infrastructure Awareness</h3>
                </div>
                <p className="text-text-secondary mb-3 text-sm group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                  Authorities have no automatic system to monitor accident hotspots, seasonal traffic patterns, or rising risks.
                </p>
                <p className="text-accent-amber text-sm font-medium relative z-10">
                  ✓ Project K builds a live city-wide safety map, identifying danger zones, peak accident times, and patterns invisible without AI.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 4: ROADMAP */}
        <Roadmap />

        {/* SECTION 5: IMPACT CALCULATOR */}
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
                <div className="bg-gradient-to-br from-accent-teal/10 to-transparent rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:from-accent-teal/20">
                  <Heart className="w-8 h-8 text-accent-teal mb-2" />
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

                <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:from-white/10">
                  <Users className="w-8 h-8 text-white mb-2" />
                  <div className="text-3xl font-bold mb-1">
                    <AnimatedCounter end={Math.floor(cityCount * 1500)} duration={1} />
                  </div>
                  <div className="text-sm text-text-secondary">Families Protected</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>

    </main >
  );
}
