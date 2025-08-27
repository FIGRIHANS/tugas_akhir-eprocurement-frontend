export interface WorkflowProfileTableRow {
  step: number;
  category: string;
  bracketAmount: string;
  stepName: string;
  profileId: string;
  profileName: string;
  approverGroupId: string;
  notificationGroupId: string;
  remarks: string;
}

export interface WorkflowProfileTableProps {
  isDataEmpty: boolean;
  data?: WorkflowProfileTableRow[];
}
