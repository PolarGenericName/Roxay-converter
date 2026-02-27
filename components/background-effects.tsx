"use client"

export function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(265,40%,8%)] via-[hsl(260,30%,6%)] to-[hsl(270,25%,4%)]" />

      {/* Floating shapes */}
      <div
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{
          background: "linear-gradient(135deg, hsl(265 80% 50%), hsl(195 85% 55%))",
          animation: "float 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-15 blur-3xl"
        style={{
          background: "linear-gradient(135deg, hsl(280 85% 55%), hsl(265 80% 50%))",
          animation: "float 30s ease-in-out infinite",
          animationDelay: "-5s",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-64 w-64 rounded-full opacity-10 blur-3xl"
        style={{
          background: "linear-gradient(135deg, hsl(265 80% 50%), hsl(280 85% 55%))",
          animation: "float 20s ease-in-out infinite",
          animationDelay: "-10s",
        }}
      />
      <div
        className="absolute right-1/4 top-1/3 h-48 w-48 rounded-full opacity-10 blur-3xl"
        style={{
          background: "linear-gradient(135deg, hsl(195 85% 55%), hsl(265 80% 50%))",
          animation: "float 35s ease-in-out infinite",
          animationDelay: "-15s",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(265 80% 50% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(265 80% 50% / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  )
}
