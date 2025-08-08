import CanvasPad from '../components/CanvasPad'
import { useRef, useState } from 'react'
import { logEvent } from '../lib/api'

export default function Handwriting() {
    const [started, setStarted] = useState<number | null>(null)
    const onBegin = () => setStarted(Date.now())
    const onFinish = () => {
        const minutes = started ? (Date.now() - started) / 60000 : 0.2
        logEvent('handwriting', Math.max(0.1, minutes))
        setStarted(null)
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <button className="btn" onClick={onBegin}>Begin</button>
                <button className="btn btn-primary" onClick={onFinish}>Finish</button>
            </div>
            <CanvasPad width={500} height={500} />
            <div className="alert">
                <span>Practice kana or kanji strokes. Tip: copy a character from reading and trace it multiple times.</span>
            </div>
        </div>
    )
}


