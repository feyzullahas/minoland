import { useEffect, useRef, useState } from 'react'

const imageMap = {
  play: {
    src: '/oyunabasladansonraki.png',
    alt: 'Oyuna basla',
  },
  kids: {
    src: '/bölümseçimi.jpeg',
    alt: 'Bolum secimi',
  },
  family: {
    src: '/aileleriçin.png',
    alt: 'Aileler icin',
  },
}

const galleryMap = {
  introGallery: {
    title: "Mino'yu Tanıyalım",
    images: [
      '/minoyutaniyalim1.jpeg',
      '/minoyutaniyalim2.jpeg',
      '/minoyutaniyalim3.jpeg',
    ],
  },
  classGallery: {
    title: 'Sınıf Kuralları',
    gamified: true,
    folder: 's%C4%B1n%C4%B1fkurallar%C4%B1',
    files: [
      'WhatsApp Image 2026-05-30 at 16.54.36.jpeg',
      'WhatsApp Image 2026-05-30 at 16.54.36 (1).jpeg',
      'WhatsApp Image 2026-05-30 at 16.54.36 (2).jpeg',
      'WhatsApp Image 2026-05-30 at 16.54.36 (3).jpeg',
      'WhatsApp Image 2026-05-30 at 16.55.45.jpeg',
    ],
  },
  hygieneGallery: {
    title: 'Hijyen Kuralları',
    gamified: true,
    folder: 'hijyenkurallar%C4%B1',
    files: [
      'WhatsApp Image 2026-05-30 at 16.54.36 (4).jpeg',
      'WhatsApp Image 2026-05-30 at 16.54.36 (5).jpeg',
      'WhatsApp Image 2026-05-30 at 16.54.37 (1).jpeg',
      'WhatsApp Image 2026-05-30 at 16.54.37 (2).jpeg',
      'WhatsApp Image 2026-05-30 at 16.54.37.jpeg',
    ],
  },
  communicationGallery: {
    title: 'İletişim Kuralları',
    gamified: true,
    folder: 'ileti%C5%9Fimkurallar%C4%B1',
    files: [
      'WhatsApp Image 2026-05-30 at 16.54.37 (3).jpeg',
      'WhatsApp Image 2026-05-30 at 16.54.37 (4).jpeg',
      'WhatsApp Image 2026-05-30 at 16.54.37 (5).jpeg',
      'WhatsApp Image 2026-05-30 at 16.54.37 (6).jpeg',
      'WhatsApp Image 2026-05-30 at 16.54.38.jpeg',
    ],
  },
}

const buildGalleryImages = ({ folder, files, images }) =>
  images ?? files.map((file) => `/${folder}/${encodeURIComponent(file)}`)

function App() {
  const [activeImageKey, setActiveImageKey] = useState(null)
  const [historyStack, setHistoryStack] = useState([])
  const [carrots, setCarrots] = useState(0)
  const [awardedMap, setAwardedMap] = useState({})
  const [galleryComplete, setGalleryComplete] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [carrotPulse, setCarrotPulse] = useState(false)
  const [isCardExiting, setIsCardExiting] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const touchStartXRef = useRef(null)
  const activeImage = activeImageKey ? imageMap[activeImageKey] : null
  const activeGallery = galleryMap[activeImageKey] ?? null
  const galleryImages = activeGallery ? buildGalleryImages(activeGallery) : []
  const isKidsGamified =
    Boolean(activeGallery?.gamified) && historyStack.includes('kids')

  useEffect(() => {
    const className = 'has-overlay'
    if (activeImageKey) {
      document.body.classList.add(className)
    } else {
      document.body.classList.remove(className)
    }

    return () => document.body.classList.remove(className)
  }, [activeImageKey])

  useEffect(() => {
    if (activeGallery) {
      setCurrentCardIndex(0)
      setGalleryComplete(false)
      setIsCardExiting(false)
      setIsTransitioning(false)
      touchStartXRef.current = null
    }
  }, [activeGallery])

  const navigateTo = (nextKey) => {
    setHistoryStack((prev) => [...prev, activeImageKey])
    setActiveImageKey(nextKey)
  }

  const handleBack = () => {
    setHistoryStack((prev) => {
      if (prev.length === 0) {
        setActiveImageKey(null)
        return []
      }

      const nextStack = [...prev]
      const previousKey = nextStack.pop()
      setActiveImageKey(previousKey ?? null)
      return nextStack
    })
  }

  const awardCarrotForIndex = (index) => {
    if (!isKidsGamified || !activeImageKey || index < 0) return

    const awarded = awardedMap[activeImageKey] ?? []
    if (awarded.includes(index)) return

    setCarrots((prev) => prev + 1)
    setAwardedMap((prev) => ({
      ...prev,
      [activeImageKey]: [...awarded, index],
    }))
    setCarrotPulse(true)
    window.setTimeout(() => setCarrotPulse(false), 600)
  }

  useEffect(() => {
    if (isKidsGamified && activeGallery && !galleryComplete) {
      awardCarrotForIndex(currentCardIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCardIndex, isKidsGamified, activeImageKey, galleryComplete])

  const advanceCard = () => {
    if (isTransitioning || galleryComplete) return

    if (currentCardIndex >= galleryImages.length - 1) {
      if (isKidsGamified) {
        setGalleryComplete(true)
      }
      return
    }

    const nextIndex = currentCardIndex + 1
    setIsTransitioning(true)
    setIsCardExiting(true)

    window.setTimeout(() => {
      setCurrentCardIndex(nextIndex)
      setIsCardExiting(false)
      setIsTransitioning(false)
    }, 420)
  }

  const retreatCard = () => {
    if (isTransitioning || galleryComplete || currentCardIndex <= 0) return

    setCurrentCardIndex((index) => index - 1)
  }

  const handleCarouselTouchStart = (event) => {
    touchStartXRef.current = event.touches[0].clientX
  }

  const handleCarouselTouchEnd = (event) => {
    if (touchStartXRef.current === null || isTransitioning) return

    const deltaX = event.changedTouches[0].clientX - touchStartXRef.current
    touchStartXRef.current = null

    if (deltaX < -50) {
      advanceCard()
    } else if (deltaX > 50) {
      retreatCard()
    }
  }

  const handleReturnToMenu = () => {
    setGalleryComplete(false)
    handleBack()
  }

  return (
    <div className="app">
      {activeImageKey !== null && !galleryComplete ? (
        <button
          type="button"
          className="back-button"
          onClick={handleBack}
          aria-label="Geri"
        >
          <svg
            className="back-icon"
            viewBox="0 0 24 24"
            role="presentation"
            aria-hidden="true"
          >
            <path
              d="M14 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}

      {activeImageKey === null ? (
        <>
          <button
            type="button"
            className="cta-hitbox cta-hitbox--intro"
            onClick={() => navigateTo('introGallery')}
            aria-haspopup="dialog"
            aria-label="Mino'yu tanıyalım"
          />

          <button
            type="button"
            className="cta-hitbox cta-hitbox--play"
            onClick={() => navigateTo('play')}
            aria-haspopup="dialog"
            aria-label="Oyuna basla"
          />
        </>
      ) : null}

      {activeImage ? (
        <div className="intro-overlay" role="dialog" aria-modal="true">
          <img
            className={`intro-image${activeImageKey === 'family' ? ' intro-image--framed' : ''}`}
            src={activeImage.src}
            alt={activeImage.alt}
          />

          {activeImageKey === 'play' ? (
            <div className="play-hitbox-layer">
              <button
                type="button"
                className="play-hitbox play-hitbox--kids"
                onClick={() => navigateTo('kids')}
                aria-label="Cocuklar icin"
              />
              <button
                type="button"
                className="play-hitbox play-hitbox--family"
                onClick={() => navigateTo('family')}
                aria-label="Aileler icin"
              />
              <button
                type="button"
                className="play-hitbox play-hitbox--teachers"
                aria-label="Ogretmenler icin"
              />
            </div>
          ) : null}

          {activeImageKey === 'kids' || activeImageKey === 'family' ? (
            <div className="kids-hitbox-layer">
              <button
                type="button"
                className="kids-hitbox kids-hitbox--class"
                onClick={() => navigateTo('classGallery')}
                aria-label="Sinif kurallari"
              />
              <button
                type="button"
                className="kids-hitbox kids-hitbox--hygiene"
                onClick={() => navigateTo('hygieneGallery')}
                aria-label="Hijyen kurallari"
              />
              <button
                type="button"
                className="kids-hitbox kids-hitbox--communication"
                onClick={() => navigateTo('communicationGallery')}
                aria-label="Iletisim kurallari"
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {activeGallery ? (
        <div
          className={`gallery-screen${activeImageKey === 'introGallery' ? ' gallery-screen--intro' : ''}${isKidsGamified ? ' gallery-screen--kids' : ''}`}
          role="dialog"
          aria-modal="true"
        >
          <header className="gallery-header">
            <h1 className="gallery-title">{activeGallery.title}</h1>
            {isKidsGamified ? (
              <>
                <div
                  className={`gallery-score${carrotPulse ? ' gallery-score--pulse' : ''}`}
                >
                  🥕 {carrots} Havuç 🥕
                </div>
                <p className="gallery-progress">
                  Kart {currentCardIndex + 1} / {galleryImages.length}
                </p>
              </>
            ) : activeImageKey !== 'introGallery' ? (
              <div className="gallery-score">🥕 {carrots} Havuç 🥕</div>
            ) : null}
          </header>

          {!galleryComplete ? (
            <div className="gallery-main">
              <div
                className="carousel-viewport"
                role="region"
                aria-label="Gorsel galerisi"
                onTouchStart={handleCarouselTouchStart}
                onTouchEnd={handleCarouselTouchEnd}
              >
                <div className="carousel-stack">
                  {galleryImages
                    .slice(currentCardIndex)
                    .map((src, stackIndex) => {
                      const cardIndex = currentCardIndex + stackIndex
                      const isTop = stackIndex === 0

                      return (
                        <div
                          className={`carousel-card${isTop ? ' carousel-card--top' : ''}${isTop && isCardExiting ? ' carousel-card--exit' : ''}${!isTop ? ` carousel-card--behind carousel-card--behind-${stackIndex}` : ''}`}
                          key={`${src}-${cardIndex}`}
                          style={{ zIndex: galleryImages.length - stackIndex }}
                        >
                          <img
                            src={src}
                            alt={`${activeGallery.title} ${cardIndex + 1}`}
                          />
                        </div>
                      )
                    })}
                </div>
              </div>
              <div className="carousel-controls">
                <button
                  type="button"
                  className="carousel-nav"
                  onClick={retreatCard}
                  disabled={currentCardIndex === 0 || isTransitioning}
                  aria-label="Onceki gorsel"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="carousel-nav"
                  onClick={advanceCard}
                  disabled={isTransitioning}
                  aria-label="Sonraki gorsel"
                >
                  ›
                </button>
              </div>
              <p className="gallery-hint">
                {isKidsGamified
                  ? 'Her görsel için 1 havuç — sola kaydır'
                  : 'Sola veya sağa kaydır'}
              </p>
            </div>
          ) : (
            <div className="gallery-complete" role="status">
              <div className="gallery-complete__emoji" aria-hidden="true">
                🎉
              </div>
              <h2 className="gallery-complete__title">Tebrikler!</h2>
              <p className="gallery-complete__text">
                Tüm kartları tamamladın. Harika iş çıkardın!
              </p>
              <div className="gallery-score gallery-score--large">
                🥕 {carrots} Havuç 🥕
              </div>
              <button
                type="button"
                className="gallery-complete__button"
                onClick={handleReturnToMenu}
              >
                Önceki menüye dön
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default App
