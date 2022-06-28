import { Bootpay } from "@bootpay/backend-js";

// 1. 토큰 발급
async function getAccessToken() {  
    Bootpay.setConfiguration({
        application_id: '59b731f084382614ebf72215',
        private_key: 'WwDv0UjfwFa04wYG0LJZZv1xwraQnlhnHE375n52X0U='
    })
    try {
        let response = await Bootpay.getAccessToken()
        console.log(response)
    } catch (e) {
        console.log(e)
    }
}

// 2. 결제 단건 조회
async function getReceipt() { 
    Bootpay.setConfiguration({
        application_id: '5b8f6a4d396fa665fdc2b5ea',
        private_key: 'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    })
    try {
        await Bootpay.getAccessToken()
        const response = await Bootpay.receiptPayment('62b12f4b6262500007629fec')
        console.log(response)
    } catch (e) {
        console.log(e)
    }
}


// 3. 결제 취소 (전액 취소 / 부분 취소)
async function cancel() { 
    Bootpay.setConfiguration({
        application_id: '5b8f6a4d396fa665fdc2b5ea',
        private_key: 'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    })
    try {
        await Bootpay.getAccessToken()
        const response = await Bootpay.cancelPayment({
            receipt_id: '628b2206d01c7e00209b6087',
            cancel_price: 1000,
            cancel_username: '테스트 사용자',
            cancel_message: '테스트 취소입니다.'
        })
        console.log(response)
    } catch (e) {
        console.log(e)
    }
}

// 4-1. 빌링키 발급 
async function getBillingKey() { 
    Bootpay.setConfiguration({
        application_id: '5b8f6a4d396fa665fdc2b5ea',
        private_key: 'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    })
    try {
        await Bootpay.getAccessToken()
        const response = await Bootpay.requestSubscribeBillingKey({
            pg: '나이스페이',
            order_name: '테스트결제',
            subscription_id: (new Date()).getTime(), 
            card_no: '5570********1074', //카드번호 
            card_pw: '**', //카드 비밀번호 2자리 
            card_identity_no: '******', //카드 소유주 생년월일 6자리 
            card_expire_year: '**', //카드 유효기간 년 2자리 
            card_expire_month: '**', //카드 유효기간 월 2자리 
            user: {
                username: '홍길동',
                phone: '01012345678'
            }
        })
        console.log(response)
    } catch (e) {
        console.log(e)
    }
}

// 4-2. 발급된 빌링키로 결제 승인 요청
async function subscribeBilling() { 
    Bootpay.setConfiguration({
        application_id: '5b8f6a4d396fa665fdc2b5ea',
        private_key: 'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    })
    try {
        await Bootpay.getAccessToken()
        const response = await Bootpay.requestSubscribeCardPayment({
            billing_key: '62b3d166cf9f6d001bd20d59',
            order_name: '테스트 결제',
            order_id: (new Date()).getTime(),
            price: 100,
            tax_free: 0
        })
        console.log(response)
    } catch (e) {
        console.log(e)
    }
}

// 4-3. 발급된 빌링키로 결제 예약 요청
async function subscribeBillingReserve() { 
    Bootpay.setConfiguration({
        application_id: '5b8f6a4d396fa665fdc2b5ea',
        private_key: 'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    })
    try {
        // console.log(new Date((new Date()).getTime() + 5000))
        await Bootpay.getAccessToken()
        const response = await Bootpay.subscribePaymentReserve({
            billing_key: '62b3d166cf9f6d001bd20d59',
            order_name: '테스트 결제',
            order_id: (new Date()).getTime(),
            price: 1000,
            reserve_execute_at: new Date((new Date()).getTime() + 5000)
        })
        console.log(response)
    } catch (e) {
        console.log(e)
    }
}

// 4-4. 발급된 빌링키로 결제 예약 - 취소 요청
async function subscribeBillingReserveCancel() { 
    Bootpay.setConfiguration({
        application_id: '5b8f6a4d396fa665fdc2b5ea',
        private_key: 'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    })
    try {
        // console.log(new Date((new Date()).getTime() + 5000))
        await Bootpay.getAccessToken()
        const response = await Bootpay.subscribePaymentReserve({
            billing_key: '62b3d166cf9f6d001bd20d59',
            order_name: '테스트 결제',
            order_id: (new Date()).getTime(),
            price: 1000,
            reserve_execute_at: new Date((new Date()).getTime() + 5000)
        })
        if (response.reserve_id !== undefined) {
            const cancel = await Bootpay.cancelSubscribeReserve(response.reserve_id)
            console.log(cancel)
        }
    } catch (e) {
        console.log(e)
    }
}

// 4-5. 빌링키 삭제 
async function deleteBillingKey() { 
    Bootpay.setConfiguration({
        application_id: '5b8f6a4d396fa665fdc2b5ea',
        private_key: 'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    })
    try {
        await Bootpay.getAccessToken()
        const response = await Bootpay.destroyBillingKey('62b3d166cf9f6d001bd20d59')
        console.log(response)
    } catch (e) {
        console.log(e)
    }
}


// 4-6. 빌링키 조회
async function lookupBillingKey() { 
    Bootpay.setConfiguration({
        application_id: '5b8f6a4d396fa665fdc2b5ea',
        private_key: 'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    })
    try {
        await Bootpay.getAccessToken()
        const response = await Bootpay.lookupSubscribeBillingKey('62b3cbbecf9f6d001bd20ce8')
        console.log(response)
    } catch (e) {
        console.log(e)
    }
}


// 5. 사용자 토큰 발급 
async function getUserToken() { 
    Bootpay.setConfiguration({
        application_id: '5b8f6a4d396fa665fdc2b5ea',
        private_key: 'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    })
    try {
        await Bootpay.getAccessToken()
        const response = await Bootpay.requestUserToken({
            user_id: 'gosomi1',
            phone:'01012345678'
        })
        console.log(response)
    } catch (e) {
        console.log(e)
    }
}
 

// 6. 서버 승인 요청
async function serverConfirm() {
    Bootpay.setConfiguration({
        application_id: '5b8f6a4d396fa665fdc2b5ea',
        private_key: 'rm6EYECr6aroQVG2ntW0A6LpWnkTgP4uQ3H18sDDUYw='
    })
    try {
        await Bootpay.getAccessToken()
        const response = await Bootpay.confirmPayment('62876963d01c7e00209b6028')
        console.log(response)
    } catch (e) {
        console.log(e)
    }
}
// 8. 본인 인증 결과 검증
async function certificate() { 
    Bootpay.setConfiguration({
        application_id: '59b731f084382614ebf72215',
        private_key: 'WwDv0UjfwFa04wYG0LJZZv1xwraQnlhnHE375n52X0U='
    })
    try {
        await Bootpay.getAccessToken()
        const response = await Bootpay.shippingStart({
            receipt_id: "62a9379ad01c7e001f7dc1f3",
            tracking_number: '123456',
            delivery_corp: 'CJ대한통운',
            user: {
                username: '테스트',
                phone: '01000000000',
                address: '서울특별시 종로구',
                zipcode: '08490'
            }
        })
        console.log(response)
    } catch (e) {
        console.log(e)
    }
}

async function goTest() {
    await getAccessToken();
    await getReceipt();
    await cancel();
    await getBillingKey();
    await subscribeBilling();
    await subscribeBillingReserve();
    await subscribeBillingReserveCancel();
    await deleteBillingKey();
    await getUserToken();
    await serverConfirm();
    await certificate();
}

goTest();

