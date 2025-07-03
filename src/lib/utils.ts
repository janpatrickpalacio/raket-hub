import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function userAvatarFallback({ seed }: { seed: string }) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
}

export function createArray(length: number) {
  return Array.from({ length }, (_, index) => index);
}
