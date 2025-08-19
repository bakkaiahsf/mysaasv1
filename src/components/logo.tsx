interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, showTagline = false, className = "" }: LogoProps) {
  const logoSizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  const taglineSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  // BRITSAI 3D-style "B" logo using CSS
  const BritsaiIcon = ({ className }: { className: string }) => (
    <div className={`relative ${className}`}>
      <div className="relative w-full h-full bg-gradient-to-br from-sky-400 via-blue-500 to-blue-700 rounded-lg transform perspective-1000 rotate-y-12 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-800/30 to-transparent rounded-lg"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-xl leading-none transform -skew-y-3">B</span>
        </div>
        <div className="absolute top-0 left-0 w-2 h-2 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-sm"></div>
      </div>
    </div>
  );

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BritsaiIcon className={logoSizeClasses[size]} />
      <div className="flex flex-col">
        {showText && (
          <span className={`font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 ${textSizeClasses[size]}`}>
            BRITSAI
          </span>
        )}
        {showTagline && showText && (
          <span className={`text-blue-600/70 font-medium ${taglineSizeClasses[size]} -mt-1`}>
            Your business. Only smoother
          </span>
        )}
      </div>
    </div>
  );
}