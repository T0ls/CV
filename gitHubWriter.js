import data from './gitHubREST.js';

console.log(data);

var avatar = document.getElementById("avatarGitHub");
var profileUrl = document.getElementById("profileUrlGitHub");
avatar.src = data[0].owner.avatar_url;
profileUrl.href = data[0].owner.html_url;
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
	//console.log(link);
	
	// Create the scrollbar items list
	var div1 = document.createElement('div');
	var a = document.createElement('a');
	var h4 = document.createElement('h4');
	var p1 = document.createElement('p');
	var p2 = document.createElement('p');
	var span = document.createElement('span');
	var div2 = document.createElement('div');
	// div
	if (i !== 0) {
		div1.setAttribute('class', 'border-top pt-3');
	}	
	div1.setAttribute('id', 'item-' + data[i].name);

	div2.setAttribute('class', 'd-inline-flex');
	div2.setAttribute('id', 'dotDiv' + data[i].name);
	// a
	a.setAttribute('id', 'repoLink-' + data[i].name);
	//a.setAttribute('onclick', 'hideBlock(' + i + ')');
	a.setAttribute('href', data[i].html_url);
	a.setAttribute('target', '_blank');
	// h4
	//h4.setAttribute('class', 'text-primary')
	h4.innerHTML = data[i].name;
	// p
	p1.setAttribute('class', 'm-1')
	p1.innerHTML = data[i].description;
	p2.innerHTML = data[i].language;
	// span
	span.setAttribute('class','repo-language-color');

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

/*

Useful resources:
	Profile name: owner.login 
	Avatar: ownner.avatar_url
	Profile url: owner.html_url
	Repo name: name
	Descr: description
	Url repo: html_url
	Last update: updated_at
	Laguage: language
	Stars: stargazers_count
	Watching: watchers
	Views: watchers_count
	Forks: forks

<div class="d-inline-flex">
	<span class="repo-language-color"></span>
	<p class="p-0">Go</p>
</div>


	<div id="item-1" class="border-top pt-3">
	<h4>Item 1</h4>
	<p>..</p>
	</div>
*/