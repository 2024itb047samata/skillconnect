import { Link } from 'react-router-dom';
import {
  Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind, Star, ArrowRight,
  CheckCircle, Search, Shield, Clock, Users, ShieldCheck, BadgeCheck, AlertTriangle,
  MapPin, TrendingUp, Awards, Briefcase, UserCheck, Phone, Heart, ChevronRight,
  Brain, Target, Globe2, MessageCircle, BarChart3, Wallet, GraduationCap, UserCog
} from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  { icon: Wrench, name: 'Plumber', desc: 'Pipe repair & installation', color: 'from-blue-500 to-cyan-400' },
  { icon: Zap, name: 'Electrician', desc: 'Electrical wiring & repairs', color: 'from-amber-500 to-yellow-400' },
  { icon: Paintbrush, name: 'Painter', desc: 'Interior & exterior painting', color: 'from-rose-500 to-pink-400' },
  { icon: Building2, name: 'Mason', desc: 'Brickwork & construction', color: 'from-orange-500 to-red-400' },
  { icon: Hammer, name: 'Carpenter', desc: 'Woodwork & furniture', color: 'from-amber-600 to-orange-400' },
  { icon: Car, name: 'Mechanic', desc: 'Vehicle repair', color: 'from-slate-500 to-gray-400' },
  { icon: Sparkles, name: 'Cleaner', desc: 'Home & office cleaning', color: 'from-emerald-500 to-teal-400' },
  { icon: Wind, name: 'AC Technician', desc: 'AC installation & repair', color: 'from-cyan-500 to-blue-400' },
];

const stats = [
  { value: '10,000+', label: 'Skilled Workers', icon: Users, color: 'from-primary-500 to-primary-600' },
  { value: '50,000+', label: 'Jobs Completed', icon: CheckCircle, color: 'from-trust-500 to-trust-600' },
  { value: '500+', label: 'Cities', icon: MapPin, color: 'from-accent-500 to-accent-600' },
  { value: '4.8', label: 'Avg Rating', icon: Star, color: 'from-amber-500 to-amber-600' },
];

const features = [
  { icon: Brain, title: 'AI Skill Verification', desc: 'Upload work photos & get AI-verified SkillTrust Score' },
  { icon: Target, title: 'Smart Job Matching', desc: 'AI recommends best workers based on your needs' },
  { icon: ShieldCheck, title: 'Verified Workers', desc: 'Every worker is background checked & verified' },
  { icon: Wallet, title: 'Digital Wage Record', desc: 'Track earnings, build financial identity' },
  { icon: GraduationCap, title: 'Skill Development', desc: 'Training modules & certifications' },
  { icon: Heart, title: 'Women Empowerment', desc: 'Dedicated category for women professionals' },
];

const steps = [
  { step: 1, title: 'Search & Compare', desc: 'Use AI matching to find verified workers', icon: Search },
  { step: 2, title: 'Check SkillTrust', desc: 'View AI-verified scores & portfolios', icon: BadgeCheck },
  { step: 3, title: 'Book Instantly', desc: 'Schedule with secure payment', icon: CheckCircle },
  { step: 4, title: 'Track & Review', desc: 'Monitor progress and leave feedback', icon: Star },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a14] via-[#12122a] to-[#0a0a14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-8 pb-4 lg:pt-12 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            {/* Trust Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600/20 border border-primary-500/30 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
              </span>
              <span className="text-sm font-medium text-white">AI-Powered Workforce Empowerment Platform</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight tracking-tight"
            >
              <span className="text-white">Build Trust.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 mt-1">
                Empower Careers.
              </span>
              <span className="block text-white text-2xl sm:text-3xl md:text-4xl mt-3 font-semibold">
                Transform Lives.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Not just a marketplace — an AI-powered ecosystem helping workers build trust,
              gain financial identity, develop skills, and access better opportunities.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-lg font-bold rounded-xl shadow-lg shadow-primary-500/25 inline-flex items-center gap-3 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
                >
                  <span>Find Workers</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/signup?role=worker"
                  className="px-8 py-4 bg-white/10 border-2 border-accent-500/50 text-white text-lg font-bold rounded-xl inline-flex items-center gap-2 hover:bg-accent-500/20 transition-all"
                >
                  <Briefcase className="w-5 h-5" />
                  Join as Worker
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/signup?role=contractor"
                  className="px-8 py-4 bg-white/10 border-2 border-primary-500/50 text-white text-lg font-bold rounded-xl inline-flex items-center gap-2 hover:bg-primary-500/20 transition-all"
                >
                  <UserCog className="w-5 h-5" />
                  Contractor Mode
                </Link>
              </motion.div>
            </motion.div>

            {/* Emergency Button */}
            <motion.div variants={itemVariants} className="mb-6">
              <Link
                to="/emergency"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emergency-600 text-white font-bold rounded-xl emergency-pulse hover:bg-emergency-700 transition-colors"
              >
                <AlertTriangle className="w-5 h-5" />
                Emergency Service
              </Link>
            </motion.div>
          </motion.div>

          {/* Service Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
              {services.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                >
                  <Link to="/search" className="group block">
                    <div className="relative overflow-hidden rounded-2xl p-4 lg:p-5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl bg-[#12122a] border border-white/10 hover:border-primary-500/50">
                      <div className={`w-14 h-14 lg:w-16 lg:h-16 mb-3 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <s.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                      </div>
                      <h3 className="text-base lg:text-lg font-bold text-white mb-1">{s.name}</h3>
                      <p className="text-xs lg:text-sm text-gray-400">{s.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#12122a] border border-white/10 rounded-xl p-4 text-center"
              >
                <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SkillTrust Score Section */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-trust-500/20 border border-trust-500/30 mb-4">
              <BadgeCheck className="w-4 h-4 text-trust-400" />
              <span className="text-sm font-medium text-trust-300">AI-Powered Verification</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              SkillTrust <span className="text-transparent bg-clip-text bg-gradient-to-r from-trust-400 to-primary-400">Score</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Upload work photos and videos. AI analyzes quality, finishing, and complexity to generate your verified skill score.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Score Display */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#12122a] border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(16,185,129,0.2)" strokeWidth="8" fill="none" />
                    <circle cx="48" cy="48" r="40" stroke="url(#gradient)" strokeWidth="8" fill="none"
                      strokeDasharray="251.2" strokeDashoffset="50" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">87</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BadgeCheck className="w-5 h-5 text-trust-400" />
                    <span className="font-bold text-white">AI Verified Electrician</span>
                  </div>
                  <p className="text-sm text-gray-400">Confidence: 94%</p>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Work Quality</span>
                  <span className="text-white font-medium">92/100</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-trust-500 to-primary-500 rounded-full" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Customer Ratings</span>
                  <span className="text-white font-medium">4.8/5.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Job Completion Rate</span>
                  <span className="text-white font-medium">98%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-white font-medium">~15 min</span>
                </div>
              </div>
            </motion.div>

            {/* Score Components */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                { label: 'AI Work Analysis', value: 40, desc: 'Quality & complexity scoring' },
                { label: 'Customer Ratings', value: 25, desc: 'Average from all reviews' },
                { label: 'Completion Rate', value: 15, desc: 'Jobs successfully finished' },
                { label: 'Response Time', value: 10, desc: 'Speed of engagement' },
                { label: 'Repeat Customers', value: 10, desc: 'Customer loyalty metric' },
              ].map((item, i) => (
                <div key={i} className="bg-[#12122a] border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{item.label}</span>
                    <span className="text-trust-400 font-bold">{item.value}%</span>
                  </div>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Works</span>
            </h2>
            <p className="text-gray-400 text-lg">Four simple steps to get your job done</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-500 text-white text-sm font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="relative py-16 bg-gradient-to-b from-transparent via-primary-950/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Empowerment <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-primary-400">Features</span>
            </h2>
            <p className="text-gray-400 text-lg">More than a marketplace — a complete ecosystem</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#12122a] border border-white/10 rounded-2xl p-6 hover:border-primary-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Women Professionals Section */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-empower-900/30 to-primary-900/30 border border-empower-500/30 rounded-2xl p-8"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-empower-400" />
                  <span className="text-sm font-medium text-empower-300">Women Workforce Empowerment</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Professional Women, <span className="text-empower-400">Verified & Trusted</span>
                </h2>
                <p className="text-gray-300 mb-6">
                  Dedicated category for women professionals with verified profiles,
                  safety-focused matching, and women-led service categories.
                  Promoting equal employment opportunities.
                </p>
                <Link
                  to="/search?women=true"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-empower-600 text-white font-bold rounded-xl hover:bg-empower-700 transition-colors"
                >
                  <span>Explore Women Professionals</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Cleaner', 'Cook', 'Beautician', 'Tailor'].map((skill, i) => (
                  <div key={i} className="bg-[#12122a] border border-white/10 rounded-xl p-4 text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-empower-500/20 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-empower-400" />
                    </div>
                    <span className="text-sm font-medium text-white">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contractor Mode */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#12122a] border border-white/10 rounded-2xl p-8"
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <UserCog className="w-5 h-5 text-primary-400" />
                  <span className="text-sm font-medium text-primary-300">For Contractors & Builders</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Contractor Mode</h2>
                <p className="text-gray-400 mb-6">
                  Manage your workforce, track site attendance through geofencing,
                  monitor progress, and handle payments — all in one place.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['Team Management', 'Site Attendance', 'Wage Tracking', 'Progress Reports'].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-trust-400" />
                      <span className="text-gray-300">{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/signup?role=contractor"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  <span>Get Started as Contractor</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="w-full lg:w-80">
                <div className="bg-[#0a0a14] rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-400">A</div>
                    <div className="flex-1">
                      <span className="text-sm text-white">Worker Attendance</span>
                      <p className="text-xs text-trust-400">Auto check-in via geofencing</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-trust-500/20 text-trust-400 rounded">Active</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center text-xs font-bold text-accent-400">W</div>
                    <div className="flex-1">
                      <span className="text-sm text-white">Wage Summary</span>
                      <p className="text-xs text-gray-500">Today: ₹12,500 pending</p>
                    </div>
                    <span className="text-xs text-gray-400">View</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="relative py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#12122a] border border-white/10 rounded-2xl p-6">
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
              {[
                { icon: Shield, label: 'Verified Workers' },
                { icon: Clock, label: '24/7 Support' },
                { icon: Star, label: 'Quality Guarantee' },
                { icon: CheckCircle, label: 'Secure Payments' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600"
          >
            <div className="relative px-8 py-12 sm:px-12 sm:py-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Join the Workforce Revolution
              </h2>
              <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
                Whether you're hiring or looking for work, SkillConnect is your gateway to trust,
                opportunity, and growth.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/signup"
                    className="px-8 py-4 bg-white text-primary-600 font-bold rounded-xl shadow-lg inline-flex items-center gap-2 hover:shadow-xl transition-all"
                  >
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/search"
                    className="px-8 py-4 bg-white/10 border-2 border-white text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                  >
                    Browse Workers
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SkillConnect</span>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            AI-Powered Workforce Empowerment Platform
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <span>Trust</span>
            <span>•</span>
            <span>Opportunity</span>
            <span>•</span>
            <span>Growth</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
