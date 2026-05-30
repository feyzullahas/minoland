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
  teachers: {
    src: '/%C3%B6%C4%9Fretmenleri%C3%A7in.png',
    alt: 'Ogretmenler icin',
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
      'WhatsApp Image 2026-05-30 at 16.54.38.jpeg',
      'WhatsApp Image 2026-05-30 at 17.53.15.jpeg',
    ],
  },
  familyClassGallery: {
    title: 'Sınıf Kuralları',
    folder: 'ailes%C4%B1n%C4%B1fkurallar%C4%B1',
    files: ['ailesınıf1.jpeg', 'ailesınıf2.jpeg', 'ailesınıf3.jpeg'],
  },
  familyHygieneGallery: {
    title: 'Hijyen Kuralları',
    folder: 'ailehijyenkurallar%C4%B1',
    files: ['ailehijyen1.jpeg', 'ailehijyen2.jpeg', 'ailehijyen3.jpeg'],
  },
  familyCommunicationGallery: {
    title: 'İletişim Kuralları',
    folder: 'aileileti%C5%9Fimkurallar%C4%B1',
    files: ['aileiletişim1.jpeg', 'aileiletişim2.jpeg', 'aileiletişim3.jpeg'],
  },
  teacherClassGallery: {
    title: 'Sınıf Kuralları',
    folder: '%C3%B6%C4%9Fretmens%C4%B1n%C4%B1f',
    files: ['öğretmensınıf1.jpeg', 'öğretmensınıf2.jpeg', 'öğretmensınıf3.jpeg'],
  },
  teacherHygieneGallery: {
    title: 'Hijyen Kuralları',
    folder: '%C3%B6%C4%9Fretmenhijyen',
    files: ['öğretmenhijyen1.jpeg', 'öğretmenhijyen2.jpeg', 'öğretmenhijyen3.jpeg'],
  },
  teacherCommunicationGallery: {
    title: 'İletişim Kuralları',
    folder: '%C3%B6%C4%9Fretmenileti%C5%9Fim',
    files: ['öğretmeniletişim1.jpeg', 'öğretmeniletişim2.jpeg', 'öğretmeniletişim3.jpeg'],
  },
}

const buildGalleryImages = ({ folder, files, images }) =>
  images ?? files.map((file) => `/${folder}/${encodeURIComponent(file)}`)

function App() {
  const [activeImageKey, setActiveImageKey] = useState(null)
  const [historyStack, setHistoryStack] = useState([])
  const [galleryProgress, setGalleryProgress] = useState({
    galleryKey: null,
    viewed: [],
    carrots: 0,
  })
  const [galleryComplete, setGalleryComplete] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [carrotPulse, setCarrotPulse] = useState(false)
  const [cardTransition, setCardTransition] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showMascot, setShowMascot] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const CARD_ANIM_MS = 420
  const touchStartXRef = useRef(null)
  const activeImage = activeImageKey ? imageMap[activeImageKey] : null
  const activeGallery = galleryMap[activeImageKey] ?? null
  const galleryImages = activeGallery ? buildGalleryImages(activeGallery) : []
  const isKidsGamified =
    Boolean(activeGallery?.gamified) && historyStack.includes('kids')
  const carrots =
    galleryProgress.galleryKey === activeImageKey ? galleryProgress.carrots : 0

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
    if (!activeGallery) return

    setCurrentCardIndex(0)
    setGalleryComplete(false)
    setCardTransition(null)
    setIsTransitioning(false)
    setShowMascot(false)
    touchStartXRef.current = null

  }, [activeImageKey, isKidsGamified, activeGallery])

  const awardCarrotForIndex = (index) => {
    if (!isKidsGamified || !activeImageKey) return

    setGalleryProgress((prev) => {
      if (prev.galleryKey !== activeImageKey) return prev
      if (prev.viewed.includes(index)) return prev

      setCarrotPulse(true)
      window.setTimeout(() => setCarrotPulse(false), 600)

      return {
        galleryKey: activeImageKey,
        viewed: [...prev.viewed, index],
        carrots: prev.carrots + 1,
      }
    })
  }

  const navigateTo = (nextKey) => {
    const nextStack = [...historyStack, activeImageKey]
    const enteringKidsGallery =
      Boolean(galleryMap[nextKey]?.gamified) && nextStack.includes('kids')

    if (enteringKidsGallery) {
      setGalleryProgress({
        galleryKey: nextKey,
        viewed: [],
        carrots: 0,
      })
      setCurrentCardIndex(0)
      setGalleryComplete(false)
    }

    setHistoryStack(nextStack)
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

  const advanceCard = () => {
    if (isTransitioning || galleryComplete) return

    if (currentCardIndex >= galleryImages.length - 1) {
      if (isKidsGamified) {
        awardCarrotForIndex(currentCardIndex)
        setGalleryComplete(true)
      }
      return
    }

    awardCarrotForIndex(currentCardIndex)
    setShowMascot(false)

    const nextIndex = currentCardIndex + 1
    setIsTransitioning(true)
    setCardTransition({
      direction: 'forward',
      fromIndex: currentCardIndex,
      toIndex: nextIndex,
    })

    window.setTimeout(() => {
      setCurrentCardIndex(nextIndex)
      setCardTransition(null)
      setIsTransitioning(false)
    }, CARD_ANIM_MS)
  }

  const retreatCard = () => {
    if (isTransitioning || galleryComplete || currentCardIndex <= 0) return

    const prevIndex = currentCardIndex - 1
    setShowMascot(false)
    setIsTransitioning(true)
    setCardTransition({
      direction: 'back',
      fromIndex: currentCardIndex,
      toIndex: prevIndex,
    })

    window.setTimeout(() => {
      setCurrentCardIndex(prevIndex)
      setCardTransition(null)
      setIsTransitioning(false)
    }, CARD_ANIM_MS)
  }

  const renderCarouselCards = () => {
    if (cardTransition?.direction === 'back') {
      const { fromIndex, toIndex } = cardTransition
      return (
        <>
          <div
            className="carousel-card carousel-card--top carousel-card--enter-left"
            key={`enter-${toIndex}`}
            style={{ zIndex: galleryImages.length }}
          >
            <img
              src={galleryImages[toIndex]}
              alt={`${activeGallery.title} ${toIndex + 1}`}
            />
          </div>
          <div
            className="carousel-card carousel-card--top carousel-card--exit-right"
            key={`exit-${fromIndex}`}
            style={{ zIndex: galleryImages.length + 1 }}
          >
            <img
              src={galleryImages[fromIndex]}
              alt={`${activeGallery.title} ${fromIndex + 1}`}
            />
          </div>
        </>
      )
    }

    const stackStartIndex =
      cardTransition?.direction === 'forward'
        ? cardTransition.fromIndex
        : currentCardIndex

    return galleryImages.slice(stackStartIndex).map((src, stackIndex) => {
      const cardIndex = stackStartIndex + stackIndex
      const isTop = stackIndex === 0
      const isExitingForward =
        isTop && cardTransition?.direction === 'forward'

      return (
        <div
          className={`carousel-card${isTop ? ' carousel-card--top' : ''}${isExitingForward ? ' carousel-card--exit-left' : ''}${!isTop ? ` carousel-card--behind carousel-card--behind-${stackIndex}` : ''}`}
          key={`${src}-${cardIndex}`}
          style={{ zIndex: galleryImages.length - stackIndex }}
        >
          <img
            src={src}
            alt={`${activeGallery.title} ${cardIndex + 1}`}
          />
        </div>
      )
    })
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

          <button
            type="button"
            className="about-button"
            onClick={() => setShowAbout(true)}
            aria-label="Hakkımızda"
            title="Hakkımızda"
          >
            ℹ️
          </button>

          {showAbout ? (
            <div className="about-modal-overlay" onClick={() => setShowAbout(false)}>
              <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="about-modal-close"
                  onClick={() => setShowAbout(false)}
                >
                  ✕
                </button>
                <h2>Proje yapımcıları:</h2>
                <ul className="creators-list">
                  <li>Sedat Erez</li>
                  <li>Samet Sizgen</li>
                  <li>Muhammed Dal</li>
                </ul>
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {activeImage ? (
        <div className="intro-overlay" role="dialog" aria-modal="true">
          <img
            className={`intro-image${activeImageKey === 'family' ? ' intro-image--family-menu' : ''}${activeImageKey === 'teachers' ? ' intro-image--teachers-menu' : ''}`}
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
                onClick={() => navigateTo('teachers')}
                aria-label="Ogretmenler icin"
              />
            </div>
          ) : null}

          {activeImageKey === 'kids' ? (
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

          {activeImageKey === 'family' ? (
            <div className="family-hitbox-layer">
              <button
                type="button"
                className="family-hitbox family-hitbox--class"
                onClick={() => navigateTo('familyClassGallery')}
                aria-label="Aile sinif kurallari"
              />
              <button
                type="button"
                className="family-hitbox family-hitbox--hygiene"
                onClick={() => navigateTo('familyHygieneGallery')}
                aria-label="Aile hijyen kurallari"
              />
              <button
                type="button"
                className="family-hitbox family-hitbox--communication"
                onClick={() => navigateTo('familyCommunicationGallery')}
                aria-label="Iletisim kurallari"
              />
            </div>
          ) : null}

          {activeImageKey === 'teachers' ? (
            <div className="teacher-hitbox-layer">
              <button
                type="button"
                className="teacher-hitbox teacher-hitbox--class"
                onClick={() => navigateTo('teacherClassGallery')}
                aria-label="Ogretmen sinif kurallari"
              />
              <button
                type="button"
                className="teacher-hitbox teacher-hitbox--hygiene"
                onClick={() => navigateTo('teacherHygieneGallery')}
                aria-label="Ogretmen hijyen kurallari"
              />
              <button
                type="button"
                className="teacher-hitbox teacher-hitbox--communication"
                onClick={() => navigateTo('teacherCommunicationGallery')}
                aria-label="Ogretmen iletisim kurallari"
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {activeGallery ? (
        <div
          className={`gallery-screen${activeImageKey === 'introGallery' ? ' gallery-screen--intro' : ''}${isKidsGamified ? ' gallery-screen--kids' : ''}${galleryComplete ? ' gallery-screen--complete' : ''}`}
          role="dialog"
          aria-modal="true"
        >
          {!galleryComplete ? (
            <header className="gallery-header">
              <h1 className="gallery-title">{activeGallery.title}</h1>
              {isKidsGamified ? (
                <>
                  <div
                    className={`gallery-score${carrotPulse ? ' gallery-score--pulse' : ''}`}
                  >
                    🥕 {carrots}
                  </div>
                  <p className="gallery-progress">
                    Kart {currentCardIndex + 1} / {galleryImages.length}
                  </p>
                </>
              ) : null}
            </header>
          ) : null}

          {!galleryComplete ? (
            <div className="gallery-main">
              <div
                className="carousel-viewport"
                role="region"
                aria-label="Gorsel galerisi"
                onTouchStart={handleCarouselTouchStart}
                onTouchEnd={handleCarouselTouchEnd}
              >
                <div className="carousel-stack">{renderCarouselCards()}</div>
                {isKidsGamified && showMascot ? (
                  <div className="mascot-overlay" onClick={() => setShowMascot(false)}>
                    <img src="/maskot.png" alt="Mino maskot" className="mascot-img" />
                  </div>
                ) : null}
              </div>
              <div className="carousel-controls">
                {isKidsGamified ? (
                  <button
                    type="button"
                    className="eye-button"
                    onClick={() => setShowMascot((v) => !v)}
                    aria-label="Maskotu göster"
                  >
                    {showMascot ? '🙈' : '👁️'}
                  </button>
                ) : null}
                <div className="carousel-nav-row">
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
              </div>
              <p className="gallery-hint">
                {isKidsGamified
                  ? 'Her görsel için 1 havuç — sola kaydır'
                  : 'Sola veya sağa kaydır'}
              </p>
            </div>
          ) : (
            <div
              className="gallery-complete"
              role="status"
              aria-label="Kategori tamamlandi"
            >
              <div className="gallery-complete__panel">
                <div className="gallery-score gallery-score--large">
                  🥕 {carrots}
                </div>
                <button
                  type="button"
                  className="gallery-complete__button"
                  onClick={handleReturnToMenu}
                >
                  Önceki menüye dön
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default App
