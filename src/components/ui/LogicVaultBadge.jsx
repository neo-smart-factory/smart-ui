import { ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * LogicVaultBadge - A premium badge indicating the contract is secured by the NEØ Logic Vault.
 */
const LogicVaultBadge = ({ logicHash, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 ${className}`}
    >
      <ShieldCheck className="w-4 h-4 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
      <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
        Logic Vault <span className="text-white/60 font-medium">Secured</span>
      </span>
      {logicHash && (
        <div className="ml-2 pl-2 border-l border-green-500/30 flex items-center gap-1.5 group cursor-help" title={`MIO Signature Hash: ${logicHash}`}>
          <Lock className="w-3 h-3 text-white/40" />
          <span className="text-[9px] font-mono text-white/40 group-hover:text-white/80 transition-colors">
            {logicHash.slice(0, 8)}...
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default LogicVaultBadge;
