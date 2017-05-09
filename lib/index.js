const newJPushClient = require('./jpush.js')
const newAppleClient = require('./apple.js')
const newMiPushClient = require('./mipush.js')

const clients = {}

const newClient = (type, config) => {
	if (type === 'JPush') {
		return newJPushClient(config)
	} else if (type === 'Apple') {
		return newAppleClient(config)
	} else if (type === 'MiPush') {
		return newMiPushClient(config)
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
