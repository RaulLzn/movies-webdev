// This file contains utility functions for working with JSON data
import * as fs from 'fs';

export default 
private jsonPath: string = path.join(__dirname, '../../database/products.json');

//Leer Json
export function readJsonFile(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                const json = JSON.parse(data);
                resolve(json);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
}

//Actualizar Json
export function updateJsonFile(filePath: string, updates: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await readJsonFile(filePath);
            const updatedData = { ...data, ...updates };
            await writeJsonFile(filePath, updatedData);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

//Escribir Json
export function writeJsonFile(filePath: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
        const json = JSON.stringify(data, null, 2);
        fs.writeFile(filePath, json, 'utf-8', (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}