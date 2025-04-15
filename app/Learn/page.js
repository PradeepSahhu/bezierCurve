"use client";
import React, { useState, useEffect, useRef } from "react";

export default function BezierLearningRoute() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoPoints, setDemoPoints] = useState([
    { x: 100, y: 250 },
    { x: 150, y: 100 },
    { x: 250, y: 100 },
    { x: 300, y: 250 },
  ]);

  const demoAnimationRef = useRef(null);

  useEffect(() => {
    return () => {
      if (demoAnimationRef.current) {
        cancelAnimationFrame(demoAnimationRef.current);
      }
    };
  }, []);

  // Scroll to section when activeSection changes
  useEffect(() => {
    const sectionElement = document.getElementById(activeSection);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSection]);

  const toggleDemo = () => {
    if (isDemoPlaying) {
      cancelAnimationFrame(demoAnimationRef.current);
      setIsDemoPlaying(false);
    } else {
      setDemoProgress(0);
      setIsDemoPlaying(true);
      animateDemo();
    }
  };

  const animateDemo = () => {
    setDemoProgress((prev) => {
      const newProgress = prev + 0.005;
      if (newProgress >= 1) {
        setIsDemoPlaying(false);
        return 1;
      }

      if (isDemoPlaying) {
        demoAnimationRef.current = requestAnimationFrame(animateDemo);
      }

      return newProgress;
    });
  };

  // Linear interpolation between two points
  const lerp = (p0, p1, t) => {
    return {
      x: (1 - t) * p0.x + t * p1.x,
      y: (1 - t) * p0.y + t * p1.y,
    };
  };

  // Calculate point on Bezier curve at parameter t using De Casteljau's algorithm
  const getBezierPoint = (controlPoints, t) => {
    if (controlPoints.length === 1) {
      return controlPoints[0];
    }

    const newPoints = [];
    for (let i = 0; i < controlPoints.length - 1; i++) {
      newPoints.push(lerp(controlPoints[i], controlPoints[i + 1], t));
    }

    return getBezierPoint(newPoints, t);
  };

  // Generate intermediate points for visualization
  const getIntermediatePoints = (points, t) => {
    if (points.length <= 1) return [];

    const intermediatePoints = [];
    const nextLevelPoints = [];

    for (let i = 0; i < points.length - 1; i++) {
      const newPoint = lerp(points[i], points[i + 1], t);
      nextLevelPoints.push(newPoint);

      intermediatePoints.push({
        start: points[i],
        end: points[i + 1],
        point: newPoint,
      });
    }

    return [
      ...intermediatePoints,
      ...getIntermediatePoints(nextLevelPoints, t),
    ];
  };

  // Generate curve points for visualization
  const generateCurvePoints = (controlPoints, numPoints = 100) => {
    const points = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      points.push(getBezierPoint(controlPoints, t));
    }
    return points;
  };

  const curvePoints = generateCurvePoints(demoPoints);
  const intermediateSteps = getIntermediatePoints(demoPoints, demoProgress);

  // Get interpolated point for current progress
  const currentPoint =
    demoProgress < 1
      ? getBezierPoint(demoPoints, demoProgress)
      : getBezierPoint(demoPoints, 1);

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Header */}
      <header className="bg-blue-600 text-black shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">
              The Mathematics of Bezier Curves
            </h1>
            <nav>
              <ul className="flex flex-wrap gap-2 md:gap-4">
                <li>
                  <button
                    onClick={() => setActiveSection("introduction")}
                    className={`px-3 py-1 rounded ${
                      activeSection === "introduction"
                        ? "bg-black text-blue-600"
                        : "hover:bg-blue-500"
                    }`}
                  >
                    Introduction
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("formula")}
                    className={`px-3 py-1 rounded ${
                      activeSection === "formula"
                        ? "bg-black text-blue-600"
                        : "hover:bg-blue-500"
                    }`}
                  >
                    Formula
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("deCasteljau")}
                    className={`px-3 py-1 rounded ${
                      activeSection === "deCasteljau"
                        ? "bg-black text-blue-600"
                        : "hover:bg-blue-500"
                    }`}
                  >
                    De Casteljau's Algorithm
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("properties")}
                    className={`px-3 py-1 rounded ${
                      activeSection === "properties"
                        ? "bg-black text-blue-600"
                        : "hover:bg-blue-500"
                    }`}
                  >
                    Properties
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection("applications")}
                    className={`px-3 py-1 rounded ${
                      activeSection === "applications"
                        ? "bg-black text-blue-600"
                        : "hover:bg-blue-500"
                    }`}
                  >
                    Applications
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Interactive Visualization */}
        <div className="bg-black rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Interactive Visualization
          </h2>
          <div className="relative border border-gray-200 rounded-lg h-64 md:h-80 mb-4">
            <svg width="100%" height="100%" viewBox="0 0 400 300">
              {/* The full Bezier curve */}
              <path
                d={`M ${curvePoints.map((p) => `${p.x},${p.y}`).join(" L ")}`}
                fill="none"
                stroke="#ddd"
                strokeWidth="2"
              />

              {/* Control polygon */}
              <polyline
                points={demoPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="#aaa"
                strokeWidth="1.5"
                strokeDasharray="5,5"
              />

              {/* Visualization of De Casteljau algorithm for current t */}
              {intermediateSteps.map((step, i) => (
                <g key={i}>
                  <line
                    x1={step.start.x}
                    y1={step.start.y}
                    x2={step.end.x}
                    y2={step.end.y}
                    stroke={`hsl(${i * 30}, 70%, 60%)`}
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={step.point.x}
                    cy={step.point.y}
                    r="4"
                    fill={`hsl(${i * 30}, 70%, 60%)`}
                  />
                </g>
              ))}

              {/* Control points */}
              {demoPoints.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#3b82f6"
                />
              ))}

              {/* Current point on the curve */}
              <circle
                cx={currentPoint.x}
                cy={currentPoint.y}
                r="8"
                fill="red"
              />

              {/* t parameter indicator */}
              <text x="20" y="30" fontSize="16" fill="#333">
                t = {demoProgress.toFixed(2)}
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={toggleDemo}
              className={`px-4 py-2 rounded-md font-medium ${
                isDemoPlaying
                  ? "bg-red-500 hover:bg-red-600 text-black"
                  : "bg-blue-500 hover:bg-blue-600 text-black"
              }`}
            >
              {isDemoPlaying ? "Stop Animation" : "Start Animation"}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={demoProgress}
              onChange={(e) => {
                setIsDemoPlaying(false);
                setDemoProgress(parseFloat(e.target.value));
              }}
              className="w-1/2"
            />
          </div>
        </div>

        {/* Introduction Section */}
        <section id="introduction" className="mb-12">
          <div className="bg-black rounded-xl shadow-lg p-6 text-black">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Introduction to Bezier Curves
            </h2>
            <p className="mb-4 text-white">
              Bezier curves are parametric curves widely used in computer
              graphics and related fields. Named after French engineer Pierre
              Bézier who used them in the 1960s for designing automobile bodies
              at Renault, these curves have become fundamental tools in
              computer-aided design (CAD) and computer graphics.
            </p>
            <p className="mb-4 text-white">
              A Bezier curve is defined by a set of control points P₀ through
              Pₙ, where n is called the order of the curve (n=1 for linear, n=2
              for quadratic, n=3 for cubic, etc.). The first and last control
              points are always the endpoints of the curve, while intermediate
              control points generally do not lie on the curve.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Linear Bezier (n=1)</h3>
                <p>
                  A straight line between two points. The simplest form of a
                  Bezier curve.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Quadratic Bezier (n=2)</h3>
                <p>
                  Defined by three control points, creating a simple curve that
                  follows the influence of the middle control point.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Cubic Bezier (n=3)</h3>
                <p>
                  Defined by four control points, offering greater flexibility
                  and the most commonly used form in design applications.
                </p>
              </div>
            </div>
            <p className="text-white">
              What makes Bezier curves so valuable is their intuitive behavior
              and mathematical properties. They're smooth, easy to compute,
              invariant under affine transformations, and contained within the
              convex hull of their control points.
            </p>
          </div>
        </section>

        {/* Formula Section */}
        <section id="formula" className="mb-12">
          <div className="bg-black rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              The Mathematical Formula
            </h2>
            <p className="mb-4">
              A Bezier curve is mathematically defined using the Bernstein
              polynomial form. For a curve of degree n with control points P₀,
              P₁, ..., Pₙ, the formula is:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6 overflow-x-auto text-black">
              <p className="text-center text-lg font-mono">
                B(t) = Σ<sub>i=0</sub>
                <sup>n</sup> (ⁿᵢ)P<sub>i</sub>t<sup>i</sup>(1-t)<sup>n-i</sup>,
                where t ∈ [0,1]
              </p>
            </div>
            <p className="mb-4">
              The term (ⁿᵢ) is the binomial coefficient, calculated as
              n!/(i!(n-i)!), and represents the number of ways to choose i items
              from n items.
            </p>
            <p className="mb-4">
              The parameter t varies from 0 to 1, determining the position along
              the curve:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                When t = 0, B(0) = P₀ (the curve starts at the first control
                point)
              </li>
              <li>
                When t = 1, B(1) = Pₙ (the curve ends at the last control point)
              </li>
              <li>
                For values between 0 and 1, the curve smoothly transitions from
                start to end
              </li>
            </ul>
            <h3 className="text-xl font-semibold mb-3">
              Common Bezier Curve Formulas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Linear Bezier (n=1)</h4>
                <p className="mb-2 font-mono">B(t) = (1-t)P₀ + tP₁</p>
                <p>This is simply linear interpolation between two points.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Quadratic Bezier (n=2)</h4>
                <p className="mb-2 font-mono">
                  B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
                </p>
                <p>Creates a curve influenced by three control points.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Cubic Bezier (n=3)</h4>
                <p className="mb-2 font-mono">
                  B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
                </p>
                <p>The most commonly used form in graphics and design.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Higher-Degree Curves</h4>
                <p>
                  As the degree increases, the curve can become more complex but
                  also more computationally intensive to calculate.
                  Higher-degree curves are less common in practice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* De Casteljau's Algorithm Section */}
        <section id="deCasteljau" className="mb-12">
          <div className="bg-black rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              De Casteljau's Algorithm
            </h2>
            <p className="mb-4">
              While the Bernstein polynomial formula defines Bezier curves
              mathematically, De Casteljau's algorithm provides a more
              intuitive, geometric way to compute points on a Bezier curve. This
              algorithm is both numerically stable and visually intuitive.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2 text-black">
                Algorithm Steps:
              </h3>
              <ol className="list-decimal pl-6 text-black">
                <li className="mb-2">
                  Start with the n+1 control points P₀, P₁, ..., Pₙ
                </li>
                <li className="mb-2">
                  For a given parameter t between 0 and 1, compute a new set of
                  n points by linear interpolation between consecutive control
                  points: P'ᵢ = (1-t)Pᵢ + tPᵢ₊₁ for i = 0, 1, ..., n-1
                </li>
                <li className="mb-2">
                  Repeat this process on the new set of points, creating n-1
                  points from the n points
                </li>
                <li className="mb-2">
                  Continue this recursive process until only one point remains
                </li>
                <li>
                  This final point is exactly the point on the Bezier curve at
                  parameter t
                </li>
              </ol>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Pseudocode Implementation
                </h3>
                <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm">
                  <pre>{`function deCasteljau(points, t):
  if points.length == 1:
    return points[0]
  
  newPoints = []
  for i = 0 to points.length - 2:
    x = (1-t) * points[i].x + t * points[i+1].x
    y = (1-t) * points[i].y + t * points[i+1].y
    newPoints.push({x, y})
  
  return deCasteljau(newPoints, t)`}</pre>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-white">
                  Mathematical Expression
                </h3>
                <p className="mb-2 text-white">
                  The recursive formula for De Casteljau's algorithm can be
                  expressed as:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg text-black">
                  <p className="mb-2 font-mono">
                    P<sub>i</sub>
                    <sup>0</sup>(t) = P<sub>i</sub>
                  </p>
                  <p className="mb-2 font-mono">
                    P<sub>i</sub>
                    <sup>r</sup>(t) = (1-t)P<sub>i</sub>
                    <sup>r-1</sup>(t) + tP<sub>i+1</sub>
                    <sup>r-1</sup>(t)
                  </p>
                  <p className="mb-2 font-mono">
                    for r = 1,...,n and i = 0,...,n-r
                  </p>
                  <p className="font-mono">
                    B(t) = P<sub>0</sub>
                    <sup>n</sup>(t)
                  </p>
                </div>
              </div>
            </div>
            <p className="mb-4">
              The algorithm visualized in the interactive demo above shows
              exactly how De Casteljau's algorithm works. The colored lines
              represent the intermediate steps of the algorithm, with the final
              point (in red) being the point on the Bezier curve.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-black">
                Advantages of De Casteljau's Algorithm
              </h3>
              <ul className="list-disc pl-6 text-black">
                <li>
                  Numerically stable compared to direct evaluation of the
                  Bernstein polynomial
                </li>
                <li>
                  Provides an intuitive geometric interpretation of Bezier
                  curves
                </li>
                <li>Can be easily implemented in code</li>
                <li>
                  Naturally demonstrates how Bezier curves are contained within
                  the convex hull of their control points
                </li>
                <li>
                  Forms the basis for many other algorithms related to Bezier
                  curves (e.g., subdivision)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Properties Section */}
        <section id="properties" className="mb-12">
          <div className="bg-black rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Properties of Bezier Curves
            </h2>
            <p className="mb-4 ">
              Bezier curves have several important mathematical properties that
              make them useful and predictable for design applications:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-black">
              <div className="bg-blue-50 p-4 rounded-lg text-black">
                <h3 className="font-semibold mb-2">Endpoint Interpolation</h3>
                <p>
                  The curve always passes through the first and last control
                  points. For a curve of degree n:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>B(0) = P₀</li>
                  <li>B(1) = Pₙ</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Tangent Direction at Endpoints
                </h3>
                <p>
                  The tangent at the endpoints aligns with the line connecting
                  the endpoint to its adjacent control point:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>B'(0) points from P₀ to P₁</li>
                  <li>B'(1) points from Pₙ₋₁ to Pₙ</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Convex Hull Property</h3>
                <p>
                  The entire Bezier curve is contained within the convex hull
                  (the smallest convex shape) of its control points. This
                  provides predictable bounds for the curve.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Affine Invariance</h3>
                <p>
                  Applying an affine transformation (like translation, rotation,
                  scaling) to the control points produces the same result as
                  applying the transformation to the curve itself.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Variation Diminishing Property
                </h3>
                <p>
                  A Bezier curve never oscillates more than its control polygon.
                  This means the curve is smoother than the polyline formed by
                  its control points.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Invariance Under Barycentric Combinations
                </h3>
                <p>
                  The curve depends on the relative positions of control points
                  rather than their absolute positions, ensuring predictable
                  behavior in different coordinate systems.
                </p>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Limitations of Bezier Curves
            </h3>
            <div className="bg-red-50 p-4 rounded-lg mb-6 text-black">
              <ul className="list-disc pl-6">
                <li className="mb-2">
                  <strong>Global Influence:</strong> Moving any control point
                  affects the entire curve, making local edits difficult with a
                  single Bezier curve.
                </li>
                <li className="mb-2">
                  <strong>Degree Limitation:</strong> Higher-degree curves (with
                  many control points) become computationally intensive and
                  numerically unstable.
                </li>
                <li>
                  <strong>Limited Shape Range:</strong> Not all shapes can be
                  represented accurately with a single Bezier curve,
                  necessitating the use of multiple curves joined together
                  (e.g., splines).
                </li>
              </ul>
            </div>
            <p>
              To overcome these limitations, complex shapes typically use
              multiple Bezier curves connected together in what's known as a
              composite Bezier curve or spline, with various continuity
              constraints at the connecting points.
            </p>
          </div>
        </section>

        {/* Applications Section */}
        <section id="applications" className="mb-12">
          <div className="bg-black rounded-xl shadow-lg p-6 text-black">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Applications of Bezier Curves
            </h2>
            <p className="mb-4 text-white">
              Bezier curves have become a fundamental tool in various fields due
              to their intuitive control and predictable behavior. Here are some
              of their most important applications:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Computer Graphics</h3>
                <ul className="list-disc pl-6">
                  <li>Vector graphics representation</li>
                  <li>Path definition in SVG and PostScript</li>
                  <li>Shape morphing and animation</li>
                  <li>3D surface modeling (Bezier patches)</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Font Design</h3>
                <ul className="list-disc pl-6">
                  <li>TrueType and OpenType font outlines</li>
                  <li>Character glyph definitions</li>
                  <li>Scalable typography</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">CAD/CAM Systems</h3>
                <ul className="list-disc pl-6">
                  <li>Industrial design modeling</li>
                  <li>Automotive surface design</li>
                  <li>Aerospace component design</li>
                  <li>CNC machining path planning</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Animation</h3>
                <ul className="list-disc pl-6">
                  <li>Motion path definition</li>
                  <li>Easing functions for smooth transitions</li>
                  <li>Camera movement control</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Web Design</h3>
                <ul className="list-disc pl-6">
                  <li>CSS transitions and animations</li>
                  <li>SVG path definitions</li>
                  <li>Canvas drawing operations</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Scientific Visualization</h3>
                <ul className="list-disc pl-6">
                  <li>Smooth data interpolation</li>
                  <li>Curve fitting in statistical analysis</li>
                  <li>Trajectory planning in robotics</li>
                </ul>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">
              Real-World Examples
            </h3>
            <div className="mb-6 text-white">
              <p className="mb-4">
                Bezier curves are hidden in plain sight in many everyday
                technologies:
              </p>
              <ul className="list-disc pl-6">
                <li className="mb-2">
                  <strong>Design Software:</strong> Adobe Illustrator,
                  Photoshop, Inkscape, and almost all vector graphics programs
                  use Bezier curves as their fundamental drawing primitive.
                </li>
                <li className="mb-2">
                  <strong>Web Technologies:</strong> The CSS{" "}
                  <code>cubic-bezier()</code> function controls animation
                  timing, while SVG paths use Bezier curves for drawing shapes.
                </li>
                <li className="mb-2">
                  <strong>3D Modeling:</strong> Tools like Blender, Maya, and
                  3ds Max utilize Bezier curves and their 3D counterparts for
                  creating complex geometries.
                </li>
                <li>
                  <strong>Font Rendering:</strong> Every character you're
                  reading right now is likely defined using Bezier curves in the
                  font file.
                </li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Beyond Basic Bezier Curves</h3>
              <p className="mb-2">
                The fundamental concepts of Bezier curves have been extended to
                create more advanced curve and surface types:
              </p>
              <ul className="list-disc pl-6">
                <li>B-splines: Curves with local control properties</li>
                <li>
                  NURBS (Non-Uniform Rational B-Splines): Industry standard for
                  CAD/CAM
                </li>
                <li>
                  Subdivision surfaces: Used in movie special effects and
                  animation
                </li>
                <li>
                  Bezier patches: Extensions of Bezier curves to 3D surfaces
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
