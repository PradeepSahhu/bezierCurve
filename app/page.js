"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [animatedCurves, setAnimatedCurves] = useState([]);

  // Simulate loading progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 - prev) * 0.1;
        if (newProgress > 99) {
          clearInterval(timer);
          // Small delay before completing the loading state
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Generate animated bezier curves for the background
  useEffect(() => {
    const curves = [];

    // Create 5 animated curves
    for (let i = 0; i < 5; i++) {
      // Generate random control points for each curve
      const points = [
        { x: Math.random() * 100, y: 50 + Math.random() * 300 },
        { x: 150 + Math.random() * 100, y: 50 + Math.random() * 300 },
        { x: 300 + Math.random() * 100, y: 50 + Math.random() * 300 },
        { x: 450 + Math.random() * 100, y: 50 + Math.random() * 300 },
      ];

      // Generate curve points
      const curvePoints = [];
      for (let t = 0; t <= 1; t += 0.01) {
        curvePoints.push(getBezierPoint(points, t));
      }

      curves.push({
        id: i,
        points: curvePoints,
        color: `hsl(${i * 70}, 80%, 60%)`,
        speed: 0.5 + Math.random(),
      });
    }

    setAnimatedCurves(curves);
  }, []);

  // Calculate point on Bezier curve at parameter t using De Casteljau's algorithm
  const getBezierPoint = (controlPoints, t) => {
    if (controlPoints.length === 1) {
      return controlPoints[0];
    }

    const newPoints = [];
    for (let i = 0; i < controlPoints.length - 1; i++) {
      newPoints.push({
        x: (1 - t) * controlPoints[i].x + t * controlPoints[i + 1].x,
        y: (1 - t) * controlPoints[i].y + t * controlPoints[i + 1].y,
      });
    }

    return getBezierPoint(newPoints, t);
  };

  const handleEnterApp = () => {
    alert(
      "This would navigate to the main Bezier curve visualizer application in a real Next.js implementation."
    );
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black overflow-hidden relative">
      {/* Animated background curves */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400">
        {animatedCurves.map((curve, index) => (
          <g key={curve.id}>
            <path
              d={`M ${curve.points.map((p) => `${p.x},${p.y}`).join(" L ")}`}
              fill="none"
              stroke={curve.color}
              strokeWidth="3"
              strokeDasharray="10,5"
              opacity="0.6"
              className="animate-pulse"
              style={{ animationDuration: `${curve.speed * 5}s` }}
            />
            {!loading && (
              <circle
                cx={
                  curve.points[
                    Math.floor((progress / 100) * (curve.points.length - 1))
                  ].x
                }
                cy={
                  curve.points[
                    Math.floor((progress / 100) * (curve.points.length - 1))
                  ].y
                }
                r="6"
                fill={curve.color}
                className="animate-ping"
                style={{ animationDuration: `${curve.speed}s` }}
              />
            )}
          </g>
        ))}
      </svg>

      {/* Content overlay */}
      <div className="z-10 flex flex-col items-center p-8 rounded-lg bg-black bg-opacity-60 backdrop-filter backdrop-blur-md max-w-2xl w-full text-center">
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-white mb-2">
            Bezier Curve Visualizer
          </h1>
          <div className="h-1 w-32 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        <p className="text-xl text-gray-300 mb-8">
          Explore the beauty of parametric curves with an interactive tool for
          visualizing and manipulating Bezier curves.
        </p>

        {loading ? (
          <div className="w-full max-w-md mb-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Loading
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300 ease-out"
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="./Algo"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Start Exploring
          </Link>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg">
            <div className="text-blue-400 text-2xl mb-2">Create</div>
            <p className="text-gray-300">
              Design curves with custom control points
            </p>
          </div>
          <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg">
            <div className="text-blue-400 text-2xl mb-2">Manipulate</div>
            <p className="text-gray-300">
              Drag points to see instant visualizations
            </p>
          </div>
          <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg">
            <Link href="./Learn">
              <div className="text-blue-400 text-2xl mb-2">Learn</div>
              <p className="text-gray-300">
                Understand the math behind Bezier curves
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} Bezier Curve Visualizer
      </div>
    </div>
  );
}
