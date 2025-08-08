import { useState } from 'react'
import axios from 'axios'

type Card = {
    front: string
    back: string
    reading?: string
    example?: string
    example_translation?: string
}

export default function Flashcards() {
    const [cards, setCards] = useState<Card[]>([])
    const [level, setLevel] = useState('N5')
    const [baseLang, setBaseLang] = useState<'en' | 'zh'>('en')
    const [topic, setTopic] = useState('')
    const [idx, setIdx] = useState(0)
    const [showBack, setShowBack] = useState(false)
    const [loading, setLoading] = useState(false)

    const load = async () => {
        setLoading(true)
        const res = await axios.post('/api/ai/generate_flashcards', {
            jlpt_level: level,
            base_language: baseLang,
            topic: topic || undefined,
            num_cards: 12,
        })
        setCards(res.data.cards)
        setIdx(0)
        setShowBack(false)
        setLoading(false)
    }

    const next = () => setIdx(i => Math.min(i + 1, cards.length - 1))
    const prev = () => setIdx(i => Math.max(i - 1, 0))

    const current = cards[idx]

    return (
        <div className="space-y-4">
            <div className="flex gap-2 items-end">
                <label className="form-control">
                    <span className="label-text">JLPT</span>
                    <select className="select select-bordered" value={level} onChange={e => setLevel(e.target.value)}>
                        {['N5', 'N4', 'N3', 'N2', 'N1'].map(l => <option key={l}>{l}</option>)}
                    </select>
                </label>
                <label className="form-control">
                    <span className="label-text">Base</span>
                    <select className="select select-bordered" value={baseLang} onChange={e => setBaseLang(e.target.value as any)}>
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                    </select>
                </label>
                <label className="form-control">
                    <span className="label-text">Topic</span>
                    <input className="input input-bordered" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. travel" />
                </label>
                <button className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`} onClick={load}>Generate</button>
            </div>

            {current && (
                <div className="card bg-base-100 shadow">
                    <div className="card-body items-center text-center">
                        <h2 className="card-title">{showBack ? current.back : current.front}</h2>
                        {!showBack && current.reading && <div className="opacity-70">{current.reading}</div>}
                        {showBack && (
                            <div className="space-y-2">
                                {current.example && <div><span className="font-bold">例:</span> {current.example}</div>}
                                {current.example_translation && <div className="opacity-70">{current.example_translation}</div>}
                            </div>
                        )}
                        <div className="card-actions justify-between w-full">
                            <button className="btn" onClick={prev}>Prev</button>
                            <button className="btn btn-accent" onClick={() => setShowBack(s => !s)}>{showBack ? 'Front' : 'Back'}</button>
                            <button className="btn" onClick={next}>Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


