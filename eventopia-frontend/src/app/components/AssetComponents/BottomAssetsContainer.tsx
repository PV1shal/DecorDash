import Image from "next/image";
import { ModelComponent } from "./ModelComponent";
import { useState } from "react";

const BottomASsetsContainer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <>
      <div className="absolute bottom-5 left-10 flex">
        <button className="bg-[#DF2F67] rounded-full" onClick={handleToggle}>
          <Image
            src={isExpanded ? "/img/right.png" : "/img/left.png"}
            width={50}
            height={50}
            alt=""
        />
        </button>
      </div>
      <div className="absolute bottom-0 w-11/12  h-1/6 bg-[#2C2C2C] bg-opacity-80 rounded-xl flex mb-5">
        <ModelComponent image="/model/shiba_glb/scene.glb" />
      </div>
    </>
  );
};

export default BottomASsetsContainer;
