import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import ApperIcon from './ApperIcon'
import WaitlistStatus from './WaitlistStatus'

function UserProfile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('waitlists')
  const [waitlists, setWaitlists] = useState([])
  const [reservations, setReservations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    preferences: {
      cuisine: ['Italian', 'Japanese'],
      location: 'Downtown',
      partySize: 2
    }
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    setIsLoading(true)
    setTimeout(() => {
      // Load waitlists
      const storedWaitlists = localStorage.getItem('waitlists')
      const waitlistData = storedWaitlists ? JSON.parse(storedWaitlists) : []
      setWaitlists(waitlistData.filter(w => w.status === 'active' || w.status === 'available'))

      // Load reservations
      const storedReservations = localStorage.getItem('reservations')
      const reservationData = storedReservations ? JSON.parse(storedReservations) : []
      setReservations(reservationData)
      
      setIsLoading(false)
    }, 1000)
  }

  const updateUserInfo = () => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem('userProfile', JSON.stringify(userInfo))
      setIsLoading(false)
      toast.success('Profile updated successfully!')
    }, 1000)
  }

  const cancelReservation = (reservationId) => {
    setIsLoading(true)
    setTimeout(() => {
      const updated = reservations.map(r => 
        r.id === reservationId 
          ? { ...r, status: 'cancelled', cancelledAt: new Date().toISOString() }
          : r
      )
      localStorage.setItem('reservations', JSON.stringify(updated))
      setReservations(updated)
      setIsLoading(false)
      toast.success('Reservation cancelled successfully.')
    }, 1000)
  }

  const tabs = [
    { id: 'waitlists', label: 'Active Waitlists', icon: 'Clock' },
    { id: 'reservations', label: 'Reservations', icon: 'Calendar' },
    { id: 'profile', label: 'Profile Settings', icon: 'User' }
  ]

  if (isLoading && activeTab !== 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <ApperIcon name="Loader2" className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-surface-600 dark:text-surface-400">Loading your profile...</p>
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
              My Profile
            </h1>
            <p className="text-surface-600 dark:text-surface-400 mt-1">
              Manage your reservations, waitlists, and profile settings
            </p>
          </div>
          <button
            onClick={() => navigate('/waitlist')}
            className="btn-primary flex items-center space-x-2"
          >
            <ApperIcon name="Clock" className="w-4 h-4" />
            <span>Manage Waitlists</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="card-neu p-1 mb-8">
          <div className="grid grid-cols-3 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Waitlists Tab */}
          {activeTab === 'waitlists' && (
            <div className="space-y-6">
              {waitlists.length === 0 ? (
                <div className="card-neu p-8 text-center">
                  <ApperIcon name="Clock" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
                    No Active Waitlists
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400 mb-6">
                    You don't have any active waitlists at the moment.
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="btn-primary"
                  >
                    Find Restaurants
                  </button>
                </div>
              ) : (
                waitlists.slice(0, 3).map((waitlist, index) => (
                  <motion.div
                    key={waitlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-neu p-6"
                  >
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                          {waitlist.restaurantName}
                        </h3>
                        <p className="text-surface-600 dark:text-surface-400 mb-4">
                          {format(new Date(waitlist.date), 'EEEE, MMMM do')} • {waitlist.partySize} guests
                        </p>
                        <div className="flex flex-wrap gap-2">
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
                      <div className="w-full lg:w-64">
                        <WaitlistStatus
                          position={waitlist.position}
                          estimatedWait={waitlist.estimatedWait}
                          status={waitlist.status}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              
              {waitlists.length > 3 && (
                <div className="text-center">
                  <button
                    onClick={() => navigate('/waitlist')}
                    className="btn-secondary"
                  >
                    View All Waitlists ({waitlists.length})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              {reservations.filter(r => r.status !== 'cancelled').length === 0 ? (
                <div className="card-neu p-8 text-center">
                  <ApperIcon name="Calendar" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
                    No Reservations
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400 mb-6">
                    You don't have any active reservations.
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="btn-primary"
                  >
                    Make a Reservation
                  </button>
                </div>
              ) : (
                reservations
                  .filter(r => r.status !== 'cancelled')
                  .map((reservation, index) => (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card-neu p-6"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                            {reservation.restaurantName}
                          </h3>
                          <p className="text-surface-600 dark:text-surface-400 mb-2">
                            {format(new Date(reservation.date), 'EEEE, MMMM do, yyyy')} at {reservation.time}
                          </p>
                          <p className="text-sm text-surface-500 dark:text-surface-400">
                            Party of {reservation.partySize} • {reservation.source === 'waitlist' ? 'From Waitlist' : 'Direct Booking'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            Confirmed
                          </span>
                          <button
                            onClick={() => cancelReservation(reservation.id)}
                            disabled={isLoading}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card-neu p-6">
              <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-6">
                Profile Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    value={userInfo.preferences.location}
                    onChange={(e) => setUserInfo({
                      ...userInfo,
                      preferences: {...userInfo.preferences, location: e.target.value}
                    })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={updateUserInfo}
                  disabled={isLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isLoading ? (
                    <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                  ) : (
                    <ApperIcon name="Save" className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default UserProfile