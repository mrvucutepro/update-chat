import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthComponent } from './components/AuthComponent';
import Chat from './components/ClientChat';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthComponent />} />
                <Route path="/chat-client" element={<Chat />} />
            </Routes>
        </Router>
    );
}
