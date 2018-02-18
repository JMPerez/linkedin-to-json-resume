/* exported onLinkedInLoad */

// todo: import publications, awards, volunteer
class LinkedInToJsonResume {
  constructor() {
    this.target = {};
  }

  getOutput() {
    // sort the object
    const propertyOrder = [
      'basics',
      'work',
      'volunteer',
      'education',
      'awards',
      'publications',
      'skills',
      'languages',
      'interests',
      'references',
      'projects'
    ];

    const sortedTarget = {};
    for (const p of propertyOrder) {
      if (p in this.target) {
        sortedTarget[p] = this.target[p];
      }
    }
    return sortedTarget;
  }

  _extend(target, source) {
    target = target || {};
    Object.keys(source).forEach(key => target[key] = source[key]);
  }

  processProfile(source) {
    this.target.basics = this.target.basics || {};
    this._extend(this.target.basics, {
      name: `${source.firstName} ${source.lastName}`,
      label: source.headline,
      picture: source.pictureUrl,
      phone: source.phoneNumbers && source.phoneNumbers._total ? source.phoneNumbers.values[0].phoneNumber : '',
      website: '',
      summary: source.summary,
      location: {
        address: source.address,
        postalCode: '',
        city: source.location ? source.location.name : '',
        countryCode: source.location ? source.location.country.code.toUpperCase() : '',
        region: ''
      },
      profiles: []
    });
  }

  processEmail(source) {
    this.target.basics = this.target.basics || {};
    this._extend(this.target.basics, {'email': source.address});
  }

  processPosition(source) {
    function processPosition(position) {
      let object = {
        company: position.companyName,
        position: position.title || '',
        website: '',
        startDate: `${position.startDate}`,
        summary: position.description,
        highlights: []
      };

      if (position.endDate) {
        object.endDate = `${position.endDate}`;
      }

      return object;
    }

    this.target.work = source.map(processPosition);
  }

  processEducation(source) {
    function processEducation(education) {
      let object = {
        institution: education.schoolName,
        area: '',
        studyType: education.degree,
        startDate: `${education.startDate}`,
        gpa: '',
        courses: []
      };

      if (education.endDate) {
        object.endDate = `${education.endDate}`;
      }

      return object;
    }

    this.target.education = source.map(processEducation);
  }

  processSkills(skills) {
    this.target.skills = skills.map(skill => ({
        name: skill,
        level: '',
        keywords: []
      }));
  }

  processLanguages(source) {
    function cleanProficiencyString(proficiency) {
      proficiency = proficiency.toLowerCase().replace(/_/g, ' ');
      return proficiency[0].toUpperCase() + proficiency.substr(1);
    }

    this.target.languages = source.map(language => ({
      language: language.name,
      fluency: language.proficiency ? cleanProficiencyString(language.proficiency) : null
    }));
  }

  processReferences(source) {
    this.target.references = source.map(reference => ({
      name: `${reference.recommenderFirstName} ${reference.recommenderLastName} - ${reference.recommenderCompany}`,
      reference: reference.recommendationBody
    }));
  }

  processInterests(source) {
    this.target.interests = source.map(interest => ({
      name: interest,
      keywords: []
    }));
  }

  processProjects(source) {
    function processProjects(project) {

       let p = {
          name: project.title,
          startDate: `${project.startDate}`,
          summary: project.description,
          url: project.url
        };
       if(project.endDate) {
          p.endDate = `${project.endDate}`;
       }
       return p;
    }

    this.target.projects = source.map(processProjects);
  }

  processPublications(source) {
    function processPublications(publication) {

      let p = {
        name: publication.name,
        publisher: publication.publisher,
        releaseDate: publication.date,
        website: publication.url,
        summary: publication.description
      };
      return p;
   }

   this.target.publications = source.map(processPublications);
  }
}

export default LinkedInToJsonResume;
