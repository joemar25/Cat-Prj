"use client";

import { useState } from "react";
import { KioskService, useKioskStore } from "@/state/use-kiosk-store";
import { motion } from "framer-motion";

export function SelectServiceStep() {
  const { setService } = useKioskStore();
  const [selectedService, setSelectedService] = useState<string | null>(null);

 const handleSelectService = (service: string) => {
   setSelectedService(service);
   setService(service as KioskService); // Cast service to KioskService
 };

  return (
    <div className="w-full h-full  flex justify-evenly items-center p-8">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`rounded-lg shadow-sm p-4 h-72 w-72 border-2 border-black cursor-pointer ${
          selectedService === "VERIFY" ? "bg-[#FFD101] h-80 w-80" : ""
        }`}
        onClick={() => handleSelectService("VERIFY")}
      >
        <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
          <img src="/select-reg.svg" className="w-24 h-24" alt="" />
          <span className="uppercase font-semibold w-full max-w-48 text-center">
            New Application Registration
          </span>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`rounded-lg shadow-sm p-4 h-72 w-72 border-2 cursor-pointer border-black ${
          selectedService === "TRUE_COPY" ? "bg-[#FFD101] h-80 w-80" : ""
        }`}
        onClick={() => handleSelectService("TRUE_COPY")}
      >
        <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
          <img src="/select-cert.svg" className="w-24 h-24" alt="" />
          <span className="uppercase font-semibold w-full max-w-sm text-center">
            Apply for certified true xerox copy
          </span>
        </div>
      </motion.div>
    </div>
  );
}



//do not delete
// const KioskSelectService = () => {
//   return (
//     <div className="w-full h-full border border-black flex justify-center items-center">
//       {/* <CardHeader>
//                 <CardTitle className="text-3xl">Select Service</CardTitle>
//             </CardHeader>
//             <CardContent className="flex flex-col space-y-4">
//                 <p className="text-lg">Please choose the service you want to proceed with:</p> Increased font size

//                 <Button onClick={handleTrueCopy}>Request True Copy</Button>
//                 <Button variant="outline" onClick={handleVerify}>
//                     Verify Registration
//                 </Button>
//             </CardContent> */}
//     </div>
//   );
// };
