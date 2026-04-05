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
        const text = message.trim();
        if (!text || loading) return;

        const userMsg = { role: 'user', content: text };
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5094/api/ChatBot', { message: text });

            setHistory(prev => [
                ...prev,
                userMsg,
                { role: 'bot', content: res.data.reply }
            ]);
            setMessage('');
        } catch (err) {
            console.error('Chat error:', err);
            setHistory(prev => [
                ...prev,
                userMsg,
                { role: 'bot', content: '❌ Lỗi khi kết nối server. Vui lòng thử lại sau.' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        setShow(prev => {
            if (!prev && history.length === 0) {
                setHistory([
                    {
                        role: 'bot',
                        content:
                            '👋 Xin chào! Tôi là TheFoodsAI – trợ lý ẩm thực của bạn. Hãy nhập khẩu vị, vùng miền hoặc nguyên liệu để được gợi ý món ăn nhé.'
                    }
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
            {/* Nút tròn mở/đóng chat */}
            <div className="chatbot-toggle" onClick={handleToggle}>
                <span className="chatbot-toggle-icon">💬</span>
                <span className="chatbot-toggle-text">Hỏi đáp</span>
            </div>

            {show && (
                <div className="chatbot-box shadow">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-icon">🥗</div>
                        <div className="chatbot-header-text">
                            <div className="chatbot-header-title">TheFoods</div>
                            <div className="chatbot-header-subtitle">Tư vấn món ăn theo khẩu vị</div>
                        </div>
                    </div>

                    {/* Lịch sử chat */}
                    <div className="chatbot-history">
                        {history.map((msg, i) => (
                            <div key={i} className={`chat-msg ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}

                        {loading && (
                            <div className="chat-msg bot typing">
                                TheFoodsAI đang trả lời
                                <span className="dots">
                                    <span>.</span>
                                    <span>.</span>
                                    <span>.</span>
                                </span>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Ô nhập */}
                    <div className="chatbot-input">
                        <input
                            className="chatbot-input-box"
                            placeholder="Ví dụ: món ăn miền Bắc, ngọt, chay..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            className="btn-chat-send"
                            onClick={handleSend}
                            disabled={loading}
                        >
                            {loading ? '...' : 'Gửi'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBotBox;
