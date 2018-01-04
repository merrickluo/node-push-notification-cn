const newJPushClient = require('./jpush')
const newAppleClient = require('./apple')
const newMiPushClient = require('./mipush')
const newHuaweiClient = require('./huawei')

const clients = {}

const newClient = (type, config) => {
	if (type === 'JPush') {
		return newJPushClient(config)
	} else if (type === 'Apple') {
		return newAppleClient(config)
	} else if (type === 'MiPush') {
		return newMiPushClient(config)
	} else if (type === 'Huawei') {
		return newHuaweiClient(config)
	}
	throw new Error(`${type} is not supported`)
}

const allClients = (configs) => {
	return {
		client: (type) => {
			// if already created
			if (clients[type]) {
				return clients[type]
			}

			const config = configs[type]
			if (!config || Object.keys(config).length == 0) {
				throw new Error(`${type} setting not found!`)
			}

			clients[type] = newClient(type, config)
			return clients[type]
		}
	}
}

module.exports = allClients
