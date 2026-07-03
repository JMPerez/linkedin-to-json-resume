import LinkedInToJsonResume, { processors } from './converter';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import yauzl from 'yauzl-promise';
import CSVToArray from './csvtoarray';

if (process.argv.length < 3) {
    console.error('Usage: node cli.js <linkedin-export.zip>');
    process.exit(1);
}

const zipFile = process.argv[2];
const linkedinToJsonResume = new LinkedInToJsonResume();

async function processZip(zipPath: string): Promise<void> {
    const zf = await yauzl.open(zipPath);
    const contents: { [key: string]: string } = {};
    const entries: { fileName: string }[] = [];

    for await (const entry of zf) {
        const name = entry.filename;
        entries.push({ fileName: name });

        if (!name.endsWith('/')) {
            const rs = await entry.openReadStream();
            const chunks: Buffer[] = [];
            for await (const chunk of rs) {
                chunks.push(chunk);
            }
            contents[name] = Buffer.concat(chunks).toString('utf8');
        }
    }

    await zf.close();

    // Ensure Profile.csv is first
    const profileIndex = entries.findIndex(e => e.fileName === "Profile.csv");
    if (profileIndex !== -1) {
        const [profileEntry] = entries.splice(profileIndex, 1);
        entries.unshift(profileEntry);
    }

    // Ensure Skills.csv is processed before endorsements
    const skillsIndex = entries.findIndex(e => e.fileName === "Skills.csv");
    if (skillsIndex !== -1) {
        const [skillsEntry] = entries.splice(skillsIndex, 1);
        entries.unshift(skillsEntry);
    }

    // Process each file
    for (const entry of entries) {
        const content = contents[entry.fileName];
        if (!content) continue;

        for (const [csvName, processor] of Object.entries(processors)) {
            if (entry.fileName.indexOf(csvName) !== -1) {
                processor({ content, linkedinToJsonResume });
                break;
            }
        }
    }

    // Save the result
    const output = linkedinToJsonResume.getOutput();
    const outPath = 'resume.json';
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
    console.log('Resume JSON saved to: ' + outPath);
    console.log('Successfully generated resume.json file');
}

processZip(zipFile)
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Error processing zip:', err);
        process.exit(1);
    });
