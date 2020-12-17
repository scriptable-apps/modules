const ArtveeBase = importModule('/modules/artveebase')
const { DocumentStore, TemporaryStore } = importModule('/modules/store')

class ArtveeArtist extends ArtveeBase {
    constructor (artist, options) {
        super(options)
        this.artist = artist
    }

    async present() {
        await super.initBase(() => 
            new DocumentStore(`artvee-artist-${this.artist}`), this.artist)
        super.present()
    }
}

class ArtveeDaily extends ArtveeBase {
    constructor (options) {
        super(options)
    }

    async present() {
        await super.initBase(() => new TemporaryStore("artvee-daily"))
        super.present()
    }
}

module.exports = {
    ArtveeArtist,
    ArtveeDaily,
}