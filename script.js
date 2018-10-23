(function () {

    const APIPATH = 'https://api.exchangeratesapi.io/latest';

    const getLatestRates = (path, base, symbols) => fetch(`${path}?base=${base}&symbols=${symbols.join(',')}`)
        .then(data => data.json())
        .then(d => d && d.rates ? d.rates : {});

    const getStrangeCurrencyName = symbol => {
        const nameMap = {
            RUB: 'rubles',
            EUR: 'euros',
            USD: 'US dollars',
            GBP: 'pounds',
            JPY: 'yens'
        };
        return nameMap[symbol] || symbol;
    };

    const convertSum = (sum, base, symbols) => getLatestRates(APIPATH, base, symbols)
        .then(rates => symbols.reduce((res, nextSymbol) => {
            res[getStrangeCurrencyName(nextSymbol)] = sum * rates[nextSymbol]
            return res;
        }, {}));

    const selectedCart = [
        { price: 20 },
        { price: 45 },
        { price: 67 },
        { price: 1305 }
    ];

    document.getElementById('cart-json').innerHTML = JSON.stringify(selectedCart, null, 2);

    Promise.resolve(selectedCart.reduce((a, b) => a + b.price, 0))
        .then(sum => convertSum(sum, 'USD', ['RUB', 'EUR', 'USD', 'GBP', 'JPY']))
        .then(totalCartPrice => {
            document.getElementById('result-json').innerHTML = JSON.stringify(totalCartPrice, null, 2);
        });

})();