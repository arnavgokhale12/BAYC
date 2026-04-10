import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Generates a plausible-looking fake tx hash
function fakeTxHash() {
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  const seg = (n) => Array.from({ length: n }, hex).join('');
  return `0x${seg(6)}…${seg(4)}`;
}

let toastListener = null;

// Call this from anywhere to fire a mint toast
export function showMintToast() {
  if (toastListener) toastListener(fakeTxHash());
}

export default function TxToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((txHash) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, txHash, status: 'pending' }]);

    // Resolve after 3 s
    setTimeout(() => {
      setToasts(prev =>
        prev.map(t => t.id === id ? { ...t, status: 'confirmed' } : t)
      );
      // Auto-dismiss after another 3 s
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    }, 3000);
  }, []);

  // Register the global listener
  useEffect(() => {
    toastListener = addToast;
    return () => { toastListener = null; };
  }, [addToast]);

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0,  scale: 1   }}
            exit={{   opacity: 0, x: 60, scale: 0.9  }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="rounded-xl px-4 py-3 shadow-2xl pointer-events-auto"
            style={{
              background: '#0f0f1e',
              border: `1px solid ${toast.status === 'confirmed' ? 'rgba(255,215,0,0.5)' : 'rgba(255,255,255,0.12)'}`,
              minWidth: 260,
              boxShadow: toast.status === 'confirmed'
                ? '0 0 20px rgba(255,215,0,0.2)'
                : '0 8px 32px rgba(0,0,0,0.6)',
            }}
          >
            <div className="flex items-center gap-2.5">
              {toast.status === 'pending' ? (
                <Spinner />
              ) : (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className="text-base"
                >
                  ✅
                </motion.span>
              )}
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-semibold"
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    color: toast.status === 'confirmed' ? '#FFD700' : '#fff',
                  }}
                >
                  {toast.status === 'pending' ? 'Transaction Pending' : 'Minted on-chain!'}
                </div>
                <div
                  className="text-xs mt-0.5 truncate font-mono"
                  style={{ color: '#555' }}
                >
                  {toast.txHash}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Spinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-4 h-4 rounded-full flex-shrink-0"
      style={{ border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#FFD700' }}
    />
  );
}
