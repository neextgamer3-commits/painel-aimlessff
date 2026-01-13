import { NativeModule, requireNativeModule } from 'expo-modules-core';
import { EventEmitter, Subscription } from 'expo-modules-core';

// Define the module interface
export interface FloatingBubbleModuleInterface {
  hasOverlayPermission(): boolean;
  requestOverlayPermission(): void;
  showBubble(x: number, y: number): Promise<boolean>;
  hideBubble(): void;
  updatePosition(x: number, y: number): void;
  isVisible(): boolean;
}

// Event types
export interface BubblePressEvent {
  x: number;
  y: number;
}

export interface BubbleDragEvent {
  x: number;
  y: number;
}

export interface BubbleRemoveEvent {
  removed: boolean;
}

// Get the native module
const FloatingBubbleModule = requireNativeModule<FloatingBubbleModuleInterface>('FloatingBubble');

// Create event emitter
const emitter = new EventEmitter(FloatingBubbleModule);

// Export functions
export function hasOverlayPermission(): boolean {
  return FloatingBubbleModule.hasOverlayPermission();
}

export function requestOverlayPermission(): void {
  FloatingBubbleModule.requestOverlayPermission();
}

export async function showBubble(x: number = 0, y: number = 100): Promise<boolean> {
  return FloatingBubbleModule.showBubble(x, y);
}

export function hideBubble(): void {
  FloatingBubbleModule.hideBubble();
}

export function updatePosition(x: number, y: number): void {
  FloatingBubbleModule.updatePosition(x, y);
}

export function isVisible(): boolean {
  return FloatingBubbleModule.isVisible();
}

// Event listeners
export function addBubblePressListener(listener: (event: BubblePressEvent) => void): Subscription {
  return emitter.addListener('onBubblePress', listener);
}

export function addBubbleDragListener(listener: (event: BubbleDragEvent) => void): Subscription {
  return emitter.addListener('onBubbleDrag', listener);
}

export function addBubbleRemoveListener(listener: (event: BubbleRemoveEvent) => void): Subscription {
  return emitter.addListener('onBubbleRemove', listener);
}

export default FloatingBubbleModule;
