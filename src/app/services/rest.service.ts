import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { REST } from './constants';
import { Store } from '@ngrx/store';

import { User } from '../model/user';
import { Meeting } from '../model/meeting';
import { Slot } from '../model/slot';
import { StudyCourse } from '../model/study-course';
import { Error } from '../model/error';

@Injectable()
export class RestService {

    constructor(
        private http: Http,
        private store: Store<any>) {
    }

    authorizeUser(user: string, password: string): Observable<User> {
        let headers = new Headers();
        headers.append('Content-Type', 'text/plain');
        headers.append('Authorization', 'Basic ' + btoa(user + ':' + password));
        let response: Observable<User> = this.http.post(REST + '/tokens', {}, { headers: headers, withCredentials: true })
                .map((res: Response) => res.json().user as User);
        response.subscribe((authorizedUser: User) => {
            console.log(authorizedUser);
            localStorage.setItem('user_id', '' + authorizedUser.id);
            localStorage.setItem('user_role', authorizedUser.roles[0]);
            localStorage.setItem('user_name', authorizedUser.username);
        });
        return response;
    }

    createUser(user: User): Observable<User> {
        let response: Observable<User> = this.http.post(REST + '/users', user)
                .map((res: Response) => res.json() as User);
        response.subscribe((createdUser: User) => {
            console.log(createdUser); //TODO
        });
        return response;
    }

    updateUserPassword(userId: number, oldPassword: string, newPassword: string): Observable<User> {
        let requestBody = {
            'app_password[oldPassword]': oldPassword,
            'app_password[newPassword][first]': newPassword,
            'app_password[newPassword][second]': newPassword
        };
        let response: Observable<User> = this.http.patch(REST + '/users/' + userId + '/change-password', requestBody)
                .map((res: Response) => res.json() as User);
        response.subscribe((updatedUser: User) => {
            console.log(updatedUser); //TODO
        });
        return response;
    }

    readProfessors(): Observable<Array<User>> {
        let response: Observable<Array<User>> = this.http.get(REST + '/users/professors')
                .map((res: Response) => res.json() as Array<User>);
        response.subscribe((professors: Array<User>) => {
            console.log(professors); //TODO
        });
        
        // delete:
        let persons: Object = [
            {
                name: 'Prof. Dr. Ralf Kramer',//lastname
                id: 1,
                vorlesungen: [//studyCourses
                    {
                        title: 'Verteilte Systeme'//name
                    },
                    {
                        title: 'IT-Sicherheit'
                    }
                ]
            },
            {
                name: 'Prof. Dr. Oliver Höß',
                id: 2,
                vorlesungen: [
                    {
                        title: 'Verteilte Systeme',
                        id: 5
                    },
                    {
                        title: 'IT-Sicherheit',
                        id: 6
                    }
                ]
            },
        ];
        this.store.dispatch({ type: 'ADD_PERSONS', payload: persons });

        return response;
    }

    readMeetings(): Observable<Array<Meeting>> {
  //readMeetings(userId: number, userRole: string): Observable<Array<Meeting>> {
        let userId = 3;
        let userRole = 'ROLE_STUDENT';

        let response: Observable<Array<Meeting>>;
        if (userRole === 'ROLE_PROF') {
            response = this.http.get(REST + '/users/' + userId + '/meetings/professor')
                    .map((res: Response) => res.json() as Array<Meeting>);
        } else { // if userRole === 'ROLE_STUDENT'
            response = this.http.get(REST + '/users/' + userId + '/meetings/student')
                    .map((res: Response) => res.json() as Array<Meeting>);
        }
        response.subscribe((meetings: Array<Meeting>) => {
            console.log(meetings); //TODO
        });

        //delete:
        let d1 = new Date();
        let d2 = new Date();
        let d3 = new Date();
        d1.setDate(new Date().getDate());
        d2.setDate(new Date().getDate() + 3);
        d3.setDate(new Date().getDate() + 7);
        let data = [
            {
                id: 1,
                title: 'Besprechung',
                start: d1,
                end: d1,
                color: {
                    primary: '#ad2121',
                    secondary: '#FAE3E3'
                },
                prof: 'Prof. Dr. Otto Offline',
                vorlesung: 'Mathe 1/2',
                info: 'Besprechen bzgl. 1 Abgabe',
                duration: 5,
                time: 'Mo 15:30 13.12.16',
                status: 'canceled'
            },
            {
                id: 2,
                title: 'Bachelorarbeit',
                start: d2,
                end: d2,
                color: {
                    primary: '#ad2121',
                    secondary: '#FAE3E3'
                },
                prof: 'Prof. Dr. Ralf Kramer',
                vorlesung: 'Datenbanksysteme',
                info: 'Besprechen bzgl. 1 Abgabe',
                duration: 15,
                time: 'Do 12:30 20.12.16',
                status: 'open'
            },
            {
                id: 3,
                title: 'Frage zur Übung 05',
                start: d3,
                end: d3,
                color: {
                    primary: '#ad2121',
                    secondary: '#FAE3E3'
                },
                prof: 'Prof. Dr. Oliver Höß',
                vorlesung: 'Softwaremodellierung',
                info: 'Besprechen bzgl. 1 Abgabe',
                duration: 25,
                time: 'Fr 13:30 01.12.16',
                status: 'accepted'
            }
        ];
        this.store.dispatch({ type: 'ADD_MEETINGS', payload: data });

        return response;
    }

    createSlot(meetingId: number, name: string, duration: number, comment: string): Observable<Slot> {
        let requestBody = {
            'app_slot[name]': name,
            'app_slot[duration]': duration,
            'app_slot[comment]': comment
        };
        let response: Observable<Slot> = this.http.post(REST + '/meetings/' + meetingId + '/slots', requestBody)
                .map((res: Response) => res.json() as Slot);
        response.subscribe((createdSlot: Slot) => {
            console.log(createdSlot); //TODO
        });
        //TODO check if response is Slot or Array<Slot>
        return response;
    }

    updateSlot(meetingId: number, slotId: number, duration: number, comment: string, status: string): void {
        let requestBody = {
            'app_slot[duration]': duration,
            'app_slot[comment]': comment,
            'app_slot[status]': status
        };
        this.http.patch(REST + '/meetings/' + meetingId + '/slots/' + slotId, requestBody);
        //TODO check if there really no response
    }

    readSlots(userId: number, meeting: Meeting): Observable<Array<Slot>> {
        let response: Observable<Array<Slot>> = this.http.get(REST + '/users/' + userId + '/slots')
                .map((res: Response) => res.json() as Array<Slot>);
        response.subscribe((slots: Array<Slot>) => {
            console.log(slots); //TODO
        });
        return response;
    }

    updateMeeting(meeting: Meeting): void {
        let requestBody = { // MeetingProfessor
            id: meeting.id,
            startDate: meeting.startDate,
            endDate: meeting.endDate,
            status: meeting.status,
            slots: meeting.slots
        };
        this.http.put(REST + '/meetings/' + meeting.id, requestBody);
        //TODO check if there really no response
    }

}
