let data

await fetch('https://api.github.com/users/T0ls/repos', {
	method: 'GET',
	headers: {
		'Accept': 'application/json'
	}
})
	.then(response => {
		if (!response.ok) {
			throw new Error('Error requesting GitHub API');
		}
		return response.json();
	})
	.then(dataRepo => {
		//console.log(data);
		data = dataRepo
	})
	.catch(error => {
		console.error(error);
});

//console.log(data)
export default data;
