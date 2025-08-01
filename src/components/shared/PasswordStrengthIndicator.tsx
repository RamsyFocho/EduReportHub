
"use client";

import { Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

export function PasswordStrengthIndicator({ password = '' }: PasswordStrengthIndicatorProps) {
  const validation = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[^a-zA-Z0-9]/.test(password),
  };

  const strength = Object.values(validation).filter(Boolean).length;
  const strengthPercentage = (strength / 5) * 100;
  
  const getStrengthColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-destructive'; // red
      case 2:
        return 'bg-orange-500'; // orange
      case 3:
        return 'bg-yellow-500'; // yellow
      case 4:
        return 'bg-blue-500'; // blue
      case 5:
        return 'bg-primary'; // green (or your primary color)
      default:
        return 'bg-muted';
    }
  };

  const strengthColorClass = getStrengthColor();

  const criteria = [
    { label: 'At least 8 characters', valid: validation.length },
    { label: 'A lowercase letter', valid: validation.lowercase },
    { label: 'An uppercase letter', valid: validation.uppercase },
    { label: 'A number', valid: validation.number },
    { label: 'A special character', valid: validation.specialChar },
  ];

  return (
    <div className="space-y-2 pt-2">
      <Progress value={strengthPercentage} className="h-2 [&>div]:bg-red-500" style={{'--tw-bg-opacity': 1} as React.CSSProperties} color={strengthColorClass}/>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {criteria.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.valid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-destructive" />
            )}
            <span className={cn(item.valid ? "text-muted-foreground" : "text-foreground")}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
