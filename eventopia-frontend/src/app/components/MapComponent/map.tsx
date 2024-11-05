"use client";
import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import itemTypes from "../../../../utils/ItemTypes";
import { useAssetContext } from "@/app/Context/3DContext";
import { AssetPropertiesComponent } from "../AssetComponents/AssetPropertiesComponent";
import { useAssetPropertiesContext } from "@/app/Context/AssetPropertiesContext";

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map3DElement, setMap3DElement] = useState(null);
  const { assetList, handleDrop, editingAsset } = useAssetContext();
  const { assetProperties, handleLocationClick } = useAssetPropertiesContext();
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const selectedPolygonRef = useRef(selectedPolygon);
  const assetElementsRef = useRef({});

  const [, dropRef] = useDrop({
    accept: itemTypes.ASSET,
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (assetProperties.position) {
        handleDrop(assetProperties);
      } else {
        console.log(
          "No valid position available. Please click on the map or enter coordinates."
        );
      }
    },
  });

  useEffect(() => {
    selectedPolygonRef.current = selectedPolygon;
  }, [selectedPolygon]);

  useEffect(() => {
    let isMounted = true;

    const loadMap = async () => {
      const { Map3DElement, LocationClickEvent, Polygon3DElement } =
        await google.maps.importLibrary("maps3d");

      if (mapRef.current && !map3DElement && isMounted) {
        const newMap3DElement = new Map3DElement({
          center: { lat: 40.717766, lng: -74.012628, altitude: 100 },
          range: 1000,
        });

        mapRef.current.innerHTML = "";
        mapRef.current.appendChild(newMap3DElement);
        setMap3DElement(newMap3DElement);

        newMap3DElement.addEventListener("gmp-click", (event) => {
          if (event instanceof LocationClickEvent && event.position) {
            const res = handleLocationClick({
              position: {
                lat: event.position.lat,
                lng: event.position.lng,
                altitude: event.position.altitude,
              },
            });
            if (selectedPolygonRef.current) {
              selectedPolygonRef.current.remove();
            }
            if (res.isFound) {
              const assetPosition = res.assetProperties.position;
              const polygonSize = 0.0001; 

              const polygon3DElement = new Polygon3DElement({
                fillColor: "rgba(0, 0, 0, 0.2)",
                strokeColor: "#0000FF",
                strokeWidth: 2,
                extruded: true,
                altitudeMode: "RELATIVE_TO_GROUND",
                outerCoordinates: [
                  {
                    lat: assetPosition.lat + polygonSize,
                    lng: assetPosition.lng + polygonSize,
                    altitude: assetPosition.altitude + 15,
                  },
                  {
                    lat: assetPosition.lat + polygonSize,
                    lng: assetPosition.lng - polygonSize,
                    altitude: assetPosition.altitude + 15,
                  },
                  {
                    lat: assetPosition.lat - polygonSize,
                    lng: assetPosition.lng - polygonSize,
                    altitude: assetPosition.altitude + 15,
                  },
                  {
                    lat: assetPosition.lat - polygonSize,
                    lng: assetPosition.lng + polygonSize,
                    altitude: assetPosition.altitude + 15,
                  },
                ],
              });              

              newMap3DElement.appendChild(polygon3DElement);
              setSelectedPolygon(polygon3DElement);
            }
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
    const updateAssets = async () => {
      if (!map3DElement) return;
      const { Model3DElement } = await google.maps.importLibrary("maps3d");

      // Remove assets that are no longer in the list
      Object.keys(assetElementsRef.current).forEach((id) => {
        if (!assetList.some((asset) => asset.id === id)) {
          assetElementsRef.current[id].remove();
          delete assetElementsRef.current[id];
        }
      });

      // Update or add new assets
      assetList.forEach((asset) => {
        if (assetElementsRef.current[asset.id]) {
          // Update existing asset
          Object.assign(assetElementsRef.current[asset.id], asset);
        } else {
          // Add new asset
          const model3DElement = new Model3DElement(asset);
          map3DElement.appendChild(model3DElement);
          assetElementsRef.current[asset.id] = model3DElement;
        }
      });
    };

    updateAssets();
  }, [assetList, map3DElement]);

  useEffect(() => {
    if (editingAsset && assetElementsRef.current[editingAsset.id]) {
      // Remove the asset being edited from the map
      assetElementsRef.current[editingAsset.id].remove();
      delete assetElementsRef.current[editingAsset.id];
    }
  }, [editingAsset]);

  return (
    <div className="relative w-full h-full">
      <div ref={dropRef(mapRef)} className="w-full h-full"></div>
      <AssetPropertiesComponent />
    </div>
  );
};

export { MapComponent };
