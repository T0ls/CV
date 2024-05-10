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

function formatStringWithBr(str) {
	//console.log(str.replace(/\n/g, "<br>"))
	return str.replace(/\n/g, "<br>");
}


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

.catch(error => { console.error('An error occurred:', error); });
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
		showGitHubMenu(data);
		//console.log(data)
	})
	.catch(error => {
		console.error(error);
});

function fetchMenu() {
	document.getElementById('containerTextDisplayRepo').style.display = "none";
	document.getElementById('containerItemRepo').style.display = "none";
	document.getElementById("gitHubProfile").style.display = "block";
	document.getElementById("gitHubRepoItem").style.display = "none";
	fetch('https://api.github.com/users/T0ls/repos', { method: 'GET', headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + gitHubApi_Key,} })
		.then(response => { if (!response.ok) {	throw new Error('Error requesting GitHub API: repositories'); }	return response.json();})
		.then(data => {	showGitHubMenu(data);})
		.catch(error => { console.error(error);	});
}

function showGitHubMenu(repoData) {
	containerNav = document.getElementById('repoNavContainer');
	containerInfo = document.getElementById('repoInfoContainer');
	cardNav = document.getElementById('repoNavBar');
	cardInfo = document.getElementById('gitHubRepoItems');
	containerNav.innerHTML = "";
	containerInfo.innerHTML = "";
	containerNav.append(cardNav);
	containerInfo.append(cardInfo);
	for (i = 0; i < repoData.length; i++) {

		let data = repoData[i];
		cloneNav = cardNav.cloneNode(true);
		cloneInfo = cardInfo.cloneNode(true);
		aNav = cloneNav.getElementsByClassName('repoNavList')[0];
		aInfo = cloneInfo.getElementsByClassName('repoNavLink')[0];
		h4Info = cloneInfo.getElementsByClassName('repoNavTitle')[0];
		pInfo = cloneInfo.getElementsByClassName('repoNavDescr')[0];
		langInfo = cloneInfo.getElementsByClassName('repoNavLang')[0];
		if (i != 0) {
			cloneInfo.getElementsByClassName('repoInfoDiv')[0].setAttribute('class', 'border-top');
		}
		aNav.setAttribute('href', '#item-' + data.name);
		aNav.textContent = data.name;
		aInfo.setAttribute('href', '#item-' + data.name);
		aInfo.setAttribute('onclick', 'hideBlock(\'' + data.name + "!key!" +  "" + '\')');
		h4Info.innerHTML = data.name;
		pInfo.innerHTML = data.description;
		langInfo.innerHTML = data.language;

		cloneNav.classList.remove('d-none')
		cloneInfo.classList.remove('d-none')
		cardNav.before(cloneNav)
		cardInfo.before(cloneInfo)
	}
}

/* End */


/* Hide/Show Functions */

function hideBlock(repoN) {

	document.getElementById("gitHubProfile").style.display = "none";
	//console.log(data);
	//console.log(document.getElementById("gitHubPage").getClientRects()[0].y)
	document.getElementById("gitHubRepoItem").style.display = "block";
	//console.log(document.getElementById("gitHubPage").getClientRects()[0].y)
	//scrollTo(0, document.getElementById("gitHubPage").getClientRects()[0].y);

	//showPath("assembly-MIPS","min-max/main.asm");
	//console.log(repoN);	
	showPath(repoN.split("!key!")[0], repoN.split("!key!")[1]);
}

let dati = new Map();
// get repo infos
async function fetchAPI(repo, path) {
	let key = repo + "!key!" + path;
	//console.log(key)
	if (dati.has(key)) {
		//console.log("Found something!");
		return dati.get(key)
	} else {
		let response = await fetch(`https://api.github.com/repos/${document.getElementById("profileUrlGitHub").innerHTML}/${key.split("!key!")[0]}/contents/${key.split("!key!")[1]}`, {
			method: 'GET',
			headers: { 'Accept': 'application/json',  'Authorization': 'Bearer ' + gitHubApi_Key, }
		})
		if (!response.ok) {
			console.error('Error requesting GitHub API')
		} 
		let data = await response.json()
		dati.set(key, data);
		//console.log(dati.set(key, data))
		//console.log(data)
		return data
	}
}

// get repo commits infos
async function fetchCommits(repo) {
	let response = await fetch(`https://api.github.com/repos/${document.getElementById("profileUrlGitHub").innerHTML}/${repo}/commits/f13a9251168852dcec6cd78328408932b6787bbd`, {
		method: 'GET',
		headers: { 'Accept': 'application/json',  'Authorization': 'Bearer ' + gitHubApi_Key, }
	})
	if (!response.ok) {
		console.error('Error requesting GitHub API')
	} 
	let data = await response.json()
	console.log(data)
	return data
}

function showPath(repo, path) {
		fetchCommits(repo);	
		fetchAPI(repo, path).then(function(repoData){
		document.getElementById("orginalRepoGitHubLink").innerHTML = repo
		let linkOriginalRepo
		if (repoData.length === undefined) {
			linkOriginalRepo = repoData.html_url.replace("https://github.com/", ""); 
		} else {
			linkOriginalRepo = repoData[0].html_url.replace("https://github.com/", ""); 
		}
		linkOriginalRepo =  linkOriginalRepo.split("/");
		document.getElementById("orginalRepoGitHubLink").href = `https://github.com/${linkOriginalRepo[0]}/${linkOriginalRepo[1]}`;
		let app;
		if (path.split("/")[0] !== "") {
			if (path.split("/") !== 1 ) {
				app = path.split("/");
				app.pop();
				app = app.join("/");
			} else {
				app = ""
			}
			backButton = document.getElementById('pathBackLink');
			backButton.setAttribute('onclick', 'hideBlock(\'' + repo + "!key!" + app + '\')');
		} else {
			backButton = document.getElementById('pathBackLink');
			backButton.setAttribute('onclick', 'fetchMenu()');
		}
		if ("encoding" in repoData) {
			document.getElementById('containerTextDisplayRepo').style.display = "block";
			document.getElementById('containerItemRepo').style.display = "none";

			container = document.getElementById('containerTextDisplayRepo');
			card = document.getElementById('repoIdTextList');
			container.innerHTML = "";
			container.append(card);

			clone = card.cloneNode(true);
			nome = clone.getElementsByClassName('repoClassText')[0];
			//console.log(formatStringWithBr(atob(repoData.content)))
			console.log(atob(repoData.content));
			console.log(nome);
			nome.innerHTML = formatStringWithBr(atob(repoData.content));	
			clone.classList.remove('d-none')
			card.before(clone)

			document.getElementById('repoIdTextList').style.display = "none";
		} else {
			document.getElementById('containerTextDisplayRepo').style.display = "none";
			document.getElementById('containerItemRepo').style.display = "block";

			container = document.getElementById('containerItemRepo');
			card = document.getElementById('itemRepoLi');
			container.innerHTML = "";
			container.append(card);
			for (i = 0; i < repoData.length; i++) {

				let data = repoData[i];
				clone = card.cloneNode(true);
				image = clone.getElementsByClassName('repoClassImage')[0];
				nome = clone.getElementsByClassName('repoClassName')[0];
				if (data.type == "file") {
					image.src = "file2X.png";
				} else {
					image.src = "folder2X.png";
				} 
				nome.innerHTML = repoData[i].name; 
				nome.setAttribute('onclick', 'hideBlock(\'' + repo + "!key!" + repoData[i].path + '\')');
				clone.classList.remove('d-none')
				card.before(clone)
			}
		}
	});
}

/* End */


