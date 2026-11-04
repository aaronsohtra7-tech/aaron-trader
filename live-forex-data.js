// AARON TRADER - Live Forex Data Module
// Data source: BiQuote (MT5 broker feed)
// This module does not modify the existing app.

(function () {
    "use strict";

    const BASE_URL = "https://biquote.io/api";

    const PAIRS = {
        "EUR/USD": "EURUSD",
        "GBP/USD": "GBPUSD",
        "USD/JPY": "USDJPY",
        "USD/CHF": "USDCHF",
        "AUD/USD": "AUDUSD",
        "USD/CAD": "USDCAD"
    };

    const TIMEFRAMES = {
        "1 Minute": "1m",
        "5 Minutes": "5m",
        "15 Minutes": "15m",
        "30 Minutes": "30m",
        "1 Hour": "1h",
        "4 Hours": "4h"
    };

    async function requestJSON(url) {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Market data error: HTTP " + response.status);
        }

        return response.json();
    }

    async function getCandles(pair, timeframe, limit = 200) {
        const symbol = PAIRS[pair] || pair;
        const interval = TIMEFRAMES[timeframe] || timeframe;

        if (!Object.values(PAIRS).includes(symbol)) {
            throw new Error("Unsupported Forex pair: " + pair);
        }

        if (!Object.values(TIMEFRAMES).includes(interval)) {
            throw new Error("Unsupported timeframe: " + timeframe);
        }

        const url =
            `${BASE_URL}/${symbol}/ohlc?interval=${interval}&limit=${limit}`;

        const data = await requestJSON(url);

        if (!data || !Array.isArray(data.bars)) {
            throw new Error("Invalid candle data received");
        }

        return {
            symbol: data.symbol,
            interval: data.interval,
            bars: data.bars
        };
    }

    async function getQuote(pair) {
        const symbol = PAIRS[pair] || pair;

        if (!Object.values(PAIRS).includes(symbol)) {
            throw new Error("Unsupported Forex pair: " + pair);
        }

        const data = await requestJSON(`${BASE_URL}/${symbol}`);

        if (!Number.isFinite(data.mid)) {
            throw new Error("Invalid Forex price received");
        }

        return data;
    }

    window.AaronLiveForexData = {
        getCandles,
        getQuote,
        pairs: Object.keys(PAIRS),
        timeframes: Object.keys(TIMEFRAMES)
    };

})();
