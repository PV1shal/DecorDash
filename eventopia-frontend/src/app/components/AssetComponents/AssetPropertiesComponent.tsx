"use client";
import { useEffect, useRef, useState } from "react";
import { useAssetPropertiesContext } from "@/app/Context/AssetPropertiesContext";
import { useAssetContext } from "@/app/Context/3DContext";

const AssetPropertiesComponent = () => {
  const { assetList, handleDrop } = useAssetContext();
  const { assetProperties, handleLocationClick } = useAssetPropertiesContext();

  const handleAssetChange = (e, field, subField = null) => {
    let prev = assetProperties;
    if (subField) {
      prev = {
        ...prev,
        [field]: {
          ...prev[field],
          [subField]: parseFloat(e.target.value) || 0
        }
      };
      handleLocationClick(prev);
    } else {
      prev = {
        ...prev,
        [field]: field === 'src' || field === 'altitudeMode' ? e.target.value : parseFloat(e.target.value) || 0
      };
      handleLocationClick(prev);
    }
  };

  const handleDropAssetAtCoordinates = () => {
   handleDrop(assetProperties);
  };

  return (
    <div className="absolute top-4 right-4 bg-[#2C2C2C] bg-opacity-80 p-4 rounded flex flex-col items-center shadow">
      <h3 className="text-lg font-bold mb-2 text-white">Asset Properties</h3>
      <div className="mb-2">
        <label className="block text-white">Latitude:</label>
        <input
          type="number"
          value={assetProperties.position.lat}
          onChange={(e) => handleAssetChange(e, "position", "lat")}
          className="w-full border rounded px-2 py-1 bg-black text-white border-none"
        />
      </div>
      <div className="mb-2">
        <label className="block text-white">Longitude:</label>
        <input
          type="number"
          value={assetProperties.position.lng}
          onChange={(e) => handleAssetChange(e, "position", "lng")}
          className="w-full border rounded px-2 py-1 bg-black text-white border-none"
        />
      </div>
      <div className="mb-2">
        <label className="block text-white">Altitude:</label>
        <input
          type="number"
          value={assetProperties.position.altitude}
          onChange={(e) => handleAssetChange(e, "position", "altitude")}
          className="w-full border rounded px-2 py-1 bg-black text-white border-none"
        />
      </div>
      <div className="mb-2">
        <label className="block text-white">Scale:</label>
        <input
          type="number"
          value={assetProperties.scale}
          onChange={(e) => handleAssetChange(e, "scale")}
          className="w-full border rounded px-2 py-1 bg-black text-white border-none"
        />
      </div>
      <div className="mb-2">
        <label className="block text-white">Heading:</label>
        <input
          type="number"
          value={assetProperties.orientation.heading}
          onChange={(e) => handleAssetChange(e, "orientation", "heading")}
          className="w-full border rounded px-2 py-1 bg-black text-white border-none"
        />
      </div>
      <div className="mb-2">
        <label className="block text-white">Tilt:</label>
        <input
          type="number"
          value={assetProperties.orientation.tilt}
          onChange={(e) => handleAssetChange(e, "orientation", "tilt")}
          className="w-full border rounded px-2 py-1 bg-black text-white border-none"
        />
      </div>
      <div className="mb-2">
        <label className="block text-white">Roll:</label>
        <input
          type="number"
          value={assetProperties.orientation.roll}
          onChange={(e) => handleAssetChange(e, "orientation", "roll")}
          className="w-full border rounded px-2 py-1 bg-black text-white border-none"
        />
      </div>
      <button
        onClick={handleDropAssetAtCoordinates}
        className="bg-[#DF2F67] text-white mt-3 px-4 py-2 rounded hover:bg-blue-600"
      >
        Drop Asset Here
      </button>
    </div>
  );
};

export { AssetPropertiesComponent };
