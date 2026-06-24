"use client";

import React from 'react';
import './ShinyText.css';

interface ShinyTextProps {
  text: string;
  animate: boolean;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  direction?: 'left' | 'right';
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  animate,
  className = '',
  color = '#A5A5A5',
  shineColor = '#FFFFFF',
  spread = 140,
  direction = 'left'
}) => {
  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundPosition: direction === 'left' ? '150% center' : '-50% center'
  };

  const animationClass = animate
    ? (direction === 'left' ? 'animate-shine' : 'animate-shine-right')
    : '';

  return (
    <span
      className={`shiny-text ${animationClass} ${className}`}
      style={gradientStyle}
    >
      {text}
    </span>
  );
};

export default ShinyText;
