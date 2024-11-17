"use client";
import { useEffect, useRef, useState } from "react";
import { Easing, Tween, update } from "@tweenjs/tween.js";

const LoginMapComponent = () => {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const [map3DElement, setMap3DElement] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadMap = async () => {
      const { Map3DElement } = await google.maps.importLibrary("maps3d");

      if (mapRef.current && !map3DElement && isMounted) {
        const initialCameraOptions = {
          center: { lat: 40.712776, lng: -74.005974, altitude: 50 },
          range: 200,
          tilt: 60,
          heading: 0,
        };

        const newMap3DElement = new Map3DElement(initialCameraOptions);

        mapRef.current.innerHTML = "";
        mapRef.current.appendChild(newMap3DElement);
        setMap3DElement(newMap3DElement);

        const autocomplete = new google.maps.places.Autocomplete(
          searchInputRef.current
        );

        startCinematicMovement(newMap3DElement, initialCameraOptions);
      }
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&v=alpha&libraries=maps3d,places`;
    script.async = true;
    script.onload = loadMap;
    document.body.appendChild(script);

    return () => {
      isMounted = false;
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const startCinematicMovement = (map3DElement) => {
    const duration = 180000;

    const keyframes = [
      {
        lat: 40.712776,
        lng: -74.005974,
        altitude: 50,
        range: 200,
        tilt: 60,
        heading: 0,
      },
      {
        lat: 40.714001,
        lng: -74.013401,
        altitude: 50,
        range: 200,
        tilt: 60,
        heading: 45,
      },
      {
        lat: 40.718217,
        lng: -74.013787,
        altitude: 50,
        range: 200,
        tilt: 60,
        heading: 0,
      },
      {
        lat: 40.721619,
        lng: -74.005075,
        altitude: 50,
        range: 200,
        tilt: 60,
        heading: 90,
      },
      {
        lat: 40.718397,
        lng: -73.997179,
        altitude: 50,
        range: 200,
        tilt: 60,
        heading: 180,
      },
      {
        lat: 40.712776,
        lng: -74.005974,
        altitude: 50,
        range: 200,
        tilt: 60,
        heading: 270,
      },
    ];

    const tweens = [];

    for (let i = 0; i < keyframes.length - 1; i++) {
      const start = keyframes[i];
      const end = keyframes[i + 1];
      const tweenDuration = duration / (keyframes.length - 1);

      const tween = new Tween(start)
        .to(end, tweenDuration)
        .easing(Easing.Linear.None)
        .onUpdate((update) => {
          map3DElement.center = {
            lat: update.lat,
            lng: update.lng,
            altitude: update.altitude,
          };
          map3DElement.range = update.range;
          map3DElement.tilt = update.tilt;
          map3DElement.heading = update.heading;
        });

      tweens.push(tween);
    }

    for (let i = 0; i < tweens.length - 1; i++) {
      tweens[i].chain(tweens[i + 1]);
    }
    tweens[tweens.length - 1].chain(tweens[0]);

    tweens[0].start();

    const animate = (time) => {
      requestAnimationFrame(animate);
      update(time);
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className="w-full h-full bg-black">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export { LoginMapComponent };
