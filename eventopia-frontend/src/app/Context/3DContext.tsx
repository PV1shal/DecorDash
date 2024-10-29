import { createContext, useContext, useEffect, useState } from "react";

interface Position {
  lat: number;
  lng: number;
  altitude: number;
}

interface orientation {
  heading: number;
  tilt: number;
  roll: number;
}

interface AssetProperties {
  position: Position;
  scale: number;
  src: string;
  orientation: {};
  altitudeMode: string;
}

interface AssetContextType {
    assetList: AssetProperties[];
    handleDrop: (assetProperties: Partial<AssetProperties>) => void;
}

const AssetContext = createContext<AssetContextType>({
    assetList: [],
    handleDrop: () => {},
});

export const AssetContextProvider = ({children}) => {
  const [assetList, setAssetList] = useState<AssetProperties[]>([]);

  const handleDrop = (assetProperties: Partial<AssetProperties>) => {
    let newAsset: AssetProperties = {
        position: {
            lat: assetProperties.position?.lat ?? 0,
            lng: assetProperties.position?.lng ?? 0,
            altitude: assetProperties.position?.altitude ?? 0,
        },
        scale: 10,
        orientation: { heading: 0, tilt: -90, roll: 0 },
        src: "/model/shiba_glb/scene.glb", // Corrected path
        altitudeMode: "RELATIVE_TO_GROUND",
    };

    setAssetList((prevList) => [...prevList, newAsset]);
  };

  return <AssetContext.Provider value={{ assetList: assetList, handleDrop: handleDrop}}>
    {children}
  </AssetContext.Provider>
}

export const useAssetContext = () => useContext(AssetContext);