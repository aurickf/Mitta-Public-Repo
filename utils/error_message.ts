class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class InputException extends ValidationError {
  property: string;

  constructor(property) {
    super("Missing or invalid input : " + property);
    this.name = "InputException";
    this.property = property;
  }
}

class DataException extends ValidationError {
  data: string;

  constructor(data) {
    super("Missing or invalid data : " + data);
    this.name = "DataException";
    this.data = data;
  }
}

class RuleException extends ValidationError {
  rule: string;

  constructor(rule) {
    super("Restriction : " + rule);
    this.name = "RuleException";
    this.rule = rule;
  }
}

class AccessException extends ValidationError {
  property: string;

  constructor(property) {
    super("Unauthorized : " + property);
    this.name = "AccessException";
    this.property = property;
  }
}

const accessError = {
  INVALID_ACCESS: " You do not have required role to perform this action.",
};

const announcementError = {
  NOT_FOUND: "Selected announcement could not be found.",
  ENDDATE_IS_EARLY: "End date must be later than start date.",
};

const bookingCardError = {
  CLASS_IS_FULL:
    "Our class is at maximum capacity. It may be available again if other member cancel their booking. Please try again later.",
  INVALID_BOOKING_STATUS: "Invalid booking status.",
  NO_MULTIPLE_BOOK:
    "You already booked this class. Multiple booking is not allowed.",
  NO_MULTIPLE_SEAT: "Multiple seats booking is not allowed.",
  NOT_FOUND: "Booking card could not be found.",
  SEAT_CANNOT_BE_ZERO: "Invalid seat amount requested. Must be 1 or more.",
  SEAT_PARTIPICANT_NO_MATCH:
    "Seat amount and provided participant names must match.",
  TIMELIMIT_CANCEL_EXPIRED: "Unable to cancel. Cancellation period has passed",
  TIMELIMIT_BOOK_EXPIRED: "Unable to book. Booking period has ended.",
  UPDATER_NOT_FOUND: "Updater ID could not be found.",
};

const classError = {
  CANCEL_ONLY_BY_ADMIN_OR_INSTRUCTOR:
    "Only admin and instructor allowed to cancel class.",
  CONFIRM_ONLY_BY_ADMIN_OR_INSTRUCTOR:
    "Only admin and instructor allowed to confirm class.",
  CONFIRMATION_FAILED_PARTIAL:
    "Some of members booking failed to be confirmed, please try again.",
  CANCELLATION_FAILED_PARTIAL:
    "Some of members booking failed to be cancelled, please try again.",
  CLASS_DELETION_FAILED: "Class deletion failed, please try again.",
  DIFFERENT_AMOUNT:
    "Previous schedule and new schedule has different amount of class.",
  DURATION_IS_INVALID:
    "Invalid class duration, class end time is before start time.",
  HAS_NOT_ENDED:
    "Confirmation can only be done after scheduled time has passed.",
  INVALID_RECURRENCE: "Invalid recurrenceId or invalid recurrence input.",
  INVALID_ACTION: "Invalid action parameter.",
  IS_CANCELLED: "This class has been cancelled. Please book another class.",
  IS_CLOSED:
    "Booking period has been closed early for this class. Please book another class.",
  IS_RUNNING: "One or more class already running.",
  IS_VIP_ONLY: "This class is open for VIP membership only.",
  IS_ALREADY_BOOKED:
    "One or more class booking cancellation failed. Please try to delete again later.",
  NOT_FOUND: "Class could not be found.",
  NO_INSTRUCTOR: "Instructor is mandatory.",
  NO_TITLE: "Class title is mandatory.",
  NO_LEVEL: "Class level is mandatory.",
  NO_CAPACITY: "Class capacity is mandatory.",
  OFFLINE_ONLINE_ZERO_CAPACITY: "Offline and online capacity cannot both be 0.",
  SPECIAL_CLASS_CONFIRM_RUNNING_BEFORE_TIME:
    "You can only confirm class to run after scheduled time has passed.",
  TITLE_MUST_BE_ALPHANUMERIC:
    "Class title should not contain special character.",
};

const featureError = {
  NO_UPDATER: "Please select user as auto-approver first.",
};

const holidayError = {
  NOT_FOUND: "Selected holiday could not be found.",
  ENDDATE_IS_EARLY: "End date must be later than start date.",
};

const levelError = {
  NOT_FOUND: "Selected holiday could not be found.",
};

const membershipError = {
  NOT_FOUND: "Membership could not be found.",
  INSUFFICIENT_BALANCE:
    "Unable to book. Your membership balance is insufficient.",
  IS_EXPIRED: "Your membership has expired. Please purchase a new one.",
  DEVERIFY_LATEST:
    "Cannot de-verify latest membership. Activate new membership for this member first.",
  DELETE_LATEST:
    "Cannot delete latest membership. Activate new membership for this member first.",
  DELETE_VERIFIED: "Cannot delete verified membership. De-verify it first.",
};

const membershipPackageError = {
  NOT_FOUND: "Membership package could not be found.",
};

const paymentMethodError = {
  NOT_FOUND: "Selected payment method could not be found.",
  REQUIRE_PROOF:
    "Selected payment method require proof of payment. Please provide one.",
};

const seriesError = {
  ALREADY_EXIST: "Series title already in used. Please use another title.",
};

const templateError = {
  NOT_FOUND: "Selected template could not be found.",
};

const userError = {
  EMAIL_INVALID: "Invalid email.",
  NOT_FOUND: "User could not be found.",
  IMAGE_URL_INVALID: "Invalid avatar image url.",
  NAME_IS_EMPTY: "Please input your name.",
  NAME_CONTAINS_NON_ALPHA: "Name must only contain letters",
  PHONE_FORMAT_INVALID: "Invalid mobile number.",
  USERNAME_IS_EMPTY: "Please input your username.",
  USERNAME_CONTAINS_NON_ALPHANUMERIC:
    "Username must only contain letters and numbers",
  UPDATER_NOT_FOUND: "Invalid updater ID",
};

export {
  AccessException,
  InputException,
  DataException,
  RuleException,
  accessError,
  announcementError,
  bookingCardError,
  classError,
  featureError,
  holidayError,
  levelError,
  membershipError,
  membershipPackageError,
  paymentMethodError,
  seriesError,
  templateError,
  userError,
};
