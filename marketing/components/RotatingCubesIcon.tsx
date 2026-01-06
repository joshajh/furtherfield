"use client";

import { motion } from "framer-motion";

type RotatingCubesIconProps = {
  className?: string;
  size?: number;
};

export function RotatingCubesIcon({
  className = "",
  size = 200,
}: RotatingCubesIconProps) {
  return (
    <motion.div
      className={className}
      style={{ perspective: 1000 }}
      animate={{ rotateY: 360 }}
      transition={{
        duration: 8,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      <svg
        width={size}
        height={size * (709 / 743)}
        viewBox="0 0 743 709"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Lichen patterns for rearward faces */}
          <pattern id="lichen1_pattern" patternUnits="objectBoundingBox" width="1" height="1">
            <image href="/lichen/lichen-1.png" width="200" height="200" preserveAspectRatio="xMidYMid slice" />
          </pattern>
          <pattern id="lichen2_pattern" patternUnits="objectBoundingBox" width="1" height="1">
            <image href="/lichen/lichen-2.png" width="200" height="200" preserveAspectRatio="xMidYMid slice" />
          </pattern>
          <pattern id="lichen3_pattern" patternUnits="objectBoundingBox" width="1" height="1">
            <image href="/lichen/lichen-3.png" width="200" height="200" preserveAspectRatio="xMidYMid slice" />
          </pattern>
          <pattern id="lichen4_pattern" patternUnits="objectBoundingBox" width="1" height="1">
            <image href="/lichen/lichen-4.png" width="200" height="200" preserveAspectRatio="xMidYMid slice" />
          </pattern>

          {/* Keep vertical gradients for front faces */}
          <linearGradient
            id="paint2_linear_rotating"
            x1="463.675"
            y1="236.677"
            x2="463.675"
            y2="589.444"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BCE5F3" />
            <stop offset="1" stopColor="#D0D6FD" />
          </linearGradient>
          <linearGradient
            id="paint6_linear_rotating"
            x1="278.805"
            y1="236.677"
            x2="278.805"
            y2="589.444"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BCE5F3" />
            <stop offset="1" stopColor="#D0D6FD" />
          </linearGradient>
          <linearGradient
            id="paint8_linear_rotating"
            x1="278.805"
            y1="119.089"
            x2="278.805"
            y2="471.855"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BCE5F3" />
            <stop offset="1" stopColor="#D0D6FD" />
          </linearGradient>
          <linearGradient
            id="paint9_linear_rotating"
            x1="463.675"
            y1="119.089"
            x2="463.675"
            y2="471.855"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BCE5F3" />
            <stop offset="1" stopColor="#D0D6FD" />
          </linearGradient>
        </defs>

        {/* Bottom cube - bottom left face (rearward) */}
        <path
          d="M371.24 471.855L186.37 354.266V589.444L371.24 707.032V471.855Z"
          fill="url(#lichen1_pattern)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Bottom cube - bottom right face (rearward) */}
        <path
          d="M371.24 471.855L556.11 354.266V589.444L371.24 707.032V471.855Z"
          fill="url(#lichen2_pattern)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Bottom cube - top face outline */}
        <path
          d="M371.24 236.677L556.11 354.266L371.24 471.855L186.37 354.266L371.24 236.677Z"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Middle right cube - left face (front) */}
        <path
          d="M556.11 354.266L371.24 236.677V471.855L556.11 589.444V354.266Z"
          fill="url(#paint2_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Middle right cube - right face (rearward) */}
        <path
          d="M556.11 354.266L740.98 236.677V471.855L556.11 589.444V354.266Z"
          fill="url(#lichen3_pattern)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Middle right cube - top face (rearward) */}
        <path
          d="M556.11 119.089L740.98 236.677L556.11 354.266L371.24 236.677L556.11 119.089Z"
          fill="url(#lichen4_pattern)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Middle left cube - left face (rearward) */}
        <path
          d="M186.37 354.266L1.5 236.677V471.855L186.37 589.444V354.266Z"
          fill="url(#lichen1_pattern)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Middle left cube - right face (front) */}
        <path
          d="M186.37 354.266L371.24 236.677V471.855L186.37 589.444V354.266Z"
          fill="url(#paint6_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Middle left cube - top face (rearward) */}
        <path
          d="M186.37 119.089L371.24 236.677L186.37 354.266L1.5 236.677L186.37 119.089Z"
          fill="url(#lichen2_pattern)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Top cube - left face (front) */}
        <path
          d="M371.24 236.677L186.37 119.089V354.266L371.24 471.855V236.677Z"
          fill="url(#paint8_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Top cube - right face (front) */}
        <path
          d="M371.24 236.677L556.11 119.089V354.266L371.24 471.855V236.677Z"
          fill="url(#paint9_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Top cube - top face (rearward) */}
        <path
          d="M371.24 1.5L556.11 119.089L371.24 236.677L186.37 119.089L371.24 1.5Z"
          fill="url(#lichen3_pattern)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
