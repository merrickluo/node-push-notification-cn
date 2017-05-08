const apn = require('apn')

const newClient = (config) => {
	const provider = new apn.Provider(config)

	return {
		sendNotification: ({ title, content, recipient }) => {
			const { regids } = recipient
			const note = new apn.Notification();

			note.badge = 1;
			note.title = title
			note.alert = content
			note.topic = config.bundleid

			return provider.send(note, regids)
		},
		sendMessage: ({ extras, recipient }) => {
			const { regids } = recipient
			// this only work if app is in foreground
			const note = new apn.Notification();
			note.payload = extras
			note.topic = config.bundleid

			return provider.send(note, regids)
		}
	}
}
