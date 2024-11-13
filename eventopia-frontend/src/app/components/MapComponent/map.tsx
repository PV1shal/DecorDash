"use client";
import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import itemTypes from "../../../../utils/ItemTypes";
import { useAssetContext } from "@/app/Context/3DContext";
import { AssetPropertiesComponent } from "../AssetComponents/AssetPropertiesComponent";
import { useAssetPropertiesContext } from "@/app/Context/AssetPropertiesContext";
import Image from "next/image";
import { Modal } from "@mui/material";

const MapComponent = () => {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const [map3DElement, setMap3DElement] = useState(null);
  const { assetList, handleDrop, editingAsset } = useAssetContext();
  const { assetProperties, handleLocationClick } = useAssetPropertiesContext();
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const selectedPolygonRef = useRef(selectedPolygon);
  const assetElementsRef = useRef({});
  const [autocomplete, setAutocomplete] = useState(null);
  const [askGPTModal, setAskGPTModal] = useState(false);

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

        // Initialize autocomplete
        const autocomplete = new google.maps.places.Autocomplete(
          searchInputRef.current
        );
        setAutocomplete(autocomplete);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            newMap3DElement.center = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              altitude: 100,
            };
            newMap3DElement.range = 1000;
          }
        });
      }
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&v=alpha&libraries=maps3d,places`;
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
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-1/3 h-12">
        <div className="relative w-full h-full">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a location"
            className="w-full h-full px-4 py-2 pr-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#2C2C2C] bg-opacity-80 text-white"
          />
          <button
            onClick={() => {
              setAskGPTModal(true);
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 p-0 bg-[#2C2C2C] rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-hidden"
          >
            <img
              src="/img/AI.png"
              alt="AI Search"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
        <Modal
          open={askGPTModal}
          onClose={() => setAskGPTModal(false)}
          aria-labelledby="ask-gpt-modal"
          aria-describedby="modal-to-ask-gpt-questions"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2C2C2C] p-6 rounded-lg shadow-lg w-96">
            <button
              onClick={() => setAskGPTModal(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 id="ask-gpt-modal" className="text-white text-xl mb-4">
              Ask GPT
            </h2>
            <input
              type="text"
              placeholder="Ask GPT"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#3C3C3C] text-white"
            />
          </div>
        </Modal>
      </div>
      <div ref={dropRef(mapRef)} className="w-full h-full"></div>
      <AssetPropertiesComponent />
    </div>
  );
};

export { MapComponent };
