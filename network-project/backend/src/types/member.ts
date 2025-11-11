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

export interface MemberRequest extends CreateMemberRequestBody {
  id: number;
  status: MemberRequestStatus;
  createdAt: Date;
  invitation?: Invitation | null;
}

export interface Invitation {
  id: number;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  memberRequestId: number;
}