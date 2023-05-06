import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Appointment } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private firestore: AngularFirestore) {}

  makeAppointment(table: any, appointment: Appointment) {
    return this.firestore.collection('Appointments').add(appointment);
  }

  getAppointmentsForWeek(startDate: Date, tableId: number) {
    //make a const endDate that gives 7 days to the startDate
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    return this.firestore
      .collection('Appointments', (ref) => {
        return ref
          .where('date', '>=', startDate)
          .where('date', '<=', endDate)
          .where('tableId', '==', tableId);
      })
      .valueChanges();
  }

  getAppointmentsByUserEmail(email: string) {
    return this.firestore
      .collection('Appointments', (ref) => {
        return ref.where('user_email', '==', email).orderBy('date', 'desc');
      })
      .valueChanges();
  }
}
