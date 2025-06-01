// Mock data for our EMR application

// Patient data
export interface Patient {
  id: string;
  name: string;
  gender: string;
  pronouns?: string;
  dateOfBirth: string;
  age: number;
  provider: string;
  image?: string;
  active: boolean;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  medicalHistory?: string[];
}

export const patients: Patient[] = [
  {
    id: "p1",
    name: "Jane Doe",
    gender: "Female",
    pronouns: "She/Her/Hers",
    dateOfBirth: "1986-06-06",
    age: 38,
    provider: "Dr. Jennifer Davis",
    active: true,
    contactInfo: {
      email: "jane.doe@example.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Anytown, CA 94321",
    },
    medicalHistory: ["Asthma", "Allergies - Seasonal"]
  },
  {
    id: "p2",
    name: "John Smith",
    gender: "Male",
    dateOfBirth: "1975-03-15",
    age: 49,
    provider: "Dr. Jennifer Davis",
    active: true,
    contactInfo: {
      email: "john.smith@example.com",
      phone: "(555) 987-6543",
      address: "456 Oak Ave, Sometown, CA 94322",
    },
    medicalHistory: ["Hypertension", "Type 2 Diabetes"]
  },
  {
    id: "p3",
    name: "Alex Johnson",
    gender: "Non-binary",
    pronouns: "They/Them/Theirs",
    dateOfBirth: "1992-11-28",
    age: 31,
    provider: "Dr. Michael Wong",
    active: true,
    contactInfo: {
      email: "alex.j@example.com",
      phone: "(555) 456-7890",
      address: "789 Pine St, Othertown, CA 94323",
    },
    medicalHistory: ["Depression", "Anxiety"]
  },
  {
    id: "p4",
    name: "Maria Garcia",
    gender: "Female",
    dateOfBirth: "1968-09-12",
    age: 55,
    provider: "Dr. Sarah Johnson",
    active: false,
    contactInfo: {
      email: "maria.g@example.com",
      phone: "(555) 321-6547",
      address: "101 Cedar Rd, Newtown, CA 94324",
    },
    medicalHistory: ["Osteoarthritis", "Hyperlipidemia"]
  },
  {
    id: "p5",
    name: "Robert Chen",
    gender: "Male",
    dateOfBirth: "1990-02-23",
    age: 34,
    provider: "Dr. Jennifer Davis",
    active: true,
    contactInfo: {
      email: "robert.c@example.com",
      phone: "(555) 654-9870",
      address: "202 Maple Ave, Lasttown, CA 94325",
    },
    medicalHistory: ["Migraine", "Eczema"]
  },
  {
    id: "p6",
    name: "Arjun Patel",
    gender: "Male",
    dateOfBirth: "1983-07-15",
    age: 41,
    provider: "Dr. Michael Wong",
    active: true,
    contactInfo: {
      email: "arjun.p@example.com",
      phone: "(555) 234-5678",
      address: "303 Banyan St, Greenville, CA 94326",
    },
    medicalHistory: ["Hyperthyroidism", "Allergies - Dust"]
  },
  {
    id: "p7",
    name: "Priya Sharma",
    gender: "Female",
    pronouns: "She/Her/Hers",
    dateOfBirth: "1995-12-03",
    age: 28,
    provider: "Dr. Sarah Johnson",
    active: true,
    contactInfo: {
      email: "priya.s@example.com",
      phone: "(555) 876-5432",
      address: "404 Neem Ave, Riverside, CA 94327",
    },
    medicalHistory: ["PCOS", "Vitamin D Deficiency"]
  },
  {
    id: "p8",
    name: "Raj Malhotra",
    gender: "Male",
    dateOfBirth: "1972-04-28",
    age: 52,
    provider: "Dr. Jennifer Davis",
    active: true,
    contactInfo: {
      email: "raj.m@example.com",
      phone: "(555) 765-4321",
      address: "505 Tulsi Rd, Lakeside, CA 94328",
    },
    medicalHistory: ["Type 2 Diabetes", "Hypertension", "Coronary Artery Disease"]
  },
  {
    id: "p9",
    name: "Ananya Desai",
    gender: "Female",
    dateOfBirth: "1988-09-17",
    age: 36,
    provider: "Dr. Michael Wong",
    active: false,
    contactInfo: {
      email: "ananya.d@example.com",
      phone: "(555) 432-1098",
      address: "606 Jasmine St, Hillcrest, CA 94329",
    },
    medicalHistory: ["Asthma", "Allergic Rhinitis"]
  },
  {
    id: "p10",
    name: "Vikram Singh",
    gender: "Male",
    dateOfBirth: "1979-01-30",
    age: 45,
    provider: "Dr. Sarah Johnson",
    active: true,
    contactInfo: {
      email: "vikram.s@example.com",
      phone: "(555) 321-8765",
      address: "707 Lotus Ln, Valleytown, CA 94330",
    },
    medicalHistory: ["Gastritis", "Insomnia"]
  }
];

// Task data
export interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  status: 'pending' | 'overdue' | 'booked' | 'completed' | 'unassigned';
  assignee?: string;
  patientId?: string;
}

export const tasks: Task[] = [
  {
    id: "t1",
    title: "Draft Lab Orders",
    date: "Jan 17, 2024",
    time: "12:15pm",
    status: "pending",
    assignee: "Unassigned",
    patientId: "p1"
  },
  {
    id: "t2",
    title: "Pending Medication Requests",
    date: "Jan 17, 2024",
    time: "12:15pm",
    status: "pending",
    assignee: "Unassigned",
    patientId: "p1"
  },
  {
    id: "t3",
    title: "Reach out to patient after discharge",
    date: "Jan 17, 2024",
    time: "12:15pm",
    status: "pending",
    assignee: "Unassigned",
    patientId: "p1"
  },
  {
    id: "t4",
    title: "Check lab results from today",
    date: "Jan 17, 2024",
    time: "12:15pm",
    status: "overdue",
    assignee: "Dr. Jennifer Davis",
    patientId: "p1"
  },
  {
    id: "t5",
    title: "Follow-up appointment",
    date: "Jan 17, 2024",
    time: "12:15pm",
    status: "booked",
    assignee: "In-clinic",
    patientId: "p1"
  },
];

// Vital data
export interface Vital {
  id: string;
  type: string;
  value: string | number;
  unit: string;
  date: string;
  secondary?: string;
  patientId: string;
}

export const vitals: Vital[] = [
  {
    id: "v1",
    type: "Temperature",
    value: "100.4",
    unit: "°F",
    date: "Jan 17, 2024",
    secondary: "36.7 °C",
    patientId: "p1"
  },
  {
    id: "v2",
    type: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    date: "Jan 17, 2024",
    patientId: "p1"
  },
  {
    id: "v3",
    type: "Heart Rate",
    value: "89",
    unit: "bpm",
    date: "Jan 17, 2024",
    patientId: "p1"
  },
  {
    id: "v4",
    type: "Respiratory Rate",
    value: "16",
    unit: "breaths/min",
    date: "Jan 17, 2024",
    patientId: "p1"
  },
  {
    id: "v5",
    type: "Oxygen Saturation",
    value: "98",
    unit: "%",
    date: "Jan 17, 2024",
    patientId: "p1"
  },
];

// Appointments data
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  status: 'booked' | 'pending' | 'cancelled' | 'completed';
  provider: string;
  notes?: string;
  reasonForVisit?: string;
}

export const appointments: Appointment[] = [
  {
    id: "a1",
    patientName: "Jane Doe",
    patientId: "p1",
    date: "2024-01-17",
    time: "10:00 AM",
    duration: "30 minutes",
    type: "Follow-up",
    status: "booked",
    provider: "Dr. Jennifer Davis",
    reasonForVisit: "Medication review and follow-up on asthma symptoms"
  },
  {
    id: "a2",
    patientName: "John Smith",
    patientId: "p2",
    date: "2024-01-17",
    time: "11:00 AM",
    duration: "45 minutes",
    type: "New Patient",
    status: "booked",
    provider: "Dr. Jennifer Davis",
    reasonForVisit: "Initial consultation for hypertension management"
  },
  {
    id: "a3",
    patientName: "Alex Johnson",
    patientId: "p3",
    date: "2024-01-17",
    time: "1:30 PM",
    duration: "30 minutes",
    type: "Follow-up",
    status: "booked",
    provider: "Dr. Michael Wong",
    reasonForVisit: "Mental health check-in and prescription refill"
  },
  {
    id: "a4",
    patientName: "Maria Garcia",
    patientId: "p4",
    date: "2024-01-18",
    time: "9:00 AM",
    duration: "60 minutes",
    type: "Annual Physical",
    status: "pending",
    provider: "Dr. Sarah Johnson",
    reasonForVisit: "Annual wellness exam"
  },
  {
    id: "a5",
    patientName: "Robert Chen",
    patientId: "p5",
    date: "2024-01-18",
    time: "2:00 PM",
    duration: "30 minutes",
    type: "Follow-up",
    status: "pending",
    provider: "Dr. Jennifer Davis",
    reasonForVisit: "Eczema treatment follow-up"
  },
  {
    id: "a6",
    patientName: "Arjun Patel",
    patientId: "p6",
    date: "2024-01-19",
    time: "11:30 AM",
    duration: "30 minutes",
    type: "Follow-up",
    status: "booked",
    provider: "Dr. Michael Wong",
    reasonForVisit: "Review of thyroid panel results"
  },
  {
    id: "a7",
    patientName: "Priya Sharma",
    patientId: "p7",
    date: "2024-01-19",
    time: "3:00 PM",
    duration: "45 minutes",
    type: "Consultation",
    status: "booked",
    provider: "Dr. Sarah Johnson",
    reasonForVisit: "PCOS management and nutrition planning"
  },
  {
    id: "a8",
    patientName: "Raj Malhotra",
    patientId: "p8",
    date: "2024-01-20",
    time: "10:30 AM",
    duration: "60 minutes",
    type: "Comprehensive Review",
    status: "pending",
    provider: "Dr. Jennifer Davis",
    reasonForVisit: "Diabetes and cardiac health assessment"
  },
  {
    id: "a9",
    patientName: "Ananya Desai",
    patientId: "p9",
    date: "2024-01-20",
    time: "1:00 PM",
    duration: "30 minutes",
    type: "Follow-up",
    status: "pending",
    provider: "Dr. Michael Wong",
    reasonForVisit: "Asthma management and peak flow monitoring"
  },
  {
    id: "a10",
    patientName: "Vikram Singh",
    patientId: "p10",
    date: "2024-01-21",
    time: "9:00 AM",
    duration: "30 minutes",
    type: "Follow-up",
    status: "booked",
    provider: "Dr. Sarah Johnson",
    reasonForVisit: "Gastritis and sleep improvement follow-up"
  },
  {
    id: "a11",
    patientName: "Emily Johnson",
    patientId: "p1",
    date: "2025-06-01",
    time: "8:00 AM",
    duration: "30 minutes",
    type: "Follow-up",
    status: "booked",
    provider: "Dr. Jennifer Davis",
    reasonForVisit: "Blood pressure check and medication review"
  },
  {
    id: "a12",
    patientName: "Michael Rodriguez",
    patientId: "p2",
    date: "2025-06-01",
    time: "8:30 AM",
    duration: "45 minutes",
    type: "New Patient",
    status: "booked",
    provider: "Dr. Jennifer Davis",
    reasonForVisit: "Initial consultation for diabetes management"
  },
  {
    id: "a13",
    patientName: "Sarah Williams",
    patientId: "p3",
    date: "2025-06-01",
    time: "9:00 AM",
    duration: "30 minutes",
    type: "Follow-up",
    status: "completed",
    provider: "Dr. Michael Wong",
    reasonForVisit: "Anxiety medication adjustment"
  },
  {
    id: "a14",
    patientName: "David Chen",
    patientId: "p4",
    date: "2025-06-01",
    time: "9:30 AM",
    duration: "60 minutes",
    type: "Annual Physical",
    status: "booked",
    provider: "Dr. Sarah Johnson",
    reasonForVisit: "Comprehensive annual health examination"
  },
  {
    id: "a15",
    patientName: "Lisa Thompson",
    patientId: "p5",
    date: "2025-06-01",
    time: "10:00 AM",
    duration: "30 minutes",
    type: "Follow-up",
    status: "booked",
    provider: "Dr. Jennifer Davis",
    reasonForVisit: "Migraine treatment progress review"
  },
  {
    id: "a16",
    patientName: "James Wilson",
    patientId: "p6",
    date: "2025-06-01",
    time: "10:30 AM",
    duration: "30 minutes",
    type: "Urgent Care",
    status: "pending",
    provider: "Dr. Michael Wong",
    reasonForVisit: "Persistent cough and chest discomfort"
  },
  {
    id: "a17",
    patientName: "Amanda Davis",
    patientId: "p7",
    date: "2025-06-01",
    time: "11:00 AM",
    duration: "45 minutes",
    type: "Consultation",
    status: "booked",
    provider: "Dr. Sarah Johnson",
    reasonForVisit: "Pre-operative consultation for knee surgery"
  },
  {
    id: "a18",
    patientName: "Robert Martinez",
    patientId: "p8",
    date: "2025-06-01",
    time: "11:30 AM",
    duration: "30 minutes",
    type: "Follow-up",
    status: "booked",
    provider: "Dr. Jennifer Davis",
    reasonForVisit: "Diabetes monitoring and insulin adjustment"
  },
  {
    id: "a19",
    patientName: "Jennifer Garcia",
    patientId: "p9",
    date: "2025-06-01",
    time: "1:00 PM",
    duration: "30 minutes",
    type: "Follow-up",
    status: "pending",
    provider: "Dr. Michael Wong",
    reasonForVisit: "Asthma control assessment"
  },
  {
    id: "a20",
    patientName: "Christopher Lee",
    patientId: "p10",
    date: "2025-06-01",
    time: "1:30 PM",
    duration: "30 minutes",
    type: "Follow-up",
    status: "booked",
    provider: "Dr. Sarah Johnson",
    reasonForVisit: "Sleep disorder treatment review"
  },
  {
    id: "a21",
    patientName: "Michelle Brown",
    patientId: "p1",
    date: "2025-06-01",
    time: "2:00 PM",
    duration: "45 minutes",
    type: "Specialist Referral",
    status: "booked",
    provider: "Dr. Jennifer Davis",
    reasonForVisit: "Cardiology referral discussion"
  },
  {
    id: "a22",
    patientName: "Kevin Anderson",
    patientId: "p2",
    date: "2025-06-01",
    time: "2:30 PM",
    duration: "30 minutes",
    type: "Lab Work",
    status: "booked",
    provider: "Dr. Michael Wong",
    reasonForVisit: "Blood work and lab results review"
  },
  {
    id: "a23",
    patientName: "Nicole Taylor",
    patientId: "p3",
    date: "2025-06-01",
    time: "3:00 PM",
    duration: "30 minutes",
    type: "Follow-up",
    status: "pending",
    provider: "Dr. Sarah Johnson",
    reasonForVisit: "Mental health medication review"
  },
  {
    id: "a24",
    patientName: "Daniel White",
    patientId: "p4",
    date: "2025-06-01",
    time: "3:30 PM",
    duration: "60 minutes",
    type: "Procedure",
    status: "booked",
    provider: "Dr. Jennifer Davis",
    reasonForVisit: "Minor skin lesion removal"
  },
  {
    id: "a25",
    patientName: "Rachel Moore",
    patientId: "p5",
    date: "2025-06-01",
    time: "4:00 PM",
    duration: "30 minutes",
    type: "Telehealth",
    status: "booked",
    provider: "Dr. Michael Wong",
    reasonForVisit: "Remote consultation for chronic pain management"
  }
];

// Appointment types for dropdown
export const appointmentTypes = [
  "New Patient",
  "Follow-up",
  "Annual Physical", 
  "Urgent Care",
  "Specialist Referral",
  "Telehealth",
  "Consultation",
  "Comprehensive Review",
  "Procedure",
  "Lab Work"
];

// Available time slots
export const availableTimeSlots = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM", 
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM"
];

// Duration options
export const durationOptions = [
  "15 minutes",
  "30 minutes",
  "45 minutes",
  "60 minutes",
  "90 minutes"
];

// Providers
export const providers = [
  "Dr. Jennifer Davis",
  "Dr. Michael Wong",
  "Dr. Sarah Johnson"
];

export const patientProblems = [
  {
    id: "prob1",
    patientId: "p7", // Priya Sharma
    name: "Type 2 Diabetes Mellitus",
    dateIdentified: "Jan 15, 2022",
    status: "chronic",
    notes: "Managed with diet and oral medications"
  },
  {
    id: "prob2",
    patientId: "p7",
    name: "Hypertension",
    dateIdentified: "Mar 03, 2022",
    status: "active",
    notes: "Blood pressure consistently high, monitoring medication efficacy"
  },
  {
    id: "prob3",
    patientId: "p7",
    name: "Osteoarthritis",
    dateIdentified: "Sep 18, 2022",
    status: "active",
    notes: "Primarily affecting knees, managed with NSAIDs and physiotherapy"
  },
  {
    id: "prob4",
    patientId: "p7",
    name: "Urinary Tract Infection",
    dateIdentified: "Dec 05, 2023",
    status: "resolved",
    notes: "Treated with antibiotics, resolved completely"
  }
];

export const patientMedications = [
  {
    id: "med1",
    patientId: "p7",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: "Jan 20, 2022",
    status: "active"
  },
  {
    id: "med2",
    patientId: "p7",
    name: "Amlodipine",
    dosage: "5mg",
    frequency: "Once daily",
    startDate: "Mar 10, 2022",
    status: "active"
  },
  {
    id: "med3",
    patientId: "p7",
    name: "Paracetamol",
    dosage: "500mg",
    frequency: "As needed for pain",
    startDate: "Sep 20, 2022",
    status: "active"
  },
  {
    id: "med4",
    patientId: "p7",
    name: "Ciprofloxacin",
    dosage: "250mg",
    frequency: "Twice daily for 7 days",
    startDate: "Dec 05, 2023",
    status: "discontinued"
  }
];

export const patientAllergies = [
  {
    id: "alg1",
    patientId: "p7",
    allergen: "Penicillin",
    reaction: "Skin rash",
    severity: "moderate",
    dateIdentified: "Feb 10, 2020"
  },
  {
    id: "alg2",
    patientId: "p7",
    allergen: "Peanuts",
    reaction: "Hives, difficulty breathing",
    severity: "severe",
    dateIdentified: "Aug 22, 2019"
  },
  {
    id: "alg3",
    patientId: "p7",
    allergen: "Dust mites",
    reaction: "Sneezing, nasal congestion",
    severity: "mild",
    dateIdentified: "Jan 05, 2021"
  }
];

export const patientLabResults = [
  {
    id: "lab1",
    patientId: "p7",
    testName: "Fasting Blood Glucose",
    value: "145",
    unit: "mg/dL",
    referenceRange: "70-99 mg/dL",
    date: "Jan 10, 2024",
    pdfReport: "/sample-reports/glucose-test.pdf"
  },
  {
    id: "lab2",
    patientId: "p7",
    testName: "HbA1c",
    value: "7.2",
    unit: "%",
    referenceRange: "<5.7%",
    date: "Jan 10, 2024",
    pdfReport: "/sample-reports/hba1c-test.pdf"
  },
  {
    id: "lab3",
    patientId: "p7",
    testName: "Lipid Panel - Total Cholesterol",
    value: "210",
    unit: "mg/dL",
    referenceRange: "<200 mg/dL",
    date: "Jan 10, 2024",
    pdfReport: "/sample-reports/lipid-panel.pdf"
  },
  {
    id: "lab4",
    patientId: "p7",
    testName: "Lipid Panel - LDL",
    value: "130",
    unit: "mg/dL",
    referenceRange: "<100 mg/dL",
    date: "Jan 10, 2024",
    pdfReport: "/sample-reports/lipid-panel.pdf"
  },
  {
    id: "lab5",
    patientId: "p7",
    testName: "Lipid Panel - HDL",
    value: "45",
    unit: "mg/dL",
    referenceRange: ">40 mg/dL",
    date: "Jan 10, 2024",
    pdfReport: "/sample-reports/lipid-panel.pdf"
  },
  {
    id: "lab6",
    patientId: "p7",
    testName: "Complete Blood Count",
    value: "Normal",
    unit: "",
    referenceRange: "Various",
    date: "Dec 15, 2023",
    pdfReport: "/sample-reports/cbc-test.pdf"
  }
];

export const patientNotes = [
  {
    id: "note1",
    patientId: "p7",
    date: "Jan 17, 2024",
    content: "Patient reports feeling tired and experiencing increased thirst. Blood glucose readings at home have been between 140-180 mg/dL. Advised to monitor diet more closely and increase physical activity.",
    author: "Dr. Patel",
    audioRecording: null
  },
  {
    id: "note2",
    patientId: "p7",
    date: "Dec 05, 2023",
    content: "Patient presented with symptoms of UTI. Prescribed Ciprofloxacin 250mg twice daily for 7 days. Advised to increase fluid intake and follow up if symptoms persist.",
    author: "Dr. Singh",
    audioRecording: null
  },
  {
    id: "note3",
    patientId: "p7",
    date: "Sep 15, 2023",
    content: "Quarterly diabetes check-up. HbA1c is 7.5%, slightly increased from last visit. Adjusting Metformin dosage and reviewing diet plan. Referred to nutritionist.",
    author: "Dr. Patel",
    audioRecording: null
  }
];
