import { useEffect, useRef, useState } from 'react'

export default function CanvasPad({ width = 400, height = 400 }: { width?: number; height?: number }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [drawing, setDrawing] = useState(false)
    const [last, setLast] = useState<{ x: number; y: number } | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.lineWidth = 8
        ctx.strokeStyle = '#111827'
    }, [])

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect()
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
        return { x: clientX - rect.left, y: clientY - rect.top }
    }

    const start = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault()
        setDrawing(true)
        setLast(getPos(e))
    }

    const move = (e: React.MouseEvent | React.TouchEvent) => {
        if (!drawing) return
        e.preventDefault()
        const pos = getPos(e)
        const ctx = canvasRef.current!.getContext('2d')!
        if (last) {
            ctx.beginPath()
            ctx.moveTo(last.x, last.y)
            ctx.lineTo(pos.x, pos.y)
            ctx.stroke()
        }
        setLast(pos)
    }

    const end = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault()
        setDrawing(false)
        setLast(null)
    }

    const clear = () => {
        const ctx = canvasRef.current!.getContext('2d')!
        ctx.clearRect(0, 0, width, height)
    }

    return (
        <div className="space-y-2">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="border rounded bg-white"
                onMouseDown={start}
                onMouseMove={move}
                onMouseUp={end}
                onMouseLeave={end}
                onTouchStart={start}
                onTouchMove={move}
                onTouchEnd={end}
            />
            <button className="btn" onClick={clear}>Clear</button>
        </div>
    )
}


