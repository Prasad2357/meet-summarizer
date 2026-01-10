type Props = {
  label: string;
  value?: string | number;
  loading?: boolean;
};

const KPICard = ({ label, value, loading }: Props) => {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-2xl font-semibold">
        {loading ? "--" : value ?? "--"}
      </div>
      <div className="text-sm text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  );
};

export default KPICard;
