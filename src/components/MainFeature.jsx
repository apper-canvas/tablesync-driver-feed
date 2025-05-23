import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, addDays, startOfDay } from 'date-fns'
import ApperIcon from './ApperIcon'
import { useNavigate } from 'react-router-dom'

// The Neon Garden Restaurant Data
const restaurant = {
  id: 1,
  name: "The Neon Garden",
  cuisine: "Modern Fusion",
  rating: 4.9,
  priceRange: "$$$$",
  image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
  location: "Downtown District",
  description: "An innovative dining experience featuring molecular gastronomy and cyberpunk aesthetics",
  phone: "+1 (555) 123-NEON",
  email: "reservations@neongarden.com",
  waitlistAvailable: true
}

const timeSlots = [
  "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
  "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM"
]

function MainFeature() {
  const navigate = useNavigate()
  const [step, setStep] = useState('search') // search, booking, confirmation
  const [searchFilters, setSearchFilters] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '7:00 PM',
    partySize: 2,
    cuisine: '',
    location: ''
  })
  const [tableAvailability, setTableAvailability] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    specialRequests: '',
    selectedTime: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showWaitlistOption, setShowWaitlistOption] = useState(false)
  const [waitlistDetails, setWaitlistDetails] = useState({
    name: '',
    email: '',
    phone: '',
    preferredTimes: []
  })

  const handleSearch = () => {
    setIsLoading(true)
    
    setTimeout(() => {
      // Simulate checking table availability for The Neon Garden
      const hasAvailability = Math.random() > 0.4
      const availableTimes = hasAvailability ? 
        timeSlots.filter(() => Math.random() > 0.5).slice(0, Math.floor(Math.random() * 4) + 1) : 
        []
      
      setTableAvailability(availableTimes)
      setSelectedRestaurant(restaurant)
      setStep('booking')
      setIsLoading(false)
    }, 1500)
  }

  const handleBooking = () => {
    if (!bookingDetails.name || !bookingDetails.email || !bookingDetails.selectedTime) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    
    // Simulate booking API call
    setTimeout(() => {
      setStep('confirmation')
      setIsLoading(false)
      toast.success("Reservation confirmed at The Neon Garden! Check your email for details.")
    }, 2000)
  }

  const joinWaitlist = () => {
    if (!waitlistDetails.name || !waitlistDetails.email || waitlistDetails.preferredTimes.length === 0) {
      toast.error("Please fill in all required fields and select preferred times")
      return
    }

    setIsLoading(true)
    
    // Simulate waitlist API call
    setTimeout(() => {
      const waitlistEntry = {
        id: Date.now(),
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        date: searchFilters.date,
        partySize: searchFilters.partySize,
        preferredTimes: waitlistDetails.preferredTimes,
        position: Math.floor(Math.random() * 8) + 1,
        estimatedWait: `${Math.floor(Math.random() * 120) + 15} minutes`,
        status: 'active',
        ...waitlistDetails,
        joinedAt: new Date().toISOString()
      }
      
      const existingWaitlists = JSON.parse(localStorage.getItem('waitlists') || '[]')
      localStorage.setItem('waitlists', JSON.stringify([...existingWaitlists, waitlistEntry]))
      
      setIsLoading(false)
      toast.success(`Successfully joined The Neon Garden waitlist! You're #${waitlistEntry.position} in line.`)
      setStep('confirmation')
    }, 1500)
  }

  const resetBooking = () => {
    setStep('search')
    setTableAvailability([])
    setBookingDetails({
      name: '',
      email: '',
      phone: '',
      specialRequests: '',
      selectedTime: ''
    })
    setSearchFilters({
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '7:00 PM',
      partySize: 2,
      cuisine: '',
      location: ''
    })
    setWaitlistDetails({
      name: '',
      email: '',
      phone: '',
      preferredTimes: []
    })
    setShowWaitlistOption(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="card-neu p-6 sm:p-8 lg:p-10 max-w-6xl mx-auto"
    >
      {/* Progress Bar */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center justify-between mb-4">
          {['search', 'booking', 'confirmation'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step === stepName ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-neon' :
                ['search', 'booking', 'confirmation'].indexOf(step) > index ? 'bg-gradient-to-r from-primary-light to-secondary-light text-white shadow-card' :
                'bg-surface-200/80 dark:bg-surface-700/80 text-surface-600 dark:text-surface-400'
              }`}>
                {index + 1}
              </div>
              {index < 2 && (
                <div className={`w-8 sm:w-16 lg:w-24 h-1 mx-2 rounded transition-all duration-300 ${
                  ['search', 'booking', 'confirmation'].indexOf(step) > index ? 'bg-primary-light' : 'bg-surface-200 dark:bg-surface-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100 capitalize">
            {step === 'restaurant' && 'Choose Restaurant'}
            {step === 'booking' && 'Complete Booking'}
            {step === 'confirmation' && 'Booking Confirmed'}
          </h3>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Search Step */}
        {step === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Restaurant Info Header */}
              <div className="sm:col-span-2 lg:col-span-3 mb-6">
                <div className="text-center">
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    {restaurant.name}
                  </h4>
                  <p className="text-surface-600 dark:text-surface-400 mb-1">
                    {restaurant.cuisine} • {restaurant.location} • {restaurant.priceRange}
                  </p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    {restaurant.description}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={searchFilters.date}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                  onChange={(e) => setSearchFilters({...searchFilters, date: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Time
                </label>
                <select
                  value={searchFilters.time}
                  onChange={(e) => setSearchFilters({...searchFilters, time: e.target.value})}
                  className="input-field"
                >
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Party Size
                </label>
                <select
                  value={searchFilters.partySize}
                  onChange={(e) => setSearchFilters({...searchFilters, partySize: parseInt(e.target.value)})}
                  className="input-field"
                >
                  {[1,2,3,4,5,6,7,8].map(size => (
                    <option key={size} value={size}>{size} {size === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            <motion.button
              onClick={handleSearch}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center space-x-2 text-base sm:text-lg"
            >
              {isLoading ? (
                <>
                  <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
                  <span>Searching Restaurants...</span>
                </>
              ) : (
                <>
                  <ApperIcon name="Search" className="w-5 h-5" />
                  <span>Find Available Tables</span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Booking Step - Table Available */}
        {step === 'booking' && tableAvailability.length > 0 && !showWaitlistOption && (
          <motion.div
            key="booking"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  Complete Your Reservation
                </h4>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  {restaurant.name} • {format(new Date(searchFilters.date), 'EEEE, MMMM do')}
                </p>
              </div>
              <button
                onClick={() => setStep('search')}
                className="btn-secondary flex items-center space-x-2 text-sm"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4" />
                <span>Change Date/Time</span>
              </button>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                Available Times *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {tableAvailability.map((time) => (
                  <button
                    key={time}
                    onClick={() => setBookingDetails({...bookingDetails, selectedTime: time})}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      bookingDetails.selectedTime === time
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-neon'
                        : 'bg-surface-100/80 dark:bg-surface-700/80 text-surface-900 dark:text-surface-100 hover:bg-surface-200/80 dark:hover:bg-surface-600/80 border border-primary/10 dark:border-cyber-blue/20'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={bookingDetails.name}
                  onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={bookingDetails.email}
                  onChange={(e) => setBookingDetails({...bookingDetails, email: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={bookingDetails.phone}
                  onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Special Requests
                </label>
                <textarea
                  placeholder="Allergies, celebrations, accessibility needs..."
                  value={bookingDetails.specialRequests}
                  onChange={(e) => setBookingDetails({...bookingDetails, specialRequests: e.target.value})}
                  rows="3"
                  className="input-field resize-none"
                />
              </div>
            </div>

            <motion.button
              onClick={handleBooking}
              disabled={isLoading || !bookingDetails.selectedTime}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center space-x-2 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
                  <span>Confirming Reservation...</span>
                </>
              ) : (
                <>
                  <ApperIcon name="Check" className="w-5 h-5" />
                  <span>Confirm Reservation</span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Waitlist Step */}
        {/* No Availability - Waitlist Option */}
        {step === 'booking' && tableAvailability.length === 0 && !showWaitlistOption && (
          <motion.div
            key="no-availability"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="Clock" className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                No Tables Available
              </h4>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                Unfortunately, no tables are available for {format(new Date(searchFilters.date), 'EEEE, MMMM do')} at your requested time.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setStep('search')}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span>Try Different Date/Time</span>
              </button>
              
              <button
                onClick={() => setShowWaitlistOption(true)}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <ApperIcon name="UserPlus" className="w-4 h-4" />
                <span>Join Waitlist</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Waitlist Step */}
        {step === 'booking' && showWaitlistOption && (
          <motion.div
            key="waitlist"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  Join Waitlist
                </h4>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  {restaurant.name} • {format(new Date(searchFilters.date), 'EEEE, MMMM do')}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowWaitlistOption(false)
                  setStep('search')
                }}
                className="btn-secondary flex items-center space-x-2 text-sm"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4" />
                <span>Back to Search</span>
              </button>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Clock" className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                    No tables currently available
                  </h5>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Join The Neon Garden waitlist and we'll notify you immediately when a table opens up for your party size.
                  </p>
                </div>
              </div>
            </div>

            {/* Preferred Times */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                Preferred Times * (Select at least one)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      const currentTimes = waitlistDetails.preferredTimes
                      const newTimes = currentTimes.includes(time)
                        ? currentTimes.filter(t => t !== time)
                        : [...currentTimes, time]
                      setWaitlistDetails({...waitlistDetails, preferredTimes: newTimes})
                    }}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      waitlistDetails.preferredTimes.includes(time)
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-neon'
                        : 'bg-surface-100/80 dark:bg-surface-700/80 text-surface-900 dark:text-surface-100 hover:bg-surface-200/80 dark:hover:bg-surface-600/80 border border-primary/10 dark:border-cyber-blue/20'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={waitlistDetails.name}
                  onChange={(e) => setWaitlistDetails({...waitlistDetails, name: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={waitlistDetails.email}
                  onChange={(e) => setWaitlistDetails({...waitlistDetails, email: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={waitlistDetails.phone}
                  onChange={(e) => setWaitlistDetails({...waitlistDetails, phone: e.target.value})}
                  className="input-field"
                />
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                  We'll send you SMS and email notifications when a table becomes available
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => joinWaitlist()}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
                    <span>Joining Waitlist...</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="UserPlus" className="w-5 h-5" />
                    <span>Join Waitlist</span>
                  </>
                )}
              </motion.button>
              
              <button
                onClick={() => navigate('/waitlist')}
                className="btn-secondary flex items-center justify-center space-x-2 text-sm"
              >
                <ApperIcon name="List" className="w-4 h-4" />
                <span>View My Waitlists</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Confirmation Step */}
        {step === 'confirmation' && !showWaitlistOption && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon animate-pulse">
              <ApperIcon name="Check" className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                Reservation Confirmed!
              </h4>
              <p className="text-surface-600 dark:text-surface-400">
                Your table has been successfully reserved
              </p>
            </div>

            <div className="card-neu p-6 text-left max-w-md mx-auto">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-surface-600 dark:text-surface-400">Restaurant:</span>
                  <span className="font-medium text-surface-900 dark:text-surface-100">{restaurant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600 dark:text-surface-400">Date:</span>
                  <span className="font-medium text-surface-900 dark:text-surface-100">
                    {format(new Date(searchFilters.date), 'MMM do, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600 dark:text-surface-400">Time:</span>
                  <span className="font-medium text-surface-900 dark:text-surface-100">{bookingDetails.selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600 dark:text-surface-400">Party Size:</span>
                  <span className="font-medium text-surface-900 dark:text-surface-100">{searchFilters.partySize} guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600 dark:text-surface-400">Confirmation:</span>
                  <span className="font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">#TS{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={resetBooking}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
                <span>Make Another Reservation</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Waitlist Confirmation */}
        {step === 'confirmation' && showWaitlistOption && (
          <motion.div
            key="waitlist-confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-accent to-cyber-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon animate-pulse">
              <ApperIcon name="Clock" className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                Added to Waitlist!
              </h4>
              <p className="text-surface-600 dark:text-surface-400 mb-4">
                The Neon Garden will notify you as soon as a table becomes available
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => navigate('/waitlist')} className="btn-primary">
                  View Waitlist Status
                </button>
                <button onClick={resetBooking} className="btn-secondary">
                  Make Another Search
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default MainFeature