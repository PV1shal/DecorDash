import Image from "next/image";
import { ModelComponent } from "./ModelComponent";
import { useEffect, useState } from "react";
import modelData from "../../../../utils/ModelData";
import { useAssetPropertiesContext } from "@/app/Context/AssetPropertiesContext";

const BottomAssetsContainer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState("1");
  const { assetProperties, selectAssetComponent } = useAssetPropertiesContext();
  const handleToggle = () => setIsExpanded(!isExpanded);

  const onClickModelComponent = (key) => {
    setSelectedId(key);
    selectAssetComponent(modelData[key].image);
  };

  return (
    <div className="fixed bottom-5 left-0 z-10">
      <div
        className={`relative bg-[#2C2C2C] bg-opacity-80 rounded-r-xl transition-all duration-500 ease-in-out h-[20vh]
          ${isExpanded ? "w-[98vw]" : "w-[4rem]"}`}
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
          {isExpanded && (
            <div className="flex items-center h-full">
              {Object.entries(modelData).map(([key, model]) => (
                <button
                  onClick={() => onClickModelComponent(key)}
                  key={key}
                  className={`p-2 ${
                    selectedId === key ? "border-2 bg-[#df2f6756]" : ""
                  }`}
                >
                  <ModelComponent key={model.id} image={model.image} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomAssetsContainer;
