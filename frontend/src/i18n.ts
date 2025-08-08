import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
    en: {
        translation: {
            app_title: 'Japanese Learning',
            nav: {
                dashboard: 'Dashboard',
                flashcards: 'Flashcards',
                reading: 'Reading',
                listening: 'Listening',
                speaking: 'Speaking',
                handwriting: 'Handwriting',
                quizzes: 'Quizzes',
            },
            base_language: 'Base language',
            english: 'English',
            chinese: 'Chinese',
        },
    },
    zh: {
        translation: {
            app_title: '日语学习',
            nav: {
                dashboard: '仪表盘',
                flashcards: '抽认卡',
                reading: '阅读',
                listening: '听力',
                speaking: '口语',
                handwriting: '手写',
                quizzes: '测验',
            },
            base_language: '学习基准语言',
            english: '英语',
            chinese: '中文',
        },
    },
}

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
})

export default i18n


