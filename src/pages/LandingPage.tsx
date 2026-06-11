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
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-50" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-500/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[150px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
              </span>
              <span className="text-sm font-medium text-surface-300">Trusted by 50,000+ customers</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 leading-tight"
            >
              Find Trusted
              <span className="block text-gradient mt-2">Skilled Workers</span>
              <span className="block text-surface-300 text-3xl sm:text-4xl md:text-5xl mt-4">Near You</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-surface-400 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Connect with verified plumbers, electricians, mechanics, and skilled professionals.
              Get work done quickly, reliably, and at the best prices.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/signup"
                  className="premium-button px-8 py-4 text-lg inline-flex items-center gap-3"
                >
                  <span>Hire a Worker</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/signup?role=worker"
                  className="glass-button px-8 py-4 text-lg font-semibold rounded-xl inline-flex items-center gap-2 text-white"
                >
                  Join as a Worker
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Floating Service Cards Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="glass-card p-8 overflow-hidden">
              <div className="grid grid-cols-4 gap-4">
                {services.slice(0, 4).map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="glass-card p-4 text-center group cursor-pointer"
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow`}>
                      <s.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-surface-200">{s.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center group card-hover"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 mb-4 group-hover:shadow-glow transition-shadow">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gradient mb-1">{s.value}</div>
                <div className="text-sm text-surface-400">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Popular <span className="text-gradient">Services</span>
            </h2>
            <p className="text-surface-400 max-w-2xl mx-auto text-lg">
              Find skilled professionals for every job. Quality work, guaranteed.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {services.map((s, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link
                  to="/search"
                  className="glass-card group p-6 block card-hover"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-glow group-hover:shadow-glow-lg group-hover:scale-110 transition-all duration-300`}>
                    <s.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{s.name}</h3>
                  <p className="text-sm text-surface-400">{s.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center group"
              >
                <div className="relative inline-flex items-center justify-center mb-8">
                  <div className="absolute w-20 h-20 bg-primary-500/20 rounded-full blur-xl group-hover:bg-primary-500/30 transition-colors" />
                  <div className="relative w-16 h-16 glass rounded-2xl flex items-center justify-center group-hover:shadow-glow transition-shadow">
                    <item.icon className="w-8 h-8 text-primary-400" />
                  </div>
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white text-sm font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-surface-400">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-[2px] bg-gradient-to-r from-primary-500/50 to-transparent" style={{ width: 'calc(100% - 60px)', left: 'calc(50% + 60px)' }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 sm:p-12 text-center"
          >
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
              {[
                { icon: Shield, label: 'Verified Workers' },
                { icon: Clock, label: '24/7 Support' },
                { icon: Star, label: 'Quality Guarantee' },
                { icon: CheckCircle, label: 'Secure Payments' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-surface-300 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-accent-500 to-primary-600 animate-gradient-shift bg-[length:200%_200%]" />
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,0,0,0.3)_100%)]" />
            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/80 mb-10 text-lg max-w-2xl mx-auto">
                Join thousands of customers and workers already using SkillConnect.
                Find your perfect match today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/signup"
                    className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-xl transition-all text-lg inline-flex items-center gap-2"
                  >
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/search"
                    className="px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-lg"
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
      <footer className="relative py-12 border-t border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500" />
              <Wrench className="w-5 h-5 text-white relative z-10 m-auto mt-[10px]" />
            </div>
            <span className="text-xl font-bold text-gradient">SkillConnect</span>
          </div>
          <p className="text-surface-500 text-sm">
            © 2024 SkillConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
