"use client";
import { useEffect, useRef } from "react";

const MapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    let map3DElement = null;
    let polygon3DElement = null;
    let model3DElement = null;

    const loadMap = async () => {
      const { Map3DElement, Polygon3DElement, Model3DElement, } = await google.maps.importLibrary("maps3d");
     
      if (mapRef.current && !map3DElement) {
        map3DElement = new Map3DElement({
          center: { lat: 40.717766, lng: -74.012628, altitude: 100 },
          // tilt: 67.5,
          range: 1000,
          // heading: 0,
        });
       
        mapRef.current.innerHTML = ''; // Clear any existing content
        mapRef.current.appendChild(map3DElement);

        // Create a polygon
        // polygon3DElement = new Polygon3DElement({
        //   fillColor: "rgba(255, 0, 0, 0.5)",
        //   strokeColor: "#0000FF",
        //   strokeWidth: 2,
        //   extruded: true
        // });

        // Define polygon coordinates
        // polygon3DElement.outerCoordinates = [
        //   {lat: 40.717766, lng: -74.012628, altitude: 2000},
        //   {lat: 40.717766, lng: -74.012603, altitude: 2000},
        //   {lat: 40.717766, lng: -74.012612, altitude: 2000},
        // ];

        // Create a 3D model
        model3DElement = new Model3DElement({
          position: { lat: 40.717766, lng: -74.012628, altitude: 10 },
          orientation: { heading: 0, tilt: -90, roll: 0 },
          scale: 10, // Reduced scale to make it more visible
          src: "/model/shiba_glb/scene.glb", // Corrected path
          altitudeMode: "RELATIVE_TO_GROUND",
        });

        // Add the polygon to the map
        // map3DElement.appendChild(polygon3DElement);
        map3DElement.appendChild(model3DElement);
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

  return <div ref={mapRef} className="w-full h-full"></div>;
};

export { MapComponent };
