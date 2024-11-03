import { createContext, useContext, useEffect, useState } from "react";
import { useAssetContext } from "@/app/Context/3DContext";

const defaultAssetProperty = {
  position: {
    lat: 0,
    lng: 0,
    altitude: 0,
  },
  orientation: {
    tilt: -90,
    heading: 0,
    roll: 0,
  },
  scale: 10,
  src: "/model/shiba_glb/scene.glb",
  altitudeMode: "RELATIVE_TO_GROUND",
};

const MAX_DISTANCE = 10;

const AssetPropertiesContext = createContext<AssetPropertiesContextType>({
  assetProperties: defaultAssetProperty,
  handleLocationClick: () => {},
});

export const AssetPropertiesContextProvider = ({ children }) => {
  const [assetProperties, setAssetProperties] =
    useState<AssetProperties>(defaultAssetProperty);
  
  const { findClosestAsset } = useAssetContext();

  const handleLocationClick = (assetProperties: Partial<AssetProperties>) => {
    const closestAsset = findClosestAsset(assetProperties.position);
    console.log("Closest asset: ", closestAsset);
    let newAsset: AssetProperties;

    if (closestAsset.asset && closestAsset.distance < MAX_DISTANCE) {
      newAsset = closestAsset.asset;
      return {
        assetProperties: newAsset,
        isFound: true,
      }
    } else {
      newAsset = {
        position: {
          lat: assetProperties.position?.lat ?? 0,
          lng: assetProperties.position?.lng ?? 0,
          altitude: assetProperties.position?.altitude ?? 0,
        },
        scale: assetProperties.scale ?? defaultAssetProperty.scale,
        orientation: assetProperties.orientation ?? defaultAssetProperty.orientation,
        src: assetProperties.src ?? defaultAssetProperty.src,
        altitudeMode: defaultAssetProperty.altitudeMode,
      };
    }
    setAssetProperties(newAsset);
    return {
      assetProperties: newAsset,
      isFound: false,
    }
  };

  return (
    <AssetPropertiesContext.Provider
      value={{
        assetProperties: assetProperties,
        handleLocationClick: handleLocationClick,
      }}
    >
      {children}
    </AssetPropertiesContext.Provider>
  );
};

export const useAssetPropertiesContext = () =>
  useContext(AssetPropertiesContext);
