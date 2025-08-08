import { useEffect, useState } from 'react'
import axios from 'axios'

type Daily = {
    date: string
    total_minutes: number
    activities: Record<string, number>
    average_score?: number | null
}

export default function Dashboard() {
    const [data, setData] = useState<Daily[]>([])
    const [streak, setStreak] = useState(0)

    useEffect(() => {
        axios.get('/api/progress/daily?days=14').then(r => setData(r.data))
        axios.get('/api/progress/streak').then(r => setStreak(r.data.streak_days))
    }, [])

    return (
        <div className="space-y-4">
            <div className="stats shadow">
                <div className="stat">
                    <div className="stat-title">Current streak</div>
                    <div className="stat-value">{streak} d</div>
                    <div className="stat-desc">Keep it up!</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Last day minutes</div>
                    <div className="stat-value">{data.at(-1)?.total_minutes ?? 0}</div>
                    <div className="stat-desc">Across all activities</div>
                </div>
            </div>

            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title">Daily minutes</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr><th>Date</th><th>Total</th><th>By activity</th><th>Avg score</th></tr>
                            </thead>
                            <tbody>
                                {data.map(d => (
                                    <tr key={d.date}>
                                        <td>{d.date}</td>
                                        <td>{d.total_minutes}</td>
                                        <td>
                                            {Object.entries(d.activities).map(([k, v]) => (
                                                <div key={k} className="badge badge-outline mr-2">{k}: {v}</div>
                                            ))}
                                        </td>
                                        <td>{d.average_score ?? '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}


