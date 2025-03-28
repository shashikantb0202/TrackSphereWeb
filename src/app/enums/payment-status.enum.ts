export enum PaymentStatusEnum {
  None = 'None',
  Pending = 'Pending', // Payment is yet to be processed
  Completed = 'Completed', // Payment is successfully completed
  Failed = 'Failed', // Payment failed during processing
  Refunded = 'Refunded', // Payment has been refunded
  PartiallyPaid = 'PartiallyPaid', // Only a part of the amount is paid
  Cancelled = 'Cancelled', // Payment was canceled
  OnHold = 'OnHold', // Payment is on hold for verification
}
