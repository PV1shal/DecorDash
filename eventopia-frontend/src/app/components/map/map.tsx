"use client";
import { useEffect, useRef } from "react";

const defaultMapContainerStyle = {
  width: "100%",
  height: "100vh",
  borderRadius: "15px 0px 0px 15px",
};

const MapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    let map3DElement = null;

    const loadMap = async () => {
      const { Map3DElement } = await google.maps.importLibrary("maps3d");
     
      if (mapRef.current && !map3DElement) {
        map3DElement = new Map3DElement({
          center: { lat: 37.819852, lng: -122.478549, altitude: 0 },
          tilt: 67.5,
          range: 1000,
          heading: 0,
        });
       
        mapRef.current.innerHTML = ''; // Clear any existing content
        mapRef.current.appendChild(map3DElement);
      }
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&v=alpha&libraries=maps3d`;
    script.async = true;
    script.onload = loadMap;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      if (map3DElement && map3DElement.parentNode) {
        map3DElement.parentNode.removeChild(map3DElement);
      }
    };
  }, []);

  return <div ref={mapRef} style={defaultMapContainerStyle}></div>;
};

export { MapComponent };