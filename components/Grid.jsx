import * as React from 'react';
import { motion } from "framer-motion"

const Grid = () => {
  const arr = Array(500).fill(2);
  return (
    <div className="bg-gray-700 flex flex-wrap justify-between gap-2 py-4 w-full overflow-scroll h-[50vh]">
      {arr.map(i => (
        <motion.div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center cursor-pointer" whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.9 }}>gif</motion.div>
      ))}
    </div>
  );
}

export default Grid;