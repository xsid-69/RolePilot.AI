import { motion } from 'framer-motion';
import { pageTransition, smoothTransition } from '../lib/motion';

const PageTransition = ({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageTransition}
    transition={smoothTransition}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

export default PageTransition;
