var jsonResumeOutput = null;
var linkedinToJsonResume = function(profile) {

	var basics = {
		name: profile.firstName + ' ' + profile.lastName,
		label: '',
		picture: '',
		email: profile.emailAddress,
		phone: '',
		website: '',
		summary: profile.summary,
		location: {
			address: '',
			postalCode: '',
			city: profile.location.name,
			countryCode: profile.location.country.code.toUpperCase(),
			region: ''
		},
		profiles: []
	};

	var work = profile.positions ? profile.positions.values.map(function(p) {

		var object = {
			company: p.company.name,
			position: p.title,
			website: '',
			startDate: p.startDate.year + '-' + (p.startDate.month < 10 ? '0' : '') + p.startDate.month + '-01',
			summary: p.summary,
			highlights: []
		};

		if (p.endDate) {
			object.endDate = p.endDate.year + '-' + (p.endDate.month < 10 ? '0' : '') + p.endDate.month + '-01';
		}

		return object;
	}) : [];

	var education = profile.educations ? profile.educations.values.map(function(e) {

		var object = {
			institution: e.schoolName,
			area: e.fieldOfStudy,
			studyType: e.degree,
			startDate: '' + e.startDate.year + '-01-01',
			gpa: '',
			courses: []	// even though they are returned through the API, they can't
									// be tracked back to a school/education entry
		};

		if (e.endDate) {
			object.endDate = e.endDate.year + '-01-01';
		}

		return object;
	}) : [];

	var skills = profile.skills ? profile.skills.values.map(function(s) {
		return {
			name: s.skill.name,
			level: '',
			keywords: []
		};
	}) : [];

	var languages = profile.languages ? profile.languages.values.map(function(l) {
		return {
			language: l.language.name,
			fluency: ''
		};
	}) : [];

	var references = profile.recommendationsReceived ? profile.recommendationsReceived.values.map(function(r) {
			return {
				name: r.recommender.firstName + ' ' + r.recommender.lastName,
				reference: r.recommendationText
			};
	}) : [];

	jsonResumeOutput = {
		basics: basics,
		work: work,
		education: education,
		skills: skills,
		references: references,
		languages: languages
	};

	var output = document.getElementById('output');
	output.innerHTML = JSON.stringify(jsonResumeOutput, undefined, 2);
	Prism.highlightElement(output);
};

var downloadButton = document.querySelector('.download');
downloadButton.addEventListener('click', function() {
	save(JSON.stringify(jsonResumeOutput, undefined, 2), 'resume.json');
});
downloadButton.style.display = 'none';
var onLinkedInAuth = function() {
	IN.API.Profile("me")
		.fields("firstName", "lastName", "industry", "summary", "specialties",
			"positions", "email-address", "languages", "skills", "educations",
			"location:(name,country)", "recommendations-received")
		.result(function(data) {
			linkedinToJsonResume(data.values[0]);
			downloadButton.style.display = 'block';
		});
};

var onLinkedInLoad = function() {
	IN.Event.on(IN, "auth", onLinkedInAuth);
};
