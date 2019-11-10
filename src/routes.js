import App from './App'
import QR from './components/QR'
import Loading from './components/Loading'

export default [
    {
        path: '/', component: App,
        children: [
            { path: '', component: QR },
            { path: 'loading', component: Loading },
        ]
    }
]