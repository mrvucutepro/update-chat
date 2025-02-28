import ClientChat from './client-chat/index';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
    console.log('🛠 App.tsx được render');

    return (
        <Router>
            <Routes>
                <Route path="/" element={<ClientChat />} />
            </Routes>
        </Router>
    );
}
