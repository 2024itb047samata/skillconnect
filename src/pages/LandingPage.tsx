import { Link } from 'react-router-dom';
import { Wrench, Zap, Paintbrush, Building2, Hammer, Car, Sparkles, Wind, Star, ArrowRight, CheckCircle, Search } from 'lucide-react';

const services = [
  { icon: Wrench, name: 'Plumber', desc: 'Pipe repair & installation' },
  { icon: Zap, name: 'Electrician', desc: 'Electrical wiring & repairs' },
  { icon: Paintbrush, name: 'Painter', desc: 'Interior & exterior painting' },
  { icon: Building2, name: 'Mason', desc: 'Brickwork & construction' },
  { icon: Hammer, name: 'Carpenter', desc: 'Woodwork & furniture' },
  { icon: Car, name: 'Mechanic', desc: 'Vehicle repair' },
  { icon: Sparkles, name: 'Cleaner', desc: 'Home & office cleaning' },
  { icon: Wind, name: 'AC Technician', desc: 'AC installation & repair' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
              <span className="text-blue-600 dark:text-cyan-400 font-medium text-sm">Connecting Skilled Workers with Opportunities</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Find Trusted Skilled
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Workers Near You</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
              Connect with verified plumbers, electricians, mechanics, and skilled professionals. Get work done quickly and reliably.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2">
                <span>Hire a Worker</span><ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/signup?role=worker" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-cyan-500 hover:shadow-lg transition-all">
                Join as a Worker
              </Link>
            </div>

            {/* Service Grid */}
            <div className="mt-16 relative bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-2xl overflow-hidden mx-4 sm:mx-0">
              <div className="p-8 sm:p-12">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {services.map((s, i) => (
                    <div key={i} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white text-center hover:bg-white/30 transition-colors">
                      <s.icon className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white dark:bg-gray-800 py-16 border-y border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{ v: '10,000+', l: 'Skilled Workers' }, { v: '50,000+', l: 'Jobs Completed' }, { v: '500+', l: 'Cities' }, { v: '4.8', l: 'Avg Rating' }].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{s.v}</div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Popular Services</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Find skilled professionals for every job.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((s, i) => (
              <Link key={i} to="/search" className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-cyan-500 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{s.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Search for Service', desc: 'Browse skilled workers by service type and location', icon: Search },
              { step: 2, title: 'Compare & Book', desc: 'Compare ratings, reviews, and prices', icon: Star },
              { step: 3, title: 'Get the Job Done', desc: 'Track progress and pay securely', icon: CheckCircle }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-medium text-blue-600 dark:text-cyan-400 mb-2">Step {item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-gradient-to-br from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8">Join thousands of customers and workers already using SkillConnect.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-xl transition-all">Create Account</Link>
            <Link to="/search" className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all">Browse Workers</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center"><Wrench className="w-4 h-4 text-white" /></div>
            <span className="text-lg font-bold text-white">SkillConnect</span>
          </div>
          <p>&copy; 2024 SkillConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
