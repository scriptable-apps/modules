const getStoreFilePath = (path, storeName) => {
    const fm = FileManager.local()
    const baseDir = `${path}/store`

    if (!fm.isDirectory(baseDir)) {
        fm.createDirectory(baseDir)
    }

    let storePath = `${baseDir}/${storeName}.js`
    console.log(`determined store path: ${storePath}`)
    return storePath
}

const init = (path, storeName, options) => {
    const fm = FileManager.local()
    const storeFile = getStoreFilePath(path, storeName)
    if (fm.fileExists(storeFile)) {
        return JSON.parse(fm.readString(storeFile))
    } else {
        let store = {}
        fm.writeString(storeFile, JSON.stringify(store))
        return store
    }
}

class StoreBase {
    constructor (path, storeName, options) {
        if (path) {
            this.path = path
            this.storeName = storeName

            this.options = Object.assign({
                pretty: false
            }, options)

            this.store = init(path, storeName, this.options)            
        } else {
            // anti...
            console.log('gist mode...')
        }
    }

    save (id, data) {
        this.store[id] = data
    }

    saveSync () {
        const fm = FileManager.local()
        const storeFile = getStoreFilePath(this.path, this.storeName)
        fm.writeString(storeFile, (this.options.pretty) ?
            JSON.stringify(this.store, null, 4) : JSON.stringify(this.store)
        )
    }

    has (id) {
        return this.store[id] !== undefined
    }

    get (id) {
        return this.store[id]
    }

    all (sortKey, sortFunc) {
        let datas = Object.values(this.store)
        if (sortKey) {
            if (sortFunc) {
                return datas.sort(sortFunc)
            } else {
                return datas.sort((prev, next) => 
                                  prev[sortKey] > next[sortKey] ? 1 : 
                                  prev[sortKey] < next[sortKey] ? -1 : 0)
            }
        } else return datas
    }

    delete (id) {
        delete this.store[id]
    }

    size () {
        return Object.keys(this.store).length
    }
}

class DocumentStore extends StoreBase {
    constructor (storeName, options) {
        super(FileManager.local().documentsDirectory(), storeName, options)
    }
}

class CacheStore extends StoreBase {
    constructor (storeName, options) {
        super(FileManager.local().cacheDirectory(), storeName, options)
    }
}

class TemporaryStore extends StoreBase {
    constructor (storeName, options) {
        super(FileManager.local().temporaryDirectory(), storeName, options)
    }
}

class GistStore extends StoreBase {
    constructor ({ githubId, gistId, gistToken, storeName, options }) {
        super()
        this.githubId = githubId
        this.gistId = gistId
        this.gistToken = gistToken
        this.storeName = storeName

        this.options = Object.assign({
            pretty: false
        }, options)

        this.store = null
    }

    async load () {
        let request = new Request(`https://gist.github.com/${this.githubId}/${this.gistId}/raw/${this.storeName}.json`)
        request.method = 'GET'
        request.headers = {
            'Authorization': `bearer ${this.gistToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GistStore'
        }

        this.store = await request.loadJSON()
    }
   
    async saveSync () {
        let files = {}
        files[`${this.storeName}.json`] = { 
            content: (this.options.pretty) ?
                JSON.stringify(this.store, null, 4) : JSON.stringify(this.store)
        }
        let request = new Request(`https://api.github.com/gists/${this.gistId}`)
        request.method = 'PATCH'
        request.headers = {
            'Authorization': `bearer ${this.gistToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GistStore'
        }
        request.body = JSON.stringify({ files })
        let response = await request.loadJSON()
        console.log(response)
    }

}

module.exports = {
    DocumentStore,
    CacheStore,
    TemporaryStore,
    GistStore,
}
