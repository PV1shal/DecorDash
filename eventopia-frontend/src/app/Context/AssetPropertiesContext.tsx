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

const MAX_DISTANCE = 30;

const AssetPropertiesContext = createContext<AssetPropertiesContextType>({
  assetProperties: defaultAssetProperty,
  handleLocationClick: () => {},
  handleLocationChange: () => {},
  selectAssetComponent: () => {},
});

export const AssetPropertiesContextProvider = ({ children }) => {
  const [assetProperties, setAssetProperties] =
    useState<AssetProperties>(defaultAssetProperty);

  const { assetList, findClosestAsset } = useAssetContext();

  useEffect(() => {
    console.log("Asset List: ", assetList);
  }, [assetList]);

  const selectAssetComponent = (src: string) => {
    let selectedAsset = assetProperties;
    selectedAsset.src = src;
    setAssetProperties(selectedAsset);
  };

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
          heading:
            assetProperties.orientation?.heading ?? prev.orientation.heading,
          tilt: assetProperties.orientation?.tilt ?? prev.orientation.tilt,
          roll: assetProperties.orientation?.roll ?? prev.orientation.roll,
        },
      };
    });
  };

  const handleLocationClick = (assetProperties: Partial<AssetProperties>) => {
    const closestAsset = findClosestAsset(assetProperties.position);
    let newAsset: AssetProperties;
    console.log("Closest Asset: ", closestAsset , MAX_DISTANCE * 2);

    if (closestAsset.asset && closestAsset.distance < MAX_DISTANCE * closestAsset.asset.scale / 2) {
      console.log("Asset Found: ", closestAsset.asset);
      newAsset = closestAsset.asset;
      setAssetProperties(newAsset);
      return {
        assetProperties: newAsset,
        isFound: true,
      };
    } else {
      handleLocationChange(assetProperties);
      return {
        assetProperties: assetProperties,
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
        selectAssetComponent: selectAssetComponent,
      }}
    >
      {children}
    </AssetPropertiesContext.Provider>
  );
};

export const useAssetPropertiesContext = () =>
  useContext(AssetPropertiesContext);
