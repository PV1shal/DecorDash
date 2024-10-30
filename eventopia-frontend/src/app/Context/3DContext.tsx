import { createContext, useContext, useEffect, useState } from "react";

const AssetContext = createContext<AssetContextType>({
  assetList: [],
  handleDrop: () => {},
});

export const AssetContextProvider = ({ children }) => {
  const [assetList, setAssetList] = useState<AssetProperties[]>([]);

  const handleDrop = (assetProperties: Partial<AssetProperties>) => {
    let newAsset: AssetProperties = {
      position: {
        lat: assetProperties.position?.lat ?? 0,
        lng: assetProperties.position?.lng ?? 0,
        altitude: assetProperties.position?.altitude ?? 0,
      },
      scale: assetProperties.scale ?? 1,
      orientation: assetProperties.orientation ?? {
        heading: 0,
        tilt: 0,
        roll: 0,
      },
      src: assetProperties.src ?? "",
      altitudeMode: "RELATIVE_TO_GROUND",
    };

    console.log("Dropped asset", newAsset);
    setAssetList((prevList) => [...prevList, newAsset]);
  };

  return (
    <AssetContext.Provider
      value={{ assetList: assetList, handleDrop: handleDrop }}
    >
      {children}
    </AssetContext.Provider>
  );
};

export const useAssetContext = () => useContext(AssetContext);
