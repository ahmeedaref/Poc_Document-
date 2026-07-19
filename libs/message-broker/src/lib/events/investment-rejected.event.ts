export interface InvestmentRejectedEvent {
  investmentId: string;
  investorId: string;
  companyName: string;
  investmentAmount: number;
  approvalStatus: 'REJECTED';
  rejectedAt: string;
}
