import { useEffect, useState } from 'react'
import axios from 'axios'
import { logEvent } from '../lib/api'

type Article = { id: string; title: string; link: string; published: string; summary?: string }

export default function Reading() {
    const [articles, setArticles] = useState<Article[]>([])
    const [startAt, setStartAt] = useState<number | null>(null)

    useEffect(() => {
        axios.get('/api/resources/nhk-easy?limit=20').then(r => setArticles(r.data))
    }, [])

    const begin = () => setStartAt(Date.now())
    const finish = (article: Article) => {
        const minutes = startAt ? (Date.now() - startAt) / 60000 : 0.5
        logEvent('reading', Math.max(0.1, minutes), undefined, { article_id: article.id, title: article.title })
        setStartAt(null)
        window.open(article.link, '_blank')
    }

    return (
        <div className="space-y-4">
            <div className="alert">
                <span>NHK Easy latest articles. Click Begin to start a reading session, then Open to read.</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                {articles.map(a => (
                    <div className="card bg-base-100 shadow" key={a.id}>
                        <div className="card-body">
                            <h2 className="card-title">{a.title}</h2>
                            <p className="opacity-70">{a.published}</p>
                            <div className="card-actions justify-end">
                                <button className="btn" onClick={begin}>Begin</button>
                                <button className="btn btn-primary" onClick={() => finish(a)}>Open</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


