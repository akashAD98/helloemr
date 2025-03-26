
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
