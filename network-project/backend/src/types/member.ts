export enum MemberRequestStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

export interface CreateMemberRequestBody {
  company: string;
  email: string;
  name: string;
  reason: string;
}

export interface UpdateMemberRequestStatusBody {
  status: MemberRequestStatus;
}