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
    var container = document.getElementById("repoGrid");
    // Clear any existing content
    container.innerHTML = '';

    // Sort by updated_at (newest first) optional
    data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    for(var i=0; i<data.length; i++) {
        var col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';

        // Format description
        var desc = data[i].description || "No description available";
        if(desc.length > 80) desc = desc.substring(0, 80) + "...";

        // Language Dot Color Logic (Basic mapping, default to gray)
        var lang = data[i].language || 'N/A';
        var langId = 'lang-' + data[i].name;
        
        col.innerHTML = `
            <div class="repo-card h-100" onclick="hideBlock('${data[i].name}')">
                <div class="repo-card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="repo-icon-box">
                            <i class="bi bi-journal-bookmark-fill"></i>
                        </div>
                        <i class="bi bi-arrow-right text-muted arrow-icon"></i>
                    </div>
                    
                    <h5 class="fw-bold mb-2 text-truncate">${data[i].name}</h5>
                    <p class="text-muted small mb-3 flex-grow-1">${desc}</p>
                    
                    <div class="d-flex align-items-center mt-auto pt-3 border-top border-light-subtle">
                        <span class="repoLanguageColor flex-shrink-0"></span>
                        <div class="ms-2 me-2 flex-grow-1" style="min-width: 0;">
                            <small id="${langId}" class="fw-medium text-secondary d-block text-truncate" title="${lang}">${lang}</small>
                        </div>
                        <div class="d-flex gap-3 text-muted small flex-shrink-0">
                            <span><i class="bi bi-star"></i> ${data[i].stargazers_count}</span>
                            <span><i class="bi bi-diagram-2"></i> ${data[i].forks_count}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
        
        // Fetch all languages for this repo
        if (data[i].languages_url) {
            fetchLanguages(data[i].languages_url, langId);
        }
    }
})
.catch(error => {
    console.error(error);
});

function fetchLanguages(url, elementId) {
    fetch(url, { headers: apiHeaders })
        .then(res => res.json())
        .then(langs => {
            const langList = Object.keys(langs).join(', ');
            const element = document.getElementById(elementId);
            if (element && langList) {
                element.textContent = langList;
                element.title = langList; // Tooltip for full text
            }
        })
        .catch(err => console.error('Error fetching languages:', err));
}

/* Fetch Last Update Date for CV Repo */
fetch('https://api.github.com/repos/T0ls/CV/commits?per_page=1', {
    method: 'GET',
    headers: apiHeaders
})
.then(response => {
    if (!response.ok) {
        throw new Error('Error requesting GitHub API: CV commits');
    }
    return response.json();
})
.then(data => {
    if (data && data.length > 0) {
        const lastCommitDate = new Date(data[0].commit.author.date);
        const formattedDate = lastCommitDate.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const lastUpdateElement = document.getElementById('lastUpdateDate');
        if (lastUpdateElement) {
            // Check current language to decide prefix
            const currentLang = localStorage.getItem('language') || 'IT';
            const prefix = currentLang === 'IT' ? 'Ultimo aggiornamento' : 'Last updated';
            lastUpdateElement.innerHTML = `${prefix} ${formattedDate}`;
            
            // Add a data attribute so translation logic can pick it up if language changes
            lastUpdateElement.setAttribute('data-last-date', formattedDate);
        }
    }
})
.catch(error => {
    console.error('Error fetching CV last commit:', error);
});

/* Hide/Show Functions */
function hideBlock(x) {
	var block = document.getElementById("gitHubProfile");
	block.style.display = "none";
	showBlock(x);
}

function showBlock(repoN) {
	// const owner = document.getElementById("profileUrlGitHub").innerHTML;
    const owner = 'T0ls'; // Hardcoded for now as profile fetch seems missing
	
    // 1. Fetch Repo Details
    fetch(`https://api.github.com/repos/${owner}/${repoN}`, { headers: apiHeaders })
        .then(res => res.json())
        .then(repo => {
            document.getElementById('projectTitle').textContent = repo.name;
            document.getElementById('projectDescription').textContent = repo.description;
            document.getElementById('projectLink').href = repo.html_url;
            
            const homepageBtn = document.getElementById('projectHomepage');
            if(repo.homepage) {
                homepageBtn.href = repo.homepage;
                homepageBtn.style.display = 'inline-flex';
            } else {
                homepageBtn.style.display = 'none';
            }

            const topicsContainer = document.getElementById('projectTopics');
            topicsContainer.innerHTML = '';
            if(repo.topics) {
                repo.topics.forEach(topic => {
                    const span = document.createElement('span');
                    span.className = 'badge bg-secondary-subtle text-secondary-emphasis rounded-pill border';
                    span.textContent = topic;
                    topicsContainer.appendChild(span);
                });
            }
        });

    // 2. Fetch README (HTML)
    // Create headers with specific Accept for HTML
    const readmeHeaders = { ...apiHeaders, 'Accept': 'application/vnd.github.html' };
    
    fetch(`https://api.github.com/repos/${owner}/${repoN}/readme`, { headers: readmeHeaders })
        .then(res => {
            if(res.ok) return res.text();
            throw new Error('No README');
        })
        .then(html => {
            const container = document.getElementById('readmeContainer');
            const content = document.getElementById('readmeContent');
            content.innerHTML = html;
            container.style.display = 'block';
        })
        .catch(() => {
            document.getElementById('readmeContainer').style.display = 'none';
        });

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

let repoCache = new Map();

async function fetchAPI(repo, path) {
	// Fixed: Use a string key for the Map instead of an array
	let key = `${repo}/${path}`;
	if (dati.has(key)) {
		return dati.get(key)
	} else {
		// Fixed: Handle empty path correctly to avoid double slashes
        const owner = 'T0ls';
		let url = `https://api.github.com/repos/${owner}/${repo}/contents`;
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

async function navigateTo(repoName, path) {
    const data = await fetchAPI(repoName, path);
    
    // Ensure we are rendering a directory (Array)
    if (Array.isArray(data)) {
        renderRepoContents(data, repoName, path);
    } else {
        console.error("Path is not a directory or data is missing.");
    }
}

// Added: Function to render repository contents
function renderRepoContents(data, repoName, currentPath = '') {
    const folderSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="height: 24px; width: 24px;">
  <path d="M20 6H12L10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6Z" fill="#8B8F99"/>
</svg>`;

    const fileSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="height: 24px; width: 24px;">
  <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" 
        stroke="#7A7D85" 
        stroke-width="2.5" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
  <path d="M14 2V8H20" 
        stroke="#7A7D85" 
        stroke-width="2.5" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
</svg>`;

	let container;

	if (currentPath && currentPath !== '') {
		container = document.querySelector("#githubRepoContent ul");
	} else {
		container = document.querySelector("#gitHubRepoItem ul");
	}
    
    if (!container) {
        // Fallback if the specific container isn't found (e.g. if githubRepoContent doesn't exist yet)
        container = document.querySelector("#gitHubRepoItem ul");
    }
    
    if (!container) {
        console.error("Container #gitHubRepoItem ul not found");
        return;
    }

    // Keep the header (first element) and remove the rest
    const header = container.firstElementChild;
    container.replaceChildren(header);

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
					${folderSvg}
					<a class="aHide ms-2 mb-0 text-truncate">..</a>
				</div>
			</div>
		`;
		container.appendChild(li);
	}

    // Sort: folders first, then files
    if (Array.isArray(data)) {
        data.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'dir' ? -1 : 1;
        });

        data.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            
            if (item.type === 'dir') {
                li.style.cursor = 'pointer';
                li.onclick = (e) => {
                    e.stopPropagation(); // Prevent bubbling issues
                    navigateTo(repoName, item.path);
                };
            } else if (item.type === 'file') {
                // Added: Click handler for files
                li.style.cursor = 'pointer';
                li.onclick = (e) => {
                    e.stopPropagation(); // Prevent bubbling issues
                    viewFile(repoName, item.path);
                };
            }

            const iconSvg = item.type === 'dir' ? folderSvg : fileSvg;
            
            li.innerHTML = `
                <div class="row mt-1 mb-1">
                    <div class="col-4 d-flex">
                        ${iconSvg}
                        <a class="aHide ms-2 mb-0 text-truncate">${item.name}</a>
                    </div>
                    <div class="col-6"><a class="aHide text-truncate mb-0"></a></div>
                    <div class="col-2"><p class="text-truncate mb-0 text-end"></p></div>
                </div>
            `;
            container.appendChild(li);
        });
    } else {
        console.error("Data is not an array:", data);
    }
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

/* Translation Logic */
function updateLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) {
        console.warn('Translations not available for', lang);
        return;
    }
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });

    // Update dynamic last update date if available
    const lastUpdateElement = document.getElementById('lastUpdateDate');
    if (lastUpdateElement && lastUpdateElement.hasAttribute('data-last-date')) {
        const date = lastUpdateElement.getAttribute('data-last-date');
        const prefix = lang === 'IT' ? 'Ultimo aggiornamento' : 'Last updated';
        lastUpdateElement.innerHTML = `${prefix} ${date}`;
    }

    // Save preference
    localStorage.setItem('language', lang);
}

// Initialize language
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'IT';
    const langSelect = document.querySelector('select[aria-label="Language"]');
    
    if (langSelect) {
        langSelect.value = savedLang;
        langSelect.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    }
    
    updateLanguage(savedLang);
});

/* End */
