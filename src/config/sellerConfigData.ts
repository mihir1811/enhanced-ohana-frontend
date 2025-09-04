interface Option {
  value: string;
  label: string;
}

// Diamond Colors
export const diamondColors: Option[] = [
  { value: 'D', label: 'D (Colorless)' },
  { value: 'E', label: 'E (Colorless)' },
  { value: 'F', label: 'F (Colorless)' },
  { value: 'G', label: 'G (Near Colorless)' },
  { value: 'H', label: 'H (Near Colorless)' },
  { value: 'I', label: 'I (Near Colorless)' },
  { value: 'J', label: 'J (Near Colorless)' },
  { value: 'K', label: 'K (Faint)' },
  { value: 'L', label: 'L (Faint)' },
  { value: 'M', label: 'M (Faint)' },
  { value: 'N', label: 'N (Very Light)' },
  { value: 'O', label: 'O (Very Light)' },
  { value: 'P', label: 'P (Very Light)' },
  { value: 'Q', label: 'Q (Very Light)' },
  { value: 'R', label: 'R (Very Light)' },
  { value: 'S', label: 'S (Light)' },
  { value: 'T', label: 'T (Light)' },
  { value: 'U', label: 'U (Light)' },
  { value: 'V', label: 'V (Light)' },
  { value: 'W', label: 'W (Light)' },
  { value: 'X', label: 'X (Light)' },
  { value: 'Y', label: 'Y (Light)' },
  { value: 'Z', label: 'Z (Light)' },
];

// Fancy Colors
export const fancyColors: Option[] = [
  { value: 'Fancy Yellow', label: 'Fancy Yellow' },
  { value: 'Fancy Pink', label: 'Fancy Pink' },
  { value: 'Fancy Blue', label: 'Fancy Blue' },
  { value: 'Fancy Green', label: 'Fancy Green' },
  { value: 'Fancy Brown', label: 'Fancy Brown' },
  { value: 'Fancy Orange', label: 'Fancy Orange' },
  { value: 'Fancy Purple', label: 'Fancy Purple' },
  { value: 'Fancy Red', label: 'Fancy Red' },
  { value: 'Fancy Gray', label: 'Fancy Gray' },
  { value: 'Fancy Black', label: 'Fancy Black' },
];

// Fancy Intensities
export const fancyIntensities: Option[] = [
  { value: 'Faint', label: 'Faint' },
  { value: 'Very Light', label: 'Very Light' },
  { value: 'Light', label: 'Light' },
  { value: 'Fancy Light', label: 'Fancy Light' },
  { value: 'Fancy', label: 'Fancy' },
  { value: 'Fancy Intense', label: 'Fancy Intense' },
  { value: 'Fancy Vivid', label: 'Fancy Vivid' },
  { value: 'Fancy Deep', label: 'Fancy Deep' },
  { value: 'Fancy Dark', label: 'Fancy Dark' },
];

// Fancy Overtones
export const fancyOvertones: Option[] = [
  { value: 'None', label: 'None' },
  { value: 'Brownish', label: 'Brownish' },
  { value: 'Orangish', label: 'Orangish' },
  { value: 'Pinkish', label: 'Pinkish' },
  { value: 'Purplish', label: 'Purplish' },
  { value: 'Grayish', label: 'Grayish' },
  { value: 'Greenish', label: 'Greenish' },
  { value: 'Bluish', label: 'Bluish' },
  { value: 'Yellowish', label: 'Yellowish' },
];

// Cut Grades
export const cutGrades: Option[] = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Very Good', label: 'Very Good' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
];

// Clarities
export const clarities: Option[] = [
  { value: 'FL', label: 'FL' },
  { value: 'IF', label: 'IF' },
  { value: 'VVS1', label: 'VVS1' },
  { value: 'VVS2', label: 'VVS2' },
  { value: 'VS1', label: 'VS1' },
  { value: 'VS2', label: 'VS2' },
  { value: 'SI1', label: 'SI1' },
  { value: 'SI2', label: 'SI2' },
  { value: 'I1', label: 'I1' },
  { value: 'I2', label: 'I2' },
  { value: 'I3', label: 'I3' },
];

// Shades
export const shades: Option[] = [
  { value: 'White', label: 'White' },
  { value: 'Yellow', label: 'Yellow' },
  { value: 'Brown', label: 'Brown' },
  { value: 'Pink', label: 'Pink' },
  { value: 'Blue', label: 'Blue' },
  { value: 'Green', label: 'Green' },
  { value: 'Gray', label: 'Gray' },
  { value: 'Black', label: 'Black' },
];

// Diamond Shapes
export const shapes: Option[] = [
  { value: 'Round', label: 'Round' },
  { value: 'Princess', label: 'Princess' },
  { value: 'Emerald', label: 'Emerald' },
  { value: 'Asscher', label: 'Asscher' },
  { value: 'Cushion', label: 'Cushion' },
  { value: 'Cushion Modified', label: 'Cushion Modified' },
  { value: 'Cushion Brilliant', label: 'Cushion Brilliant' },
  { value: 'Radiant', label: 'Radiant' },
  { value: 'Oval', label: 'Oval' },
  { value: 'Pear', label: 'Pear' },
  { value: 'Marquise', label: 'Marquise' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Trilliant', label: 'Trilliant' },
  { value: 'Baguette', label: 'Baguette' },
  { value: 'Tapered Baguette', label: 'Tapered Baguette' },
  { value: 'Half-moon', label: 'Half-moon' },
  { value: 'Flanders', label: 'Flanders' },
  { value: 'French', label: 'French' },
  { value: 'Lozenge', label: 'Lozenge' },
  { value: 'Bullet', label: 'Bullet' },
  { value: 'Kite', label: 'Kite' },
  { value: 'Shield', label: 'Shield' },
  { value: 'Star Cut', label: 'Star Cut' },
  { value: 'Rose Cut', label: 'Rose Cut' },
  { value: 'Old Miner', label: 'Old Miner' },
  { value: 'Old European', label: 'Old European' },
  { value: 'Euro Cut', label: 'Euro Cut' },
  { value: 'Briolette', label: 'Briolette' },
  { value: 'Trapezoid', label: 'Trapezoid' },
  { value: 'Pentagonal Cut', label: 'Pentagonal Cut' },
  { value: 'Hexagonal Cut', label: 'Hexagonal Cut' },
  { value: 'Octagonal Cut', label: 'Octagonal Cut' },
  { value: 'Portuguese Cut', label: 'Portuguese Cut' },
];

// Fluorescence Levels
export const fluorescences: Option[] = [
  { value: 'None', label: 'None' },
  { value: 'Faint', label: 'Faint' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Strong', label: 'Strong' },
  { value: 'Very Strong', label: 'Very Strong' },
];

// Diamond Processes
export const processes: Option[] = [
  { value: 'Natural', label: 'Natural' },
  { value: 'HPHT', label: 'HPHT (High Pressure High Temperature) – Lab-grown' },
  { value: 'CVD', label: 'CVD (Chemical Vapor Deposition) – Lab-grown' },
];

// Diamond Treatments
export const treatments: Option[] = [
  { value: 'Natural', label: 'Natural / Untreated' },
  { value: 'laserDrilled', label: 'Laser Drilled' },
  { value: 'fractureFilled', label: 'Fracture Filled' },
  { value: 'HPHT', label: 'HPHT (Color Treatment)' },
  { value: 'Irradiated', label: 'Irradiated' },
  { value: 'heatTreated', label: 'Annealed / Heat Treated' },
  { value: 'Coated', label: 'Coated' },
  { value: 'HPHT', label: 'Lab-Grown HPHT' },
  { value: 'CVD', label: 'Lab-Grown CVD' },
];

// Certificate Companies
export const certificateCompanies: Option[] = [
  { value: '1', label: 'GIA' },
  { value: '2', label: 'IGI' },
  { value: '3', label: 'AGS' },
  { value: '4', label: 'HRD' },
  { value: '5', label: 'Other' },
];
