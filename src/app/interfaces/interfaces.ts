export interface Table {
  name: string;
  id: number;
}

export interface Appointment {
  tableId: number;
  date: Date;
  user_email?: string;
  user_name?: string;
  user_phone?: string;
}

export interface AppointmentFirestore {
  tableId: number;
  date: { seconds: number; nanoseconds: number };
  user_email?: string;
  user_name?: string;
  user_phone?: string;
}

export interface Weekdays {
  name: string;
  id: number;
  date: Date;
  appointments: { booked: boolean; selected: boolean; time: string }[];
}

export interface User {
  email: string;
  username: string;
  UUID: string;
  name?: string;
  phone?: string;
}
