const fetch = require('node-fetch')
const { URLSearchParams } = require('url')

const PUSH_URL = 'https://api.xmpush.xiaomi.com/v2/message/regid'
const MSG_TYPE_PASSTHROUGH = 1 // 透传异步消息
const MSG_TYPE_NOTIFICATION = 0 // 系统通知栏异步消息

const send = async function (config, type, opts) {
	const { title = '',	content = '',	extras = {}, recipient } = opts

	const regIds = recipient.regIds.join(',')

	const params = new URLSearchParams()
	params.append('restricted_package_name', config.packageName)
	params.append('title', title)
	params.append('description', content)
	params.append('pass_through', type)
	params.append('payload', 'not important in this case')
	params.append('registration_id', regIds)

	for (const key of Object.keys(extras)) {
		params.append(`extra.${key}`, extras[key])
	}

	const res = await fetch(PUSH_URL, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'key=' + config.appSecret,
		},
		method: 'POST',
		body: params,
	})
	if (res.status != 200) {
		throw 'cannot send msg: ' + await res.text()
	}
	const json = await res.json()
	if (json.code !== 0) {
		// failed
		throw JSON.stringify(json)
	}
	return json
}

const newClient = (config) => {
	return {
		sendNotification: async function (opts) {
			return send(config, MSG_TYPE_NOTIFICATION, opts)
		},
		sendMessage: async function (opts) {
			return send(config, MSG_TYPE_PASSTHROUGH, opts)
		}
	}
}

module.exports = newClient

