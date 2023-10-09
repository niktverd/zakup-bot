// node ./actions/0ManualStart.js

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer");
const fs = require("fs");
const _ = require("lodash");
const readXlsxFile = require('read-excel-file/node')

// add stealth plugin and use defaults (all evasion techniques)
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// puppeteer.use(StealthPlugin());

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + "/" + file).isDirectory();
    });
}
// aelbertshvab@yandex.ru+#

const USER_NAME = "patosgamb1980@ro.ru";
// const USER_NAME = "manmaro1987@rambler.ru";
// const USER_NAME = "johnatanmcsteevenson@yandex.ru";

async function main() {
    const fSessions = getDirectories("./sessions");
    // console.log("Sessions: ", fSessions);
    // if (!fSessions.includes(USER_NAME)) {
    //     console.log("User is not found!");
    //     return;
    // }
    console.log("Creating folders names...");

    const xlsFile = await readXlsxFile('./contract_11-05-2022_export.xlsx');

    console.log(xlsFile);

    const userDataDirPath = `./sessions/userDataDir`;

    //   return;

    // puppeteer usage as normal
    console.log("Launching puppeteer...");

    puppeteer
        .launch({
            headless: false,
            userDataDir: userDataDirPath,
            ignoreDefaultArgs: ["--disable-extensions", "--enable-automation"],
        })
        .then(async (browser) => {
            console.log("Environment almost created..");
            const page = await browser.newPage();
            for(const row of xlsFile){
                if (row[0] == 'Номер договора') {
                    continue;
                }
                try {
                    await page.goto("https://www.goszakup.gov.kz/ru/registry/contract");
                    await page.waitForTimeout(1000);
                    await page.type('#in_number', row[0]);
                    await page.waitForTimeout(1000);
                    await (await page.$('[name="smb"]')).click()
                    await page.waitForTimeout(5000);

                    const table = await page.$('#search-result');
                    const contract_href = await table.$('a');
                    const [target] = await Promise.all([
                        new Promise(resolve => browser.once('targetcreated', resolve)),
                        contract_href.click(),
                    ]);

                    const newPage = await target.page();
                    await newPage.bringToFront();
                    await page.waitForTimeout(7000);

                    const newPageAllLinks = await newPage.$$('a');
                    console.log('newPageAllLinks.length', newPageAllLinks.length);
                    for(let link of newPageAllLinks){
                        const href = await link.evaluate((el) => el.href);
                        console.log(href);
                        if (href.includes('cpublic/units/'))  {
                            await link.click();
                            break;
                        }
                    }
                    await page.waitForTimeout(7000);

                    await newPage.close();

                } catch (error) {
                    console.log(error);
                } finally {
                    // await browser.close();
                    console.log(`Started. Use it`);
                }
                return;
            }
        });
}

main();
