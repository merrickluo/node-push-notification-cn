const fetch = require('node-fetch')
const moment = require('moment')

const { URLSearchParams } = require('url')

const TOKEN_URL = 'https://login.vmall.com/oauth2/token'

let _cachedToken = ''
let _expiresAt = 0

module.exports = async function ({ client_id, client_secret}) {
	if (_cachedToken && _expiresAt > moment.valueOf()) {
		return _cachedToken
	}

	const params = new URLSearchParams()
	params.append('grant_type', 'client_credentials')
	params.append('client_id', client_id)
	params.append('client_secret', client_secret)

	const res = await fetch(TOKEN_URL, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'POST',
		body: params,
	})
	if (res.ok) {
		const json = await res.json()
		if (json.error) {
			throw json.error_description
		}
		_cachedToken = json.access_token
		_expiresAt = Date.now() + json.expires_in
		return _cachedToken
	} else {
		throw 'cannot fetch accessToken: ' + await res.text()
	}
}
