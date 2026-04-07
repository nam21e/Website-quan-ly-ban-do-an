import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/ChatBotBox.css';

const ChatBotBox = () => {
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const bottomRef = useRef(null);

    const handleSend = async () => {
        if (!message.trim()) return;
        const userMsg = { role: 'user', content: message };
        setLoading(true);
        try {
            const res = await axios.post('/api/chatbot', { message });
            setHistory(prev => [...prev, userMsg, { role: 'bot', content: res.data.reply }]);
            setMessage('');
        } catch {
            setHistory(prev => [...prev, userMsg, { role: 'bot', content: '❌ Lỗi khi kết nối. Vui lòng thử lại.' }]);
        }
        setLoading(false);
    };

    const handleToggle = () => {
        setShow(prev => {
            if (!prev && history.length === 0) {
                setHistory([
                    { role: 'bot', content: '👋 Xin chào! Tôi là TheFoodsAI – trợ lý ẩm thực của bạn. Hãy nhập khẩu vị, vùng miền hoặc nguyên liệu để được gợi ý món ăn nhé.' }
                ]);
            }
            return !prev;
        });
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    return (
        <div className={`chatbot-container ${show ? 'active' : ''}`}>
            <div className="chatbot-toggle" onClick={handleToggle}>
                💬 Chatbot
            </div>

            {show && (
                <div className="chatbot-box shadow">
                    <div className="chatbot-header bg-primary text-white px-3 py-2 fw-bold rounded-top">
                        🍽️ TheFoodsAI – Tư vấn món ăn
                    </div>
                    <div className="chatbot-history px-3 py-2">
                        {history.map((msg, i) => (
                            <div key={i} className={`chat-msg ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}
                        {loading && (
                            <div className="chat-msg bot typing">
                                TheFoodsAI đang trả lời<span className="dots"><span>.</span><span>.</span><span>.</span></span>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                    <div className="chatbot-input d-flex border-top">
                        <input
                            className="form-control border-0"
                            placeholder="Ví dụ: món ăn miền Bắc, ngọt, chay..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className="btn btn-primary" onClick={handleSend} disabled={loading}>
                            {loading ? '...' : 'Gửi'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBotBox;
