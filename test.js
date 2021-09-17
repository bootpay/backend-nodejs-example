// 1. 토큰 발급
async function getAccessToken() { 
    const Bootpay = require('bootpay-backend-nodejs').Bootpay
    Bootpay.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )    
    try {
        let response = await Bootpay.getAccessToken()
        console.log(response)
    } catch(e) {
        console.log(e)
    }
};

// 2. 결제 검증 
async function verify() {
    const Bootpay = require('bootpay-backend-nodejs').Bootpay
    Bootpay.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )
    const token = await Bootpay.getAccessToken()
    if (token.status === 200) {
        let result
        try {
            result = await Bootpay.verify('612df0250d681b001de61de6')
        } catch (e) {
            return console.log(e)
        }
        console.log(result)
    }
}


// 3. 결제 취소 (전액 취소 / 부분 취소)
async function cancel() {
    const Bootpay = require('bootpay-backend-nodejs').Bootpay
    Bootpay.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )
    let token = await Bootpay.getAccessToken()
    if (token.status === 200) {
        let response
        try { 
            response = await Bootpay.cancel({
                receiptId: '612df0250d681b001de61de6',
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
}

// 4. 빌링키 발급
async function getBillingKey() {
    const Bootpay = require('bootpay-backend-nodejs').Bootpay
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
            console.log(e)
            return
        }
        console.log(response)
    }
}

// 4-1. 발급된 빌링키로 결제 승인 요청
async function subscribeBilling() {
    const Bootpay = require('bootpay-backend-nodejs').Bootpay
    Bootpay.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )
    let token = await Bootpay.getAccessToken()
    if (token.status === 200) {
        let response
        try {
            response = await Bootpay.requestSubscribeBillingPayment({
                billingKey: '612deb53019943001fb52312',
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
}

// 4-2. 발급된 빌링키로 결제 예약 요청
async function subscribeBillingReserve() {
    const Bootpay = require('bootpay-backend-nodejs').Bootpay
    Bootpay.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )
    let token = await Bootpay.getAccessToken()
    if (token.status === 200) {
        let response
        try {
            response = await Bootpay.reserveSubscribeBilling({
                billingKey: '612deb53019943001fb52312',
                itemName: '테스트',
                price: 1000,
                orderId: (new Date()).getTime(),
                userInfo: {
                    username: '테스트',
                    phone: '01000000000'
                },
                feedbackUrl: 'https://dev-api.bootpay.co.kr/callback',
                feedbackContentType: 'json',
                schedulerType: 'oneshot',
                executeAt: ((new Date()).getTime() / 1000) + 5
            })
        } catch (e) {
            return console.log(e)
        }
        console.log(response)
    }
}

// 4-2-1. 발급된 빌링키로 결제 예약 - 취소 요청
async function subscribeBillingReserveCancel() {
    const Bootpay = require('bootpay-backend-nodejs').Bootpay
    Bootpay.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )
    let token = await Bootpay.getAccessToken()
    if (token.status === 200) {
        let response
        try {            
            response = await Bootpay.destroyReserveSubscribeBilling('612debc70d681b0039e6133d')
            console.log(response)
        } catch (e) {
            return console.log(e)
        }
        console.log(response)
    }
}

// 4-3. 빌링키 삭제
async function deleteBillingKey() {
    const Bootpay = require('bootpay-backend-nodejs').Bootpay
    Bootpay.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )
    let token = await Bootpay.getAccessToken()
    if (token.status === 200) {
        let response
        try {            
            response = await Bootpay.destroySubscribeBillingKey('612debc70d681b0039e6133d')
            console.log(response)
        } catch (e) {
            return console.log(e)
        }
        console.log(response)
    }
}

// 5. (부트페이 단독 - 간편결제창, 생체인증 기반의 사용자를 위한) 사용자 토큰 발급
async function getUserToken() {
    const Bootpay = require('bootpay-backend-nodejs').Bootpay
    Bootpay.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )
    let token = await Bootpay.getAccessToken()
    if (token.status === 200) {
        let response
        try {            
            response = await Bootpay.requestUserToken({
                userId: '1234',
                email: 'test@gmail.com',
                name: '홍길동'
            })
            console.log(response)
        } catch (e) {
            return console.log(e)
        }
        console.log(response)
    }
}

// 6. 결제링크 생성
async function requestPayment() {
    const Bootpay = require('bootpay-backend-nodejs').Bootpay
    Bootpay.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )
    let token = await Bootpay.getAccessToken()
    if (token.status === 200) {
        let response
        try {            
            response = await Bootpay.requestPayment({
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
        console.log(response)
    }
}

// 7. 서버 승인 요청
async function submit() {
    const Bootpay = require('bootpay-backend-nodejs').Bootpay
    Bootpay.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )
    let token = await Bootpay.getAccessToken()
    if (token.status === 200) {
        let response
        try {            
            response = await Bootpay.verify('612df0250d681b001de61de6')
        } catch (e) {
            return console.log(e)
        }
        console.log(response)
    }
}
// 8. 본인 인증 결과 검증
async function certificate() {
    const Bootpay = require('bootpay-backend-nodejs').Bootpay
    Bootpay.setConfig(
        '5b8f6a4d396fa665fdc2b5ea',
        'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    )
    let token = await Bootpay.getAccessToken()
    if (token.status === 200) {
        let response
        try {            
            response = await Bootpay.certificate('612df0250d681b001de61de6')
        } catch (e) {
            return console.log(e)
        }
        console.log(response)
    }
}

async function goTest() {
    await getAccessToken();
    await verify();
    await cancel();
    await getBillingKey();
    await subscribeBilling();
    await subscribeBillingReserve();
    await subscribeBillingReserveCancel();
    await deleteBillingKey();
    await getUserToken();
    await requestPayment();
    await submit();
    await certificate();
}

goTest();
