'use client'

import 'leaflet/dist/leaflet.css'

import type { LatLngBoundsExpression } from 'leaflet'
import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet'

export interface MapPoint {
  id: string
  lat: number
  lng: number
  label: string
  sublabel: string
  color: string
}

interface AtlasMapProps {
  points: MapPoint[]
  activeId: string | null
  onSelect?: (id: string) => void
  onHover?: (id: string | null) => void
}

export default function AtlasMap({ points, activeId, onSelect, onHover }: AtlasMapProps) {
  const bounds: LatLngBoundsExpression | undefined =
    points.length > 1 ? points.map((p) => [p.lat, p.lng] as [number, number]) : undefined
  const center: [number, number] = points.length ? [points[0].lat, points[0].lng] : [30, 20]

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [60, 60], maxZoom: 6 }}
      center={bounds ? undefined : center}
      zoom={bounds ? undefined : 4}
      scrollWheelZoom={false}
      worldCopyJump
      className="atlas-map size-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
      />
      {points.map((p) => {
        const active = activeId === p.id
        return (
          <CircleMarker
            key={`${p.id}-halo-${active}`}
            center={[p.lat, p.lng]}
            radius={active ? 22 : 14}
            pathOptions={{ color: p.color, weight: 0, fillColor: p.color, fillOpacity: active ? 0.25 : 0.12 }}
            interactive={false}
          />
        )
      })}
      {points.map((p) => {
        const active = activeId === p.id
        return (
          <CircleMarker
            key={`${p.id}-${active}`}
            center={[p.lat, p.lng]}
            radius={active ? 8 : 6}
            pathOptions={{ color: '#0c1a14', weight: 2, fillColor: p.color, fillOpacity: 1 }}
            eventHandlers={{
              click: () => onSelect?.(p.id),
              mouseover: () => onHover?.(p.id),
              mouseout: () => onHover?.(null),
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} permanent={active} className="atlas-tooltip">
              <span className="block font-medium">{p.label}</span>
              <span className="block opacity-70">{p.sublabel}</span>
            </Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
