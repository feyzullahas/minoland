import { useEffect, useState } from 'react'

const imageMap = {
  intro: {
    src: '/minoyu tanıyalım.png',
    alt: "Mino'yu tanıyalım",
  },
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
  classGallery: {
    title: 'Sınıf Kuralları',
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

const buildGalleryImages = (folder, files) =>
  files.map((file) => `/${folder}/${encodeURIComponent(file)}`)

function App() {
  const [activeImageKey, setActiveImageKey] = useState(null)
  const [introZoom, setIntroZoom] = useState(1)
  const [historyStack, setHistoryStack] = useState([])
  const activeImage = activeImageKey ? imageMap[activeImageKey] : null
  const activeGallery = galleryMap[activeImageKey] ?? null
  const galleryImages = activeGallery
    ? buildGalleryImages(activeGallery.folder, activeGallery.files)
    : []

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
    if (activeImageKey !== 'intro') {
      setIntroZoom(1)
    }
  }, [activeImageKey])

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

  return (
    <div className="app">
      {activeImageKey !== null ? (
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
            onClick={() => navigateTo('intro')}
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
            className={`intro-image${activeImageKey === 'intro' ? ' intro-image--contain' : ''}${activeImageKey === 'family' ? ' intro-image--framed' : ''}`}
            src={activeImage.src}
            alt={activeImage.alt}
            style={
              activeImageKey === 'intro'
                ? {
                    transform: `scale(${introZoom})`,
                  }
                : undefined
            }
          />

          {activeImageKey === 'intro' ? (
            <div className="intro-zoom-controls">
              <button
                type="button"
                className="zoom-button"
                onClick={() => setIntroZoom((zoom) => Math.max(1, zoom - 0.1))}
                aria-label="Uzaklastir"
              >
                -
              </button>
              <button
                type="button"
                className="zoom-button"
                onClick={() => setIntroZoom(1)}
                aria-label="Sifirla"
              >
                1x
              </button>
              <button
                type="button"
                className="zoom-button"
                onClick={() => setIntroZoom((zoom) => Math.min(2.5, zoom + 0.1))}
                aria-label="Yakinlastir"
              >
                +
              </button>
            </div>
          ) : null}

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
        <div className="gallery-screen" role="dialog" aria-modal="true">
          <h1 className="gallery-title">{activeGallery.title}</h1>
          <div className="gallery-track" role="region" aria-label="Gorsel galerisi">
            {galleryImages.map((src, index) => (
              <div className="gallery-card" key={src}>
                <img
                  src={src}
                  alt={`${activeGallery.title} ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <p className="gallery-hint">Sağa ve sola kaydır</p>
        </div>
      ) : null}
    </div>
  )
}

export default App
