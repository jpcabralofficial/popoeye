export default interface CheckoutState {
  fulfillmentType: 'dine-in' | 'take-out' | '';
  modeOfPayment: 'card' | 'gcash' | 'maya' | '';
  typeOfPayment: 'cash' | 'cashless' | '';
  counterQueueTicket: number;
  paymentStatus:
    | 'PENDING'
    | 'FAILED'
    | 'CANCELLED'
    | 'STARTED'
    | 'SUCCESSFUL'
    | '';
}
