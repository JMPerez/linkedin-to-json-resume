/* global module */
/* exported onLinkedInLoad */

// todo: import publications, awards, volunteer
class LinkedInToJsonResume {
  constructor() {
    this.target = {};
  }

  getOutput() {
    // sort the object
    var propertyOrder = [
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

    var sortedTarget = {};
    for (var p of propertyOrder) {
      if (p in this.target) {
        sortedTarget[p] = this.target[p];
      }
    }
    return sortedTarget;
  }

  _extend(target, source) {
    target = target || {};
    Object.keys(source).forEach(key => target[key] = source[key]);
  }

  processProfile(source) {
    this.target.basics = this.target.basics || {};
    this._extend(this.target.basics, {
      name: source.firstName + ' ' + source.lastName,
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
        startDate: position.startDate.year + '-' + (position.startDate.month < 10 ? '0' : '') + position.startDate.month + '-01',
        summary: position.description,
        highlights: []
      };

      if (position.endDate) {
        object.endDate = position.endDate.year + '-' + (position.endDate.month < 10 ? '0' : '') + position.endDate.month + '-01';
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
        startDate: '' + education.startDate + '-01-01',
        gpa: '',
        courses: []
      };

      if (education.endDate) {
        object.endDate = education.endDate + '-01-01';
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
      name: reference.recommenderFirstName + ' ' + reference.recommenderLastName,
      reference: reference.recommendationBody
    }));
  }
  
  processInterests(source) {

    this.target.references = source.map(interest => ({
      name: interest,
      keywords: []
    }));
  }

  processProjects(source) {

    function processProjects(project) {

       let p = {
          name: project.title,
          startDate: project.startDate.year + '-' + (project.startDate.month < 10 ? '0' : '') + project.startDate.month + '-01',
          summary: project.description,
          url: project.url
        };
       if(project.endDate) {
          p.endDate = project.endDate.year + '-' + (project.endDate.month < 10 ? '0' : '') + project.endDate.month + '-01';
       }
       return p;
    }

    this.target.projects = source.map(processProjects)
  }

}

module.exports = LinkedInToJsonResume;
