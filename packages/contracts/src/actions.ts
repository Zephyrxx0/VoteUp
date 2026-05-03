export type ActionPriority = 'urgent' | 'high' | 'normal';
export type CtaType = 'external_url' | 'calendar_add' | 'map_view' | 'none';

export interface CalendarEventSpec {
  title: string;
  date: string;
  description?: string;
  location?: string;
}

export interface MapLocation {
  name: string;
  lat: number;
  lng: number;
  address: string;
  type: 'registration_office' | 'polling_station' | 'support_org';
}

export interface ActionItem {
  id: string;
  priority: ActionPriority;
  title: string;
  description: string;
  ctaType: CtaType;
  ctaPayload?: string | CalendarEventSpec | MapLocation;
}

export interface PersonalisedActions {
  stageId: string;
  items: ActionItem[];
  mapLocations: MapLocation[];
}
