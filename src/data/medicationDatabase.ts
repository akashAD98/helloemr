
export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  strength: string[];
  dosageForm: string;
  category: string;
  commonDosages: string[];
  commonFrequencies: string[];
  routes: string[];
  warnings?: string[];
  controlled?: boolean;
}

export const medicationDatabase: Medication[] = [
  // Cardiovascular
  {
    id: "1",
    name: "Lisinopril",
    genericName: "Lisinopril",
    brandName: "Prinivil, Zestril",
    strength: ["5mg", "10mg", "20mg", "40mg"],
    dosageForm: "Tablet",
    category: "ACE Inhibitor",
    commonDosages: ["5mg", "10mg", "20mg"],
    commonFrequencies: ["Once daily", "Twice daily"],
    routes: ["Oral"],
    warnings: ["Monitor kidney function", "Check for dry cough"]
  },
  {
    id: "2",
    name: "Atorvastatin",
    genericName: "Atorvastatin",
    brandName: "Lipitor",
    strength: ["10mg", "20mg", "40mg", "80mg"],
    dosageForm: "Tablet",
    category: "Statin",
    commonDosages: ["20mg", "40mg"],
    commonFrequencies: ["Once daily in evening"],
    routes: ["Oral"],
    warnings: ["Monitor liver function", "Muscle pain"]
  },
  {
    id: "3",
    name: "Amlodipine",
    genericName: "Amlodipine",
    brandName: "Norvasc",
    strength: ["2.5mg", "5mg", "10mg"],
    dosageForm: "Tablet",
    category: "Calcium Channel Blocker",
    commonDosages: ["5mg", "10mg"],
    commonFrequencies: ["Once daily"],
    routes: ["Oral"],
    warnings: ["Monitor for ankle swelling"]
  },

  // Diabetes
  {
    id: "4",
    name: "Metformin",
    genericName: "Metformin",
    brandName: "Glucophage",
    strength: ["500mg", "850mg", "1000mg"],
    dosageForm: "Tablet",
    category: "Biguanide",
    commonDosages: ["500mg", "1000mg"],
    commonFrequencies: ["Twice daily", "Three times daily"],
    routes: ["Oral"],
    warnings: ["Take with meals", "Monitor kidney function"]
  },
  {
    id: "5",
    name: "Insulin Glargine",
    genericName: "Insulin Glargine",
    brandName: "Lantus",
    strength: ["100 units/mL"],
    dosageForm: "Injection",
    category: "Long-acting Insulin",
    commonDosages: ["10 units", "20 units", "30 units"],
    commonFrequencies: ["Once daily at bedtime"],
    routes: ["Subcutaneous"],
    warnings: ["Monitor blood glucose", "Rotate injection sites"]
  },

  // Antibiotics
  {
    id: "6",
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    brandName: "Amoxil",
    strength: ["250mg", "500mg", "875mg"],
    dosageForm: "Capsule",
    category: "Penicillin Antibiotic",
    commonDosages: ["500mg", "875mg"],
    commonFrequencies: ["Three times daily", "Twice daily"],
    routes: ["Oral"],
    warnings: ["Complete full course", "Check for penicillin allergy"]
  },
  {
    id: "7",
    name: "Azithromycin",
    genericName: "Azithromycin",
    brandName: "Z-Pack",
    strength: ["250mg", "500mg"],
    dosageForm: "Tablet",
    category: "Macrolide Antibiotic",
    commonDosages: ["250mg", "500mg"],
    commonFrequencies: ["Once daily", "Day 1: 500mg, then 250mg daily"],
    routes: ["Oral"],
    warnings: ["Complete full course", "Take on empty stomach"]
  },

  // Pain Management
  {
    id: "8",
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    brandName: "Advil, Motrin",
    strength: ["200mg", "400mg", "600mg", "800mg"],
    dosageForm: "Tablet",
    category: "NSAID",
    commonDosages: ["400mg", "600mg", "800mg"],
    commonFrequencies: ["Three times daily", "Four times daily"],
    routes: ["Oral"],
    warnings: ["Take with food", "Monitor for GI bleeding"]
  },
  {
    id: "9",
    name: "Acetaminophen",
    genericName: "Acetaminophen",
    brandName: "Tylenol",
    strength: ["325mg", "500mg", "650mg"],
    dosageForm: "Tablet",
    category: "Analgesic",
    commonDosages: ["500mg", "650mg"],
    commonFrequencies: ["Every 4-6 hours", "Four times daily"],
    routes: ["Oral"],
    warnings: ["Max 3000mg per day", "Monitor liver function"]
  },

  // Thyroid
  {
    id: "10",
    name: "Levothyroxine",
    genericName: "Levothyroxine",
    brandName: "Synthroid",
    strength: ["25mcg", "50mcg", "75mcg", "100mcg", "125mcg", "150mcg"],
    dosageForm: "Tablet",
    category: "Thyroid Hormone",
    commonDosages: ["50mcg", "75mcg", "100mcg"],
    commonFrequencies: ["Once daily on empty stomach"],
    routes: ["Oral"],
    warnings: ["Take on empty stomach", "Monitor TSH levels"]
  }
];

export const medicationCategories = [
  "ACE Inhibitor",
  "Statin", 
  "Calcium Channel Blocker",
  "Biguanide",
  "Long-acting Insulin",
  "Penicillin Antibiotic",
  "Macrolide Antibiotic", 
  "NSAID",
  "Analgesic",
  "Thyroid Hormone"
];
