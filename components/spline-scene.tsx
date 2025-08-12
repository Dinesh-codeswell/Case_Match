"use client"

import { useEffect, useRef } from "react"
import "@splinetool/runtime"

interface SplineSceneProps {
  sceneUrl: string
}

const SplineScene = ({ sceneUrl }: SplineSceneProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let splineApp: any = null

    const loadSpline = () => {
      if (typeof window !== "undefined" && canvasRef.current) {
        import("@splinetool/runtime")
          .then(({ Application }) => {
            if (canvasRef.current && !splineApp) {
              splineApp = new Application(canvasRef.current)
              splineApp.load(sceneUrl).catch((error: any) => {
                console.warn("Failed to load Spline scene:", error)
              })
            }
          })
          .catch((error) => {
            console.warn("Failed to load Spline runtime:", error)
          })
      }
    }

    // Add a small delay to ensure the component is mounted
    const timer = setTimeout(loadSpline, 100)

    return () => {
      clearTimeout(timer)
      if (splineApp) {
        try {
          splineApp.dispose()
        } catch (error) {
          console.warn("Error disposing Spline app:", error)
        }
      }
    }
  }, [sceneUrl])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{
        background: "transparent",
        outline: "none",
      }}
    />
  )
}

export default SplineScene
