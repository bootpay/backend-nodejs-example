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
            response = await Bootpay.cancel({
                receiptId: '5b0df1b8e13f332c6c83df6a',
                price: 1000,
                name: '취소자명',
                reason: '취소합니다'                
            })
        } catch (e) {
            console.log(e)
            return
        }
        console.log(response)
    }
})()