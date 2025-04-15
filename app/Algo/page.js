"use client";
import React, { useState, useEffect } from "react";

export default function BezierCurveVisualizer() {
  const [points, setPoints] = useState([
    { x: 100, y: 200 },
    { x: 200, y: 100 },
    { x: 300, y: 100 },
    { x: 400, y: 200 },
  ]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [curvePoints, setCurvePoints] = useState([]);
  const [showControlLines, setShowControlLines] = useState(true);
  const [showControlPoints, setShowControlPoints] = useState(true);
  const [resolution, setResolution] = useState(100);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  // Calculate Bezier curve points
  useEffect(() => {
    const bezierPoints = [];
    for (let t = 0; t <= 1; t += 1 / resolution) {
      bezierPoints.push(getBezierPoint(points, t));
    }
    setCurvePoints(bezierPoints);
  }, [points, resolution]);

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

  // Add new control point
  const addPoint = () => {
    const lastPoint = points[points.length - 1];
    setPoints([
      ...points,
      {
        x: lastPoint.x + 50,
        y: lastPoint.y,
      },
    ]);
  };

  // Remove last control point (if more than 2 exist)
  const removePoint = () => {
    if (points.length > 2) {
      setPoints(points.slice(0, -1));
    }
  };

  // Mouse handlers for dragging points
  const handleMouseDown = (index) => {
    setSelectedPoint(index);
  };

  const handleMouseMove = (e) => {
    if (selectedPoint !== null) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, canvasSize.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, canvasSize.height));

      const newPoints = [...points];
      newPoints[selectedPoint] = { x, y };
      setPoints(newPoints);
    }
  };

  const handleMouseUp = () => {
    setSelectedPoint(null);
  };

  // Handle canvas resize
  const handleCanvasResize = (dimension, value) => {
    setCanvasSize({
      ...canvasSize,
      [dimension]: Math.max(200, parseInt(value) || 200),
    });
  };

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Bezier Curve Visualizer</h1>

      <div className="mb-4 flex flex-wrap gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={addPoint}
        >
          Add Control Point
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={removePoint}
          disabled={points.length <= 2}
        >
          Remove Control Point
        </button>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={showControlLines}
            onChange={() => setShowControlLines(!showControlLines)}
            className="mr-2"
          />
          <label>Show Control Lines</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={showControlPoints}
            onChange={() => setShowControlPoints(!showControlPoints)}
            className="mr-2"
          />
          <label>Show Control Points</label>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label className="mr-2">Resolution:</label>
          <input
            type="range"
            min="10"
            max="500"
            value={resolution}
            onChange={(e) => setResolution(parseInt(e.target.value))}
            className="w-32"
          />
          <span className="ml-2">{resolution}</span>
        </div>
        <div>
          <label className="mr-2">Width:</label>
          <input
            type="number"
            value={canvasSize.width}
            onChange={(e) => handleCanvasResize("width", e.target.value)}
            className="w-20 border rounded px-2"
          />
        </div>
        <div>
          <label className="mr-2">Height:</label>
          <input
            type="number"
            value={canvasSize.height}
            onChange={(e) => handleCanvasResize("height", e.target.value)}
            className="w-20 border rounded px-2"
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm mb-2">
          Control Points:{" "}
          {points.map((p, i) => (
            <span key={i} className="mr-2">
              P{i}({Math.round(p.x)}, {Math.round(p.y)})
            </span>
          ))}
        </div>
      </div>

      <div
        className="relative border border-gray-300 bg-white"
        style={{ width: canvasSize.width, height: canvasSize.height }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Control lines */}
        {showControlLines && (
          <svg
            width={canvasSize.width}
            height={canvasSize.height}
            className="absolute"
          >
            <polyline
              points={points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#aaa"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          </svg>
        )}

        {/* Bezier curve */}
        <svg
          width={canvasSize.width}
          height={canvasSize.height}
          className="absolute"
        >
          <polyline
            points={curvePoints.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#0066ff"
            strokeWidth="3"
          />
        </svg>

        {/* Control points */}
        {showControlPoints &&
          points.map((point, index) => (
            <div
              key={index}
              className={`absolute w-6 h-6 rounded-full flex items-center justify-center cursor-move ${
                selectedPoint === index ? "bg-red-500" : "bg-blue-500"
              }`}
              style={{
                left: point.x - 12,
                top: point.y - 12,
                touchAction: "none",
              }}
              onMouseDown={() => handleMouseDown(index)}
            >
              <span className="text-white text-xs">{index}</span>
            </div>
          ))}
      </div>

      <div className="mt-4 text-sm">
        <p>Drag the control points to modify the Bezier curve.</p>
        <p>
          A Bezier curve of degree {points.length - 1} is currently displayed.
        </p>
      </div>
    </div>
  );
}
