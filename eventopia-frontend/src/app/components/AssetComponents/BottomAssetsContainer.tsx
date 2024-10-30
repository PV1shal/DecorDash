import Image from "next/image";
import { ModelComponent } from "./ModelComponent";
import { useState } from "react";

const BottomAssetsContainer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <div className="fixed bottom-5 left-0 z-10">
      <div
        className={`relative bg-[#2C2C2C] bg-opacity-80 rounded-r-xl transition-all duration-500 ease-in-out h-[20vh]
          ${isExpanded ? 'w-[98vw]' : 'w-[4rem]'}`}
      >
        <button
          className="absolute top-[-1rem] right-[-1rem] bg-[#DF2F67] rounded-full flex justify-center items-center w-12 h-12 z-20"
          onClick={handleToggle}
        >
          <Image
            src={isExpanded ? "/img/close.png" : "/img/right.png"}
            width={24}
            height={24}
            alt=""
          />
        </button>
        <div className="h-full w-full">
          {isExpanded && <ModelComponent image="/model/shiba_glb/scene.glb" />}
        </div>
      </div>
    </div>
  );
};

export default BottomAssetsContainer;
