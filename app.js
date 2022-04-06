import fs from 'fs';
import fetch from 'node-fetch';

const modulesList = JSON.parse(fs.readFileSync('./repositories.json', 'utf-8'));

async function getModules() {
	for(const moduleId in modulesList) {
		let moduleReleasesResponse = null;
		let moduleJsonResponse = null;
		switch(modulesList[moduleId].repositoryType) {
			case 'github':
				moduleReleasesResponse = await fetch(`https://api.github.com/repos/${modulesList[moduleId].repository}/releases`);
				moduleJsonResponse = await fetch(`https://raw.githubusercontent.com/${modulesList[moduleId].repository}/master/module.json`);
				break;
			default:
				throw new Error(`Invalid repostory type ! ${modulesList[moduleId].repositoryType} is unknown.`);
		}

		modulesList[moduleId].versions = await moduleReleasesResponse.json();
		modulesList[moduleId].moduleJson = await moduleJsonResponse.json();
	}

	fs.writeFileSync('./repositories.json', JSON.stringify(modulesList, null, 4));
}

getModules();