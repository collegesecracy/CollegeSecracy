import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const InitialLoader = ({ isPageLoaded }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isPageLoaded) {
      const timer = setTimeout(() => setVisible(false), 5200);
      return () => clearTimeout(timer);
    }
  }, [isPageLoaded]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* ===== BASE BACKGROUND ===== */}
          <div className="absolute inset-0 bg-[#eef1f5]" />

          {/* Depth radial tones */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(55,162,223,0.08),transparent_40%),radial-gradient(circle_at_85%_70%,rgba(10,68,213,0.08),transparent_40%)]" />

          {/* Edge vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_55%,rgba(0,0,0,0.08)_100%)]" />

          {/* Animated grid */}
          <motion.div
            className="absolute inset-0 opacity-[0.04] 
            bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] 
            bg-[size:60px_60px]"
            animate={{ backgroundPosition: ["0px 0px", "60px 60px"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />

          {/* ===== NEW SUBTLE BACKGROUND ANIMATION ===== */}

          {/* Floating soft particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-600 rounded-full opacity-20"
              style={{
                top: `${20 + i * 10}%`,
                left: `${10 + i * 15}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* ===== RANDOM SYSTEM LOGS ===== */}
          <div className="absolute inset-0 pointer-events-none text-[10px] sm:text-[11px] font-medium tracking-wide text-gray-700">

            <motion.div
              className="absolute top-16 sm:top-20 left-6 sm:left-20"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              ● Rank Dataset Indexed
            </motion.div>

            <motion.div
              className="absolute bottom-20 sm:bottom-28 right-6 sm:right-24"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              ● Seat Matrix Validated
            </motion.div>

            <motion.div
              className="hidden sm:block absolute top-1/3 right-32"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              ● Counselling Rounds Synced
            </motion.div>

            <motion.div
              className="hidden sm:block absolute bottom-1/3 left-24"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              ● Category Cutoffs Processed
            </motion.div>
          </div>

          {/* ===== CENTER CONTENT ===== */}
          <motion.div
            className="relative z-10 text-center px-4 sm:px-6 w-full max-w-xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Rotating Seal */}
            <div className="relative mx-auto mb-8 sm:mb-12 
                            w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 
                            flex items-center justify-center">

              <motion.div
                className="absolute inset-0 rounded-full border-2 sm:border-[3px] border-gray-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              />

              <motion.div
                className="absolute inset-4 sm:inset-6 rounded-full border border-gray-500 opacity-40"
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              />

              {/* Book */}
              <motion.svg
                viewBox="0 0 200 200"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
              >
                <motion.path
                  d="M40 40 L100 30 L100 170 L40 180 Z"
                  fill="#ffffff"
                  stroke="#37A2DF"
                  strokeWidth="3"
                  initial={{ rotateY: -90, originX: 1 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 1.3 }}
                />

                <motion.path
                  d="M100 30 L160 40 L160 180 L100 170 Z"
                  fill="#ffffff"
                  stroke="#0A44D5"
                  strokeWidth="3"
                  initial={{ rotateY: 90, originX: 0 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 1.3, delay: 0.2 }}
                />

                <motion.line
                  x1="100"
                  y1="30"
                  x2="100"
                  y2="170"
                  stroke="#374151"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                />
              </motion.svg>
            </div>

            {/* Brand */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest"
              style={{
                background:
                  "linear-gradient(90deg,#37A2DF,#A7AAB1,#0A44D5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 3px 8px rgba(0,0,0,0.15)"
              }}
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.12em" }}
              transition={{ delay: 1 }}
            >
              CollegeSecracy
            </motion.h1>

            <motion.p
              className="text-gray-800 mt-4 sm:mt-6 text-sm sm:text-base tracking-wide font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              Initializing College Prediction & Counselling System
            </motion.p>

            <motion.p
              className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              Secure Academic Data Processing in Progress
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoader;