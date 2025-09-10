import { v4 } from 'uuid'

export function average(...args: number[]): number {
  const sum = args.reduce((acc, val) => acc + val, 0)
  return args.length ? sum / args.length : 0
}

export function sum(...args: number[]): number {
  return args.reduce((acc, val) => acc + val, 0)
}

export function median(...args: number[]): number {
  if (args.length === 0) return 0
  const sorted = [...args].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export function generateUUID(): string {
  return v4()
}
