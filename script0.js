// Sample data for Waste Trend
const wasteTrendData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
        label: 'Waste Generated (kg)',
        data: [300, 250, 270, 290, 310, 320, 330, 340, 360, 370, 390, 410],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4  // Adds the curve to the line (0.4 is a good value for a gentle curve)
    }]
};

// Waste Trend Line Chart
const ctxWasteTrend = document.getElementById('wasteTrendChart').getContext('2d');
const wasteTrendChart = new Chart(ctxWasteTrend, {
    type: 'line',
    data: wasteTrendData,
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Waste Generated (kg)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Month',
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.parsed.y + ' kg';
                    }
                }
            }
        }
    }
});


// last month area chart

const wasteEfficiencyData = {
    labels: ['Plastic', 'Organic', 'Metal', 'Paper', 'Glass', 'Textile'],
    datasets: [
        {
            label: 'Waste Efficiently Segregated (kg)',
            data: [20, 80, 50, 100, 30, 20], // Example data for waste types
            backgroundColor: 'rgba(75, 192, 192, 0.5)', // Area color
            borderColor: 'rgba(75, 192, 192, 1)', // Line color
            borderWidth: 1,
            fill: true, // Fill the area under the line
        },
        {
            label: 'Carbon Footprint Generated (kg CO2)',
            data: [30, 16, 30, 8, 6, 4], // Example data for carbon footprint per waste type
            backgroundColor: 'rgba(255, 99, 132, 0.5)', // Area color for carbon footprint
            borderColor: 'rgba(255, 99, 132, 1)', // Line color for carbon footprint
            borderWidth: 1,
            fill: true, // Fill the area under the line
        },
        {
            label: 'Target Waste (200 kg)',
            data: [200, 200, 200, 200, 200, 200], // Constant target line
            borderColor: 'rgba(0, 0, 0, 1)', // Color for the target line
            borderWidth: 2,
            fill: false, // Do not fill under the target line
            tension: 0, // Straight line
        }
    ]
};

const ctxWasteEfficiency = document.getElementById('wasteEfficiencyChart').getContext('2d');
const wasteEfficiencyChart = new Chart(ctxWasteEfficiency, {
    type: 'line', // Using line type for the area chart
    data: wasteEfficiencyData,
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Weight (kg)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Waste Type',
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const value = context.raw;
                        return `${label}: ${value} kg`;
                    }
                }
            }
        }
    }
});


// progess bar

// localStorage.clear();

let monthlyTarget = localStorage.getItem('monthlyTarget') || 0;
let totalGarbage = localStorage.getItem('totalGarbage') || 0;
let dailyInputs = JSON.parse(localStorage.getItem('dailyInputs')) || [];

const ctx = document.getElementById('progressChart').getContext('2d');
const progressChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: dailyInputs.map((_, index) => `Day ${index + 1}`),
        datasets: [{
            label: 'Daily Garbage Input (kg)',
            data: dailyInputs,
            fill: false,
            borderColor: 'green',
            stepped: true,
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

if (monthlyTarget > 0) {
    document.getElementById('target').value = monthlyTarget;
    updateProgressBar();
}

if (totalGarbage > 0) {
    totalGarbage = parseFloat(totalGarbage);
    updateProgressChart();
}

document.getElementById('setTargetBtn').addEventListener('click', function() {
    const targetInput = document.getElementById('target').value;
    monthlyTarget = parseFloat(targetInput);
    totalGarbage = 0; // Reset total when a new target is set
    dailyInputs = []; // Reset daily inputs
    localStorage.setItem('monthlyTarget', monthlyTarget);
    localStorage.setItem('totalGarbage', totalGarbage);
    localStorage.setItem('dailyInputs', JSON.stringify(dailyInputs));
    
    progressChart.data.labels = []; // Reset labels
    progressChart.data.datasets[0].data = []; // Reset data
    progressChart.update();
    document.getElementById('notification').innerText = ''; // Clear notification
});

document.getElementById('addInputBtn').addEventListener('click', function() {
    const dailyInput = document.getElementById('dailyInput').value;
    const dailyGarbage = parseFloat(dailyInput);

    if (!isNaN(dailyGarbage) && dailyGarbage > 0) {
        totalGarbage += dailyGarbage;
        dailyInputs.push(dailyGarbage);
        localStorage.setItem('totalGarbage', totalGarbage);
        localStorage.setItem('dailyInputs', JSON.stringify(dailyInputs));
        
        updateProgressChart();

        if (totalGarbage > monthlyTarget) {
            showExceededNotification();
        } else {
            document.getElementById('notification').innerText = ''; // Clear notification
        }
    } else {
        alert("Please enter a valid daily garbage amount.");
    }
});

function updateProgressChart() {
    progressChart.data.labels = dailyInputs.map((_, index) => `Day ${index + 1}`);
    progressChart.data.datasets[0].data = dailyInputs;
    progressChart.update();
}

function showExceededNotification() {
    const notification = document.getElementById('notification');
    notification.innerText = 'You have exceeded your monthly target!';
    alert('You have exceeded your monthly target!');
}


