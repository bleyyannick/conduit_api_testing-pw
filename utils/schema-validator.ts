import path from "path";
import fs from "fs/promises";
import { z } from "zod";

const SCHEMA_BASE_PATH = './response-schemas/';

export const validateSchema = async (dirName: string, filename: string, response: object) => {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${filename}_schema.json`);
    const jsonSchema = await loadSchema(schemaPath);
    const zodSchema = jsonSchemaToZod(jsonSchema);
    
    try {
        zodSchema.parse(response);
        console.log(`Response matches schema: ${schemaPath}, it is still valid.`);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error(`Schema validation errors: ${JSON.stringify(error, null, 2)}`);
            throw new Error(`Response does not match schema: ${schemaPath}`);
        }
        throw error;
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

const jsonSchemaToZod = (schema: any): z.ZodSchema => {
    if (schema.type === 'object') {
        const shape: Record<string, z.ZodSchema> = {};
        
        if (schema.properties) {
            for (const [key, value] of Object.entries(schema.properties)) {
                const fieldSchema = jsonSchemaToZod(value);
                const isRequired = schema.required?.includes(key);
                shape[key] = isRequired ? fieldSchema : fieldSchema.optional();
            }
        }
        
        return z.object(shape);
    }
    
    if (schema.type === 'array') {
        const itemSchema = schema.items ? jsonSchemaToZod(schema.items) : z.unknown();
        return z.array(itemSchema);
    }
    
    if (schema.type === 'string') {
        let stringSchema = z.string();
        if (schema.minLength !== undefined) stringSchema = stringSchema.min(schema.minLength);
        if (schema.maxLength !== undefined) stringSchema = stringSchema.max(schema.maxLength);
        if (schema.pattern) stringSchema = stringSchema.regex(new RegExp(schema.pattern));
        if (schema.enum) return z.enum(schema.enum);
        return stringSchema;
    }
    
    if (schema.type === 'number') {
        let numberSchema = z.number();
        if (schema.minimum !== undefined) numberSchema = numberSchema.min(schema.minimum);
        if (schema.maximum !== undefined) numberSchema = numberSchema.max(schema.maximum);
        return numberSchema;
    }
    
    if (schema.type === 'integer') {
        let intSchema = z.number().int();
        if (schema.minimum !== undefined) intSchema = intSchema.min(schema.minimum);
        if (schema.maximum !== undefined) intSchema = intSchema.max(schema.maximum);
        return intSchema;
    }
    
    if (schema.type === 'boolean') {
        return z.boolean();
    }
    
    if (schema.type === 'null') {
        return z.null();
    }
    
    if (schema.enum) {
        return z.enum(schema.enum);
    }
    
    return z.unknown();
}