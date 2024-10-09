"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rocket } from "lucide-react";
import { Rock_Salt } from "@next/font/google";

// Initialize the font
const rockSalt = Rock_Salt({
  weight: "400", // Specify the weight if needed
  subsets: ["latin"], // Specify the subsets if needed
});

interface Star {
  el: HTMLDivElement;
  x: number;
  y: number;
  z: number;
}

const StarfieldHero: React.FC = () => {
  const starfieldRef = useRef<HTMLDivElement | null>(null);
  const [windowWidth, setWindowWidth] = useState<number | null>();
  const [speed] = useState<number>(0.25);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted email:", email);
    setSubmitted(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      setWindowWidth(window.innerWidth); // Initialize the width
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (!starfieldRef.current) return;

    const starfield = starfieldRef.current;
    const starCount = 200;
    const stars: Star[] = [];

    const width = starfield.clientWidth;

    const height = starfield.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    const createStar = (): Star => {
      const star = document.createElement("div");
      star.className = "star bg-white absolute rounded-full";
      starfield.appendChild(star);
      const zVal = Math.random() * width;

      return {
        el: star,
        x: Math.random() * width - centerX,
        y: Math.random() * height - centerY,
        z: zVal,
      };
    };

    for (let i = 0; i < starCount; i++) {
      stars.push(createStar());
    }

    const animateStars = () => {
      stars.forEach((star) => {
        star.z -= speed; // This is the line that controls the speed

        if (star.z <= 0) {
          star.z = width;
          star.x = Math.random() * width - centerX;
          star.y = Math.random() * height - centerY;
        }

        const scale = 500 / star.z;
        const x = star.x * scale + centerX;
        const y = star.y * scale + centerY;

        const opacity = Math.min(Math.max((width - star.z) / width, 0), 1);

        star.el.style.left = `${x}px`;
        star.el.style.top = `${y}px`;
        star.el.style.width = `${Math.max(0.5, scale)}px`;
        star.el.style.height = `${Math.max(0.5, scale)}px`;
        star.el.style.opacity = opacity.toString();
      });

      requestAnimationFrame(animateStars);
    };

    animateStars();

    return () => {
      while (starfield.firstChild) {
        starfield.removeChild(starfield.firstChild);
      }
    };
  }, [windowWidth, speed]);

  // You can add a function to change the speed if needed
  // const changeSpeed = (newSpeed: number) => {
  //   setSpeed(newSpeed);
  // };

  const isMobile = windowWidth ? windowWidth <= 768 : false;

  return (
    <div className="flex flex-col md:flex-row relative h-screen w-full">
      {/* Hero-Video Section */}
      <div className="relative flex flex-1">
        <div
          id="videoSection"
          className="w-full md:w-auto h-full md:h-full flex items-center justify-center bg-gray-100"
        >
          <video autoPlay loop muted className="object-cover h-full">
            <source
              src="/rocketvid.mp4" // Updated path
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          {/* <img
          src="https://assets.lummi.ai/assets/QmZRvhGw3yq5ZcFmBf6U7QSrVxcrsnn1m7DpYVu7eNZHCS?auto=format&w=1500"
          alt="Hero"
          className="object-cover w-full h-full"
        /> */}
        </div>
        {/* <div className="absolute top-0 left-0 w-full h-full " /> */}
      </div>
      {/* Sign Up Form */}
      <div
        id="formSection"
        className={`md:w-1/3 h-1/2 md:h-full ${
          isMobile ? "order-last" : ""
        } relative`}
      >
        <div
          ref={starfieldRef}
          className={`absolute inset-0 overflow-hidden bg-black`}
        >
          {/* Starfield will be rendered here */}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 p-8 rounded-lg text-white text-center">
            <header className="mb-10">
              <Rocket className="w-16 h-16 mx-auto mb-4" />
              <h2
                className={`text-3xl font-semibold tracking-widest ${rockSalt.className}`}
              >
                Get Ready for Liftoff
              </h2>
            </header>
            <main>
              <p className="mb-8 max-w-md text-xl font-sans">
                Be the first to know when we blast off. Sign up now for
                exclusive updates and early access!
              </p>
              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col items-center space-y-4"
                >
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button type="submit">Sign Up</Button>
                  </div>
                </form>
              ) : (
                <p className="text-green-400">
                  {" Thank you for signing up! We'll keep you posted."}
                </p>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarfieldHero;
