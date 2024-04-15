import Hero from '@ulixee/hero'

const connectionToCore = "ws://xx.xxx.xx.xxx:xxxx"
const threads: number = 4

async function loopScraping() {
    let index = 0
    while (true) {
        const links = [
            "this is not a link, but makes hero fail",
            "this is not a link, but makes hero fail",
            "this is not a link, but makes hero fail",
            "this is not a link, but makes hero fail",
        ]

        if (index * 4 > links.length) {
            index = 0
        }

        const promises = links.map(
            (link, index) => scrape(link, index)
        )

        await Promise.all(promises)
        console.log("-- Another batch done --")
        console.log("")

        await new Promise(r => setTimeout(r, 50))

        index++
    }
}

async function scrape(link: string, index: number) {
    let hero
    try {
        hero = new Hero({
            connectionToCore: connectionToCore,
            locale: "de-DE",
            blockedResourceTypes: [
                "BlockCssResources",
                "BlockImages",
                "BlockFonts",
                "BlockIcons",
                "BlockMedia",
            ],
            timezoneId: "Europe/Berlin",
            showChrome: false,
            showChromeInteractions: false,
            userProfile: undefined
        })
        await hero.goto(link, {
            timeoutMs: 3000
        });
    } catch (e: any) {
        console.log(e.message)
        //console.log(e.stack)
    } finally {
        if (hero) {
            await hero.close()
        }
    }
}

async function process() {
    console.log("starting...")
    await loopScraping();
}

process()