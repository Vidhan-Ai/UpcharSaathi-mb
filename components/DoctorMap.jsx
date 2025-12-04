'use client'
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom Marker Component
const createCustomIcon = (type) => {
    let color = '#dc2626'; // Red for default/hospital
    if (type === 'clinic' || type === 'doctor') color = '#2563eb'; // Blue
    if (type === 'blood_bank') color = '#db2777'; // Pink

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="white"></circle>
    </svg>
    `;

    return L.divIcon({
        className: 'custom-map-marker',
        html: svg,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

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

    if (!isMounted) return (
        <div style={{ height: '100%', background: '#f8fafc', borderRadius: '1rem' }} className="d-flex align-items-center justify-content-center">
            <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading Map...</span>
            </div>
        </div>
    );

    const defaultCenter = [20.5937, 78.9629]; // India center
    const mapCenter = center && center.lat ? [center.lat, center.lon] : defaultCenter;

    return (
        <>
            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%', borderRadius: '0.5rem', zIndex: 0 }}
                zoomControl={false}
            >
                <ChangeView center={mapCenter} zoom={13} />

                {/* Modern CartoDB Voyager TileLayer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {doctors.map((doctor) => (
                    <Marker
                        key={doctor.osmId}
                        position={[doctor.latitude, doctor.longitude]}
                        icon={createCustomIcon(doctor.type)}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2">
                                <h6 className="fw-bold mb-1 text-dark">{doctor.name}</h6>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <span className="badge rounded-pill"
                                        style={{ fontSize: '0.7rem', backgroundColor: doctor.type === 'blood_bank' ? '#fce7f3' : '#dbeafe', color: doctor.type === 'blood_bank' ? '#be185d' : '#1d4ed8' }}>
                                        {doctor.specialty ? doctor.specialty.replace(/_/g, ' ') : (doctor.type === 'blood_bank' ? 'Blood Bank' : doctor.type)}
                                    </span>
                                </div>
                                <p className="mb-0 small text-muted" style={{ lineHeight: '1.4' }}>{doctor.address}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <style jsx global>{`
                .custom-map-marker svg {
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .custom-map-marker:hover svg {
                    transform: scale(1.2) translateY(-5px);
                    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 1rem !important;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
                    border: none !important;
                }
                .leaflet-popup-tip {
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
                }
                .leaflet-container {
                    font-family: inherit !important;
                }
            `}</style>
        </>
    );
}
