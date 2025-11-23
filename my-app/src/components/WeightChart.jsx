import { Line } from 'react-chartjs-2';

export default function WeightChart({ healthRecords, isDark }) {
    // 최근 8개 기록만 사용
    const recentRecords = healthRecords.slice(0, 8).reverse();

    const data = {
        labels: recentRecords.map((record, idx) => {
            if (idx === 0) return '시작';
            if (idx === recentRecords.length - 1) return '현재';
            return '';
        }),
        datasets: [
            {
                label: '체중 (kg)',
                data: recentRecords.map(r => r.weight_kg),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: 'rgb(34, 197, 94)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                titleColor: isDark ? '#fff' : '#000',
                bodyColor: isDark ? '#fff' : '#000',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return `${context.parsed.y} kg`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: Math.min(...recentRecords.map(r => r.weight_kg)) - 1,
                max: Math.max(...recentRecords.map(r => r.weight_kg)) + 1,
                grid: {
                    color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    color: isDark ? '#9CA3AF' : '#6B7280',
                    callback: function (value) {
                        return value + ' kg';
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: isDark ? '#9CA3AF' : '#6B7280',
                }
            }
        }
    };

    return (
        <div className="h-48">
            <Line data={data} options={options} />
        </div>
    );
}
