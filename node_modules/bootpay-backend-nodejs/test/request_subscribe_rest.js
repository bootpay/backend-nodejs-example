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
            response = await Bootpay.requestSubscribeBillingKey({
                orderId: (new Date()).getTime(),
                pg: 'nicepay',
                itemName: '정기결제 30일권',
                cardNo: '[ 카드 번호 ]',
                cardPw: '[ 카드 비밀번호 앞 2자리 ]',
                expireYear: '[ 카드 만료 연도 ]',
                expireMonth: '[ 카드 만료 월 ]',
                identifyNumber: '[ 카드 소유주 생년월일 혹은 법인 번호 ]',
                extra: {
                    subscribeTestPayment: 1 // 100원 결제 후 결제가 되면 billing key를 발행, 결제가 실패하면 에러
                }
            })
        } catch (e) {
            return console.log(e)
        }
        console.log(response)
    }
})()