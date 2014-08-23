var linkedinToJsonResume = function(profile) {

	var bio = {
		firstName: profile.firstName,
		lastName: profile.lastName,
		email: {
			personal: profile.emailAddress
		},
		phone: { },
		summary: profile.summary,
		location: {
			city: profile.location.name,
			countryCode: profile.location.country.code.toUpperCase()
		}
	};

	var work = profile.positions.values.map(function(p) {

		var object = {
			company: p.company.name,
			position: p.title,
			startDate: p.startDate.year + '-' + (p.startDate.month < 10 ? '0' : '') + p.startDate.month,
			summary: p.summary
		};

		if (p.endDate) {
			object.endDate = p.endDate.year + '-' + (p.endDate.month < 10 ? '0' : '') + p.endDate.month;
		}

		return object;
	});

	var education = profile.educations.values.map(function(e) {
		return {
			institution: e.schoolName,
			startDate: '' + e.startDate.year,
			endDate: '' + e.endDate.year,
			area: e.fieldOfStudy,
			summary: e.notes,
			studyType: e.degree,
			courses: []	// even though they are returned through the API, they can't
						// be tracked back to a school/education entry
		};
	});

	var skills = profile.skills.values.map(function(s) {
		return {
			name: s.skill.name,
			keywords: []
		};
	});

	var references = profile.recommendationsReceived.values.map(function(r) {
			return {
				name: r.recommender.firstName + ' ' + r.recommender.lastName,
				reference: r.recommendationText
			};
	});

	var allData = {
		bio: bio,
		work: work,
		education: education,
		skills: skills,
		references: references
	}

	document.getElementById('output').value = JSON.stringify(allData, undefined, 2);
}

var onLinkedInAuth = function() {
	IN.API.Profile("me")
		.fields("firstName", "lastName", "industry", "summary", "specialties",
			"positions", "email-address", "languages", "skills", "educations",
			"location:(name,country)", "recommendations-received")
		.result(function(data) {
			linkedinToJsonResume(data.values[0]);
		});
};

var onLinkedInLoad = function() {
	IN.Event.on(IN, "auth", onLinkedInAuth);
};