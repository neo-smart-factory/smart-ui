import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Target } from 'lucide-react';

export default function LandingSection() {
    const stats = [
        { label: "Deployed Assets", value: "10k+", icon: Zap },
        { label: "Total Liquidity", value: "$42M+", icon: Globe },
        { label: "Audit Rating", value: "AAA", icon: Shield }
    ];

    return (
        <div className="space-y-24 py-12">
            {/* Social Proof / Stats - Removido por ser placeholder / números fictícios */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="text-center group"
                    >
                        <div className="mb-4 flex justify-center">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-neon-acid/50 transition-colors">
                                <stat.icon className="w-6 h-6 text-slate-400 group-hover:text-neon-acid transition-colors" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold font-headline mb-1">{stat.value}</div>
                        <div className="text-xs uppercase font-bold tracking-[0.2em] text-slate-500">{stat.label}</div>
                    </motion.div>
                ))}
            </div> */}

            {/* Conversion / Traffic Paid Focus */}
            <div className="glass-card bg-gradient-to-br from-white/5 to-transparent border-neon-acid/20 p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-energy" />

                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold font-headline leading-tight">
                            Ready to <span className="text-neon-acid">Launch</span> your Multichain Empire?
                        </h2>
                        <p className="text-slate-400 font-medium">
                            Skip the complexity of smart contract development. Use the NEØ neural protocol to deploy professional, audited, and liquid assets in less than 60 seconds.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <div className="flex items-center gap-2 bg-black/40 px-6 py-4 rounded-xl border border-white/10">
                            <Target className="w-5 h-5 text-neon-acid" />
                            <div className="text-left">
                                <span className="block text-[10px] uppercase font-bold text-slate-500">Execution Speed</span>
                                <span className="text-sm font-bold">~45 Seconds</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-black/40 px-6 py-4 rounded-xl border border-white/10">
                            <Shield className="w-5 h-5 text-signal-cyan" />
                            <div className="text-left">
                                <span className="block text-[10px] uppercase font-bold text-slate-500">Security Guard</span>
                                <span className="text-sm font-bold">Standard V2.0 Audit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter / Retargeting Mockup */}
            <div className="flex flex-col items-center gap-6">
                <h3 className="neo-label">Join the Neural Network</h3>
                <div className="flex w-full max-w-md gap-2">
                    <input
                        id="newsletter-email"
                        name="email"
                        type="email"
                        placeholder="enter@your.neural.link"
                        className="neo-input flex-1"
                        autoComplete="email"
                    />
                    <button type="submit" className="btn-primary !py-2">Join</button>
                </div>
                <p className="text-[10px] text-slate-500">Get weekly updates on new chains and deployed assets.</p>
            </div>
        </div>
    );
}
