const getModuleBaseInfos = () => {
    const fm = FileManager.iCloud()
    const dir = fm.documentsDirectory()
    return { fm, baseDir: `${dir}/modules` }
}

const checkTargetModules = (versions, baseModuleName) => {
    console.log(`call checkTargetModules, ${baseModuleName}`)

    let targetModules = new Set()
    const findDependencies = (moduleName) => {
        targetModules.add(moduleName)
        versions.modules.find(ver => ver.name === moduleName)
            .dependencies.forEach(depName => findDependencies(depName))
    }
    findDependencies(baseModuleName)
    console.log('total dep: ' + [...targetModules])
    return [...targetModules]
}

const getRemoteVersions = async () => {
    let request = new Request(`https://julio-kim.github.io/scriptable/version.json`)
    return await request.loadJSON()
}

const getLocalVersions = () => {
    const { fm, baseDir } = getModuleBaseInfos()
    const verPath = `${baseDir}/version.json`
    if (fm.fileExists(verPath)) {
        return JSON.parse(fm.readString(verPath))
    } else {
        let versions = {modules:[]}
        fm.writeString(verPath, JSON.stringify(versions))
        return versions
    }
}

class Moduler {
    async init () {
        this.remoteVersions = await getRemoteVersions()
        this.localVersions = getLocalVersions()

        console.log('remote: ' + JSON.stringify(this.remoteVersions))
        console.log('local: ' + JSON.stringify(this.localVersions))
    }

    async install (moduleName) {
        console.log(`call install ${moduleName}`)
        const { fm, baseDir } = getModuleBaseInfos()

        let targetModules = checkTargetModules(this.remoteVersions, moduleName)
        for (let depName of targetModules) {
            let remoteModule = this.remoteVersions.modules.find(module => module.name === depName)
            if (fm.fileExists(`${baseDir}/${depName}/index.js`)) {
                let localModule = this.localVersions.modules.find(module => module.name === depName)
                if (localModule.version < remoteModule.version) {
                    await this.updateModule(remoteModule)
                } 
            } else {
                await this.installModule(remoteModule)
            }
        }

        let targetModule = `/modules/${moduleName}`
        console.log(`targetModule: ${targetModule}`)    
        return importModule(targetModule)
    }

    async uninstall (moduleName) {
        const { fm, baseDir } = getModuleBaseInfos()

        if (fm.fileExists(`${baseDir}/${moduleName}/index.js`)) {
            fm.remove(`${baseDir}/${moduleName}`)
            this.deleteVersion(moduleName)
        } else {
            throw new Error(`Module not found: ${moduleName}`)
        }    
    }

    async installModule (remoteModule) {
        console.log(`call installModule ${remoteModule.name}`)
        const { fm, baseDir } = getModuleBaseInfos()
    
        if (!fm.isDirectory(`${baseDir}/${remoteModule.name}`)) {
            fm.createDirectory(`${baseDir}/${remoteModule.name}`)
        }
        return this.writeModule(remoteModule, true)
    }

    async updateModule (remoteModule) {
        console.log(`call updateModule ${remoteModule.name}`)
        return this.writeModule(remoteModule, false)
    }
    
    async writeModule (remoteModule, isNew) {
        console.log(`call writeModule ${remoteModule.name}`)
        const { fm, baseDir } = getModuleBaseInfos()
    
        let request = new Request(`https://julio-kim.github.io/scriptable/modules/${remoteModule.name}/index.js`)
        let moduleFile = await request.loadString()
        fm.writeString(`${baseDir}/${remoteModule.name}/index.js`, moduleFile)
    
        await this.updateVersion(remoteModule, isNew)
    }
    
    async updateVersion (remoteModule, isNew) {
        console.log(`call updateVersion ${remoteModule.name}`)
        const { fm, baseDir } = getModuleBaseInfos()
    
        const index = this.localVersions.modules.findIndex(item => item.name === remoteModule.name)
        if (index >= 0) {
            this.localVersions.modules = [
                ...this.localVersions.modules.slice(0, index),
                ...this.localVersions.modules.slice(index + 1)
            ]
        }
        this.localVersions.modules.push(remoteModule)
        fm.writeString(`${baseDir}/version.json`, JSON.stringify(this.localVersions))
    
        if (!isNew) {
            let noti = new Notification()
            noti.title = `${remoteModule.name} (${remoteModule.version}) 모듈이 업데이트 되었습니다.`
            noti.body = remoteModule.description
            noti.sound = 'piano_success'
            noti.openURL = 'https://julio-kim.github.io/scriptable'
            noti.schedule()    
        }
    }
    
    deleteVersion (moduleName) {
        const { fm, baseDir } = getModuleBaseInfos()
        
        const index = this.localVersions.modules.findIndex(item => item.name === moduleName)
        if (index >= 0) {
            this.localVersions.modules = [
                ...this.localVersions.modules.slice(0, index),
                ...this.localVersions.modules.slice(index + 1)
            ]
        }
        fm.writeString(`${baseDir}/version.json`, JSON.stringify(this.localVersions))
    }
}

module.exports = {
    install: async (moduleName) => {
        let moduler = new Moduler()
        await moduler.init()
        return moduler.install(moduleName)
    },
    findDependencies: async (moduleName) => {
        let versions = await getRemoteVersions()
        return checkTargetModules(versions, moduleName)
    },
    list: () => {
        return getLocalVersions().modules
    },
    uninstall: async (moduleName) => {
        let moduler = new Moduler()
        await moduler.init()
        await moduler.uninstall(moduleName)
        uninstall(moduleName)
    }
}