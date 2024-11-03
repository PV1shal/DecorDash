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

  function getDistanceHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c * 1000; // Distance in meters
    return distance;
  }  

  const findClosestAsset = (position: Position) => {
  console.log("Asset list: ", assetListRef.current);
    if (assetListRef.current.length === 0) return { asset: null, distance: 0 };
    let closestAsset = assetListRef.current[0];
    let minDistance = getDistanceHaversine(position.lat, position.lng, closestAsset.position.lat, closestAsset.position.lng);
    assetListRef.current.forEach((asset) => {
      const distance = getDistanceHaversine(position.lat, position.lng, asset.position.lat, asset.position.lng);
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
