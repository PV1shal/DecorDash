"use client";
import { MapComponent } from "@/app/components/MapComponent/map";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AssetContextProvider } from "./Context/3DContext";
import BottomASsetsContainer from "./components/AssetComponents/BottomAssetsContainer";
import { AssetPropertiesContextProvider } from "./Context/AssetPropertiesContext";

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AssetContextProvider>
        <AssetPropertiesContextProvider>
          <div className="flex flex-col h-screen">
            <div className="flex-grow relative flex flex-col items-center">
              <MapComponent />
              <BottomASsetsContainer />
            </div>
          </div>
        </AssetPropertiesContextProvider>
      </AssetContextProvider>
    </DndProvider>
  );
}
