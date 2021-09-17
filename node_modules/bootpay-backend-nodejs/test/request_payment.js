(async () => {
    const Bootpay = require('../dist/bootpay').Bootpay
    Bootpay.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )
    const token = await Bootpay.getAccessToken()
    if (token.status === 200) {
        let result
        try {
            result = await Bootpay.requestPayment({
                pg: 'kcp',
                method: 'card',
                orderId: (new Date).getTime(),
                price: 1000,
                itemName: '테스트 부트페이 상품',
                returnUrl: 'https://dev-api.bootpay.co.kr/callback',
                extra: {
                    expire: 30
                }
            })
        } catch (e) {
            return console.log(e)
        }
        console.log(result)
    }
})()