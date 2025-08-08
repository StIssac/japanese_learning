import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Dashboard from './pages/Dashboard'
import Flashcards from './pages/Flashcards'
import Reading from './pages/Reading'
import Listening from './pages/Listening'
import Speaking from './pages/Speaking'
import Handwriting from './pages/Handwriting'
import Quizzes from './pages/Quizzes'

export default function App() {
    const { t, i18n } = useTranslation()
    const [theme, setTheme] = useState('cyberpunk')

    const onLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(e.target.value)
    }

    return (
        <div data-theme={theme} className="min-h-screen">
            <div className="navbar bg-base-100 shadow">
                <div className="flex-1">
                    <Link to="/" className="btn btn-ghost text-xl">{t('app_title')}</Link>
                </div>
                <div className="flex-none gap-2">
                    <select className="select select-bordered" onChange={onLangChange} defaultValue={i18n.language}>
                        <option value="en">{t('english')}</option>
                        <option value="zh">{t('chinese')}</option>
                    </select>
                    <select className="select select-bordered" onChange={(e) => setTheme(e.target.value)} defaultValue={theme}>
                        <option>light</option>
                        <option>dark</option>
                        <option>cupcake</option>
                        <option>emerald</option>
                        <option>synthwave</option>
                        <option>cyberpunk</option>
                    </select>
                </div>
            </div>

            <div className="drawer lg:drawer-open">
                <input id="drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content p-4">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/flashcards" element={<Flashcards />} />
                        <Route path="/reading" element={<Reading />} />
                        <Route path="/listening" element={<Listening />} />
                        <Route path="/speaking" element={<Speaking />} />
                        <Route path="/handwriting" element={<Handwriting />} />
                        <Route path="/quizzes" element={<Quizzes />} />
                    </Routes>
                </div>
                <div className="drawer-side">
                    <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 min-h-full w-64 p-4">
                        <li><Link to="/">{t('nav.dashboard')}</Link></li>
                        <li><Link to="/flashcards">{t('nav.flashcards')}</Link></li>
                        <li><Link to="/reading">{t('nav.reading')}</Link></li>
                        <li><Link to="/listening">{t('nav.listening')}</Link></li>
                        <li><Link to="/speaking">{t('nav.speaking')}</Link></li>
                        <li><Link to="/handwriting">{t('nav.handwriting')}</Link></li>
                        <li><Link to="/quizzes">{t('nav.quizzes')}</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}


