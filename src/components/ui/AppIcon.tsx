'use client';

import React from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';
import * as HeroIconsSolid from '@heroicons/react/24/solid';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

type IconVariant = 'outline' | 'solid';

interface IconProps {
  name: string;
  variant?: IconVariant;
  size?: number;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function AppIcon({
  name,
  variant = 'outline',
  size = 20,
  className = '',
  onClick,
  disabled = false,
}: IconProps) {
  const iconSet = variant === 'solid' ? HeroIconsSolid : HeroIcons;
  const IconComponent = iconSet[name as keyof typeof iconSet] as React.ComponentType<any>;

  if (!IconComponent) {
    return (
      <QuestionMarkCircleIcon
        width={size}
        height={size}
        className={`text-gray-400 ${className}`}
      />
    );
  }

  return (
    <IconComponent
      width={size}
      height={size}
      className={`${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      onClick={onClick}
    />
  );
}