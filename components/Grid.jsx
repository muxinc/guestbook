import * as React from "react";
import { motion } from "framer-motion";
import { supabase } from "../utils/supabaseClient";

const Grid = () => {
  const [entries, set] = React.useState([]);

  React.useEffect(() => {
    const hydrate = async () => {
      let { data: entries, error } = await supabase.from("entries").select("*");
      set(entries);
    };

    hydrate();
  }, []);

  return (
    <div className="bg-gray-700 flex flex-wrap justify-between gap-2 py-4 w-full overflow-scroll h-[50vh]">
      {entries.map((row) => (
        <motion.div
          key={row.id}
          className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.9 }}
        >
          {row.first_name} {row.last_name}
        </motion.div>
      ))}
    </div>
  );
};

export default Grid;
