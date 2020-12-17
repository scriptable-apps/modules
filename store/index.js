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
        this.path = path
        this.storeName = storeName

        this.options = Object.assign({
            pretty: false
        }, options)

        this.store = init(path, storeName, this.options)
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

    get (id) {
        return this.store[id]
    }

    all (sortKey) {
        let datas = Object.values(this.store)
        return (sortKey) ? 
            datas.sort((prev, next) => prev[sortKey] > next[sortKey]) : datas
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

module.exports = {
    DocumentStore,
    CacheStore,
    TemporaryStore,
}