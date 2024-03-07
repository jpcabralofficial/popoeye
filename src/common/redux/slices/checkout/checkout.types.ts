export default interface CheckoutState {
  fulfillmentType: 'dine-in' | 'take-out' | '';
  typeOfPayment: 'cash' | 'cashless' | '';
  counterQueueTicket: number;
}
