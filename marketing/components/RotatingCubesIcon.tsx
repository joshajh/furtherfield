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
        <path
          d="M371.24 471.855L186.37 354.266V589.444L371.24 707.032V471.855Z"
          fill="url(#paint0_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M371.24 471.855L556.11 354.266V589.444L371.24 707.032V471.855Z"
          fill="url(#paint1_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M371.24 236.677L556.11 354.266L371.24 471.855L186.37 354.266L371.24 236.677Z"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M556.11 354.266L371.24 236.677V471.855L556.11 589.444V354.266Z"
          fill="url(#paint2_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M556.11 354.266L740.98 236.677V471.855L556.11 589.444V354.266Z"
          fill="url(#paint3_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M556.11 119.089L740.98 236.677L556.11 354.266L371.24 236.677L556.11 119.089Z"
          fill="url(#paint4_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M186.37 354.266L1.5 236.677V471.855L186.37 589.444V354.266Z"
          fill="url(#paint5_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M186.37 354.266L371.24 236.677V471.855L186.37 589.444V354.266Z"
          fill="url(#paint6_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M186.37 119.089L371.24 236.677L186.37 354.266L1.5 236.677L186.37 119.089Z"
          fill="url(#paint7_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M371.24 236.677L186.37 119.089V354.266L371.24 471.855V236.677Z"
          fill="url(#paint8_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M371.24 236.677L556.11 119.089V354.266L371.24 471.855V236.677Z"
          fill="url(#paint9_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M371.24 1.5L556.11 119.089L371.24 236.677L186.37 119.089L371.24 1.5Z"
          fill="url(#paint10_linear_rotating)"
          stroke="black"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_rotating"
            x1="258.896"
            y1="41.7074"
            x2="-76.8694"
            y2="547.725"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#720A08" />
            <stop offset="0.389423" stopColor="#C29ABB" />
            <stop offset="0.620192" stopColor="#D0D6FD" />
            <stop offset="1" stopColor="#BEA6B0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_rotating"
            x1="443.766"
            y1="41.7074"
            x2="108"
            y2="547.725"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#720A08" />
            <stop offset="0.389423" stopColor="#C29ABB" />
            <stop offset="0.620192" stopColor="#D0D6FD" />
            <stop offset="1" stopColor="#BEA6B0" />
          </linearGradient>
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
            id="paint3_linear_rotating"
            x1="628.636"
            y1="-75.8813"
            x2="292.87"
            y2="430.136"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BEA6B0" />
            <stop offset="0.379808" stopColor="#BCE5F3" />
            <stop offset="0.610577" stopColor="#FFFCB9" />
            <stop offset="1" stopColor="#F6F7F9" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_rotating"
            x1="516.292"
            y1="-89.2838"
            x2="413.837"
            y2="373.931"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BEA6B0" />
            <stop offset="0.379808" stopColor="#BCE5F3" />
            <stop offset="0.610577" stopColor="#FFFCB9" />
            <stop offset="1" stopColor="#F6F7F9" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_rotating"
            x1="74.0259"
            y1="-75.8813"
            x2="-261.74"
            y2="430.136"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BEA6B0" />
            <stop offset="0.379808" stopColor="#BCE5F3" />
            <stop offset="0.610577" stopColor="#FFFCB9" />
            <stop offset="1" stopColor="#F6F7F9" />
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
            id="paint7_linear_rotating"
            x1="146.552"
            y1="-89.2838"
            x2="44.0973"
            y2="373.931"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BEA6B0" />
            <stop offset="0.379808" stopColor="#BCE5F3" />
            <stop offset="0.610577" stopColor="#FFFCB9" />
            <stop offset="1" stopColor="#F6F7F9" />
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
          <linearGradient
            id="paint10_linear_rotating"
            x1="331.422"
            y1="-206.872"
            x2="228.968"
            y2="256.342"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#BEA6B0" />
            <stop offset="0.379808" stopColor="#BCE5F3" />
            <stop offset="0.610577" stopColor="#FFFCB9" />
            <stop offset="1" stopColor="#F6F7F9" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
