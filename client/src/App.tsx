import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthComponent } from './auth';
import Chat from './client-chat';

export default function App() {
    console.log('🛠 App.tsx được render');

    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthComponent />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </Router>
    );
}
