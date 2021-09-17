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
            result = await Bootpay.requestUserToken({
                userId: 'gosomi'
            })
        } catch (e) {
            return console.log(e)
        }
        console.log(result)
    }
})()