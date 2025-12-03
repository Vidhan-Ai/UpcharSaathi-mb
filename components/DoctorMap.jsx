'use client'
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function DoctorMap({ doctors, center }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div style={{ height: '400px', background: '#f0f0f0' }} className="d-flex align-items-center justify-content-center">Loading Map...</div>;

    const defaultCenter = [20.5937, 78.9629]; // India center
    const mapCenter = center && center.lat ? [center.lat, center.lon] : defaultCenter;

    return (
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}>
            <ChangeView center={mapCenter} zoom={13} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {doctors.map((doctor) => (
                <Marker
                    key={doctor.osmId}
                    position={[doctor.latitude, doctor.longitude]}
                    icon={icon}
                >
                    <Popup>
                        <div className="p-1">
                            <h6 className="fw-bold mb-1">{doctor.name}</h6>
                            <p className="mb-1 small text-muted">{doctor.specialty || doctor.type}</p>
                            <p className="mb-0 small">{doctor.address}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
