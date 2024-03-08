export class CreateVenueDto {
  readonly name: string;
  readonly country: string;
  readonly state?: string;
  readonly city: string;
  readonly timezone: string;
  readonly zipCode?: string;
  readonly address?: string;
}
