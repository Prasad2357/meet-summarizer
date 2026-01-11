export type Props = {
  priority: string;
  owner: string;
  status: string;
  owners: string[];
  onPriorityChange: (v: string) => void;
  onOwnerChange: (v: string) => void;
  onStatusChange: (v: string) => void;
};