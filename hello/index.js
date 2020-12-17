module.exports.hello = (name) => {  
    const lodash = importModule('/modules/lodash')
    const moment = importModule('/modules/moment')
    let capName = lodash.capitalize(name)
    
    let noti = new Notification()
    noti.title = 'Scriptable Moduler'
    noti.body = `Hello ${capName}!! (${moment().format('YYYY/MM/DD HH:mm:ss')})`
    noti.sound = 'complete'
    noti.schedule()
}