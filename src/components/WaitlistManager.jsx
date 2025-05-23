import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import ApperIcon from './ApperIcon'
import WaitlistStatus from './WaitlistStatus'

function WaitlistManager() {
  const navigate = useNavigate()
  const [waitlists, setWaitlists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWaitlist, setSelectedWaitlist] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  useEffect(() => {
    loadWaitlists()
    // Simulate periodic position updates
    const interval = setInterval(() => {
      updateWaitlistPositions()
    }, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const loadWaitlists = () => {
    setIsLoading(true)
    setTimeout(() => {
      const stored = localStorage.getItem('waitlists')
      const waitlistData = stored ? JSON.parse(stored) : []
      setWaitlists(waitlistData.filter(w => w.status === 'active' || w.status === 'available'))
      setIsLoading(false)
    }, 1000)
  }

  const updateWaitlistPositions = () => {
    const stored = localStorage.getItem('waitlists')
    if (!stored) return
    
    const waitlistData = JSON.parse(stored)
    const updated = waitlistData.map(waitlist => {
      if (waitlist.status === 'active' && Math.random() > 0.7) {
        // Randomly make some tables available
        if (Math.random() > 0.5) {
          return {
            ...waitlist,
            status: 'available',
            availableTime: waitlist.preferredTimes[Math.floor(Math.random() * waitlist.preferredTimes.length)],
            notifiedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes to respond
          }
        } else {
          // Just update position
          const newPosition = Math.max(1, waitlist.position - Math.floor(Math.random() * 2))
          const estimatedWait = `${Math.max(5, parseInt(waitlist.estimatedWait) - Math.floor(Math.random() * 20))} minutes`
          return { ...waitlist, position: newPosition, estimatedWait }
        }
      }
      return waitlist
    })
    
    localStorage.setItem('waitlists', JSON.stringify(updated))
    setWaitlists(updated.filter(w => w.status === 'active' || w.status === 'available'))
  }

  const confirmTable = (waitlistId) => {
    setIsLoading(true)
    setTimeout(() => {
      const stored = localStorage.getItem('waitlists')
      const waitlistData = JSON.parse(stored)
      const updated = waitlistData.map(w => 
        w.id === waitlistId 
          ? { ...w, status: 'confirmed', confirmedAt: new Date().toISOString() }
          : w
      )
      localStorage.setItem('waitlists', JSON.stringify(updated))
      
      // Create reservation record
      const confirmedWaitlist = updated.find(w => w.id === waitlistId)
      const reservations = JSON.parse(localStorage.getItem('reservations') || '[]')
      const newReservation = {
        id: Date.now(),
        restaurantName: confirmedWaitlist.restaurantName,
        date: confirmedWaitlist.date,
        time: confirmedWaitlist.availableTime,
        partySize: confirmedWaitlist.partySize,
        guestName: confirmedWaitlist.name,
        email: confirmedWaitlist.email,
        phone: confirmedWaitlist.phone,
        status: 'confirmed',
        source: 'waitlist',
        confirmedAt: new Date().toISOString()
      }
      localStorage.setItem('reservations', JSON.stringify([...reservations, newReservation]))
      
      setWaitlists(prev => prev.filter(w => w.id !== waitlistId))
      setIsLoading(false)
      toast.success('Table confirmed! Your reservation is now active.')
      setShowConfirmDialog(false)
    }, 1500)
  }

  const declineTable = (waitlistId) => {
    setIsLoading(true)
    setTimeout(() => {
      const stored = localStorage.getItem('waitlists')
      const waitlistData = JSON.parse(stored)
      const updated = waitlistData.map(w => 
        w.id === waitlistId 
          ? { ...w, status: 'declined', declinedAt: new Date().toISOString() }
          : w
      )
      localStorage.setItem('waitlists', JSON.stringify(updated))
      setWaitlists(prev => prev.filter(w => w.id !== waitlistId))
      setIsLoading(false)
      toast.info('Table declined. You remain on the waitlist for other times.')
      setShowConfirmDialog(false)
    }, 1000)
  }

  const removeFromWaitlist = (waitlistId) => {
    setIsLoading(true)
    setTimeout(() => {
      const stored = localStorage.getItem('waitlists')
      const waitlistData = JSON.parse(stored)
      const updated = waitlistData.map(w => 
        w.id === waitlistId 
          ? { ...w, status: 'cancelled', cancelledAt: new Date().toISOString() }
          : w
      )
      localStorage.setItem('waitlists', JSON.stringify(updated))
      setWaitlists(prev => prev.filter(w => w.id !== waitlistId))
      setIsLoading(false)
      toast.success('Successfully removed from waitlist.')
      setShowConfirmDialog(false)
    }, 1000)
  }

  const handleAction = (action, waitlist) => {
    setSelectedWaitlist(waitlist)
    setConfirmAction(action)
    setShowConfirmDialog(true)
  }

  const executeAction = () => {
    if (!selectedWaitlist || !confirmAction) return
    
    switch (confirmAction.type) {
      case 'confirm':
        confirmTable(selectedWaitlist.id)
        break
      case 'decline':
        declineTable(selectedWaitlist.id)
        break
      case 'remove':
        removeFromWaitlist(selectedWaitlist.id)
        break
    }
  }

  if (isLoading && waitlists.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <ApperIcon name="Loader2" className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-surface-600 dark:text-surface-400">Loading your waitlists...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-surface-600 dark:text-surface-400 hover:text-primary transition-colors mb-4"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">
              My Waitlists
            </h1>
            <p className="text-surface-600 dark:text-surface-400 mt-1">
              Track your table waitlist status and manage available tables
            </p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="btn-secondary flex items-center space-x-2"
          >
            <ApperIcon name="User" className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </div>

        {waitlists.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-neu p-8 text-center"
          >
            <ApperIcon name="Clock" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
              No Active Waitlists
            </h3>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              You don't have any active waitlists. Search for restaurants to join waitlists when tables aren't available.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Find Restaurants
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {waitlists.map((waitlist, index) => (
              <motion.div
                key={waitlist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card-neu p-6 ${waitlist.status === 'available' ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
              >
                {waitlist.status === 'available' && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">
                          Table Available!
                        </h5>
                        <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                          A table for {waitlist.partySize} is now available at {waitlist.availableTime}. 
                          You have 15 minutes to confirm or decline this reservation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleAction({ type: 'confirm' }, waitlist)}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                          >
                            <ApperIcon name="Check" className="w-4 h-4" />
                            <span>Confirm Table</span>
                          </button>
                          <button
                            onClick={() => handleAction({ type: 'decline' }, waitlist)}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                          >
                            <ApperIcon name="X" className="w-4 h-4" />
                            <span>Decline</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                          {waitlist.restaurantName}
                        </h3>
                        <p className="text-surface-600 dark:text-surface-400">
                          {format(new Date(waitlist.date), 'EEEE, MMMM do, yyyy')} • {waitlist.partySize} guests
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          waitlist.status === 'available' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                        }`}>
                          {waitlist.status === 'available' ? 'Table Available' : 'Waiting'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Preferred Times</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {waitlist.preferredTimes.map((time) => (
                            <span
                              key={time}
                              className="text-xs bg-primary-light/10 text-primary-dark dark:text-primary-light px-2 py-1 rounded"
                            >
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Contact</label>
                        <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                          {waitlist.email}
                        </p>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                          {waitlist.phone}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-surface-500 dark:text-surface-400">
                      Joined waitlist on {format(new Date(waitlist.joinedAt), 'MMM do, yyyy \'at\' h:mm a')}
                    </div>
                  </div>

                  <div className="lg:w-80">
                    <WaitlistStatus
                      position={waitlist.position}
                      estimatedWait={waitlist.estimatedWait}
                      status={waitlist.status}
                    />
                    
                    {waitlist.status === 'active' && (
                      <button
                        onClick={() => handleAction({ type: 'remove' }, waitlist)}
                        disabled={isLoading}
                        className="w-full mt-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                        <span>Remove from Waitlist</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Confirmation Dialog */}
        <AnimatePresence>
          {showConfirmDialog && selectedWaitlist && confirmAction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowConfirmDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-surface-800 rounded-2xl p-6 max-w-md w-full mx-auto"
              >
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                  {confirmAction.type === 'confirm' && 'Confirm Table Reservation'}
                  {confirmAction.type === 'decline' && 'Decline Table Offer'}
                  {confirmAction.type === 'remove' && 'Remove from Waitlist'}
                </h3>
                <p className="text-surface-600 dark:text-surface-400 mb-6">
                  {confirmAction.type === 'confirm' && `Are you sure you want to confirm your table at ${selectedWaitlist.restaurantName}?`}
                  {confirmAction.type === 'decline' && `Are you sure you want to decline this table? You'll remain on the waitlist for other times.`}
                  {confirmAction.type === 'remove' && `Are you sure you want to remove yourself from the waitlist at ${selectedWaitlist.restaurantName}?`}
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={executeAction}
                    disabled={isLoading}
                    className={`flex-1 font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                      confirmAction.type === 'remove' || confirmAction.type === 'decline'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isLoading ? (
                      <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                    ) : (
                      <ApperIcon name={confirmAction.type === 'confirm' ? 'Check' : 'Trash2'} className="w-4 h-4" />
                    )}
                    <span>
                      {confirmAction.type === 'confirm' && 'Confirm'}
                      {confirmAction.type === 'decline' && 'Decline'}
                      {confirmAction.type === 'remove' && 'Remove'}
                    </span>
                  </button>
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default WaitlistManager