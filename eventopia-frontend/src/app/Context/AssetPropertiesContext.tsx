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
  handleLocationChange: () => {},
});

export const AssetPropertiesContextProvider = ({ children }) => {
  const [assetProperties, setAssetProperties] =
    useState<AssetProperties>(defaultAssetProperty);

  const { assetList, findClosestAsset } = useAssetContext();

  useEffect(() => {
    console.log("Asset List: ", assetList);
  }, [assetList]);

  const handleLocationChange = (assetProperties: Partial<AssetProperties>) => {
    setAssetProperties((prev) => {
      return {
        ...prev,
        position: {
          ...prev.position,
          lat: assetProperties.position?.lat ?? prev.position.lat,
          lng: assetProperties.position?.lng ?? prev.position.lng,
          altitude:
            assetProperties.position?.altitude ?? prev.position.altitude,
        },
        orientation: {
          ...prev.orientation,
          heading: assetProperties.orientation?.heading ?? prev.orientation.heading,
          tilt: assetProperties.orientation?.tilt ?? prev.orientation.tilt,
          roll:
            assetProperties.orientation?.roll ?? prev.orientation.roll,
        },
      };
    });
  };

  const handleLocationClick = (assetProperties: Partial<AssetProperties>) => {
    const closestAsset = findClosestAsset(assetProperties.position);
    let newAsset: AssetProperties;

    if (closestAsset.asset && closestAsset.distance < MAX_DISTANCE) {
      newAsset = closestAsset.asset;
      setAssetProperties(newAsset);
      return {
        assetProperties: newAsset,
        isFound: true,
      };
    } else {
      newAsset = {
        position: {
          lat: assetProperties.position?.lat ?? 0,
          lng: assetProperties.position?.lng ?? 0,
          altitude: assetProperties.position?.altitude ?? 0,
        },
        scale: assetProperties.scale ?? defaultAssetProperty.scale,
        orientation:
          assetProperties.orientation ?? defaultAssetProperty.orientation,
        src: assetProperties.src ?? defaultAssetProperty.src,
        altitudeMode: defaultAssetProperty.altitudeMode,
      };
      setAssetProperties(newAsset);
      return {
        assetProperties: newAsset,
        isFound: false,
      };
    }
  };

  return (
    <AssetPropertiesContext.Provider
      value={{
        assetProperties: assetProperties,
        handleLocationClick: handleLocationClick,
        handleLocationChange: handleLocationChange,
      }}
    >
      {children}
    </AssetPropertiesContext.Provider>
  );
};

export const useAssetPropertiesContext = () =>
  useContext(AssetPropertiesContext);
