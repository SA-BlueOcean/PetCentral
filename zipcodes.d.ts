declare module "zipcodes" {
  export function lookup(zip: number): Zipcode | undefined;
  export function radius(
    zip: string | undefined | null,
    radius: number | undefined,
  ): string[];

  export interface Zipcode {
    zip: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  }
}
