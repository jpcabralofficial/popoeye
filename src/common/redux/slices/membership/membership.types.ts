export default interface MembershipState {
  memberType: 'active' | 'expired' | 'not exist' | '';
  membershipBarcode: string;
}
