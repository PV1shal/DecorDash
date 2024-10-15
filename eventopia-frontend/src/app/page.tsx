import { MapComponent } from "@/app/components/map/map";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <MapComponent />
        <div className="absolute bottom-0">
          <button className="bg-white p-2 rounded-lg">About</button>
        </div>
      </div>
      {/* <nav className="h-16 bg-transparent">
        <a href="/about">About</a>
      </nav> */}
    </div>
  );
}
