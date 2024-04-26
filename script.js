/*
Useful resources:
	-T0ls/repos 
		Profile name= owner.login 
		Avatar= ownner.avatar_url
		Profile url= owner.html_url
		Repo name= name
		Descr= description
		Url repo= html_url
		Last update= updated_at
		Laguage= language
		Stars= stargazers_count
		Watching= watchers
		Views= watchers_count
		Forks= forks
	-T0ls/{Repos}/contents
		Tipo= type
		none= path
*/

// Leggo il contenuto del file Js
const gitHubApi_Key = gitHubToken.token

/* GitHub Api fetch Profile Info */
fetch('https://api.github.com/user', { method: 'GET', headers: { 'Authorization': 'Bearer ' + gitHubApi_Key, } })
.then(response => { if (response.ok) { return response.json(); } else { throw new Error('Error requesting GitHub API: user '); } })
.then(data => { 
	var avatar = document.getElementById("avatarGitHub");
	var profileUrl = document.getElementById("profileUrlGitHub");
	avatar.src = data.avatar_url;
	profileUrl.href = data.html_url;
	profileUrl.innerHTML = data.login;
}) 

.catch(error => { console.error('Si è verificato un errore:', error); });
/* End */

/* GitHub Api fetch Repositories List */
fetch('https://api.github.com/users/T0ls/repos', {
	method: 'GET',
	headers: {
		'Accept': 'application/json',
		'Authorization': 'Bearer ' + gitHubApi_Key,
	}
})
	.then(response => {
		if (!response.ok) {
			throw new Error('Error requesting GitHub API: repositories');
		}
		return response.json();
	})
	.then(data => {
		//console.log(data);
		var container1 = document.getElementById("gitHubRepoList");
		var container2 = document.getElementById("gitHubRepoItems");
		for(var i=0; i<data.length; i++) {
			var link = document.createElement('a');

			// Create the navbar objects list
			link.setAttribute('class', 'nav-link');
			link.setAttribute('style', 'max-width: 230px');
			link.setAttribute('href', '#item-' + data[i].name);
			link.textContent = data[i].name;
			container1.appendChild(link);

			// Create the scrollbar items list
			var div1 = document.createElement('div');
			var a = document.createElement('a');
			var h4 = document.createElement('h4');
			var p1 = document.createElement('p');
			var p2 = document.createElement('p');
			var span = document.createElement('span');
			var div2 = document.createElement('div');
			// div 1
			if (i !== 0) {
				div1.setAttribute('class', 'border-top pt-3');
			}	
			div1.setAttribute('id', 'item-' + data[i].name);
			// div 2
			div2.setAttribute('class', 'd-inline-flex');
			div2.setAttribute('id', 'dotDiv' + data[i].name);
			// a
			a.setAttribute('id', 'repoLink-' + data[i].name);
			a.setAttribute('onclick', 'hideBlock(\'' + data[i].name + '\')');
			//a.setAttribute('href', "#gitHubPage");
			// h4
			//h4.setAttribute('class', 'text-primary')
			h4.innerHTML = data[i].name;
			// p
			p1.setAttribute('class', 'm-1')
			p1.innerHTML = data[i].description;
			p2.innerHTML = data[i].language;
			// span
			span.setAttribute('class','repoLanguageColor');

			container2.appendChild(div1);

			var container3 = document.getElementById("item-" + data[i].name);
			container3.appendChild(a);
			a.appendChild(h4);
			container3.appendChild(p1);

			container3.appendChild(div2);
			var container4 = document.getElementById("dotDiv" + data[i].name);
			container4.appendChild(span)
			container4.appendChild(p2);
		}
	})
	.catch(error => {
		console.error(error);
});

/* End */


/* Hide/Show Functions */

function hideBlock(x) {

	console.log(document.getElementById("gitHubPage").getClientRects()[0].y)
	var block = document.getElementById("gitHubProfile");
	block.style.display = "none";
	showBlock(x);
	console.log(document.getElementById("gitHubPage").getClientRects()[0].y)
}

function showBlock(repoN) {
console.log(repoN);	
		fetch('https://api.github.com/repos/'+ document.getElementById("profileUrlGitHub").innerHTML +'/'+ repoN +'/contents', {
			method: 'GET',
			headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + gitHubApi_Key, }
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Error requesting GitHub API: repo');
				}
				return response.json();
			})
			.then(data => {
				console.log(data);
				console.log(document.getElementById("gitHubPage").getClientRects()[0].y)
				var block = document.getElementById("gitHubRepoItem");
				block.style.display = "block";
				console.log(document.getElementById("gitHubPage").getClientRects()[0].y)
				scrollTo(0, document.getElementById("gitHubPage").getClientRects()[0].y);
			})
			.catch(error => {
				console.error(error);
		});
}

let dati = new Map();

async function fetchAPI(repo, path) {
	let key = [repo, path];
	if (dati.has(key)) {
		return dati.get(key)
	} else {
		let response = await fetch(`https://api.github.com/repos/${document.getElementById("profileUrlGitHub").innerHTML}/${repo}/contents/${path}`, {
			method: 'GET',
			headers: { 'Accept': 'application/json',  'Authorization': 'Bearer ' + gitHubApi_Key, }
		})
		if (!response.ok) {
			console.error('Error requesting GitHub API')
		} 
		let data = await response.json()
		dati.set(key, data);
		return data
	}
}

function showPath(x) {
	fetchAPI(x);
}

/* End */


/*
fetch('https://api.github.com/users/T0ls/repos', {
	method: 'GET',
	headers: {
		'Accept': 'application/json'
	}
})
	.then(response => {
		if (!response.ok) {
			throw new Error('Error requesting GitHub API: ');
		}
		return response.json();
	})
	.then(data => {
		//console.log(data);
	})
	.catch(error => {
		console.error(error);
});
*/
