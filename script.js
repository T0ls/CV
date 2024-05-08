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
			link.setAttribute('class', 'repoNavList nav-link col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12');
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
				div1.setAttribute('class', 'border-top');
			}	
			div1.setAttribute('class', 'pt-2');
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
		console.log(data)
	})
	.catch(error => {
		console.error(error);
});

/* End */


/* Hide/Show Functions */

function hideBlock(x) {

	//console.log(document.getElementById("gitHubPage").getClientRects()[0].y)
	var block = document.getElementById("gitHubProfile");
	block.style.display = "none";
	showBlock(x);
	//console.log(document.getElementById("gitHubPage").getClientRects()[0].y)
}

function showBlock(repoN) {
	//console.log(data);
	//console.log(document.getElementById("gitHubPage").getClientRects()[0].y)
	var block = document.getElementById("gitHubRepoItem");
	block.style.display = "block";
	//console.log(document.getElementById("gitHubPage").getClientRects()[0].y)
	//scrollTo(0, document.getElementById("gitHubPage").getClientRects()[0].y);
	

	//showPath("assembly-MIPS","min-max/main.asm");
	//console.log(repoN);	
	showPath(repoN,"");
}

let dati = new Map();

async function fetchAPI(repo, path) {
	let key = [repo, path];
	if (dati.has(key)) {
		console.log("Found something!");
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
		//console.log(dati.set(key, data))
		return data
	}
}

function showPath(repo, path) {
	fetchAPI(repo, path);
	//console.log(fetchAPI(repo, path));
	let key = [repo, path];
	console.log(key);
	console.log(dati.get(["assembly-MIPS",""]));
	//console.log(dati.get(key))
	//console.log(dati)
    /*card = document.getElementById('itemRepoDiv');
    container = document.getElementById('containerItemRepo');
    container.innerHTML = "";
    container.append(card);*/

	/*for (i = 0; i < popolari.results.length; i++) {

        movie = popolari.results[i];
        clone = card.cloneNode(true);
        clone.id = 'card-film-' + i;

        title = clone.getElementsByClassName('card-title')[0];
        overview = clone.getElementsByClassName('card-text')[0];
        image = clone.getElementsByClassName('card-img-top')[0];
        button = clone.getElementsByClassName('btn-primary')[0];

        title.innerHTML = movie.title;
        overview.innerHTML = movie.overview;
        image.src = image_base + movie.poster_path;
        button.href = "scheda-film.html?id=" + movie.id;

        clone.classList.remove('d-none')
        card.before(clone)
    }*/


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
