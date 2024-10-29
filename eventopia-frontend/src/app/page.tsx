"use client";

import { MapComponent } from "@/app/components/MapComponent/map";
import { ModelComponent } from "./components/AssetComponents/ModelComponent";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AssetContextProvider } from "./Context/3DContext";
import { useState } from "react";
import Image from "next/image";
import BottomASsetsContainer from "./components/AssetComponents/BottomAssetsContainer";

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AssetContextProvider>
        <div className="flex flex-col h-screen">
          <div className="flex-grow relative flex flex-col items-center">
            <MapComponent />
            <BottomASsetsContainer />
          </div>
        </div>
      </AssetContextProvider>
    </DndProvider>
  );
}
