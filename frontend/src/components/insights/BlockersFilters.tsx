import type{ Props } from "../../types/blockersFilters";

const BlockersFilters = ({
  severity,
  meetingType,
  area,
  meetingTypes,
  areas,
  onSeverityChange,
  onMeetingTypeChange,
  onAreaChange,
}: Props) => {
  return (
    <div className="flex gap-4 flex-wrap">
      {/* Severity */}
      <select
        value={severity}
        onChange={(e) => onSeverityChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option>All</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      {/* Meeting Type */}
      <select
        value={meetingType}
        onChange={(e) => onMeetingTypeChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option>All</option>
        {meetingTypes.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      {/* Affected Area */}
      <select
        value={area}
        onChange={(e) => onAreaChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option>All</option>
        {areas.map((a) => (
          <option key={a}>{a}</option>
        ))}
      </select>
    </div>
  );
};

export default BlockersFilters;