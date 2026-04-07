import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminStatsChart = () => {
    const [stats, setStats] = useState({
        posts: { total: 0, approved: 0, pending: 0, rejected: 0, draft: 0 },
        users: { total: 0, banned: 0 },
        comments: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const res = await axios.get('http://localhost:5094/api/Admin/statistics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
                console.log("📊 Dữ liệu thống kê:", res.data);
            } catch (error) {
                console.error('❌ Lỗi lấy thống kê:', error);
            }
        };

        fetchStats();
    }, []);

    const data = {
        labels: [
            'Tổng bài viết',
            'Đã duyệt',
            'Chờ duyệt',
            'Từ chối',
            'Bản nháp',
            'Bình luận',
            'Người dùng',
            'Bị cấm'
        ],
        datasets: [
            {
                label: 'Số lượng',
                data: [
                    stats.posts.total,
                    stats.posts.approved,
                    stats.posts.pending,
                    stats.posts.rejected,
                    stats.posts.draft,
                    stats.comments,
                    stats.users.total,
                    stats.users.banned
                ],
                backgroundColor: [
                    '#4e73df',
                    '#1cc88a',
                    '#f6c23e',
                    '#e74a3b',
                    '#858796',
                    '#36b9cc',
                    '#20c997',
                    '#fd7e14'
                ],
                borderRadius: 12,
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        animation: { duration: 1000 },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    font: { size: 14 }
                },
                grid: { color: '#e0e0e0' }
            },
            x: {
                ticks: { font: { size: 14 } },
                grid: { display: false }
            }
        }
    };

    return (
        <div className="card shadow-sm p-4 mb-4">
            <h5 className="fw-bold mb-3 text-primary">📊 Thống kê tổng quan</h5>
            <Bar data={data} options={options} />
        </div>
    );
};

export default AdminStatsChart;
