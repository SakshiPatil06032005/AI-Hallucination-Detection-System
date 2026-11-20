import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type InfoCardProps = {
  icon: string;
  index: string;
  title: string;
  description: string;
  tone?: 'blue' | 'green' | 'amber' | 'gray';
  children?: ReactNode;
};

export function InfoCard({ icon, index, title, description, tone = 'blue', children }: InfoCardProps) {
  return (
    <motion.article
      className={`info-card info-card-${tone}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="info-card-top"><span className="info-card-icon">{icon}</span><span className="info-card-index">{index}</span></div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </motion.article>
  );
}