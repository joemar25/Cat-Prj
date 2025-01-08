// components/Modal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const RequestCertificatesModal = ({ isOpen, onClose, children }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed overflow-y-auto w-full inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          {/* Modal Container */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-lg shadow-lg"
            style={{
              width: "auto", // Fit to content
              maxWidth: "90%", // Ensure it doesn't exceed 90% of the screen width
              maxHeight: "90vh", // Limit height to 90% of the viewport height
              overflow: "hidden", // Prevent inner content from overflowing
              margin: "0 auto", // Center the modal
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute", // Absolute position relative to the modal container
                top: "10px",
                right: "25px",
                background: "transparent",
                border: "none",
                fontSize: "30px",
                cursor: "pointer",
                color: "black", // Ensure the close button is visible
                zIndex: 60, // Ensure it's above the modal content
              }}
            >
              ×
            </button>

            {/* Scrollable Content */}
            <div
              style={{
                maxHeight: "90vh", // Limit height to 90% of the viewport height
                overflowY: "auto", // Make the content scrollable
                padding: "24px", // Add padding to the content
              }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequestCertificatesModal; // Default export