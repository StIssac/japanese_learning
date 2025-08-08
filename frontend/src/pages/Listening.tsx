import { useState } from 'react'
import axios from 'axios'
import { logEvent } from '../lib/api'
import { playBase64Audio } from '../lib/audio'

export default function Listening() {
    const [text, setText] = useState('おはようございます。今日はいい天気ですね。')
    const [playing, setPlaying] = useState(false)

    const speak = async () => {
        setPlaying(true)
        const res = await axios.post('/api/ai/text_to_speech', new URLSearchParams({ text }))
        playBase64Audio(res.data.audio_base64)
        logEvent('listening', 0.2, undefined, { text_length: text.length })
        setPlaying(false)
    }

    return (
        <div className="space-y-4">
            <textarea className="textarea textarea-bordered w-full h-40" value={text} onChange={e => setText(e.target.value)} />
            <button className={`btn btn-primary ${playing ? 'btn-disabled' : ''}`} onClick={speak}>Play</button>
        </div>
    )
}


