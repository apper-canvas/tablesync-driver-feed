import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <div className="mb-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-primary-light to-primary rounded-full flex items-center justify-center mb-6 shadow-neu-light dark:shadow-neu-dark">
            <ApperIcon name="ChefHat" className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Table Not Found
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8">
            Sorry, the page you're looking for seems to have left the restaurant. 
            Let's get you back to your table.
          </p>
        </div>
        
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 btn-primary"
        >
          <ApperIcon name="Home" className="w-5 h-5" />
          <span>Back to TableSync</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound