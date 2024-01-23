export interface AdminAuthRequiredRequest {
  token: string;
}
export interface OnboardStudentRequest extends AdminAuthRequiredRequest {
  studentID: string;
  firstName: string;
  lastName: string;
  email: string;
  rank: string;
}
