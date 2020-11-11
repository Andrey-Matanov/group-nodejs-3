const puppeteer = require('puppeteer');
const fs = require('fs')

const scrape = async (media) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto(`https://${media}.ru/feed/news/`);

    const result = await page.evaluate(() => {
        let data = [];
        let elements = document.querySelectorAll('.text'); // Выбираем все новости
        console.log(elements)
        for (var element of elements){
            let topic = element.childNodes[1].innerText;
            let title = element.childNodes[3].innerText;
            let time = element.childNodes[5].innerText;
            data.push({topic, title, time});
        }

        return data;
    });

    browser.close();
    return result;
};

// scrape().then((value) => {
//     // console.log(value);
//     // fs.writeFileSync('./news.json', JSON.stringify(value, null, 4));
//
// });
module.exports.scrape = scrape
