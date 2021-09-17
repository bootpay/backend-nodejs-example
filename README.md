# Bootpay Server Side Package for Node.js [![alt text](https://cdn.bootpay.co.kr/icon/npm.svg)](https://www.npmjs.com/package/bootpay-backend-nodejs)


## Bootpay Node.js Server Side Library
부트페이 공식 Node.js 적용한 샘플 프로젝트 입니다. 

node환경에서 작성된 어플리케이션, 프레임워크 등에서 사용가능합니다.

* PG 결제창 연동은 클라이언트 라이브러리에서 수행됩니다. (Javascript, Android, iOS, React Native, Flutter 등)
* 결제 검증 및 취소, 빌링키 발급, 본인인증 등의 수행은 서버사이드에서 진행됩니다. (Java, PHP, Python, Ruby, Node.js, Go, ASP.NET 등)


## 기능   
1. (부트페이 통신을 위한) 토큰 발급 요청   
2. 결제 검증   
3. 결제 취소 (전액 취소 / 부분 취소)
4. 빌링키 발급
   
    4-1. 발급된 빌링키로 결제 승인 요청
   
    4-2. 발급된 빌링키로 결제 승인 예약 요청
   
    4-2-1. 발급된 빌링키로 결제 승인 예약 - 취소 요청
   
    4-3. 빌링키 삭제
5. (부트페이 단독) 사용자 토큰 발급   
6. (부트페이 단독) 결제 링크 생성   
7. 서버 승인 요청   
8. 본인 인증 결과 조회

## npm으로 설치하기 

```
npm install --save bootpay-backend-nodejs
```


## 사용하기 

```javascript
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
```
함수 단위의 샘플 코드는 [이곳](https://github.com/bootpay/backend-nodejs/tree/main/test)을 참조하세요.


## 1. 토큰 발급 

부트페이와 서버간 통신을 하기 위해서는 부트페이 서버로부터 토큰을 발급받아야 합니다.  
발급된 토큰은 30분간 유효하며, 최초 발급일로부터 30분이 지날 경우 토큰 발급 함수를 재호출 해주셔야 합니다.
```javascript 
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
}
```


## 2. 결제 검증 
결제창 및 정기결제에서 승인/취소된 결제건에 대하여 올바른 결제건인지 서버간 통신으로 결제검증을 합니다.
```javascript  
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
```


## 3. 결제 취소 (전액 취소 / 부분 취소)
price를 지정하지 않으면 전액취소 됩니다. 
* 휴대폰 결제의 경우 이월될 경우 이통사 정책상 취소되지 않습니다
* 정산받으실 금액보다 취소금액이 클 경우 PG사 정책상 취소되지 않을 수 있습니다. 이때 PG사에 문의하시면 되겠습니다.
* 가상계좌의 경우 CMS 특약이 되어있지 않으면 취소되지 않습니다. 그러므로 결제 테스트시에는 가상계좌로 테스트 하지 않길 추천합니다. 

부분취는 카드로 결제된 건만 가능하며, 일부 PG사만 지원합니다. 요청시 price에 금액을 지정하시면 되겠습니다. 
* (지원가능 PG사: 이니시스, kcp, 다날, 페이레터, 나이스페이, 카카오페이, 페이코)

간혹 개발사에서 실수로 여러번 부분취소를 보내서 여러번 취소되는 경우가 있기때문에, 부트페이에서는 부분취소 중복 요청을 막기 위해 cancel_id 라는 필드를 추가했습니다. cancel_id를 지정하시면, 해당 건에 대해 중복 요청방지가 가능합니다.  
```javascript 
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
```

## 4. 빌링키 발급 
REST API 방식으로 고객으로부터 카드 정보를 전달하여, PG사에게 빌링키를 발급받을 수 있습니다. 
발급받은 빌링키를 저장하고 있다가, 원하는 시점, 원하는 금액에 결제 승인 요청하여 좀 더 자유로운 결제시나리오에 적용이 가능합니다.
* 비인증 정기결제(REST API) 방식을 지원하는 PG사만 사용 가능합니다. 
```javascript 
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
```

## 4-1. 발급된 빌링키로 결제 승인 요청
발급된 빌링키로 원하는 시점에 원하는 금액으로 결제 승인 요청을 할 수 있습니다. 잔액이 부족하거나 도난 카드 등의 특별한 건이 아니면 PG사에서 결제를 바로 승인합니다.

```javascript  
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
```
## 4-2. 발급된 빌링키로 결제 예약 요청
원하는 시점에 4-1로 결제 승인 요청을 보내도 되지만, 빌링키 발급 이후에 바로 결제 예약 할 수 있습니다. (빌링키당 최대 5건)
```javascript  
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
```
## 4-2-1. 발급된 빌링키로 결제 예약 - 취소 요청
빌링키로 예약된 결제건을 취소합니다. 
```javascript  
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
```
## 4-3. 빌링키 삭제 
발급된 빌링키로 더 이상 사용되지 않도록, 삭제 요청합니다.
```javascript 
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
```
## 5. (부트페이 단독 - 간편결제창, 생체인증 기반의 사용자를 위한) 사용자 토큰 발급
(부트페이 단독) 부트페이에서 제공하는 간편결제창, 생체인증 기반의 결제 사용을 위해서는 개발사에서 회원 고유번호를 관리해야하며, 해당 회원에 대한 사용자 토큰을 발급합니다.
이 토큰값을 기반으로 클라이언트에서 결제요청 하시면 되겠습니다.
```javascript  
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
```
## 6. 결제 링크 생성 
(부트페이 단독) 요청 하시면 결제링크가 리턴되며, 해당 url을 고객에게 안내, 결제 유도하여 결제를 진행할 수 있습니다. 
```javascript  
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
```

## 7. 서버 승인 요청 
결제승인 방식은 클라이언트 승인 방식과, 서버 승인 방식으로 총 2가지가 있습니다.

클라이언트 승인 방식은 javascript나 native 등에서 confirm 함수에서 진행하는 일반적인 방법입니다만, 경우에 따라 서버 승인 방식이 필요할 수 있습니다.

필요한 이유 
1. 100% 안정적인 결제 후 고객 안내를 위해 - 클라이언트에서 PG결제 진행 후 승인 완료될 때 onDone이 수행되지 않아 (인터넷 환경 등), 결제 이후 고객에게 안내하지 못할 수 있습니다  
2. 단일 트랜잭션의 개념이 필요할 경우 - 재고파악이 중요한 커머스를 운영할 경우 트랜잭션 개념이 필요할 수 있겠으며, 이를 위해서는 서버 승인을 사용해야 합니다. 

```javascript  
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
```

## 8. 본인 인증 결과 조회 
다날 본인인증 후 결과값을 조회합니다. 
다날 본인인증에서 통신사, 외국인여부, 전화번호 이 3가지 정보는 다날에 추가로 요청하셔야 받으실 수 있습니다.
```javascript 
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
```
 
## Documentation

[부트페이 개발매뉴얼](https://bootpay.gitbook.io/docs/)을 참조해주세요

## 기술문의

[부트페이 홈페이지](https://www.bootpay.co.kr) 우측 하단 채팅을 통해 기술문의 주세요!

## License

[MIT License](https://opensource.org/licenses/MIT).
 