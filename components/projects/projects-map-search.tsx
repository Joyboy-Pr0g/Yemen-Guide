'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Project } from '@/types'
import { getImageUrl } from '@/lib/utils'
import {
  YEMEN_MAP_CENTER,
  YEMEN_DEFAULT_ZOOM,
  type MapBounds,
  boundsFromLeaflet,
  boundsEqual,
} from '@/utils/mapBounds'

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
}

type ProjectsMapSearchProps = {
  projects: Project[]
  onBoundsChange: (bounds: MapBounds) => void
}

function MapController({
  projects,
  onBoundsChange,
}: ProjectsMapSearchProps) {
  const map = useMap()
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)
  const onBoundsChangeRef = useRef(onBoundsChange)
  const lastPendingRef = useRef<MapBounds | null>(null)
  const projectsRef = useRef(projects)
  const [clusterReady, setClusterReady] = useState(false)
  projectsRef.current = projects
  const projectsKey = projects.map((p) => p.id).join(',')

  onBoundsChangeRef.current = onBoundsChange

  useEffect(() => {
    let cancelled = false
    let onMoveEnd: (() => void) | null = null

    void import('leaflet.markercluster').then(() => {
      if (cancelled) return

      const cluster = L.markerClusterGroup({
        maxClusterRadius: 56,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        chunkedLoading: true,
        chunkInterval: 120,
        chunkDelay: 30,
      })
      clusterRef.current = cluster
      map.addLayer(cluster)
      setClusterReady(true)

      onMoveEnd = () => {
        const bounds = map.getBounds()
        const next = boundsFromLeaflet(bounds.getSouthWest(), bounds.getNorthEast())
        if (boundsEqual(lastPendingRef.current, next)) return
        lastPendingRef.current = next
        onBoundsChangeRef.current(next)
      }

      map.on('moveend', onMoveEnd)
      onMoveEnd()

      cluster.on('clusterclick', (event) => {
        const layer = event.layer as L.MarkerCluster
        map.fitBounds(layer.getBounds(), { padding: [48, 48], maxZoom: 15 })
      })
    })

    return () => {
      cancelled = true
      if (onMoveEnd) {
        map.off('moveend', onMoveEnd)
      }
      const cluster = clusterRef.current
      if (cluster) {
        map.removeLayer(cluster)
        clusterRef.current = null
      }
      setClusterReady(false)
    }
  }, [map])

  useEffect(() => {
    const cluster = clusterRef.current
    if (!cluster || !clusterReady) return

    cluster.clearLayers()

    for (const project of projectsRef.current) {
      const lat = Number(project.latitude)
      const lng = Number(project.longitude)
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) continue

      const marker = L.marker([lat, lng], { icon: markerIcon })
      marker.on('click', () => {
        const category = project.sub_category?.name ?? ''
        const imageUrl = getImageUrl(project.image)
        marker.bindPopup(
          `<a href="/projects/${project.slug}" dir="rtl" style="display:block;min-width:180px;text-decoration:none;color:inherit;">
            <div style="border-radius:12px;overflow:hidden;background:#f3f4f6;margin-bottom:8px;">
              <img src="${imageUrl}" alt="" style="width:100%;height:96px;object-fit:cover;display:block;" loading="lazy" />
            </div>
            <strong style="display:block;font-size:13px;color:#111827;margin-bottom:4px;">${escapeHtml(project.name)}</strong>
            ${category ? `<span style="font-size:11px;color:#6b7280;">${escapeHtml(category)}</span>` : ''}
          </a>`,
          { maxWidth: 240, minWidth: 180 },
        ).openPopup()
      })
      cluster.addLayer(marker)
    }
  }, [projectsKey, clusterReady])

  return null
}

export default function ProjectsMapSearch(props: ProjectsMapSearchProps) {
  return (
    <MapContainer
      center={YEMEN_MAP_CENTER}
      zoom={YEMEN_DEFAULT_ZOOM}
      className="h-full w-full z-0"
      scrollWheelZoom
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MapController {...props} />
    </MapContainer>
  )
}
