const JPush = require('jpush-sdk')

const toAudience = (recipient) => {
	if (Object.keys(recipient) == 0) {
		return [ JPush.ALL ]
	}
	const { tags, alias, regIds } = recipient
	let args = []
	if (tags && tags.length) {
		args.push(JPush.tag(tags))
	}
	if (alias && alias.length) {
		args.push(JPush.alias(alias))
	}
	if (regIds && regIds.length) {
		args.push(JPush.registration_id(regIds))
	}

	return args
}

const newClient = (config) => {
	const client = JPush.buildClient(config)

	return {
		sendNotification: ({ title = '', content = '', extras = {}, recipient }) => {
			return new Promise((resolve, reject) => {
				client.push()
					.setPlatform('android')
					.setAudience(...toAudience(recipient))
					.setNotification(JPush.android(content, title, 1, extras))
					.send((err, resp) => {
						if (err) {
							reject(err)
						} else {
							resolve(resp)
						}
					})
			})
		},
		sendMessage: ({ title = '', content = '', extras = {}, recipient }) => {
			return new Promise((resolve, reject) => {
				client.push()
					.setPlatform('android')
					.setAudience(...toAudience(recipient))
					.setMessage(JPush.title(title),
											JPush.msg_content(content),
											JPush.extras(extras))
					.send((err, resp) => {
						if (err) {
							reject(err)
						} else {
							resolve(resp)
						}
					})
			})
		},
	}
}

module.exports = newClient
