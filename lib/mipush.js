const MiPush = require('xiaomi-push')

const newClient = (config) => {

	return {
		sendNotification: ({ title, content, recipient }) => {
			return new Promise((resolve, reject) => {
				const msg = new MiPush.Message()
				msg
					.title(title)
					.description(content)
					.passThrough(0)
					.extra('badge', 1)

				const note = new MiPush.Notification(config)
				const { regIds } = recipient
				note
					.sendToRegid(regIds, msg, (err, resp) => {
						if (err) {
							reject(err)
						} else {
							resolve(resp)
						}
					})
			})
		},
		sendMessage: ({ title, content, extra, recipient }) => {
			// return new Promise((resolve, reject) => {
			// 	const msg = new MiPush.Message()
			// 	msg
			// 		.title(title)
			// 		.description(content)
			// 		.passThrough(0)
			// 		.extra('badge', 1)

			// 	const note = new MiPush.Notification(config)
			// 	const { regIds } = recipient
			// 	note.sendToRegid(regIds, msg, () => {
			// 		console.log(arguments)
			// 	})
			// })
		},
	}
}

module.exports = newClient