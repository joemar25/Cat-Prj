"use client";

import { useState } from "react";
import { useKioskStore, DocumentType } from "@/state/use-kiosk-store";
import { motion } from "framer-motion";

export function TrueCopyRequest() {
  const { setSelectedDocuments, completeTrueCopy } = useKioskStore();
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);

  const documentTypes = [
    { value: "birth" as DocumentType, label: "Birth Certificate", icon: "/birth-cert.svg" },
    { value: "marriage" as DocumentType, label: "Marriage Certificate", icon: "/marriage-cert.svg" },
    { value: "death" as DocumentType, label: "Death Certificate", icon: "/death-cert.svg" },
  ];

  const handleSelectDocument = (docType: DocumentType) => {
    setSelectedDoc(docType);
    setSelectedDocuments([docType]);
  };

  const handleSubmit = () => {
    if (selectedDoc) {
      completeTrueCopy();
    } else {
      alert("Please select a document type before proceeding.");
    }
  };

  return (
    <div className="w-full h-full flex justify-evenly items-center p-8">
      {documentTypes.map((doc) => (
        <motion.div
          key={doc.value}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`rounded-lg shadow-sm p-4 h-72 w-72 border-2 border-black cursor-pointer ${
            selectedDoc === doc.value ? "bg-[#FFD200] h-80 w-80" : ""
          }`}
          onClick={() => handleSelectDocument(doc.value)}
        >
          <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
            <img src={doc.icon} className="w-24 h-24" alt={doc.label} />
            <span className="uppercase font-semibold w-full max-w-sm text-center">
              {doc.label}
            </span>
          </div>
        </motion.div>
      ))}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold mt-8"
        onClick={handleSubmit}
      >
        Submit
      </motion.button>
    </div>
  );
}



// const KioskTrueCopyRequest = () => {
//     return (
//         <div className="w-full p-6">
//             {/* <CardHeader>
//                 <CardTitle className="text-2xl">Request Certified Copy</CardTitle>
//             </CardHeader> */}

//             <CardContent className="space-y-6">
//                 <div className="space-y-4">
//                     <Label className="font-medium text-lg">Select Documents</Label>
//                     {documentTypes.map((doc) => (
//                         <div key={doc.value} className="flex items-center space-x-2">
//                             <Checkbox
//                                 id={doc.value}
//                                 checked={selectedDocs.includes(doc.value)}
//                                 onCheckedChange={() => handleDocSelect(doc.value)}
//                             />
//                             <Label htmlFor={doc.value} className="text-lg">{doc.label}</Label>
//                         </div>
//                     ))}
//                 </div>

//                 {/* <div>
//                     <Label htmlFor="email" className="font-medium text-lg">
//                         Email Address
//                     </Label>
//                     <Input
//                         id="email"
//                         type="email"
//                         placeholder="Enter your registered email"
//                         value={localEmail}
//                         onChange={(e) => setLocalEmail(e.target.value)}
//                         className="mt-2 text-lg"
//                     />
//                 </div> */}
//             </CardContent>

//             {/* <CardFooter className="flex justify-between">
//                 <Button variant="outline" onClick={prevStep} className="text-lg">
//                     Back
//                 </Button>
//                 <Button
//                     onClick={handleSubmit}
//                     disabled={!localEmail || selectedDocs.length === 0}
//                     className="text-lg"
//                 >
//                     Request Copies
//                 </Button>
//             </CardFooter> */}
//         </div>
//     )
// };