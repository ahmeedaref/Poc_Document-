export interface InvestmentApprovedEvent {
  investmentId: string;
  investorId: string;
  companyName: string;
  investmentAmount: number;
  approvalStatus: 'APPROVED';
  approvedAt: string;
}
