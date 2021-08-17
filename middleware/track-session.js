const trackSession = (req, res, next) => {
	if (req.session.views) {
		req.session.views++
	} else {
		req.session.views = 1
	}
	console.log(`Total PVs: ${req.session.views}`)

	next()
}

export default trackSession
