
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
  },
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
