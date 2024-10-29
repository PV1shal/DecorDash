"use client";

import { MapComponent } from "@/app/components/MapComponent/map";
import { ModelComponent } from "./components/AssetComponents/ModelComponent";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AssetContextProvider } from "./Context/3DContext";

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AssetContextProvider>
        <div className="flex flex-col h-screen">
          <div className="flex-grow relative">
            <MapComponent />
            <div className="absolute bottom-0 w-full h-1/6 bg-opacity-50 bg-gray-50 flex">
              <ModelComponent image="/model/shiba_glb/scene.glb" />
              {/* Add more ModelComponent instances here */}
            </div>
          </div>
        </div>
      </AssetContextProvider>
    </DndProvider>
  );
}
