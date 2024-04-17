import data from './gitHubREST.js';

export function hideBlock(x) {
	var block = document.getElementById("gitHubProfile");
	block.style.display = "none";
	showBlock(x);
}

export function showBlock(x) {
	var block = document.getElementById("gitHubRepoItem");
	block.style.display = "block";
	console.log(x);
	console.log(data[x]);
}	 

