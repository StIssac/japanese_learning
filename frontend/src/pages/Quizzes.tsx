import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { logEvent } from '../lib/api'

type Card = { front: string; back: string }
type Q = { question: string; choices: string[]; answer: string }

function makeQuiz(cards: Card[]): Q[] {
    const qs: Q[] = []
    for (const card of cards.slice(0, 8)) {
        const wrong = cards
            .filter(c => c.back !== card.back)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(c => c.back)
        const choices = [...wrong, card.back].sort(() => 0.5 - Math.random())
        qs.push({ question: card.front, choices, answer: card.back })
    }
    return qs
}

export default function Quizzes() {
    const [qs, setQs] = useState<Q[]>([])
    const [i, setI] = useState(0)
    const [score, setScore] = useState(0)
    const [start, setStart] = useState<number | null>(null)

    useEffect(() => {
        const load = async () => {
            const r = await axios.post('/api/ai/generate_flashcards', { jlpt_level: 'N5', base_language: 'en', num_cards: 20 })
            const cards: Card[] = r.data.cards.map((c: any) => ({ front: c.front, back: c.back }))
            setQs(makeQuiz(cards))
            setStart(Date.now())
        }
        load()
    }, [])

    const current = qs[i]

    const pick = (choice: string) => {
        if (!current) return
        if (choice === current.answer) setScore(s => s + 1)
        if (i + 1 < qs.length) setI(i + 1)
        else {
            const minutes = start ? (Date.now() - start) / 60000 : 0.5
            const pct = Math.round((score / qs.length) * 100)
            logEvent('quiz', Math.max(0.1, minutes), pct, { total: qs.length, correct: score })
        }
    }

    return (
        <div className="space-y-4">
            {current ? (
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <div className="text-xl font-bold">{current.question}</div>
                        <div className="grid md:grid-cols-2 gap-2 mt-2">
                            {current.choices.map(c => (
                                <button key={c} className="btn" onClick={() => pick(c)}>{c}</button>
                            ))}
                        </div>
                        <div className="opacity-70">{i + 1}/{qs.length}</div>
                    </div>
                </div>
            ) : (
                <div className="alert">
                    <span>Quiz complete. Score: {score}/{qs.length}</span>
                </div>
            )}
        </div>
    )
}


