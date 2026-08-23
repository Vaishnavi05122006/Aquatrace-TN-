import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const STATUS_COLOR = {
  reported: '#F4A340',
  acknowledged: '#F4A340',
  resolved: '#5FB49C',
};

function markerIcon(status, priority) {
  const color = STATUS_COLOR[status] || '#8FA6AD';
  const isUrgent = priority === 'urgent' && status !== 'resolved';
  const ring = isUrgent
    ? '<circle cx="13" cy="13" r="11" fill="none" stroke="#D65F5F" stroke-width="2.5"/>'
    : '';

  return L.divIcon({
    className: '',
    html: `<svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(2, 0)">
        <path d="M13 0C5.8 0 0 5.8 0 13c0 9.5 13 21 13 21s13-11.5 13-21C26 5.8 20.2 0 13 0z" fill="${color}"/>
        ${ring}
        <circle cx="13" cy="13" r="5" fill="#0B1D26"/>
      </g>
    </svg>`,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34],
  });
}

function FlyToSelected({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, Math.max(map.getZoom(), 12), { duration: 0.6 });
    }
  }, [position, map]);
  return null;
}

export default function MapView({ reports, selectedId, onSelect }) {
  const defaultCenter = [11.4, 79.7];
  const selected = reports.find((r) => r.id === selectedId);
  const selectedPosition = selected ? [selected.latitude, selected.longitude] : null;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={8}
      style={{ height: '100%', width: '100%' }}
      preferCanvas
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected position={selectedPosition} />
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={markerIcon(report.status, report.priority)}
          eventHandlers={{ click: () => onSelect(report.id) }}
        >
          <Popup>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <strong>{report.status}</strong>
              {report.priority === 'urgent' && (
                <span style={{ color: '#D65F5F', fontWeight: 700 }}> · URGENT</span>
              )}
              <br />
              {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
              <br />
              {report.reporterEmail}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
