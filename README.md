# lighthouse-behind-auth

🙈  Codelab for running Lighthouse to test a page behind authentication flow

## Use case

I have 3 pages

- https://mazipan.space/examples/only-for-login
- https://mazipan.space/examples/login
- https://mazipan.space/examples/unauthorized

You can not visit `/only-for-login` directly, you need to go to `/login` first then input the email and password then you will be redirected to the correct page in `/only-for-login`. If you are identified as non login, you will be rediected to `/unauthorized`.

In this case, we will try to create a Lighthouse script to get the report for page `/only-for-login`.

## Report

Report are available in two types, the html in `lhreport.html` and the json in `lhreport.json`

## How do I know Lighthouse are test the correct page?

I usually dig in to the json report and find `final-screenshoot` field. Then copy the attribute `data` to your browser to see the screenshoot of the page are being tested by Lighthouse.

Here are the sample of final-screenshoot data from json report:

```js
{
	"id": "final-screenshot",
	"title": "Final Screenshot",
	"description": "The last screenshot captured of the pageload.",
	"score": null,
	"scoreDisplayMode": "informative",
	"details": {
		"type": "screenshot",
		"timing": 719,
		"timestamp": 59710329281,
		"data": "data:image/jpeg;base64,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AAAAAAAAAAMQABkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMQABkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMQABkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMQABkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMQABkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMQABkCNjYEgjY2BII2NgSCNjYEgjY2BII2NgSCNjYEgjY2BII2NgSCNjYEgjY2BII2NgSCNjYEgjY2BII2NgSCNjYEgjY2BII2NgSCNjYEgjY2BII2NgSCNjYEgjY2BII2NgSCNjYEgjY2BII2NgSCNjYEgjY2BII2NgSCNjYEAbAH/2Q=="
	}
}
```


## Support me

- 👉 🇮🇩 [Trakteer](https://trakteer.id/mazipan?utm_source=github)
- 👉 🌍 [BuyMeACoffe](https://www.buymeacoffee.com/mazipan?utm_source=github)
- 👉 🌍 [Paypal](https://www.paypal.me/mazipan?utm_source=github)
- 👉 🌍 [Ko-Fi](https://ko-fi.com/mazipan)

* * *

Created on 2021 by Irfan Maulana
