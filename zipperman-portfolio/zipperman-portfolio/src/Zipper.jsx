import { useCallback, useEffect, useId, useRef, useState } from 'react'

const GOLD = '#c9a24a'
const GOLD_LIGHT = '#ecd187'
const GOLD_DEEP = '#8f6f25'
const INK = '#000'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const bounds = (w) => [34, Math.max(94, w - 34)]

/**
 * Zíper do Sticky Fingers no lugar de uma linha normal.
 * - Clica (ou aperta Enter/Espaço) pra abrir ou fechar.
 * - Arrasta o puxador pra abrir na mão.
 * - Aberto, mostra um buraco preto com o conteúdo (children) dentro.
 */
export default function Zipper({ label = 'clica no zíper', maxGap = 240, children }) {
  const uid = useId().replace(/:/g, '')
  const wrapRef = useRef(null)
  const widthRef = useRef(900)
  const pRef = useRef(0)
  const targetRef = useRef(0)
  const rafRef = useRef(0)
  const [width, setWidth] = useState(900)
  const [p, setP] = useState(0)

  const setProgress = useCallback((v) => {
    pRef.current = v
    setP(v)
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const measure = (w) => {
      const rounded = Math.round(w)
      if (rounded > 0) {
        widthRef.current = rounded
        setWidth(rounded)
      }
    }
    measure(el.getBoundingClientRect().width)
    const ro = new ResizeObserver((entries) => measure(entries[0].contentRect.width))
    ro.observe(el)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const animateTo = useCallback(
    (target) => {
      cancelAnimationFrame(rafRef.current)
      targetRef.current = target
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        setProgress(target)
        return
      }
      const from = pRef.current
      const dur = 250 + Math.abs(target - from) * 1000
      const t0 = performance.now()
      const step = (now) => {
        const t = clamp((now - t0) / dur, 0, 1)
        setProgress(from + (target - from) * easeInOut(t))
        if (t < 1) rafRef.current = requestAnimationFrame(step)
      }
      rafRef.current = requestAnimationFrame(step)
    },
    [setProgress]
  )

  const toggle = useCallback(() => {
    animateTo(targetRef.current === 1 ? 0 : 1)
  }, [animateTo])

  const onPullDown = (e) => {
    e.stopPropagation()
    cancelAnimationFrame(rafRef.current)
    const startX = e.clientX
    let moved = false

    const onMove = (ev) => {
      if (Math.abs(ev.clientX - startX) > 4) moved = true
      if (!moved) return
      const rect = wrapRef.current.getBoundingClientRect()
      const [x0, x1] = bounds(widthRef.current)
      setProgress(clamp((ev.clientX - rect.left - x0) / (x1 - x0), 0, 1))
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      if (moved) animateTo(pRef.current > 0.5 ? 1 : 0)
      else toggle()
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  /* ---------- geometria ---------- */
  const G = width < 560 ? Math.min(maxGap, 190) : maxGap
  const [X0, X1] = bounds(width)
  const pullX = X0 + p * (X1 - X0)
  const open = clamp(p * 2.2, 0, 1)
  const geff = G * (1 - Math.pow(1 - open, 2))
  const height = 72 + geff
  const c = height / 2

  // abertura em forma de lente: pontuda nas duas pontas, mais larga perto do começo
  const gapAt = (x) => {
    if (pullX - X0 < 2 || x <= X0 || x >= pullX) return 0
    const u = (x - X0) / (pullX - X0)
    return geff * Math.pow(Math.max(0, Math.sin(Math.PI * Math.pow(u, 0.7))), 0.9)
  }

  const N = 64
  const upper = []
  const lower = []
  for (let i = 0; i <= N; i += 1) {
    const x = X0 + ((pullX - X0) * i) / N
    const g = gapAt(x)
    upper.push([x, c - g / 2])
    lower.push([x, c + g / 2])
  }
  const fmt = (pt) => `${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`
  const holePath = `M ${upper.map(fmt).join(' L ')} L ${lower
    .slice()
    .reverse()
    .map(fmt)
    .join(' L ')} Z`
  const upperLine = upper.map((pt) => pt.map((n) => n.toFixed(1)).join(',')).join(' ')
  const lowerLine = lower.map((pt) => pt.map((n) => n.toFixed(1)).join(',')).join(' ')

  const teeth = []
  if (pullX - X0 > 20) {
    for (let x = X0 + 6; x < pullX - 6; x += 15) {
      const gu = gapAt(x)
      const gl = gapAt(x + 7.5)
      teeth.push(
        <rect key={`u${x}`} x={x - 4} y={c - gu / 2 - 5.5} width="8" height="5.5" rx="1.6" />,
        <rect key={`l${x}`} x={x + 3.5} y={c + gl / 2} width="8" height="5.5" rx="1.6" />
      )
    }
  }

  const contentOpacity = clamp((p - 0.4) / 0.4, 0, 1)
  const hintOpacity = clamp(1 - p * 5, 0, 1)

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  return (
    <div
      ref={wrapRef}
      className="zip"
      style={{ height }}
      role="button"
      tabIndex={0}
      aria-expanded={p > 0.5}
      aria-label={p > 0.5 ? 'Fechar o zíper' : 'Abrir o zíper'}
      onClick={toggle}
      onKeyDown={onKeyDown}
    >
      {/* buraco preto com o conteúdo */}
      <div
        className="zip-void"
        aria-hidden={p < 0.4}
        style={{
          display: p < 0.005 ? 'none' : 'block',
          clipPath: `path('${holePath}')`,
          WebkitClipPath: `path('${holePath}')`,
        }}
      >
        <div
          className="zip-void-content"
          style={{ top: c - G / 2, height: G, opacity: contentOpacity }}
        >
          {children}
        </div>
      </div>

      <svg
        className="zip-svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`gold${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={GOLD_LIGHT} />
            <stop offset="0.55" stopColor={GOLD} />
            <stop offset="1" stopColor={GOLD_DEEP} />
          </linearGradient>
          <pattern id={`teeth${uid}`} x="0" y={c - 6} width="16" height="12" patternUnits="userSpaceOnUse">
            <rect x="0.5" y="0.5" width="7" height="5" rx="1.4" fill={GOLD} stroke={INK} strokeWidth="1" />
            <rect x="8.5" y="6.5" width="7" height="5" rx="1.4" fill={GOLD_LIGHT} stroke={INK} strokeWidth="1" />
          </pattern>
        </defs>

        {/* parte fechada */}
        <rect x={pullX} y={c - 6} width={Math.max(0, X1 - pullX)} height="12" fill={`url(#teeth${uid})`} />

        {/* parte aberta: bordas e dentes */}
        {p > 0.005 && (
          <>
            <polyline points={upperLine} fill="none" stroke={GOLD} strokeWidth="1.6" />
            <polyline points={lowerLine} fill="none" stroke={GOLD} strokeWidth="1.6" />
            <g fill={`url(#gold${uid})`} stroke={INK} strokeWidth="1">
              {teeth}
            </g>
          </>
        )}

        {/* travas das pontas */}
        <rect x={X0 - 9} y={c - 9} width="7" height="18" rx="2" fill={`url(#gold${uid})`} stroke={INK} />
        <rect x={X1 + 2} y={c - 9} width="7" height="18" rx="2" fill={`url(#gold${uid})`} stroke={INK} />

        {/* puxador */}
        <g
          className="zip-pull"
          transform={`translate(${pullX} ${c})`}
          onPointerDown={onPullDown}
          onClick={(e) => e.stopPropagation()}
        >
          <circle r="28" fill="transparent" />
          <g transform={`rotate(${-22 + 34 * p})`}>
            <rect x="-6.5" y="8" width="13" height="30" rx="6.5" fill={`url(#gold${uid})`} stroke={INK} strokeWidth="1.2" />
            <circle cx="0" cy="29" r="3.6" fill={INK} />
          </g>
          <rect x="-16" y="-11" width="32" height="22" rx="6" fill={`url(#gold${uid})`} stroke={INK} strokeWidth="1.4" />
          <rect x="-8" y="-4" width="16" height="8" rx="3" fill={INK} opacity="0.85" />
        </g>
      </svg>

      <span className="zip-hint" style={{ top: c + 16, opacity: hintOpacity }}>
        {label}
      </span>
    </div>
  )
}
