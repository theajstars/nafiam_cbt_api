export interface AdminAuthRequiredRequest {
  token: string;
}
export interface OnboardStudentRequest extends AdminAuthRequiredRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  rank: string;
}
