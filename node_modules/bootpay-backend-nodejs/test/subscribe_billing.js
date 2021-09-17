(async () => {
    const Bootpay = require('../dist/bootpay').Bootpay
    Bootpay.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )
    let token = await Bootpay.getAccessToken()
    if (token.status === 200) {
        let response
        try {
            response = await Bootpay.requestSubscribeBillingPayment({
                billingKey: '5f97b8a40f606f03e8ab32a0',
                itemName: '테스트',
                price: 1000,
                orderId: (new Date()).getTime(),
                feedbackUrl: 'https://dev-api.bootpay.co.kr/callback',
                feedbackContentType: 'json'
            })
        } catch (e) {
            return console.log(e)
        }
        console.log(response)
    }
})()