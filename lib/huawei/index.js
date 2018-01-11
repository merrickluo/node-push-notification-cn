const fetch = require('node-fetch')
const { URLSearchParams } = require('url')

const getAccessToken = require('./getAccessToken')

const PUSH_URL = 'https://api.push.hicloud.com/pushsend.do'
const MSG_TYPE_PASSTHROUGH = 1 // 透传异步消息
const MSG_TYPE_NOTIFICATION = 3 // 系统通知栏异步消息

const _asCustomizeArray = function (extraObj) {
	return Object.keys(extraObj).map(key => {
		return { key: extraObj[key] }
	})
}

const send = async function (config, type, opts) {
	const { title = '',	content = '',	extras = {}, recipient } = opts

	// default payload contain passThrough msg
	const payload = {
		hps: {
			msg: {
				type: type,
				body: {	title, content },
			},
			ext: {
				customize: _asCustomizeArray(extras)
			}
		}
	}

	// check if send as notification
	if (type === MSG_TYPE_NOTIFICATION) {
		payload.hps.msg.action = {
			type: 3, // default to open app
			param: {
				appPkgName: config.appPkgName,
			},
		}
	}

	const params = new URLSearchParams()
	params.append('access_token', await getAccessToken(config))
	params.append('nsp_ts', Math.floor(Date.now() / 1000)) // in seconds
	params.append('nsp_svc', 'openpush.message.api.send')
	params.append('device_token_list', JSON.stringify(recipient.regIds))
	params.append('payload', JSON.stringify(payload))

	const nsp_ctx = encodeURIComponent(JSON.stringify({
		ver: 1,
		appId: config.client_id,
	}))

	const res = await fetch(PUSH_URL + '?nsp_ctx=' + nsp_ctx, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'POST',
		body: params,
	})
	if (res.status != 200) {
		throw 'cannot send msg: ' + await res.text()
	}
	const json = await res.json()
	if (json.code != '80000000') {
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
