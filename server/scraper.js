const { parser } = require("html-metadata-parser");
const fs = require("fs");

let puppeteer;
if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "darhw8hzt",
  api_key: "886276141347941",
  api_secret: "b5cFzY_pxZCDYq3lzu9EtA15mfk",
});

async function scrapeWebsite(url) {

  let companyName = "";
  let description = "";
  let companyUrl = "";

  await parser(url).then((result) => {
    companyName = result.og.site_name || "";
    description =
      result.og.description ||
      result.meta.description ||
      "Description not found";
    companyUrl = result.og.url || url;
  });

  let options = {};
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "—hide-scrollbars", "—-disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: awaitIchrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(url);

  const { protocol, hostname } = new URL(companyUrl);
  const baseUrl = `${protocol}//${hostname}`;
  if (!companyName) {
    companyName = hostname.replace("www.", "").split(".")[0];
    companyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
  }

  const logo = await page.evaluate(() => {
    const iconLink =
      document.querySelector("link[rel='icon']") ||
      document.querySelector("link[rel='shortcut icon']") ||
      document.querySelector("link[rel='apple-touch-icon']");
    return iconLink ? iconLink.href : "";
  });

  const socialLinks = {};
  socialLinks.facebook = await page.evaluate(() => {
    const facebookLink = document.querySelector("a[href*='facebook.com']");
    if (facebookLink) {
      return facebookLink.href;
    }
    return "";
  });

  socialLinks.twitter = await page.evaluate(() => {
    const twitterLink = document.querySelector("a[href*='twitter.com']");
    if (twitterLink) {
      return twitterLink.href;
    }
    return "";
  });

  socialLinks.linkedin = await page.evaluate(() => {
    const linkedinLink = document.querySelector("a[href*='linkedin.com']");
    if (linkedinLink) {
      return linkedinLink.href;
    }
    return "";
  });

  const email = await page.evaluate(() => {
    const emailLink = document.querySelector("a[href^='mailto:']");
    return emailLink ? emailLink.href.replace("mailto:", "") : "";
  });

  const phoneNumber = await page.evaluate(() => {
    const phoneLink = document.querySelector("a[href^='tel:']");
    return phoneLink ? phoneLink.href.replace("tel:", "") : "";
  });

  const screenshotPath = `screenshot_${Date.now()}.jpeg`; // File path for saving screenshot
  await page.screenshot({ path: screenshotPath, type: "jpeg", fullPage: true });
  const result = await cloudinary.uploader.upload(screenshotPath, {
    folder: "screenshots",
  });
  const screenshotUrl = result.secure_url;
  fs.unlinkSync(screenshotPath);

  const scrapedData = {
    companyName,
    description,
    logo,
    companyUrl: baseUrl,
    // screenshot: base64Image,
    screenshot: screenshotUrl,
    socialLinks,
    // address,
    phoneNumber,
    email,
  };

  console.log(scrapedData);

  await browser.close();
  return scrapedData;
}

// scrapeWebsite("https://www.facebook.com/");

module.exports = { scrapeWebsite };
