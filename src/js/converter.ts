/* exported onLinkedInLoad */
import CountryCodes from "./country-codes";
import CSVToArray from './csvtoarray';
import moment from 'moment';

export interface ProcessorOptions {
    linkedinToJsonResume: any;
    content: string;
}

export const processors = {
    "Skills.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const processedContent = content.replace(/"/g, "").trim();
        const elements = processedContent.split("\n")
            .filter(line => line.trim() !== '');
        linkedinToJsonResume.processSkills(elements.slice(1));
    },

    "Education.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const education = elements
            .slice(1)
            .map((elem) => ({
                schoolName: elem[0],
                startDate: moment(elem[1], ["YYYY-MM", "MMMM YYYY"]).format("YYYY-MM-DD"),
                endDate: elem[2] ? moment(elem[2], ["YYYY-MM", "MMMM YYYY"]).format("YYYY-MM-DD") : null,
                notes: elem[3],
                degree: elem[4],
                activities: elem[5],
            }));
        linkedinToJsonResume.processEducation(
            education.sort((e1, e2) => -e1.startDate.localeCompare(e2.startDate))
        );
    },

    "Positions.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const positions = elements
            .slice(1)
            .map((elem) => ({
                companyName: elem[0],
                title: elem[1],
                description: elem[2],
                location: elem[3],
                startDate: moment(elem[4], ["MMM YYYY", "MMMM YYYY"]).format("YYYY-MM-DD"),
                endDate: elem[5] ? moment(elem[5], ["MMM YYYY", "MMMM YYYY"]).format("YYYY-MM-DD") : null,
            }));
        linkedinToJsonResume.processPosition(
            positions.sort((p1, p2) => -p1.startDate.localeCompare(p2.startDate))
        );
    },

    "Languages.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const languages = elements
            .slice(1)
            .map((elem) => ({
                name: elem[0],
                proficiency: elem[1],
            }));
        linkedinToJsonResume.processLanguages(languages);
    },

    "Recommendations Received.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const recommendations = elements
            .slice(1)
            .map((elem) => ({
                recommenderFirstName: elem[0],
                recommenderLastName: elem[1],
                recommenderCompany: elem[2],
                recommenderTitle: elem[3],
                recommendationBody: elem[4],
                recommendationDate: moment(elem[5]).format("YYYY-MM-DD"),
                displayStatus: elem[6],
            }))
            .filter(
                (recommendation) => recommendation.displayStatus === "VISIBLE"
            );
        linkedinToJsonResume.processReferences(recommendations);
    },

    "Profile.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const profile = {
            firstName: elements[1][0],
            lastName: elements[1][1],
            maidenName: elements[1][2],
            address: elements[1][3],
            birthDate: elements[1][4],
            headline: elements[1][5],
            summary: elements[1][6],
            industry: elements[1][7],
            zipCode: elements[1][8],
            geoLocation: elements[1][9],
            twitterHandles: elements[1][10].replace('[', '').replace(']', ''),
            websites: elements[1][11],
            instantMessengers: elements[1][12]
        };
        linkedinToJsonResume.processProfile(profile);
    },

    "Email Addresses.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const emails = elements
            .slice(1)
            .map((elem) => ({
                address: elem[0],
                isPrimary: elem[2] === "Yes",
            }))
            .filter((email) => email.isPrimary);

        if (emails.length) {
            linkedinToJsonResume.processEmail(emails[0]);
        }
    },

    "Interests.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        let interests = [];
        elements.slice(1).forEach((elem) => {
          interests = interests.concat(elem[0].split(","));
        });
        linkedinToJsonResume.processInterests(interests);
    },

    "Projects.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const projects = elements
            .slice(1)
            .map((elem) => ({
                name: elem[0],
                startDate: elem[3] ? moment(elem[3], ["YYYY-MM", "MMMM YYYY"]).format("YYYY-MM-DD") : null,
                endDate: elem[4] ? moment(elem[4], ["YYYY-MM", "MMMM YYYY"]).format("YYYY-MM-DD") : null,
                description: elem[1],
                highlights: [],
                url: elem[2],
            }));
        linkedinToJsonResume.processProjects(
            projects.sort((p1, p2) => p1.startDate && p2.startDate ? -p1.startDate.localeCompare(p2.startDate) : 0)
        );
    },

    "Publications.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const publications = elements
            .slice(1)
            .map((elem) => ({
                name: elem[0],
                date: moment(elem[1]).format("YYYY-MM-DD"),
                description: elem[2],
                publisher: elem[3],
                url: elem[4],
            }));
        linkedinToJsonResume.processPublications(
            publications.sort((p1, p2) => -p1.date.localeCompare(p2.date))
        );
    },

    "PhoneNumbers.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        elements.shift();
        const elementsWithNumber = elements.filter(
          (element) => element[1]
        );
        if (elementsWithNumber.length > 0) {
          const number = {
            extension: elementsWithNumber[0][0],
            number: elementsWithNumber[0][1],
            type: elementsWithNumber[0][2],
          };
          linkedinToJsonResume.processPhoneNumber(number);
        }
    },

    "Honors.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const awards = elements
            .slice(1)
            .map((elem) => ({
                title: elem[0],
                date: moment(elem[3], ["YYYY-MM", "MMMM YYYY"]).format("YYYY-MM-DD"),
                awarder: "",
                summary: elem[1],
            }));
        linkedinToJsonResume.processAwards(
            awards.sort((p1, p2) => -p1.date.localeCompare(p2.date))
        );
    },

    "Certifications.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const certificates = elements
            .slice(1)
            .map((elem) => ({
                name: elem[0],
                date: moment(elem[3], ["YYYY-MM", "MMMM YYYY"]).format("YYYY-MM-DD"),
                issuer: elem[2],
                summary: "",
            }));
        linkedinToJsonResume.processCertificates(
            certificates.sort((p1, p2) => -p1.date.localeCompare(p2.date))
        );
    },

    "Endorsement_Received_Info.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const endorsements: {name: string; level: number}[] = [];
        elements.slice(1).forEach((elem) => {
            const current = endorsements.find((endorsement) => endorsement.name === elem[1]);
            if (current) {
                current.level += 1;
            } else {
                endorsements.push({
                    name: elem[1],
                    level: 1,
                });
            }
        });
        linkedinToJsonResume.processEndorsements(endorsements);
    },

    "Causes You Care About.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const interests = elements
            .slice(1)
            .map((elem) => ({
                name: elem[0],
                keywords: [],
            }));
        linkedinToJsonResume.processFollows(interests);
    },

    "Company Follows.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const interests = elements
            .slice(1)
            .map((elem) => ({
                name: elem[0],
                keywords: [],
            }));
        linkedinToJsonResume.processFollows(interests);
    },

    "Hashtag_Follows.csv": ({ content, linkedinToJsonResume }: ProcessorOptions) => {
        const elements = CSVToArray(content);
        const interests = elements
            .slice(1)
            .map((elem) => ({
                name: elem[0],
                keywords: [],
            }));
        linkedinToJsonResume.processFollows(interests);
    }
};

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
    this.target.skills.sort((a, b) => {
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
