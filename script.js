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
let gitHubApi_Key = null;
let apiHeaders = { 'Accept': 'application/json' };

try {
    if (typeof gitHubToken !== 'undefined' && gitHubToken.token) {
        gitHubApi_Key = gitHubToken.token;
        apiHeaders['Authorization'] = 'Bearer ' + gitHubApi_Key;
    }
} catch (e) {
    console.log("No GitHub token found, using public API");
}

/* GitHub Api fetch Profile Info */
const profileUrl = gitHubApi_Key ? 'https://api.github.com/user' : 'https://api.github.com/users/T0ls';

fetch(profileUrl, {
	method: 'GET',
	headers: apiHeaders
})
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
/* GitHub Api fetch Repositories */
fetch('https://api.github.com/users/T0ls/repos', {
	method: 'GET',
	headers: apiHeaders
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
			link.setAttribute('class', 'nav-link text-truncate');
			link.setAttribute('style', 'max-width: 100%');
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
	const owner = document.getElementById("profileUrlGitHub").innerHTML;
	
	// Fetch repository contents
	fetch(`https://api.github.com/repos/${owner}/${repoN}/contents`, {
		method: 'GET',
		headers: apiHeaders
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Error requesting GitHub API: repo');
			}
			return response.json();
		})
		.then(data => {
			var block = document.getElementById("gitHubRepoItem");
			block.style.display = "block";
			
			// Fixed: Use scrollIntoView to correctly scroll to the repository section
			document.getElementById("gitHubPage").scrollIntoView({ behavior: 'smooth' });
			
			// Render the repository contents
			renderRepoContents(data, repoN, '');
		})
		.catch(error => {
			console.error(error);
	});

	// Added: Fetch latest commit info
	fetch(`https://api.github.com/repos/${owner}/${repoN}/commits?per_page=1`, {
		method: 'GET',
		headers: apiHeaders
	})
	.then(response => response.json())
	.then(data => {
		if (data && data.length > 0) {
			const commit = data[0];
			const commitDate = new Date(commit.commit.author.date);
			const timeAgo = getTimeAgo(commitDate);

			// Update Last Commit Description
			const descrLink = document.getElementsByName("lastCommitDescr")[0];
			descrLink.innerHTML = commit.commit.message;
			descrLink.href = commit.html_url;
			descrLink.target = "_blank"; // Open in new tab

			// Update Last Commit Hash
			const hashLink = document.getElementsByName("lastCommitHash")[0];
			hashLink.innerHTML = commit.sha.substring(0, 7);
			hashLink.href = commit.html_url;
			hashLink.target = "_blank";

			// Update Time
			document.getElementsByName("lastCommitTime")[0].innerHTML = timeAgo;

			// Update Commits Button
			const btnCommits = document.getElementById("btnCommits");
			btnCommits.onclick = () => window.open(`https://github.com/${owner}/${repoN}/commits`, '_blank');
		}
	})
	.catch(error => console.error('Error fetching commits:', error));
}

// Helper function to calculate "time ago"
function getTimeAgo(date) {
	const seconds = Math.floor((new Date() - date) / 1000);
	let interval = seconds / 31536000;
	if (interval > 1) return Math.floor(interval) + " years ago";
	interval = seconds / 2592000;
	if (interval > 1) return Math.floor(interval) + " months ago";
	interval = seconds / 86400;
	if (interval > 1) return Math.floor(interval) + " days ago";
	interval = seconds / 3600;
	if (interval > 1) return Math.floor(interval) + " hours ago";
	interval = seconds / 60;
	if (interval > 1) return Math.floor(interval) + " minutes ago";
	return Math.floor(seconds) + " seconds ago";
}

// Added: Function to go back to the repository list
function showRepoList() {
	document.getElementById("gitHubRepoItem").style.display = "none";
	document.getElementById("gitHubProfile").style.display = "block";
}

let dati = new Map();

async function fetchAPI(repo, path) {
	// Fixed: Use a string key for the Map instead of an array
	let key = `${repo}/${path}`;
	if (dati.has(key)) {
		return dati.get(key)
	} else {
		// Fixed: Handle empty path correctly to avoid double slashes
		let url = `https://api.github.com/repos/${document.getElementById("profileUrlGitHub").innerHTML}/${repo}/contents`;
		if (path && path !== '') {
			url += `/${path}`;
		}
		let response = await fetch(url, {
			method: 'GET',
			headers: apiHeaders
		})
		if (!response.ok) {
			console.error('Error requesting GitHub API')
		} 
		let data = await response.json()
		dati.set(key, data);
		return data
	}
}

// Added: Function to navigate to a folder
async function navigateTo(repo, path) {
	const data = await fetchAPI(repo, path);
	renderRepoContents(data, repo, path);
}

// Added: Function to render repository contents
function renderRepoContents(data, repoName, currentPath = '') {
    const container = document.querySelector("#gitHubRepoItem ul");
    const listItems = container.querySelectorAll("li");
    
    // Remove all items except the first one (header)
    for (let i = 1; i < listItems.length; i++) {
        listItems[i].remove();
    }

	// Added: Show ".." if inside a folder
	if (currentPath && currentPath !== '') {
		const li = document.createElement('li');
		li.className = 'list-group-item';
		li.style.cursor = 'pointer';
		
		// Calculate parent path
		const parts = currentPath.split('/');
		parts.pop();
		const parentPath = parts.join('/');
		
		li.onclick = () => navigateTo(repoName, parentPath);

		li.innerHTML = `
			<div class="row mt-1 mb-1">
				<div class="col-4 d-flex">
					<img src="folder2x.png" style="height: 24px; width: 24px;">
					<a class="aHide ms-2 mb-0 text-truncate">..</a>
				</div>
			</div>
		`;
		container.appendChild(li);
	}

    // Sort: folders first, then files
    data.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'dir' ? -1 : 1;
    });

    data.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        
        if (item.type === 'dir') {
            li.style.cursor = 'pointer';
            li.onclick = () => navigateTo(repoName, item.path);
        } else if (item.type === 'file') {
			// Added: Click handler for files
			li.style.cursor = 'pointer';
			li.onclick = () => viewFile(repoName, item.path);
		}

        const iconSrc = item.type === 'dir' ? 'folder2x.png' : 'file2x.png';
        
        li.innerHTML = `
            <div class="row mt-1 mb-1">
                <div class="col-4 d-flex">
                    <img src="${iconSrc}" style="height: 24px; width: 24px;">
                    <a class="aHide ms-2 mb-0 text-truncate">${item.name}</a>
                </div>
                <div class="col-6"><a class="aHide text-truncate mb-0"></a></div>
                <div class="col-2"><p class="text-truncate mb-0 text-end"></p></div>
            </div>
        `;
        container.appendChild(li);
    });
}

// Added: Function to view file content
async function viewFile(repo, path) {
	const data = await fetchAPI(repo, path);
	
	if (data.content && data.encoding === 'base64') {
		// Decode base64 content
		// Note: atob handles simple ASCII. For UTF-8 characters, we might need a better decoder, 
		// but this works for standard code/text files.
		const content = decodeURIComponent(escape(window.atob(data.content)));
		
		document.getElementById("fileNameDisplay").textContent = data.name;
		document.getElementById("fileContentDisplay").textContent = content;
		
		document.getElementById("gitHubRepoItem").style.display = "none";
		document.getElementById("gitHubFileViewer").style.display = "block";
	} else {
		console.error("File content not available or not base64 encoded");
	}
}

// Added: Function to close file viewer
function closeFileViewer() {
	document.getElementById("gitHubFileViewer").style.display = "none";
	document.getElementById("gitHubRepoItem").style.display = "block";
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
