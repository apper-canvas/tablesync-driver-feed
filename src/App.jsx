import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import WaitlistManager from './components/WaitlistManager'
import UserProfile from './components/UserProfile'

function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50/30 to-secondary-100/50 dark:from-surface-900 dark:via-cyber-purple/10 dark:to-cyber-blue/10">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/waitlist" element={<WaitlistManager />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </AnimatePresence>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-50"
        toastClassName="bg-white/90 backdrop-blur-lg dark:bg-surface-800/90 text-surface-900 dark:text-surface-100 shadow-holo rounded-xl border border-primary/20 dark:border-cyber-blue/30"
      />
    </div>
  )
}

export default App