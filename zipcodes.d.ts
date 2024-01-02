declare module 'zipcodes' {
    export function lookup(zip: number): Zipcode | undefined;

    export interface Zipcode { 
        zip: string; 
        city: string; 
        state: string; 
        latitude: number; 
        longitude: number; 
    }
}