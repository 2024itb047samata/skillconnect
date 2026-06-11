import { Link } from 'react-router-dom';
import { Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind, Star, ArrowRight, CheckCircle, Search, Shield, Clock, Users } from 'lucide-react';
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
  { value: '10,000+', label: 'Skilled Workers', icon: Users },
  { value: '50,000+', label: 'Jobs Completed', icon: CheckCircle },
  { value: '500+', label: 'Cities', icon: Search },
  { value: '4.8', label: 'Avg Rating', icon: Star },
];

const steps = [
  { step: 1, title: 'Search for Service', desc: 'Browse skilled workers by service type and location', icon: Search },
  { step: 2, title: 'Compare & Book', desc: 'Compare ratings, reviews, and prices', icon: Star },
  { step: 3, title: 'Get the Job Done', desc: 'Track progress and pay securely', icon: CheckCircle },
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Hero Section - Optimized for Above Fold */}
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
              <span className="text-sm font-medium text-white">Trusted by 50,000+ customers</span>
            </motion.div>

            {/* Main Headline - High Contrast */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight tracking-tight"
            >
              <span className="text-white">Find Trusted</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 mt-1">
                Skilled Workers
              </span>
              <span className="block text-white text-2xl sm:text-3xl md:text-4xl mt-3 font-semibold">
                Near You
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Connect with verified plumbers, electricians, mechanics, and skilled professionals.
              Get work done quickly, reliably, and at the best prices.
            </motion.p>

            {/* CTA Buttons - Prominent */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-lg font-bold rounded-xl shadow-lg shadow-primary-500/25 inline-flex items-center gap-3 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
                >
                  <span>Hire a Worker</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/signup?role=worker"
                  className="px-8 py-4 bg-white/10 border-2 border-white/30 text-white text-lg font-bold rounded-xl inline-flex items-center gap-2 hover:bg-white/20 transition-all"
                >
                  Join as a Worker
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Service Categories - Visible Above Fold */}
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
                  <Link
                    to="/search"
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-2xl p-4 lg:p-5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl bg-[#12122a] border border-white/10 hover:border-primary-500/50">
                      {/* Icon - Larger */}
                      <div className={`w-14 h-14 lg:w-16 lg:h-16 mb-3 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <s.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                      </div>

                      {/* Label */}
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

      {/* Stats Section - Compact */}
      <section className="relative py-10 bg-gradient-to-b from-transparent via-primary-950/20 to-transparent">
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
                <s.icon className="w-5 h-5 text-primary-400 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </motion.div>
            ))}
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
            <p className="text-gray-400 text-lg">Get started in 3 simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
            {steps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-500 text-white text-sm font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="relative py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#12122a] border border-white/10 rounded-2xl p-6 text-center">
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
                Ready to Get Started?
              </h2>
              <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
                Join thousands of customers and workers already using SkillConnect.
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
          <p className="text-gray-500 text-sm">
            © 2024 SkillConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
