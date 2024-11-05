interface Position {
  lat: number;
  lng: number;
  altitude: number;
}

interface Orientation {
  heading: number;
  tilt: number;
  roll: number;
}

interface AssetProperties {
  position: Position;
  scale: number;
  src: string;
  orientation: Orientation;
  altitudeMode: string;
}

interface AssetContextType {
  assetList: AssetProperties[];
  handleDrop: (assetProperties: Partial<AssetProperties>) => void;
}

interface AssetPropertiesContextType {
  assetProperties: AssetProperties;
  handleLocationClick: (assetProperties: Partial<AssetProperties>) => void;
  handleLocationChange: (assetProperties: Partial<AssetProperties>) => void;
}
