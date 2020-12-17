class ArtveeBase {
    constructor (options) {
        this.options = Object.assign({
            debug: false,
            enableArtInfo: true,
            title: undefined,
            subTitle: undefined,
            refreshAfterSeconds: 60 * 10, // 10 Minutes
        }, options)
    }

    async loadArts (artist) {
        const baseUrl = 'https://artvee.com'
        const source = (artist) ? `${baseUrl}/artist/${artist}/?per_page=200` : baseUrl

        let webView = new WebView()
        await webView.loadURL(source)
    
        return webView.evaluateJavaScript(`
            let arts = [...document.querySelectorAll('.products .product-grid-item .product-wrapper')].map((ele) => {
                let productLinkEle = ele.querySelector('.product-element-top .product-image-link')
                let imageEle = productLinkEle.querySelector('img')
                let productInfoEle = ele.querySelector('.product-element-bottom > span')
                return {
                    id: parseInt(productInfoEle.querySelector('.linko').dataset.id),
                    title: productInfoEle.querySelector('h3.product-title > a').innerText,
                    artist: {
                        name: productInfoEle.querySelector('.woodmart-product-brands-links > a').innerText,
                        info: productInfoEle.querySelector('.woodmart-product-brands-links').innerText,
                        link: productInfoEle.querySelector('.woodmart-product-brands-links > a').getAttribute('href'),
                    },
                    link: productLinkEle.getAttribute('href'),
                    image: {
                        link: imageEle.getAttribute('src'),
                        width: imageEle.getAttribute('width'),
                        height: imageEle.getAttribute('height'),
                    }
                }
            }).sort((prev, next) => prev.id - next.id)
                
            completion(arts)
        `, true)
    }

    async initBase (storeHandler, artist) {
        let store = storeHandler()
        let arts = []
        if (store.size() == 0) {
            arts = await super.loadArts(artist)
            arts.forEach(art => store.save(art.id, art))
            store.saveSync()
        } else {
            arts = store.all()
        }

        console.log('arts: ' + JSON.stringify(arts, null, 4))
        
        let todayIdx = Math.floor(Math.random() * arts.length)
        let todayArt = arts[todayIdx]
    
        this.widget = new ListWidget()
        this.widget.refreshAfterDate = new Date(Date.now() + 1000 * this.options.refreshAfterSeconds)
        this.widget.url = todayArt.link

        if (this.options.debug) {
            let txt = this.widget.addText(`${todayIdx + 1} / ${arts.length}`)
            txt.rightAlignText()
            txt.textColor = Color.black()
            txt.font = Font.ultraLightMonospacedSystemFont(10)    
        }

        this.widget.addSpacer()
    
        if (this.options.enableArtInfo) {
            let titleTxt = this.widget.addText(
                (this.options.title) ? this.options.title : todayArt.title
            )
            titleTxt.textColor = Color.white()
            titleTxt.font = Font.boldRoundedSystemFont(20)
        
            let authorTxt = this.widget.addText(
                (this.options.subTitle) ? this.options.subTitle : todayArt.artist.info
            )
            authorTxt.textColor = Color.white()
            authorTxt.font = Font.lightSystemFont(15)    
        }
    
        this.widget.backgroundImage = await new Request(todayArt.image.link).loadImage()
    }

    present () {
        if (config.runsInWidget) {
            Script.setWidget(this.widget)
        } else {
            // for Test
            this.widget.presentLarge()
        }
        Script.complete()
    }
}

module.exports = ArtveeBase