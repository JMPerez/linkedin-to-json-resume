/* global module */
/* exported onLinkedInLoad */

class LinkedInToJsonResume {
  constructor() {

  }

  process(profile) {
    let target = {};
    this._processBasics(profile, target);
    this._processWork(profile, target);
    this._processEducation(profile, target);
    this._processSkills(profile, target);
    this._processLanguages(profile, target);
    this._processReferences(profile, target);
    this._processVolunteer(profile, target);
    this._processAwards(profile, target);
    return target;
  }

  _processBasics(source, target) {
    target.basics = {
      name: source.firstName + ' ' + source.lastName,
      label: source.headline,
      picture: source.pictureUrl,
      email: source.emailAddress,
      phone: source.phoneNumbers._total ? source.phoneNumbers.values[0].phoneNumber : '',
      website: '',
      summary: source.summary,
      location: {
        address: '',
        postalCode: '',
        city: source.location.name,
        countryCode: source.location.country.code.toUpperCase(),
        region: ''
      },
      profiles: []
    };
  }

  _processWork(source, target) {

    function processPosition(position) {
      let object = {
        company: position.company.name,
        position: position.title,
        website: '',
        startDate: position.startDate.year + '-' + (position.startDate.month < 10 ? '0' : '') + position.startDate.month + '-01',
        summary: position.summary,
        highlights: []
      };

      if (position.endDate) {
        object.endDate = position.endDate.year + '-' + (position.endDate.month < 10 ? '0' : '') + position.endDate.month + '-01';
      }

      return object;
    }

    let work = source.positions && source.positions.values ?
      source.positions.values.map(processPosition) : [];

    target.work = work;
  }

  _processEducation(source, target) {

    function processEducation(education) {
      let object = {
        institution: education.schoolName,
        area: education.fieldOfStudy,
        studyType: education.degree,
        startDate: '' + education.startDate.year + '-01-01',
        gpa: '',
        courses: [] // even though they are returned through the API, they can't
                    // be tracked back to a school/education entry
      };

      if (education.endDate) {
        object.endDate = education.endDate.year + '-01-01';
      }

      return object;
    }

    let education = source.educations && source.educations.values ?
      source.educations.values.map(processEducation) : [];
  
    target.education = education;
  }

  _processSkills(source, target) {

    let skills = source.skills && source.skills.values ?
      source.skills.values.map(skill => ({
        name: skill.skill.name,
        level: '',
        keywords: []
      })) : [];

    target.skills = skills;
  }

  _processLanguages(source, target) {

    let languages = source.languages &&
      source.languages.values ? source.languages.values.map(language => ({
        language: language.language.name,
        fluency: ''
      })) : [];

    target.languages = languages;
  }

  _processReferences(source, target) {

    let references = source.recommendationsReceived &&
      source.recommendationsReceived.values ? source.recommendationsReceived.values.map(reference => ({
        name: reference.recommender.firstName + ' ' + reference.recommender.lastName,
        reference: reference.recommendationText
      })) : [];

    target.references = references;
  }

  _processVolunteer(source, target) {

    let volunteer = source.volunteer && source.volunteer.values ?
        source.volunteer.volunteerExperiences.values.map(volunteer => ({
          organization: volunteer.organization.name,
          position: volunteer.role
          // unfortunately, startDate and endDate are not exposed
          // see https://developer.linkedin.com/forum/dates-volunteer-experience
        })) : [];

    target.volunteer = volunteer;
  }

  _processAwards(source, target) {

    let awards = source.honorsAwards &&
        source.honorsAwards.values ? source.honorsAwards.values.map(honorsAward => ({
          awarder: honorsAward.issuer,
          title: honorsAward.name
          // unfortunately, startDate and endDate are not exposed
        })) : [];

    target.awards = awards;
  }
}

module.exports = LinkedInToJsonResume;