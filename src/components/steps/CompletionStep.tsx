"use client";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Order } from "@prisma/client";

export function CompletionStep({ order }: { order: Order }) {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { y: 0.6 },
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center space-y-6 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <h2 className="text-3xl font-bold text-primary">
          🎉 Congratulations! 🎉
        </h2>
      </motion.div>

      <p className="text-xl">Your event has been successfully created!</p>
      <div className="flex items-center justify-center gap-5">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href={`/events/${order.eventId}`}
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium"
          >
            View My Events
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href={`/checkout?orderId=${order.id}&eventId=${order.eventId}`}
            className="inline-block text-white px-6 py-3   bg-green-600  rounded-md font-medium"
          >
            Proceed to checkout
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
