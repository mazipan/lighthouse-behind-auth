const fs = require('fs');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');

// origin page that we want to test
const PAGE_URL = 'https://mazipan.space/examples/only-for-login';

// page for doing authentication
const PAGE_LOGIN_URL = 'https://mazipan.space/examples/login';

const doingAuthentication = async (browser) => {
  // -- START doing authentication
  const page = await browser.newPage();

  // Go to the login page
  await page.goto(PAGE_LOGIN_URL);

  // waiting the email field is available
  await page.waitForSelector('#email');

  const emailInput = await page.$('#email');
  await emailInput.type('me@mazipan.space');

  const passwordInput = await page.$('#password');
  await passwordInput.type('password123');

  const submitBtn = await page.$('button[type="submit"]');
  await submitBtn.click();

  // waiting for redirection after login
  await page.waitForNavigation();
  await page.close();
  // -- FINISH doing authentication
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // switch to false if you want to see in actions
    defaultViewport: null,
	});

	await doingAuthentication(browser);

  // running lighthouse to open the page behind auth
  const { report, lhr } = await lighthouse(PAGE_URL, {
    port: new URL(browser.wsEndpoint()).port,
    output: 'html',
    disableStorageReset: true,
  });

  fs.writeFileSync('lhreport.html', report);
  fs.writeFileSync('lhreport.json', JSON.stringify(lhr, null, 2));

  console.log(
    `Lighthouse scores: ${Object.values(lhr.categories)
      .map((c) => c.score)
      .join(', ')}`
  );

  await browser.close();
})();
