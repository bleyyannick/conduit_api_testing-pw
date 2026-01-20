import path from "path";
import fs from "fs/promises";
const SCHEMA_BASE_PATH = './response-schemas/';
import Ajv from "ajv";

const ajv = new Ajv();


export const validateSchema = async (dirName: string, filename: string, response: object) => {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${filename}_schema.json`);
    const schema = await loadSchema(schemaPath);
    console.log(`Schema loaded from ${schemaPath}`);
    const validate = ajv.compile(schema);
    const valid = validate(response);
        if (!valid) {
            console.error(`Schema validation errors: ${JSON.stringify(validate.errors, null, 2)}`);
            throw new Error(`Response does not match schema: ${schemaPath}`);
        } else {
            console.log(`Response matches schema: ${schemaPath}, it is valid.`);
        }
}


const loadSchema = async (schemaPath: string) => {
    try {
         const schemaData = await fs.readFile(schemaPath, 'utf-8');
        return JSON.parse(schemaData);
    } catch (error) {  
        throw new Error(`Failed to load schema from ${schemaPath}: ${error}`);
    }
   
}