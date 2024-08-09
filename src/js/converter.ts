/* exported onLinkedInLoad */
import CountryCodes from "./country-codes";

interface Output {
  basics?: object;
  education?: object;
  languages?: object;
  interests?: object;
  projects?: object;
  publications?: object;
  references?: object;
  skills?: object;
  work?: object;
  volunteer?: object;
  awards?: object;
  certificates: object;
}

interface Position {
  name: string;
  position: string;
  url: string;
  startDate: string;
  summary: string;
  highlights: Array<string>;
  endDate?: string;
}

interface Education {
  institution: string;
  url?: string;
  area: string;
  studyType: string;
  startDate: string;
  score: string;
  courses: Array<string>;
  endDate?: string;
}

class LinkedInToJsonResume {
  target: Output;
  constructor() {
    this.target = {};
  }

  getOutput() {
    // sort the object
    const propertyOrder = [
      "basics",
      "work",
      "volunteer",
      "education",
      "awards",
      "certificates",
      "publications",
      "skills",
      "languages",
      "interests",
      "references",
      "projects",
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
    target = target || {};
    Object.keys(source).forEach((key) => (target[key] = source[key]));
  }

  processProfile(source) {
    this.target.basics = this.target.basics || {};

    // Splitting the address into city, region and country
    // and trimming the values
    // example: "Dublin, Leinster, Ireland" => ["Dublin", "Leinster", "Ireland"]
    const addressArray = source.geoLocation
      .split(",")
      .map((item) => item.trim());

    const ccItem = CountryCodes.find(
      (item) => item.name === addressArray[addressArray.length - 1]
    );
    let countryCode = "";
    if (ccItem) {
      countryCode = ccItem["alpha-2"];
    }

    // Extracting the URL from the LinkedIn profile
    // this regex will match the first URL in the format [NETWORK:URL]
    // This regex will remove the network part and extract the URL
    // it applies for https and http URLs
    // e.g. [Twitter:https://twitter.com/housamz] will return https://twitter.com/housamz
    const websiteRegex = /\[([A-Z]+):(https?:\/\/[^\s,\]]+)/;

    this._extend(this.target.basics, {
      name: `${source.firstName} ${source.lastName}`,
      label: source.headline,
      image: "",
      email: "",
      phone: "",
      url: source.websites
        ? source.websites.match(websiteRegex)[2]
        : "",
      summary: source.summary,
      location: {
        address: source.address,
        postalCode: source.zipCode,
        city: source.geoLocation ? addressArray[0] : "",
        countryCode: countryCode,
        region: addressArray[1],
      },
      profiles: source.twitterHandles
        ? [
            {
              network: "Twitter",
              username: source.twitterHandles,
              url: `https://twitter.com/${source.twitterHandles}`,
            },
          ]
        : [],
    });
  }

  processEmail(source) {
    this.target.basics = this.target.basics || {};
    this._extend(this.target.basics, { email: source.address });
  }

  processPosition(source) {
    function processPosition(position) {
      let object = <Position>{
        name: position.companyName,
        position: position.title || "",
        url: "",
        startDate: `${position.startDate}`,
        endDate: "",
        summary: position.description,
        highlights: [],
      };

      // ensure the end date is after the start date directly
      if (position.endDate) {
        object.endDate = `${position.endDate}`;
      } else {
        delete object.endDate;
      }

      return object;
    }

    this.target.work = source.map(processPosition);
  }

  processEducation(source) {
    function processEducation(education) {
      let object = <Education>{
        institution: education.schoolName,
        url: "",
        area: "",
        studyType: education.degree,
        startDate: `${education.startDate}`,
        endDate: "",
        score: "",
        courses: [],
      };

      // ensure the end date is after the start date directly
      if (education.endDate) {
        object.endDate = `${education.endDate}`;
      } else {
        delete object.endDate;
      }

      return object;
    }

    this.target.education = source.map(processEducation);
  }

  processSkills(skills) {
    this.target.skills = skills.map((skill) => ({
      name: skill,
      level: "",
      keywords: [],
    }));
  }

  processLanguages(languages) {
    function cleanProficiencyString(proficiency) {
      proficiency = proficiency.toLowerCase().replace(/_/g, " ");
      return proficiency[0].toUpperCase() + proficiency.substr(1);
    }

    this.target.languages = languages.map((language) => ({
      language: language.name,
      fluency: language.proficiency
        ? cleanProficiencyString(language.proficiency)
        : null,
    }));
  }

  processReferences(references) {
    this.target.references = references.map((reference) => ({
      name: `${reference.recommenderFirstName} ${reference.recommenderLastName} - ${reference.recommenderCompany}`,
      reference: reference.recommendationBody,
    }));
  }

  processInterests(interests) {
    this.target.interests = interests.map((interest) => ({
      name: interest,
      keywords: [],
    }));
  }

  processProjects(projects) {
    this.target.projects = projects.map((project) => ({
      ...{
        name: project.name,
        startDate: `${project.startDate}`,
        endDate: project.endDate ? `${project.endDate}` : "",
        description: project.description,
        highlights: project.highlights,
        url: project.url,
      },
      ...(project.endDate ? { endDate: `${project.endDate}` } : {}),
    }));
  }

  processPublications(publications) {
    this.target.publications = publications.map((publication) => ({
      name: publication.name,
      publisher: publication.publisher,
      releaseDate: publication.date,
      url: publication.url,
      summary: publication.description,
    }));
  }

  processPhoneNumber(number) {
    this._extend(this.target.basics, {
      phone: number.number,
    });
  }

  processAwards(awards) {
    this.target.awards = awards.map((award) => ({
      ...{
        title: award.title,
        date: `${award.date}`,
        awarder: award.awarder,
        summary: award.summary,
      },
    }));
  }

  processCertificates(certificates) {
    this.target.certificates = certificates.map((certificate) => ({
      ...{
        name: certificate.name,
        date: `${certificate.date}`,
        issuer: certificate.issuer,
        url: certificate.url,
      },
    }));
  }

  processEndorsements(endorsements) {
    // This will update the level in this.target.skills
    // according to how many endorsements the skill has
    const processedSkills = new Set<string>();
    this.target.skills.map((skill) => {
      endorsements.filter((endorsement) => {
        if (endorsement.name === skill.name) {
          skill.level = endorsement.level;
          processedSkills.add(skill.name);
        }
      });
    });

    // This will add the skills that have endorsements but
    // are not in the skills array
    endorsements.forEach((endorsement) => {
      if (!processedSkills.has(endorsement.name)) {
        this.target.skills.push({ ...endorsement, keywords: [] });
        processedSkills.add(endorsement.name);
      }
    });

    // Sort the skills by level
    this.target.skills?.sort((a, b) => {
      return b.level - a.level;
    });
  }

  processFollows(interests) {
    if (!this.target.interests) {
      this.target.interests = [];
    }
    interests.forEach((interest) => {
      if (
        this.target.interests &&
        this.target.interests.filter((i) => i.name === interest).length === 0
      )
        this.target.interests.push({... interest});
    });
  }
}

export default LinkedInToJsonResume;
