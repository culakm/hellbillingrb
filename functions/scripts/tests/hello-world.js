
async function helloWorldHandler(request) {
	console.log('moje data', request.data);
	const someParameter = request.data.someParameter;
	return { message: `${someParameter}, pridane vo funkcii z extra file!` };
}

module.exports = helloWorldHandler;