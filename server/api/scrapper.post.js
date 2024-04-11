import puppeteer from "puppeteer";

var productsToReturn = [];

export default defineEventHandler(async (event) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    const { term } = await readBody(event);
    await page.goto("https://www.amazon.in/" + term + "/s?k=" + term);
    await scroll(page);
    return {result: productsToReturn}
})

async function scroll(page) {
    try {
        while (true) {
            var productEvaluate = await page.evaluate(async () => {
                const products = [];

                await new Promise((resolve, reject) => {
                    var totalHeight = 0;
                    var distance = 100;
                    var timer = setInterval(async () => {
                        var scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if (totalHeight >= scrollHeight) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                })

                const productsElement = document.querySelectorAll('[data-csa-c-type="item"]')
                for (let element of productsElement) {
                    const product = {
                        date: Date.now(),
                        name: "",
                        stars: 0,
                        price: 0,
                        url: "",
                        img: "",
                    };

                    // product name
                    try {
                        product.name = element.querySelector('[class="a-size-medium a-color-base a-text-normal"]').innerHTML
                    } catch(error) {
                        console.log("no name")
                    }
                    //product stars
                    try {
                        product.stars = element.querySelector('[class="a-icon-alt"]').innerHTML
                    } catch (error) {
                        console.log("No stars")
                    }
                    // product price
                    try {
                        product.price = element.querySelector('[class="a-offscreen"]').innerHTML
                    } catch (error) {
                        console.log('no price')
                    }
                    // product url
                    try {
                        el = element.querySelector(
                            '[class="a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal"]'
                        )
                        product.url = "https://www.amazon.in" + el.getAttribute("href");
                    } catch (error) {
                        console.log("no url")
                    }
                    // product img
                    try {
                        el = element.querySelector('[class="s-image"]');
                        product.img = el.getAttribute("src");
                    } catch (error) {
                        console.log("no image")
                    }
                    products.push(product)
                }
                return products
            })
            console.log(productEvaluate);
            productsToReturn = productsToReturn.concat(productEvaluate)

            try {
                await page.click(
                    '[class="s-pagination-item s-pagination-next s-pagination-button s-pagination-button-accessibility s-pagination-separator"]',
                    { timeout: 1000 }
                );
            } catch (error) {
                console.log("no next button")
                break;
            }
        }
    } catch (error) {
        console.log(error)
    }
}
