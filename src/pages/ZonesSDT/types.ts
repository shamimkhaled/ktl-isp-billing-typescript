export interface Zone {
  id: string;
  sdt_id?: string;
  parent?: string;
  zone_name: string;
  email?: string;
  mobile1?: string;
  mobile2?: string;
  contact_name?: string;
  contact_number?: string;
  login_id?: string;
  address?: string;
  address2?: string;
  district?: string;
  thana?: string;
  zip_code?: string;
  remarks?: string;
  copy_form?: boolean;
}

export const districtData: Record<string, string[]> = {
  Dhaka: [
    "Dhanmondi",
    "Mirpur",
    "Mohammadpur",
    "Gulshan",
    "Uttara",
    "Banani",
    "Tejgaon",
  ],
  Chattogram: [
    "Pahartali",
    "Halishahar",
    "Agrabad",
    "Patenga",
    "Kotwali",
    "Double Mooring",
  ],
  Rajshahi: ["Boalia", "Motihar", "Shahmokhdum", "Rajpara"],
  Khulna: ["Sonadanga", "Khalishpur", "Khan Jahan Ali", "Daulatpur", "Kotwali"],
  Barishal: ["Kotwali", "Bandar", "Kawnia", "Airport"],
  Sylhet: ["Kotwali", "Dakshin Surma", "Mogla Bazar", "Jalalabad"],
  Rangpur: ["Kotwali", "Mahiganj", "Dhap", "Pachgachia"],
  Mymensingh: ["Kotwali", "Ganginar par", "Chorpara", "Mashkanda"],
};
