"use client"

import { useEffect, useRef } from "react"
import { Sparkles } from "./sparkles"

export function CloudBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const clouds = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 150 + Math.random() * 200,
      height: 80 + Math.random() * 100,
      speed: 0.1 + Math.random() * 0.3,
      opacity: 0.15 + Math.random() * 0.15,
    }))

    function drawCloud(x: number, y: number, width: number, height: number, opacity: number) {
      if (!ctx) return
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.fillStyle = "white"

      // Draw cloud shape with circles
      ctx.beginPath()
      ctx.arc(x, y, height / 2, 0, Math.PI * 2)
      ctx.arc(x + width / 4, y - height / 3, height / 2.5, 0, Math.PI * 2)
      ctx.arc(x + width / 2, y - height / 4, height / 2.2, 0, Math.PI * 2)
      ctx.arc(x + (3 * width) / 4, y, height / 2.5, 0, Math.PI * 2)
      ctx.arc(x + width, y, height / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      clouds.forEach((cloud) => {
        drawCloud(cloud.x, cloud.y, cloud.width, cloud.height, cloud.opacity)
        cloud.x += cloud.speed

        if (cloud.x > canvas.width + cloud.width) {
          cloud.x = -cloud.width
          cloud.y = Math.random() * canvas.height
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-b from-pink-200 via-peach-200 to-purple-200 -z-10" />
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />
      <Sparkles />
    </>
  )
}
