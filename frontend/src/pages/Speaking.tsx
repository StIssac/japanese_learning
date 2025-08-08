import { useState } from 'react'
import axios from 'axios'
import { logEvent } from '../lib/api'
import { recordAudio } from '../lib/audio'

export default function Speaking() {
    const [transcript, setTranscript] = useState('')
    const [recording, setRecording] = useState(false)

    const start = async () => {
        setRecording(true)
        const blob = await recordAudio(10)
        setRecording(false)
        const form = new FormData()
        form.append('file', blob, 'audio.webm')
        const res = await axios.post('/api/ai/speech_to_text', form, { headers: { 'Content-Type': 'multipart/form-data' } })
        const text = res.data.transcript as string
        setTranscript(text)
        // Naive score: non-empty then 100
        const score = text.trim() ? 100 : 0
        logEvent('speaking', 0.2, score, { length: text.length })
    }

    return (
        <div className="space-y-4">
            <button className={`btn btn-primary ${recording ? 'loading' : ''}`} onClick={start}>{recording ? 'Recording…' : 'Record 10s'}</button>
            <div className="mockup-code">
                <pre data-prefix=">"><code>{transcript || 'Transcript will appear here.'}</code></pre>
            </div>
        </div>
    )
}


