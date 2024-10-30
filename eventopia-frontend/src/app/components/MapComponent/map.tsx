"use client";
import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import itemTypes from "../../../../utils/ItemTypes";
import { useAssetContext } from "@/app/Context/3DContext";

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map3DElement, setMap3DElement] = useState(null);
  const [assetProperties, setAssetProperties] = useState({
    position: { lat: 0, lng: 0, altitude: 0 },
    scale: 10,
    orientation: { heading: 0, tilt: -90, roll: 0 },
    src: "/model/shiba_glb/scene.glb",
    altitudeMode: "RELATIVE_TO_GROUND",
  });
  const { assetList, handleDrop } = useAssetContext();

  const [, dropRef] = useDrop({
    accept: itemTypes.ASSET,
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      console.log("X: " + clientOffset?.x + ",Y: " + clientOffset?.y);
      if (assetProperties.position) {
        handleDrop(assetProperties);
      } else {
        console.log("No valid position available. Please click on the map or enter coordinates.");
      }
    },
  });

  useEffect(() => {
    let isMounted = true;

    const loadMap = async () => {
      const { Map3DElement, LocationClickEvent } = await google.maps.importLibrary("maps3d");

      if (mapRef.current && !map3DElement && isMounted) {
        const newMap3DElement = new Map3DElement({
          center: { lat: 40.717766, lng: -74.012628, altitude: 100 },
          range: 1000,
        });

        mapRef.current.innerHTML = "";
        mapRef.current.appendChild(newMap3DElement);
        setMap3DElement(newMap3DElement);

        newMap3DElement.addEventListener('gmp-click', (event) => {
          if (event instanceof LocationClickEvent && event.position) {
            console.log(`Clicked at: Lat ${event.position.lat}, Lng ${event.position.lng}, Alt ${event.position.altitude}`);
            setAssetProperties(prev => ({
              ...prev,
              position: {
                lat: event.position.lat,
                lng: event.position.lng,
                altitude: event.position.altitude || 0,
              },
              orientation: { heading: 0, tilt: -90, roll: 0 },
            }));
          }
        });
      }
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&v=alpha&libraries=maps3d`;
    script.async = true;
    script.onload = loadMap;
    document.body.appendChild(script);

    return () => {
      isMounted = false;
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const add3DAssets = async () => {
      if (!map3DElement) return;

      console.log("Adding 3D assets", assetList);
      const { Model3DElement } = await google.maps.importLibrary("maps3d");

      // Remove existing models
      map3DElement.querySelectorAll("model-3d").forEach((model) => {
        model.remove();
      });

      // Add new models
      assetList.forEach((asset) => {
        const model3DElement = new Model3DElement(asset);
        map3DElement.appendChild(model3DElement);
      });
    };

    add3DAssets();
  }, [assetList, map3DElement]);

  const handleAssetChange = (e, field, subField = null) => {
    if (subField) {
      setAssetProperties(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subField]: parseFloat(e.target.value) || 0
        }
      }));
    } else {
      setAssetProperties(prev => ({
        ...prev,
        [field]: field === 'src' || field === 'altitudeMode' ? e.target.value : parseFloat(e.target.value) || 0
      }));
    }
  };

  const handleDropAtCoordinates = () => {
    handleDrop(assetProperties);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={dropRef(mapRef)} className="w-full h-full"></div>
      <div className="absolute top-4 right-4 bg-[#2C2C2C] bg-opacity-80 p-4 rounded flex flex-col items-center shadow">
        <h3 className="text-lg font-bold mb-2 text-white">Asset Properties</h3>
        <div className="mb-2">
          <label className="block text-white">Latitude:</label>
          <input
            type="number"
            value={assetProperties.position.lat}
            onChange={(e) => handleAssetChange(e, 'position', 'lat')}
            className="w-full border rounded px-2 py-1 bg-black text-white border-none"
          />
        </div>
        <div className="mb-2">
          <label className="block text-white">Longitude:</label>
          <input
            type="number"
            value={assetProperties.position.lng}
            onChange={(e) => handleAssetChange(e, 'position', 'lng')}
            className="w-full border rounded px-2 py-1 bg-black text-white border-none"
          />
        </div>
        <div className="mb-2">
          <label className="block text-white">Altitude:</label>
          <input
            type="number"
            value={assetProperties.position.altitude}
            onChange={(e) => handleAssetChange(e, 'position', 'altitude')}
            className="w-full border rounded px-2 py-1 bg-black text-white border-none"
          />
        </div>
        <div className="mb-2">
          <label className="block text-white">Scale:</label>
          <input
            type="number"
            value={assetProperties.scale}
            onChange={(e) => handleAssetChange(e, 'scale')}
            className="w-full border rounded px-2 py-1 bg-black text-white border-none"
          />
        </div>
        <div className="mb-2">
          <label className="block text-white">Heading:</label>
          <input
            type="number"
            value={assetProperties.orientation.heading}
            onChange={(e) => handleAssetChange(e, 'orientation', 'heading')}
            className="w-full border rounded px-2 py-1 bg-black text-white border-none"
          />
        </div>
        <div className="mb-2">
          <label className="block text-white">Tilt:</label>
          <input
            type="number"
            value={assetProperties.orientation.tilt}
            onChange={(e) => handleAssetChange(e, 'orientation', 'tilt')}
            className="w-full border rounded px-2 py-1 bg-black text-white border-none"
          />
        </div>
        <div className="mb-2">
          <label className="block text-white">Roll:</label>
          <input
            type="number"
            value={assetProperties.orientation.roll}
            onChange={(e) => handleAssetChange(e, 'orientation', 'roll')}
            className="w-full border rounded px-2 py-1 bg-black text-white border-none"
          />
        </div>
        <button
          onClick={handleDropAtCoordinates}
          className="bg-[#DF2F67] text-white mt-3 px-4 py-2 rounded hover:bg-blue-600"
        >
          Drop Asset Here
        </button>
      </div>
    </div>
  );
};

export { MapComponent };
