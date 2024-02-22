import React from "react";

const BackgroundWithDynamicCircles = ({ children }) => {
  // Pattern properties
  const patternWidth = 700; // Adjust to spread out circles more
  const patternHeight = 700; // Adjust to spread out circles more

  // Generate circles with random radii and opacities
  const circles = Array.from({ length: 10 }, () => ({
    // Generate 10 circles, adjust as needed
    radius: Math.random() * 10 + 5, // Random radius between 5 and 15
    opacity: Math.random() * 0.5 + 0.25, // Random opacity between 0.25 and 0.75
    cx: Math.random() * patternWidth,
    cy: Math.random() * patternHeight,
  }));

  // Create an SVG pattern string including the circles
  const svgPattern = `
  <svg width="${patternWidth}" height="${patternHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#fff"/> ${circles
      .map(
        (circle) => `
    <circle cx="${circle.cx}" cy="${circle.cy}" r="${circle.radius}" fill="rgba(0,0,0,${circle.opacity})" />
    <text x="${circle.cx}" y="${circle.cy}" fill="white" font-size="${circle.radius}" text-anchor="middle" dominant-baseline="central">&#60;/&#62;</text>`
      )
      .join("")}
  </svg>
`;

  // Convert SVG pattern to a URL to use as a background image
  const svgUrl = `url('data:image/svg+xml;utf8,${encodeURIComponent(
    svgPattern
  )}')`;

  // Inline styles for the container using the SVG as a background
  const containerStyle = {
    // Ensure the pattern repeats
    backgroundImage: svgUrl,
  };

  return (
    <div
      className={`min-h-screen w-full bg-repeat relative bg-white flex items-center justify-center`}
      style={containerStyle}
    >
      {children}
    </div>
  );
};

export default BackgroundWithDynamicCircles;
