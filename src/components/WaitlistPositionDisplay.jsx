import { motion } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'
import ApperIcon from './ApperIcon'

function WaitlistPositionDisplay({ 
  position, 
  estimatedWait, 
  status, 
  restaurantName, 
  joinedAt, 
  totalInQueue = 15 
}) {
  const getStatusInfo = () => {
    switch (status) {
      case 'available':
        return {
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: 'CheckCircle',
          title: 'Table Ready!',
          subtitle: 'Your table is available now'
        }
      case 'active':
        return {
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          borderColor: 'border-amber-200 dark:border-amber-800',
          icon: 'Clock',
          title: `Position #${position}`,
          subtitle: `${estimatedWait} estimated wait`
        }
      default:
        return {
          color: 'text-surface-600 dark:text-surface-400',
          bgColor: 'bg-surface-50 dark:bg-surface-800',
          borderColor: 'border-surface-200 dark:border-surface-700',
          icon: 'Clock',
          title: 'Waiting',
          subtitle: 'Checking availability...'
        }
    }
  }

  const statusInfo = getStatusInfo()
  
  // Calculate progress percentage based on position
  const getProgressPercentage = () => {
    if (status === 'available') return 100
    const remaining = Math.max(0, totalInQueue - position)
    return Math.min(95, Math.max(5, (remaining / totalInQueue) * 100))
  }

  const getProgressColor = () => {
    const percentage = getProgressPercentage()
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getTimeWaited = () => {
    if (!joinedAt) return ''
    return formatDistanceToNow(new Date(joinedAt), { addSuffix: false })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`border rounded-xl p-6 ${statusInfo.bgColor} ${statusInfo.borderColor}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
            <ApperIcon name={statusInfo.icon} className={`w-5 h-5 ${statusInfo.color}`} />
          </div>
          <div>
            <h4 className={`font-semibold ${statusInfo.color}`}>
              {statusInfo.title}
            </h4>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              {statusInfo.subtitle}
            </p>
          </div>
        </div>
        
        {status === 'available' && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center text-green-600 dark:text-green-400"
          >
            <ApperIcon name="Bell" className="w-5 h-5" />
          </motion.div>
        )}
      </div>

      {/* Progress Section for Active Status */}
      {status === 'active' && (
        <div className="space-y-4">
          {/* Position Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-surface-600 dark:text-surface-400">Queue Progress</span>
              <span className="font-medium text-surface-900 dark:text-surface-100">
                {position} of {totalInQueue}
              </span>
            </div>
            <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-3 rounded-full ${getProgressColor()}`}
              />
            </div>
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-surface-500 dark:text-surface-400 block">Time Waited</span>
              <span className="font-medium text-surface-900 dark:text-surface-100">
                {getTimeWaited()}
              </span>
            </div>
            <div>
              <span className="text-surface-500 dark:text-surface-400 block">Est. Remaining</span>
              <span className="font-medium text-surface-900 dark:text-surface-100">
                {estimatedWait}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Available Status Call-to-Action */}
      {status === 'available' && (
        <div className="mt-4 p-3 bg-white dark:bg-surface-900 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300 text-center">
            🎉 Your table is ready! Check your notifications to confirm your reservation.
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default WaitlistPositionDisplay