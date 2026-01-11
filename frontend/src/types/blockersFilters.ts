export type Props = {
  severity: string;
  meetingType: string;
  area: string;
  meetingTypes: string[];
  areas: string[];
  onSeverityChange: (v: string) => void;
  onMeetingTypeChange: (v: string) => void;
  onAreaChange: (v: string) => void;
};