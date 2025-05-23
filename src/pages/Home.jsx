import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary to-secondary rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-accent to-cyber-green rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-cyber-purple to-cyber-pink rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-neon">
              <ApperIcon name="UtensilsCrossed" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                TableSync
              </h1>
              <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 hidden sm:block">
                Reserve Your Perfect Table
              </p>
            </div>
          </motion.div>

          <motion.button
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={toggleDarkMode}
            className="p-2 sm:p-3 rounded-xl bg-surface-100/80 dark:bg-surface-800/80 hover:bg-surface-200/80 dark:hover:bg-surface-700/80 transition-all duration-300 shadow-holo hover:shadow-neon backdrop-blur-sm border border-primary/10 dark:border-cyber-blue/20"
          >
            <ApperIcon 
              name={darkMode ? "Sun" : "Moon"} 
              className="w-5 h-5 sm:w-6 sm:h-6 text-surface-700 dark:text-surface-300" 
            />
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto text-center">
          {/* Navigation Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 flex justify-center"
          >
            <button
              onClick={() => navigate('/waitlist')}
              className="btn-secondary flex items-center space-x-2"
            >
              <ApperIcon name="Clock" className="w-4 h-4" />
              <span>My Waitlist</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-surface-900 via-primary to-secondary dark:from-surface-100 dark:via-primary-light dark:to-secondary-light bg-clip-text text-transparent">
                Book Your Perfect
              </span>
              <br />
              <span className="text-primary">Dining Experience</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-surface-600 dark:text-surface-400 max-w-3xl mx-auto leading-relaxed">
              Discover amazing restaurants and book tables instantly with real-time availability
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12 sm:mb-16"
          >
            {[
              { icon: "Store", label: "Restaurants", value: "2,500+" },
              { icon: "Calendar", label: "Bookings Made", value: "50K+" },
              { icon: "Users", label: "Happy Diners", value: "25K+" }
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 sm:p-6 card-neu min-w-[120px] sm:min-w-[140px]"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-2 sm:mb-3 shadow-neon">
                  <ApperIcon name={stat.icon} className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-100">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Feature */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <MainFeature />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-neon">
                <ApperIcon name="UtensilsCrossed" className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-surface-900 dark:text-surface-100">TableSync</span>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              © 2024 TableSync. Making dining reservations effortless.
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}

export default Home