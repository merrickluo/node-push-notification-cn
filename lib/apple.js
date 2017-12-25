const apn = require('apn')

const newClient = (config) => {
	const provider = new apn.Provider(config)

	return {
		sendNotification: ({ title, content, extra, recipient }) => {
			const { regIds } = recipient
			const note = new apn.Notification()

			note.badge = 1
			note.title = title || ''
			note.body = content || ''
			note.topic = config.bundleId
			note.payload = extra || {}

			return provider.send(note, regIds)
		},
		sendMessage: ({ title, content, extra, recipient }) => {
			const { regIds } = recipient
			// this only work if app is in foreground

			const note = new apn.Notification()
			note.badge = 1
			note.title = title || ''
			note.body = content || ''
			note.payload = extra || {}
			note.topic = config.bundleId

			return provider.send(note, regIds)
		}
	}
}

module.exports = newClient
