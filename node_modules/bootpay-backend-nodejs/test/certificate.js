(async () => {
    const RestClient = require('../dist/bootpay').Bootpay
    RestClient.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )
    let token = await RestClient.getAccessToken()
    if (token.status === 200) {
        let response
        try {
            response = await RestClient.certificate('1234')
        } catch (e) {
            return console.log(e)
        }
        console.log(response)
    }
})()