import { useEffect, useMemo, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import { useApp } from '../context/AppContext'
import { SceneBackdrop } from '../components/BullArt'
import { usePageTitle } from '../hooks/usePageTitle'

const COUNTRIES_GEOJSON_URL =
  'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson'

export default function GlobalMap() {
  usePageTitle('Community Map')
  const { stories } = useApp()
  const [countries, setCountries] = useState([])
  const wrapperRef = useRef(null)
  const globeRef = useRef(null)
  const [size, setSize] = useState({ width: 320, height: 560 })

  useEffect(() => {
    let cancelled = false
    fetch(COUNTRIES_GEOJSON_URL)
      .then((res) => res.json())
      .then((geo) => { if (!cancelled) setCountries(geo.features) })
      .catch(() => { /* map still shows without the country shading */ })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const update = () => setSize({ width: el.clientWidth, height: 560 })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true
      globeRef.current.controls().autoRotateSpeed = 0.6
      // Start pulled back and drift in — a static globe on first load reads as inert.
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 3.2 })
      setTimeout(() => globeRef.current?.pointOfView({ lat: 20, lng: 0, altitude: 1.8 }, 1800), 150)
    }
  }, [size])

  // Approved stories only, grouped by the country the submitter optionally chose.
  const countsByCountry = useMemo(() => {
    const counts = {}
    stories
      .filter((s) => s.status === 'approved' && s.country)
      .forEach((s) => { counts[s.country] = (counts[s.country] || 0) + 1 })
    return counts
  }, [stories])

  const maxCount = Math.max(1, ...Object.values(countsByCountry))
  const totalPlaced = Object.values(countsByCountry).reduce((a, b) => a + b, 0)

  const colorFor = (feat) => {
    const count = countsByCountry[feat.properties.ADMIN] || 0
    if (!count) return 'rgba(57, 255, 20, 0.05)'
    const intensity = 0.3 + 0.6 * (count / maxCount)
    return `rgba(57, 255, 20, ${intensity})`
  }

  return (
    <div className="container">
      <div className="map-ambient-glow" />
      <SceneBackdrop src="/scene-supporters.jpg" side="right" opacity={0.2} />
      <div className="page-head">
        <h1>Where the <span className="green">Black Bull</span> lives.</h1>
        <p>
          A live map built from stories submitted across the community — just a general country,
          never an exact location. Drag to spin, scroll to zoom.
        </p>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        <div ref={wrapperRef} className="card card-glow" style={{ padding: 0, overflow: 'hidden', height: 560 }}>
          <Globe
            ref={globeRef}
            width={size.width}
            height={size.height}
            backgroundColor="rgba(0,0,0,0)"
            backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
            globeImageUrl="https://unpkg.com/three-globe/example/img/earth-dark.jpg"
            bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
            showAtmosphere
            atmosphereColor="#39FF14"
            atmosphereAltitude={0.3}
            polygonsData={countries}
            polygonCapColor={colorFor}
            polygonSideColor={() => 'rgba(0,0,0,0)'}
            polygonStrokeColor={() => 'rgba(57, 255, 20, 0.25)'}
            polygonAltitude={(feat) => 0.01 + 0.08 * ((countsByCountry[feat.properties.ADMIN] || 0) / maxCount)}
            polygonLabel={(feat) => {
              const count = countsByCountry[feat.properties.ADMIN] || 0
              return `<div style="background:#111;padding:6px 10px;border-radius:8px;border:1px solid #39FF14;color:#fff;font-size:12px">
                <b>${feat.properties.ADMIN}</b><br/>${count} ${count === 1 ? 'story' : 'stories'}
              </div>`
            }}
          />
        </div>

        <p className="small muted center" style={{ marginTop: 16 }}>
          {totalPlaced === 0
            ? 'No stories have shared a country yet — be the first to light up the map.'
            : `${totalPlaced} ${totalPlaced === 1 ? 'story has' : 'stories have'} shared a country so far.`}
        </p>
      </div>
    </div>
  )
}
