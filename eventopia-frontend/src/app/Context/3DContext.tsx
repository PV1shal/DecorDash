import { createContext, useContext, useEffect, useRef, useState } from "react";

interface AssetContextType {
  assetList: AssetProperties[];
  handleDrop: (assetProperties: Partial<AssetProperties>) => void;
  updateAsset: (id: number, properties: Partial<AssetProperties>) => void;
  findClosestAsset: (position: Position) => { asset: AssetProperties | null, distance: number };
}

export const AssetContext = createContext<AssetContextType>({
  assetList: [],
  handleDrop: () => {},
  updateAsset: () => {},
  findClosestAsset: () => ({ asset: null, distance: 0 }),
});

export const AssetContextProvider = ({ children }) => {
  const [assetList, setAssetList] = useState<AssetProperties[]>([]);
  const assetListRef = useRef(assetList);

  const handleDrop = (assetProperties: Partial<AssetProperties>) => {
    const newAsset: AssetProperties = {
      id: Date.now(),
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
    
    setAssetList((prevList) => [...prevList, newAsset]);
  };

  useEffect(() => {
    assetListRef.current = assetList;
  }, [assetList]);

  const getDistance = (position1: Position, position2: Position) => {
    return Math.sqrt(
      Math.pow(position1.lat - position2.lat, 2) +
        Math.pow(position1.lng - position2.lng, 2) +
        Math.pow(position1.altitude - position2.altitude, 2)
    );
  };

  const findClosestAsset = (position: Position) => {
  console.log("Asset list: ", assetListRef.current);
    if (assetListRef.current.length === 0) return { asset: null, distance: 0 };
    let closestAsset = assetListRef.current[0];
    let minDistance = getDistance(position, closestAsset.position);
    assetListRef.current.forEach((asset) => {
      const distance = getDistance(position, asset.position);
      if (distance < minDistance) {
        minDistance = distance;
        closestAsset = asset;
      }
    });
    return {
      asset: closestAsset,
      distance: minDistance,
    }
  };

  const updateAsset = (id: number, properties: Partial<AssetProperties>) => {
    setAssetList((prevList) =>
      prevList.map((asset) =>
        asset.id === id ? { ...asset, ...properties } : asset
      )
    );
  };

  return (
    <AssetContext.Provider 
      value={{ 
        assetList, 
        handleDrop, 
        updateAsset, 
        findClosestAsset
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

export const useAssetContext = () => useContext(AssetContext);
