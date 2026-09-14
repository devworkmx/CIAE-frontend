import { describe, it, expect } from 'vitest'

describe('verificación de entorno jsdom', () => {
  it('tiene acceso a document', () => {
    expect(typeof document).toBe('object')
  })

  it('tiene acceso a window', () => {
    expect(typeof window).toBe('object')
  })

  it('tiene acceso a localStorage', () => {
    expect(typeof localStorage).toBe('object')
    localStorage.setItem('test', '123')
    expect(localStorage.getItem('test')).toBe('123')
  })
})
