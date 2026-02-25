import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const curtainTopRef = useRef<HTMLDivElement>(null)
  const curtainBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Animate progress bar
    if (progressRef.current) {
      tl.to(progressRef.current, {
        width: '100%',
        duration: 1.2,
        ease: 'power2.inOut',
      })
    }
    
    // Fade out text
    if (textRef.current) {
      tl.to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
      }, '-=0.2')
    }
    
    // Curtain effect - split and slide
    if (curtainTopRef.current) {
      tl.to(curtainTopRef.current, {
        y: '-100%',
        duration: 0.5,
        ease: 'power3.inOut',
      }, '-=0.1')
    }
    
    if (curtainBottomRef.current) {
      tl.to(curtainBottomRef.current, {
        y: '100%',
        duration: 0.5,
        ease: 'power3.inOut',
      }, '<')
    }

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999]">
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-void z-10">
        <div ref={textRef} className="text-center">
          <div className="font-heading text-2xl md:text-3xl font-bold text-white mb-8 tracking-wider">
            INITIALIZING
          </div>
          
          {/* Progress bar container */}
          <div className="w-64 md:w-80 h-1 bg-surface rounded-full overflow-hidden">
            <div 
              ref={progressRef}
              className="h-full bg-gradient-to-r from-cyan to-purple rounded-full"
              style={{ width: '0%' }}
            />
          </div>
          
          <div className="mt-4 font-mono text-xs text-text-muted">
            Loading assets...
          </div>
        </div>
      </div>
      
      {/* Curtain overlays */}
      <div 
        ref={curtainTopRef}
        className="absolute inset-0 bg-void z-20" 
        style={{ clipPath: 'inset(0 0 50% 0)' }} 
      />
      <div 
        ref={curtainBottomRef}
        className="absolute inset-0 bg-void z-20" 
        style={{ clipPath: 'inset(50% 0 0 0)' }} 
      />
    </div>
  )
}
