const alphaVantageApiKey = 'IW05VRYODS72203T';
const fmpApiKey = 'ayteiZL2IhLm5IwAeZOQNZSKGFRuvBin';

async function getStockData(symbol) {
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${alphaVantageApiKey}`);
    const data = await response.json();
    return data['Global Quote'];
}


async function getHistoricalData(symbol) {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${fmpApiKey}`);
    const data = await response.json();
    return data.historical.reverse();
}

async function displayStockData(symbol) {
    const stockDataDiv = document.getElementById('stockData');
    const stockChartDiv = document.getElementById('stockChart');

    try {
        const realTimeData = await getStockData(symbol);

        const stockDataHTML = `
            <h2>Real-Time Stock Data for ${symbol}</h2>
            <p>Price: $${realTimeData['05. price']}</p>
            <p>Change: ${realTimeData['09. change']}</p>
            <p>Change Percent: ${realTimeData['10. change percent']}</p>
        `;
        stockDataDiv.innerHTML = stockDataHTML;

        const historicalData = await getHistoricalData(symbol);

        const labels = historicalData.map(item => item.date);
        const prices = historicalData.map(item => item.close);

        const ctx = stockChartDiv.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Historical Price',
                    data: prices,
                    borderColor: 'blue',
                    fill: false
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }]
                }
            }
        });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        stockDataDiv.innerHTML = '<p>Error fetching stock data. Please try again later.</p>';
        stockChartDiv.innerHTML = '';
    }
}

function searchStock() {
    const symbol = document.getElementById('stockInput').value.toUpperCase();
    if (symbol) {
        displayStockData(symbol);
    }
}