import React from "react";

/**
 * Custom background wrapper component that applies a background image
 * and an opacity level using Tailwind CSS.
 *
 * @param {string} bgImageUrl - The URL of the background image.
 * @param {number} opacity - The opacity level of the background image (0 to 1).
 * @param {React.ReactNode} children - The child components to be rendered inside the wrapper.
 */
const BackgroundWrapper = ({ bgImageUrl, opacity = 0.7, children }) => {
  // Convert opacity to a Tailwind CSS compatible class
  const opacityClass = `bg-opacity-${Math.round(opacity * 100)}`;

  return (
    <div className="relative">
      {/* Background layer with controlled opacity */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: opacity, // Apply opacity to the background image only
        }}
      ></div>

      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
