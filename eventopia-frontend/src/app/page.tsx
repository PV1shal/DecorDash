import { MapComponent } from "@/app/components/MapComponent/map";
import { ModelComponent } from "./components/DragAndDropComponents/ModelComponent";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow relative">
        <MapComponent />
        <div className="absolute bottom-0 w-full h-1/6 bg-opacity-50 bg-gray-50">
          {/* <ModelComponent image="/model/shiba_glb/scene.glb" /> */}
        </div>
      </div>
    </div>
  );
}
