import React, { useEffect, useState } from 'react';

interface LoadingPageProps {
  onLoadingComplete: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onLoadingComplete, 800);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-sky-blue via-blue-400 to-navy transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        {/* Airplane Image Card */}
        <div className="relative mb-8 inline-block">
          <div className="animate-float rounded-3xl bg-white p-8 shadow-2xl">
            <img
              src="https://i.ibb.co/4Rn2R3Jw/plane-flight-route-pin-travel-illustration-airplane-fly-set-line-pin-airplane-790651-1223.jpg"
              alt="Flight"
              className="h-48 w-48 object-contain"
            />
          </div>
          {/* Floating effect shadow */}
          <div className="absolute -bottom-4 left-1/2 h-4 w-3/4 -translate-x-1/2 transform rounded-full bg-black/20 blur-xl"></div>
        </div>

        {/* Loading Text */}
        <h2 className="mb-6 text-3xl font-bold text-white">
          Preparing your flight...
        </h2>

        {/* Progress Bar */}
        <div className="mx-auto w-64">
          <div className="h-2 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-3 text-sm text-white/90">{progress}%</p>
        </div>

        {/* Pulsing Indicators */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-white delay-0"></div>
          <div className="h-3 w-3 animate-pulse rounded-full bg-white delay-150"></div>
          <div className="h-3 w-3 animate-pulse rounded-full bg-white delay-300"></div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-150 {
          animation-delay: 150ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
