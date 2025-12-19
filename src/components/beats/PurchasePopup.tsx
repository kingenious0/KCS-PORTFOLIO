
"use client";

import { X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

interface PurchasePopupProps {
    isOpen: boolean;
    onClose: () => void;
    beatTitle: string;
    beatPrice: string;
}

export function PurchasePopup({ isOpen, onClose, beatTitle, beatPrice }: PurchasePopupProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-md bg-zinc-900 border border-neon-blue/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.15)]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 text-center space-y-6">
                            <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center mx-auto mb-2">
                                <ShoppingCart className="w-8 h-8 text-neon-blue" />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                                    Support Kingenious
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    You've enjoyed the preview of <span className="text-white font-bold">"{beatTitle}"</span>.
                                    To unlock the full track and get the license-free high-quality audio, please support the craft by purchasing it.
                                </p>
                            </div>

                            <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                                <p className="text-sm text-gray-400 mb-1">Price</p>
                                <p className="text-2xl font-bold text-neon-green">{beatPrice}</p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={onClose}
                                >
                                    Maybe Later
                                </Button>
                                <Button
                                    variant="neon"
                                    className="flex-1 shadoow-lg shadow-neon-blue/20"
                                    onClick={() => {
                                        // Placeholder for actual checkout logic
                                        window.open("https://wa.me/233555555555?text=I%20want%20to%20buy%20" + encodeURIComponent(beatTitle), "_blank");
                                    }}
                                >
                                    Buy Now
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
