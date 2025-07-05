import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function userAvatarFallback({ seed }: { seed: string }) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
}

export function createArray(length: number) {
  return Array.from({ length }, (_, index) => index);
}

export function generateUUID(): string {
  return uuidv4();
}
