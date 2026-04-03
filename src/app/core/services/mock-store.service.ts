import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { MOCK_ENROLLMENTS, MOCK_EVENTS } from '../mocks/mock-data';

export type EnrollmentStatus = 'pending' | 'confirmed' | 'rejected';

export interface EventRecord {
  id: number;
  title: string;
  description?: string;
  date: Date;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  type: string;
  organization_id: number;
}

export interface EnrollmentRecord {
  id: number;
  userId: number;
  userName: string;
  eventId: number;
  eventTitle: string;
  registeredAt: Date;
  status: EnrollmentStatus;
}

interface StoreState {
  events: EventRecord[];
  enrollments: EnrollmentRecord[];
}

const STORAGE_KEY = 'abs_front_mock_store_v1';

function reviveDates<T>(value: any): T {
  return JSON.parse(JSON.stringify(value), (_key, v) => v) as T;
}

@Injectable({
  providedIn: 'root'
})
export class MockStoreService {
  private stateSubject: BehaviorSubject<StoreState>;
  state$: Observable<StoreState>;

  constructor() {
    this.stateSubject = new BehaviorSubject<StoreState>(this.loadInitialState());
    this.state$ = this.stateSubject.asObservable();
  }

  // ---------- Events ----------
  getEvents$(): Observable<EventRecord[]> {
    return this.state$.pipe(map(s => s.events));
  }

  getEventById$(id: number): Observable<EventRecord | undefined> {
    return this.getEvents$().pipe(map(events => events.find(e => e.id === id)));
  }

  createEvent(data: Omit<EventRecord, 'id'>): Observable<EventRecord> {
    const state = this.stateSubject.value;
    const id = this.nextId(state.events.map(e => e.id));
    const created: EventRecord = { ...data, id };
    this.setState({
      ...state,
      events: [created, ...state.events]
    });
    return of(created);
  }

  updateEvent(id: number, patch: Partial<EventRecord>): Observable<EventRecord | undefined> {
    const state = this.stateSubject.value;
    let updated: EventRecord | undefined;

    const events = state.events.map(e => {
      if (e.id !== id) return e;
      updated = { ...e, ...patch, id: e.id };
      return updated;
    });

    this.setState({ ...state, events });

    // Keep enrollments eventTitle in sync if title changes
    if (patch.title) {
      const enrollments = state.enrollments.map(en => en.eventId === id ? { ...en, eventTitle: patch.title as string } : en);
      this.setState({ ...this.stateSubject.value, enrollments });
    }

    return of(updated);
  }

  deleteEvent(id: number): Observable<{ success: true }> {
    const state = this.stateSubject.value;
    const events = state.events.filter(e => e.id !== id);
    const enrollments = state.enrollments.filter(en => en.eventId !== id);
    this.setState({ ...state, events, enrollments });
    return of({ success: true });
  }

  // ---------- Enrollments ----------
  getEnrollments$(): Observable<EnrollmentRecord[]> {
    return this.state$.pipe(map(s => s.enrollments));
  }

  getEnrollmentById$(id: number): Observable<EnrollmentRecord | undefined> {
    return this.getEnrollments$().pipe(map(items => items.find(e => e.id === id)));
  }

  deleteEnrollment(id: number): Observable<{ success: true }> {
    const state = this.stateSubject.value;
    this.setState({
      ...state,
      enrollments: state.enrollments.filter(e => e.id !== id)
    });
    return of({ success: true });
  }

  approveEnrollment(id: number): Observable<EnrollmentRecord | undefined> {
    return this.updateEnrollmentStatus(id, 'confirmed');
  }

  rejectEnrollment(id: number): Observable<EnrollmentRecord | undefined> {
    return this.updateEnrollmentStatus(id, 'rejected');
  }

  // ---------- Internals ----------
  private updateEnrollmentStatus(id: number, status: EnrollmentStatus): Observable<EnrollmentRecord | undefined> {
    const state = this.stateSubject.value;
    let updated: EnrollmentRecord | undefined;

    const enrollments = state.enrollments.map(en => {
      if (en.id !== id) return en;
      updated = { ...en, status };
      return updated;
    });

    this.setState({ ...state, enrollments });
    return of(updated);
  }

  private nextId(ids: number[]): number {
    if (!ids.length) return 1;
    return Math.max(...ids) + 1;
  }

  private loadInitialState(): StoreState {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as StoreState;

        // revive Date fields
        const events: EventRecord[] = (parsed.events || []).map(e => ({
          ...e,
          date: new Date((e as any).date)
        }));

        const enrollments: EnrollmentRecord[] = (parsed.enrollments || []).map(e => ({
          ...e,
          registeredAt: new Date((e as any).registeredAt)
        }));

        return { events, enrollments };
      } catch {
        // fallthrough to seed
      }
    }

    const seeded: StoreState = {
      events: (MOCK_EVENTS as any[]).map(e => ({ ...e })) as EventRecord[],
      enrollments: (MOCK_ENROLLMENTS as any[]).map(e => ({ ...e })) as EnrollmentRecord[]
    };

    // Ensure dates are Date instances
    seeded.events = seeded.events.map(e => ({ ...e, date: new Date((e as any).date) }));
    seeded.enrollments = seeded.enrollments.map(e => ({ ...e, registeredAt: new Date((e as any).registeredAt) }));

    this.persist(seeded);
    return seeded;
  }

  private setState(next: StoreState): void {
    this.stateSubject.next(next);
    this.persist(next);
  }

  private persist(state: StoreState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}
