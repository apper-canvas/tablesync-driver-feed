import { motion } from 'framer-motion'
import ApperIcon from './ApperIcon'

function WaitlistStatus({ position, estimatedWait, status }) {
  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return 'text-green-600 dark:text-green-400'
      case 'active':
        return 'text-amber-600 dark:text-amber-400'
      default:
        return 'text-surface-600 dark:text-surface-400'
    }
  }

  const getStatusBg = () => {
    switch (status) {
      case 'available':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'active':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
      default:
        return 'bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700'
    }
  }

  const getProgressColor = () => {
    if (position <= 3) return 'bg-green-500'
    if (position <= 6) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getProgressPercentage = () => {
    // Simulate progress based on position (lower position = higher progress)
    const maxPosition = 10
    return Math.max(20, ((maxPosition - position) / maxPosition) * 100)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`border rounded-xl p-4 ${getStatusBg()}`}
    >
      <div className="text-center space-y-4">
        <div>
          <div className={`text-3xl font-bold ${getStatusColor()} mb-1`}>
            {status === 'available' ? (
              <div className="flex items-center justify-center space-x-2">
                <ApperIcon name="CheckCircle" className="w-8 h-8" />
                <span>Ready!</span>
              </div>
            ) : (
              `#${position}`
            )}
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400">
            {status === 'available' ? 'Table Available at The Neon Garden' : 'Position in waitlist'}
          </p>
        </div>

        {status === 'active' && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-600 dark:text-surface-400">Progress</span>
                <span className="font-medium text-surface-900 dark:text-surface-100">
                  {Math.round(getProgressPercentage())}%
                </span>
              </div>
              <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-2 rounded-full ${getProgressColor()}`}
                />
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <ApperIcon name="Clock" className="w-4 h-4 text-surface-500" />
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                ~{estimatedWait} estimated wait
              </span>
            </div>
          </>
        )}

        {status === 'available' && (
          <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
            <ApperIcon name="Bell" className="w-4 h-4" />
            <span className="text-sm font-medium">
              The Neon Garden will contact you shortly!
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default WaitlistStatus