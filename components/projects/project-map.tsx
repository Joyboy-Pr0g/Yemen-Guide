'use client'

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

type ProjectMapProps = {
  latitude: number
  longitude: number
  name: string
}

export default function ProjectMap({ latitude, longitude, name }: ProjectMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={16}
      scrollWheelZoom={false}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={markerIcon}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  )
}
