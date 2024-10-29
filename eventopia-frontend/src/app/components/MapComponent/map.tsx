"use client";
import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import itemTypes from "../../../../utils/ItemTypes";
import { useAssetContext } from "@/app/Context/3DContext";

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map3DElement, setMap3DElement] = useState(null);
  const { assetList, handleDrop } = useAssetContext();

  const [, dropRef] = useDrop({
    accept: itemTypes.ASSET,
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (clientOffset && map3DElement) {
        const { x, y } = clientOffset;
        console.log("Client offset - X:", x, "Y:", y);

        handleDrop({
          position: { lat: 40.717766, lng: -74.012628, altitude: 10 }
        });
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
            // Handle the click event
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

  return <div ref={dropRef(mapRef)} className="w-full h-full"></div>;
};

export { MapComponent };
