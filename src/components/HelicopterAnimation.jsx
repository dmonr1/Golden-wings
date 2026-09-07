import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import helicopterSvg from '../assets/svgs/helicoptero-realista-izquierda.svg'

function HelicopterAnimation() {
  const containerRef = useRef(null)
  const craftRef = useRef(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const craft = craftRef.current
    if (!container || !craft) return

    let hoverTween = null
    let rockTween = null

    // Initial state: off-screen right with forward flight pitch
    gsap.set(container, {
      x: 240,
      y: -40,
      rotation: -6,
      opacity: 0,
    })

    const playEntrance = () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Swooping flight arrival from the right
      tl.to(container, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1.45,
        ease: 'power2.out',
      })
        // Deceleration flare (slight nose up to brake)
        .to(
          container,
          {
            rotation: 2.8,
            duration: 0.65,
            ease: 'power1.out',
          },
          0.65,
        )
        // Level off to hover
        .to(
          container,
          {
            rotation: 0,
            duration: 0.6,
            ease: 'power2.inOut',
          },
          1.3,
        )

      // Continuous hovering loop once arrived
      tl.add(() => {
        hoverTween = gsap.to(craft, {
          y: -7,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })

        rockTween = gsap.to(craft, {
          rotation: 1.3,
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
    }

    // Trigger on loader completion or direct mount
    const isLoaderActive =
      document.querySelector('.page-loader') || document.body.style.position === 'fixed'

    let removeListener = null
    let ran = false

    const safePlay = () => {
      if (ran) return
      ran = true
      playEntrance()
    }

    if (isLoaderActive) {
      window.addEventListener('golden-wings:loader-end', safePlay, { once: true })
      const fallbackTimer = setTimeout(safePlay, 3200)
      removeListener = () => {
        window.removeEventListener('golden-wings:loader-end', safePlay)
        clearTimeout(fallbackTimer)
      }
    } else {
      safePlay()
    }

    return () => {
      removeListener?.()
      hoverTween?.kill()
      rockTween?.kill()
    }
  }, [])

  return (
    <div className="helicopter-container" ref={containerRef} aria-label="Helicopter illustration in flight">
      {/* Realistic Helicopter Craft (Clean silhouette) */}
      <div className="helicopter-craft-wrap" ref={craftRef}>
        <img
          src={helicopterSvg}
          alt=""
          className="helicopter-craft-img"
          draggable="false"
        />
      </div>
    </div>
  )
}

export default HelicopterAnimation
