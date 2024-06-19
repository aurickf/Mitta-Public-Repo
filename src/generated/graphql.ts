import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  ObjectId: any;
  Upload: any;
};

/** Announcement model */
export type Announcement = {
  __typename?: 'Announcement';
  _id: Scalars['ObjectId'];
  end?: Maybe<Scalars['DateTime']>;
  isEnabled?: Maybe<Scalars['Boolean']>;
  isPrivate?: Maybe<Scalars['Boolean']>;
  isPublic?: Maybe<Scalars['Boolean']>;
  start: Scalars['DateTime'];
  text: Scalars['String'];
};

export type AnnouncementInput = {
  _id?: InputMaybe<Scalars['ObjectId']>;
  end?: InputMaybe<Scalars['DateTime']>;
  isEnabled?: InputMaybe<Scalars['Boolean']>;
  isPrivate?: InputMaybe<Scalars['Boolean']>;
  isPublic?: InputMaybe<Scalars['Boolean']>;
  start?: InputMaybe<Scalars['DateTime']>;
  text?: InputMaybe<Scalars['String']>;
};

/** File model */
export type AwsBucket = {
  __typename?: 'AWSBucket';
  Contents: Array<AwsFile>;
  IsTruncated: Scalars['Boolean'];
  KeyCount: Scalars['Float'];
  MaxKeys: Scalars['Float'];
  Name: Scalars['String'];
  Prefix: Scalars['String'];
};

export type AwsFile = {
  __typename?: 'AWSFile';
  FileName?: Maybe<Scalars['String']>;
  Key?: Maybe<Scalars['String']>;
  LastModified?: Maybe<Scalars['DateTime']>;
  Size?: Maybe<Scalars['Float']>;
};

export type AwsFileArrayInput = {
  fileNames: Array<Scalars['String']>;
  prefix: Scalars['String'];
};

/** Booking card model */
export type BookingCard = {
  __typename?: 'BookingCard';
  _id: Scalars['ObjectId'];
  booker?: Maybe<User>;
  bookingCode: Scalars['String'];
  classType: Scalars['String'];
  cost: Scalars['Int'];
  createdAt?: Maybe<Scalars['DateTime']>;
  regularClass?: Maybe<RegularClass>;
  status: BookingCardStatus;
  updatedAt?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
};

/** Booking card input model */
export type BookingCardInput = {
  _id?: InputMaybe<Scalars['ObjectId']>;
  booker: Scalars['ObjectId'];
  bookingCode?: InputMaybe<Scalars['String']>;
  classType: Scalars['String'];
  regularClass: Scalars['ObjectId'];
  seat: Scalars['Int'];
  status: BookingCardStatusInput;
  user: Scalars['ObjectId'];
};

export type BookingCardStatus = {
  __typename?: 'BookingCardStatus';
  lastUpdateOn: Scalars['DateTime'];
  updatedBy?: Maybe<User>;
  value?: Maybe<Scalars['String']>;
};

export type BookingCardStatusInput = {
  lastUpdateOn?: InputMaybe<Scalars['DateTime']>;
  updatedBy: Scalars['ObjectId'];
  value: Scalars['String'];
};

export type BookingReport = {
  __typename?: 'BookingReport';
  _id?: Maybe<BookingReportId>;
  count?: Maybe<Scalars['Float']>;
  totalCost?: Maybe<Scalars['Float']>;
  totalSeat?: Maybe<Scalars['Float']>;
};

export type BookingReportId = {
  __typename?: 'BookingReportId';
  classType?: Maybe<Scalars['String']>;
  instructor?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
  week?: Maybe<Scalars['Float']>;
};

export type ClassCapacity = {
  __typename?: 'ClassCapacity';
  availability?: Maybe<Scalars['Int']>;
  booked?: Maybe<Array<Maybe<BookingCard>>>;
  bookingTimeLimit?: Maybe<Scalars['Int']>;
  cancelTimeLimit?: Maybe<Scalars['Int']>;
  capacity?: Maybe<Scalars['Int']>;
  cost?: Maybe<Scalars['Int']>;
};

export type ClassCapacityInput = {
  booked?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']>>>;
  bookingTimeLimit?: InputMaybe<Scalars['Int']>;
  cancelTimeLimit?: InputMaybe<Scalars['Int']>;
  capacity?: InputMaybe<Scalars['Int']>;
  cost?: InputMaybe<Scalars['Int']>;
};

export type ClassDetails = {
  __typename?: 'ClassDetails';
  description?: Maybe<Scalars['String']>;
  level: Level;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  title: Scalars['String'];
};

export type ClassDetailsInput = {
  description?: InputMaybe<Scalars['String']>;
  level: Scalars['ObjectId'];
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title: Scalars['String'];
};

export type ClassSchedule = {
  __typename?: 'ClassSchedule';
  date?: Maybe<Scalars['DateTime']>;
  duration?: Maybe<Scalars['Int']>;
  isAllDay?: Maybe<Scalars['Boolean']>;
  rString?: Maybe<Scalars['String']>;
};

export type ClassScheduleInput = {
  date: Scalars['DateTime'];
  duration: Scalars['Int'];
  isAllDay: Scalars['Boolean'];
  rString: Scalars['String'];
};

export type ClassStatus = {
  __typename?: 'ClassStatus';
  isPublished?: Maybe<Scalars['Boolean']>;
  isRunning?: Maybe<Scalars['Boolean']>;
  isVIPOnly?: Maybe<Scalars['Boolean']>;
};

export type ClassStatusInput = {
  isPublished: Scalars['Boolean'];
  isRunning?: InputMaybe<Scalars['Boolean']>;
  isVIPOnly: Scalars['Boolean'];
};

export type ClassTemplateCapacity = {
  __typename?: 'ClassTemplateCapacity';
  bookingTimeLimit?: Maybe<Scalars['Int']>;
  cancelTimeLimit?: Maybe<Scalars['Int']>;
  capacity?: Maybe<Scalars['Int']>;
  cost?: Maybe<Scalars['Int']>;
};

export type ClassTemplateCapacityInput = {
  bookingTimeLimit: Scalars['Int'];
  cancelTimeLimit: Scalars['Int'];
  capacity: Scalars['Int'];
  cost?: InputMaybe<Scalars['Int']>;
};

export type ClassTemplateDetails = {
  __typename?: 'ClassTemplateDetails';
  description?: Maybe<Scalars['String']>;
  level: Level;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  title: Scalars['String'];
};

export type ClassTemplateDetailsInput = {
  description?: InputMaybe<Scalars['String']>;
  level: Scalars['ObjectId'];
  tags?: InputMaybe<Array<Scalars['String']>>;
  title: Scalars['String'];
};

export type ClassTemplateSchedule = {
  __typename?: 'ClassTemplateSchedule';
  day?: Maybe<Array<Scalars['Int']>>;
  duration?: Maybe<Scalars['Int']>;
  startTime: Scalars['DateTime'];
};

export type ClassTemplateScheduleInput = {
  day: Array<Scalars['Int']>;
  duration: Scalars['Int'];
  startTime: Scalars['DateTime'];
};

export type ClassZoom = {
  __typename?: 'ClassZoom';
  joinUrl?: Maybe<Scalars['String']>;
  meetingId?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

export type ClassZoomInput = {
  joinUrl?: InputMaybe<Scalars['String']>;
  meetingId?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};

export type Counter = {
  __typename?: 'Counter';
  _id: Scalars['ObjectId'];
  counter: Scalars['Int'];
  keyword: Scalars['String'];
  prefix: Scalars['String'];
};

export type DeleteObject = {
  __typename?: 'DeleteObject';
  DeleteMarker?: Maybe<Scalars['Boolean']>;
  Metadata: ResponseMetadataClass;
  VersionId?: Maybe<Scalars['String']>;
};

/** Event booking card model */
export type EventBookingCard = {
  __typename?: 'EventBookingCard';
  _id: Scalars['ObjectId'];
  booker: User;
  bookingCode: Scalars['String'];
  classType: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  event: SpecialEvent;
  participants: Array<Scalars['String']>;
  payment: EventPayment;
  seat: Scalars['Int'];
  status: EventBookingCardStatus;
  updatedAt?: Maybe<Scalars['DateTime']>;
  user: User;
};

/** Event booking card model input */
export type EventBookingCardInput = {
  _id?: InputMaybe<Scalars['ObjectId']>;
  booker: Scalars['ObjectId'];
  classType: Scalars['String'];
  event: Scalars['ObjectId'];
  image?: InputMaybe<Scalars['Upload']>;
  participants: Array<Scalars['String']>;
  payment: EventPaymentInput;
  seat: Scalars['Int'];
  status: EventBookingCardStatusInput;
  user: Scalars['ObjectId'];
};

export type EventBookingCardStatus = {
  __typename?: 'EventBookingCardStatus';
  lastUpdateOn?: Maybe<Scalars['DateTime']>;
  reason?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<User>;
  value?: Maybe<Scalars['String']>;
};

export type EventBookingCardStatusInput = {
  reason?: InputMaybe<Scalars['String']>;
  updatedBy: Scalars['ObjectId'];
  value?: InputMaybe<Scalars['String']>;
};

export type EventCapacity = {
  __typename?: 'EventCapacity';
  availability?: Maybe<Scalars['Int']>;
  booked?: Maybe<Array<Maybe<EventBookingCard>>>;
  bookedSeat: Scalars['Float'];
  bookingTimeLimit?: Maybe<Scalars['Int']>;
  capacity?: Maybe<Scalars['Int']>;
  confirmed?: Maybe<Array<Maybe<EventBookingCard>>>;
  confirmedSeat: Scalars['Float'];
  cost?: Maybe<Scalars['Int']>;
  rejected?: Maybe<Array<Maybe<EventBookingCard>>>;
  rejectedSeat: Scalars['Float'];
};

export type EventCapacityInput = {
  bookingTimeLimit?: InputMaybe<Scalars['Int']>;
  capacity?: InputMaybe<Scalars['Int']>;
  cost?: InputMaybe<Scalars['Int']>;
};

export type EventDetails = {
  __typename?: 'EventDetails';
  description?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  title: Scalars['String'];
};

export type EventDetailsInput = {
  description?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title: Scalars['String'];
};

export type EventInstructor = {
  __typename?: 'EventInstructor';
  name: Scalars['String'];
};

export type EventPayment = {
  __typename?: 'EventPayment';
  amount?: Maybe<Scalars['Float']>;
  date: Scalars['DateTime'];
  image?: Maybe<Scalars['String']>;
  method: Scalars['String'];
};

export type EventPaymentInput = {
  date: Scalars['DateTime'];
  image?: InputMaybe<Scalars['String']>;
  method: Scalars['String'];
};

export type EventSchedule = {
  __typename?: 'EventSchedule';
  date?: Maybe<Scalars['DateTime']>;
  duration?: Maybe<Scalars['Int']>;
  isAllDay?: Maybe<Scalars['Boolean']>;
  rString?: Maybe<Scalars['String']>;
};

export type EventScheduleInput = {
  date?: InputMaybe<Scalars['DateTime']>;
  duration?: InputMaybe<Scalars['Int']>;
  isAllDay?: InputMaybe<Scalars['Boolean']>;
  rString?: InputMaybe<Scalars['String']>;
};

export type EventStatus = {
  __typename?: 'EventStatus';
  isPublished?: Maybe<Scalars['Boolean']>;
  isRunning?: Maybe<Scalars['Boolean']>;
  isVIPOnly?: Maybe<Scalars['Boolean']>;
};

export type EventStatusInput = {
  isPublished?: InputMaybe<Scalars['Boolean']>;
  isRunning?: InputMaybe<Scalars['Boolean']>;
  isVIPOnly?: InputMaybe<Scalars['Boolean']>;
};

/** Feature model */
export type Feature = {
  __typename?: 'Feature';
  _id: Scalars['ObjectId'];
  by?: Maybe<User>;
  createdAt?: Maybe<Scalars['DateTime']>;
  featureKey: Scalars['String'];
  isEnabled?: Maybe<Scalars['Boolean']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

/** Holiday model */
export type Holiday = {
  __typename?: 'Holiday';
  _id: Scalars['ObjectId'];
  end?: Maybe<Scalars['DateTime']>;
  isEnabled?: Maybe<Scalars['Boolean']>;
  start: Scalars['DateTime'];
  title: Scalars['String'];
};

export type HolidayInput = {
  _id?: InputMaybe<Scalars['ObjectId']>;
  end?: InputMaybe<Scalars['DateTime']>;
  isEnabled?: InputMaybe<Scalars['Boolean']>;
  start?: InputMaybe<Scalars['DateTime']>;
  title?: InputMaybe<Scalars['String']>;
};

/** Class level model */
export type Level = {
  __typename?: 'Level';
  _id: Scalars['ObjectId'];
  code: Scalars['String'];
  description: Scalars['String'];
  isEnabled?: Maybe<Scalars['Boolean']>;
};

/** Class level input model */
export type LevelInput = {
  _id?: InputMaybe<Scalars['ObjectId']>;
  code?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  isEnabled?: InputMaybe<Scalars['Boolean']>;
};

/** Log model */
export type Log = {
  __typename?: 'Log';
  _id: Scalars['ObjectId'];
  category: Scalars['String'];
  createdAt?: Maybe<Scalars['DateTime']>;
  message: Scalars['String'];
  subCategory: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
};

export type Membership = {
  __typename?: 'Membership';
  _id: Scalars['ObjectId'];
  balance: MembershipBalance;
  booked: Array<Maybe<BookingCard>>;
  cancelled: Array<Maybe<BookingCard>>;
  confirmed: Array<Maybe<BookingCard>>;
  createdAt?: Maybe<Scalars['DateTime']>;
  next?: Maybe<Membership>;
  note?: Maybe<Scalars['String']>;
  payment: MembershipPayment;
  prev?: Maybe<Membership>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
  verified: MembershipVerified;
};

export type MembershipBalance = {
  __typename?: 'MembershipBalance';
  additional: Scalars['Int'];
  available?: Maybe<Scalars['Int']>;
  totalBookedCost: Scalars['Int'];
  totalConfirmedCost: Scalars['Int'];
  transferIn?: Maybe<Scalars['Int']>;
  transferOut?: Maybe<Scalars['Int']>;
  validUntil: Scalars['DateTime'];
};

export type MembershipBalanceInput = {
  additional?: InputMaybe<Scalars['Int']>;
  transferIn?: InputMaybe<Scalars['Int']>;
  transferOut?: InputMaybe<Scalars['Int']>;
  validUntil?: InputMaybe<Scalars['DateTime']>;
};

/** Membership package model */
export type MembershipPackage = {
  __typename?: 'MembershipPackage';
  _id: Scalars['ID'];
  additional: Scalars['Int'];
  isEnabled?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  price: Scalars['Int'];
  validity: Scalars['Int'];
};

export type MembershipPackageInput = {
  _id?: InputMaybe<Scalars['ObjectId']>;
  additional?: InputMaybe<Scalars['Int']>;
  isEnabled: Scalars['Boolean'];
  name?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Int']>;
  validity?: InputMaybe<Scalars['Int']>;
};

export type MembershipPayment = {
  __typename?: 'MembershipPayment';
  amount: Scalars['Int'];
  date: Scalars['DateTime'];
  method: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

export type MembershipPaymentInput = {
  amount?: InputMaybe<Scalars['Int']>;
  date?: InputMaybe<Scalars['DateTime']>;
  method?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

export type MembershipVerified = {
  __typename?: 'MembershipVerified';
  by?: Maybe<User>;
  date?: Maybe<Scalars['DateTime']>;
  isVerified?: Maybe<Scalars['Boolean']>;
  reason?: Maybe<Scalars['String']>;
};

export type MembershipVerifiedInput = {
  by?: InputMaybe<Scalars['ObjectId']>;
  date?: InputMaybe<Scalars['DateTime']>;
  isVerified?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
};

/** Message model */
export type Message = {
  __typename?: 'Message';
  _id: Scalars['ObjectId'];
  createdAt?: Maybe<Scalars['DateTime']>;
  isRead?: Maybe<Scalars['Boolean']>;
  message: Scalars['String'];
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  addAnnouncement: Announcement;
  addBookingCard: Array<BookingCard>;
  addEventBookingCard: EventBookingCard;
  addHoliday: Holiday;
  addLevel: Level;
  addMembership: Membership;
  addMembershipPackage: MembershipPackage;
  addPaymentMethod: PaymentMethod;
  addRegularClass: Scalars['Float'];
  addSeries: Series;
  addSpecialEvent: Scalars['Float'];
  addTemplate: RegularClassTemplate;
  addZoomMeetingRegularClass: RegularClass;
  addZoomMeetingSpecialEvent: SpecialEvent;
  cancelBookingCard: BookingCard;
  cleanUpUserData: Scalars['Boolean'];
  deleteAllReadMessagesForUser: Scalars['Float'];
  deleteAnnouncement: Announcement;
  deleteEventBookingPaymentImage: EventBookingCard;
  deleteFollowingRegularClass: Scalars['Float'];
  deleteFollowingSpecialEvent: Scalars['Float'];
  deleteHoliday: Holiday;
  deleteLevel: Level;
  deleteMembership: Membership;
  deleteMembershipPackage: MembershipPackage;
  deletePaymentMethod: PaymentMethod;
  deleteProfileImage: Scalars['Boolean'];
  deleteProofOfPayment: Membership;
  deleteRecurrenceRegularClass: Scalars['Float'];
  deleteRecurrenceSpecialEvent: Scalars['Float'];
  deleteSeries: Series;
  deleteSingleRegularClass: Scalars['Float'];
  deleteSingleSpecialEvent: Scalars['Float'];
  deleteSpecialEventStatus: SpecialEvent;
  deleteTemplate: RegularClassTemplate;
  deleteUnusedImages: DeleteObject;
  editAnnouncement: Announcement;
  editFollowingRegularClass: Scalars['Float'];
  editFollowingSpecialEvent: Scalars['Float'];
  editHoliday: Holiday;
  editLevel: Level;
  editMembership: Membership;
  editMembershipPackage: MembershipPackage;
  editPaymentMethod: PaymentMethod;
  editRecurrenceRegularClass: Scalars['Float'];
  editRecurrenceSpecialEvent: Scalars['Float'];
  editSeries: Series;
  editSingleRegularClass: Scalars['Float'];
  editSingleSpecialEvent: Scalars['Float'];
  editTemplate: RegularClassTemplate;
  editUser: User;
  editUserRoleAndAccess: User;
  markAllMessagesAsReadForUser: Scalars['Float'];
  markThisAndFollowingMembershipAsInvalid: Membership;
  markThisMembershipAsInvalid: Membership;
  setAutoApproverAdmin: Feature;
  toggleFeature: Feature;
  updateClassAttendance: RegularClass;
  updateEventBookingRequestStatus: EventBookingCard;
  updateSpecialEventBookingParticipants: EventBookingCard;
  updateSpecialEventStatus: SpecialEvent;
  uploadProfileImage: Scalars['Boolean'];
  uploadProofOfPayment: Scalars['String'];
};


export type MutationAddAnnouncementArgs = {
  input: AnnouncementInput;
};


export type MutationAddBookingCardArgs = {
  input: BookingCardInput;
};


export type MutationAddEventBookingCardArgs = {
  input: EventBookingCardInput;
};


export type MutationAddHolidayArgs = {
  input: HolidayInput;
};


export type MutationAddLevelArgs = {
  input: LevelInput;
};


export type MutationAddMembershipArgs = {
  image?: InputMaybe<Scalars['Upload']>;
  membershipPackageId: Scalars['ObjectId'];
  note: Scalars['String'];
  payment: MembershipPaymentInput;
  user: Scalars['ObjectId'];
};


export type MutationAddMembershipPackageArgs = {
  input: MembershipPackageInput;
};


export type MutationAddPaymentMethodArgs = {
  input: Payment_MethodInput;
};


export type MutationAddRegularClassArgs = {
  input: RegularClassInput;
};


export type MutationAddSeriesArgs = {
  input: SeriesInput;
};


export type MutationAddSpecialEventArgs = {
  input: SpecialEventInput;
};


export type MutationAddTemplateArgs = {
  input: RegularClassTemplateInput;
};


export type MutationAddZoomMeetingRegularClassArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationAddZoomMeetingSpecialEventArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationCancelBookingCardArgs = {
  _id: Scalars['ObjectId'];
  bookingStatus: Scalars['String'];
  updatedBy: Scalars['ObjectId'];
};


export type MutationCleanUpUserDataArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeleteAllReadMessagesForUserArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeleteAnnouncementArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeleteEventBookingPaymentImageArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeleteFollowingRegularClassArgs = {
  _id: Scalars['ObjectId'];
  date: Scalars['DateTime'];
  updatedBy: Scalars['ObjectId'];
};


export type MutationDeleteFollowingSpecialEventArgs = {
  _id: Scalars['ObjectId'];
  date: Scalars['DateTime'];
  updatedBy: Scalars['ObjectId'];
};


export type MutationDeleteHolidayArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeleteLevelArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeleteMembershipArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeleteMembershipPackageArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeletePaymentMethodArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeleteProfileImageArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeleteProofOfPaymentArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeleteRecurrenceRegularClassArgs = {
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
};


export type MutationDeleteRecurrenceSpecialEventArgs = {
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
};


export type MutationDeleteSeriesArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeleteSingleRegularClassArgs = {
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
};


export type MutationDeleteSingleSpecialEventArgs = {
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
};


export type MutationDeleteSpecialEventStatusArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeleteTemplateArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationDeleteUnusedImagesArgs = {
  input: AwsFileArrayInput;
};


export type MutationEditAnnouncementArgs = {
  input: AnnouncementInput;
};


export type MutationEditFollowingRegularClassArgs = {
  input: RegularClassInput;
  originalDate: Scalars['DateTime'];
};


export type MutationEditFollowingSpecialEventArgs = {
  input: SpecialEventInput;
  originalDate: Scalars['DateTime'];
};


export type MutationEditHolidayArgs = {
  input: HolidayInput;
};


export type MutationEditLevelArgs = {
  input: LevelInput;
};


export type MutationEditMembershipArgs = {
  _id: Scalars['ObjectId'];
  balance: MembershipBalanceInput;
  payment: MembershipPaymentInput;
  verified: MembershipVerifiedInput;
};


export type MutationEditMembershipPackageArgs = {
  input: MembershipPackageInput;
};


export type MutationEditPaymentMethodArgs = {
  input: Payment_MethodInput;
};


export type MutationEditRecurrenceRegularClassArgs = {
  input: RegularClassInput;
};


export type MutationEditRecurrenceSpecialEventArgs = {
  input: SpecialEventInput;
};


export type MutationEditSeriesArgs = {
  input: SeriesInput;
};


export type MutationEditSingleRegularClassArgs = {
  input: RegularClassInput;
};


export type MutationEditSingleSpecialEventArgs = {
  input: SpecialEventInput;
};


export type MutationEditTemplateArgs = {
  input: RegularClassTemplateInput;
};


export type MutationEditUserArgs = {
  input: UserProfileInputArgs;
};


export type MutationEditUserRoleAndAccessArgs = {
  _id: Scalars['ObjectId'];
  access: UserAccessInput;
  isVIP: Scalars['Boolean'];
  role: UserRoleInput;
  updaterId: Scalars['ObjectId'];
};


export type MutationMarkAllMessagesAsReadForUserArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationMarkThisAndFollowingMembershipAsInvalidArgs = {
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
};


export type MutationMarkThisMembershipAsInvalidArgs = {
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
};


export type MutationSetAutoApproverAdminArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationToggleFeatureArgs = {
  featureKey: Scalars['String'];
};


export type MutationUpdateClassAttendanceArgs = {
  _id: Scalars['ObjectId'];
  action: Scalars['String'];
  reason?: InputMaybe<Scalars['String']>;
  updatedBy: Scalars['ObjectId'];
};


export type MutationUpdateEventBookingRequestStatusArgs = {
  _id: Scalars['ObjectId'];
  status: EventBookingCardStatusInput;
};


export type MutationUpdateSpecialEventBookingParticipantsArgs = {
  _id: Scalars['ObjectId'];
  participants: Array<Scalars['String']>;
};


export type MutationUpdateSpecialEventStatusArgs = {
  _id: Scalars['ObjectId'];
  isRunning: Scalars['Boolean'];
};


export type MutationUploadProfileImageArgs = {
  _id: Scalars['ObjectId'];
  image: Scalars['Upload'];
};


export type MutationUploadProofOfPaymentArgs = {
  image: Scalars['Upload'];
};

/** Payment method input model */
export type Payment_MethodInput = {
  _id?: InputMaybe<Scalars['ObjectId']>;
  isEnabled?: InputMaybe<Scalars['Boolean']>;
  isEnabledForMembership?: InputMaybe<Scalars['Boolean']>;
  isEnabledForSpecialEvent?: InputMaybe<Scalars['Boolean']>;
  requireProof?: InputMaybe<Scalars['Boolean']>;
  via?: InputMaybe<Scalars['String']>;
};

/** Payment method model */
export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  _id: Scalars['ObjectId'];
  isEnabled?: Maybe<Scalars['Boolean']>;
  isEnabledForMembership?: Maybe<Scalars['Boolean']>;
  isEnabledForSpecialEvent?: Maybe<Scalars['Boolean']>;
  requireProof?: Maybe<Scalars['Boolean']>;
  via: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  activeAnnouncements: Array<Announcement>;
  activeBookings: Array<BookingCard>;
  activeClassesByInstructors: Array<RegularClass>;
  activeHolidays: Array<Holiday>;
  activeLevels: Array<Level>;
  activeMembershipPackages: Array<MembershipPackage>;
  activePaymentMethods: Array<PaymentMethod>;
  activePaymentMethodsMembership: Array<PaymentMethod>;
  activePaymentMethodsSpecialEvent: Array<PaymentMethod>;
  activePrivateAnnouncements: Array<Announcement>;
  activePublicAnnouncements: Array<Announcement>;
  admins: Array<User>;
  allPublishedSeries: Array<Series>;
  allSeries: Array<Series>;
  announcements: Array<Announcement>;
  bookingCard: BookingCard;
  bookingCards: Array<BookingCard>;
  bookingCardsUser: Array<BookingCard>;
  classTemplate: RegularClassTemplate;
  classTemplatePriceList: RegularClassTemplate;
  classTemplates: Array<RegularClassTemplate>;
  counters: Array<Counter>;
  eventBookingCard: EventBookingCard;
  eventBookingCards: Array<EventBookingCard>;
  featureAnalytics: Feature;
  featureAutoApproveMembership: Feature;
  featureSeries: Feature;
  featureTemplate: Feature;
  getAllLogs: Array<Log>;
  getMessage: Message;
  getMessagesForUser: Array<Message>;
  getUnreadNumberForUser: Scalars['Float'];
  holidays: Array<Holiday>;
  instructorPerformanceReport: Array<BookingReport>;
  instructors: Array<User>;
  isSeriesTitleExist: Scalars['Boolean'];
  isUsernameAvailable: Scalars['Boolean'];
  latestUserMembership: Membership;
  level: Level;
  levels: Array<Level>;
  listEventBucketObjects: AwsBucket;
  listMembershipBucketObjects: AwsBucket;
  membership: Membership;
  membershipPackage: MembershipPackage;
  membershipPackages: Array<MembershipPackage>;
  memberships: Array<Membership>;
  membershipsByUser: Array<Membership>;
  overallBookingReport: Array<BookingReport>;
  paymentMethod: PaymentMethod;
  paymentMethods: Array<PaymentMethod>;
  regularClass: RegularClass;
  regularClasses: Array<RegularClass>;
  regularClassesByInstructorsUsername: Array<RegularClass>;
  regularClassesPerMonth: Array<RegularClass>;
  searchAllClassesQuery: Array<SearchResult>;
  searchClassesQuery: Array<SearchResult>;
  searchClassTitleAndDate: Array<SearchResult>;
  selectedEventBookingCards: Array<EventBookingCard>;
  series: Series;
  seriesTitle: Series;
  sessions: Array<Session>;
  specialClassReport: Array<BookingReport>;
  specialEvent: SpecialEvent;
  specialEvents: Array<SpecialEvent>;
  specialEventsPerMonth: Array<SpecialEvent>;
  topInstructorReport: Array<BookingReport>;
  topUserMembershipReport: Array<BookingReport>;
  topUserReport: Array<BookingReport>;
  upcomingEventBookingCardsUser: Array<EventBookingCard>;
  user: User;
  users: Array<User>;
  weeklyBookingReport: Array<BookingReport>;
};


export type QueryActiveBookingsArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryActiveClassesByInstructorsArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryBookingCardArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryBookingCardsUserArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryClassTemplateArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryClassTemplatePriceListArgs = {
  title: Scalars['String'];
};


export type QueryEventBookingCardArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetMessageArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetMessagesForUserArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryGetUnreadNumberForUserArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryInstructorPerformanceReportArgs = {
  instructorId: Scalars['ObjectId'];
  timeFrame: Scalars['String'];
};


export type QueryIsSeriesTitleExistArgs = {
  title: Scalars['String'];
};


export type QueryIsUsernameAvailableArgs = {
  username: Scalars['String'];
};


export type QueryLatestUserMembershipArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryLevelArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryListEventBucketObjectsArgs = {
  mode: Scalars['String'];
};


export type QueryListMembershipBucketObjectsArgs = {
  mode: Scalars['String'];
};


export type QueryMembershipArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryMembershipPackageArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryMembershipsByUserArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryPaymentMethodArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryRegularClassArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryRegularClassesByInstructorsUsernameArgs = {
  username: Scalars['String'];
  viewedDate: Scalars['DateTime'];
};


export type QueryRegularClassesPerMonthArgs = {
  viewedDate: Scalars['DateTime'];
};


export type QuerySearchAllClassesQueryArgs = {
  from?: InputMaybe<Scalars['DateTime']>;
  instructors?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']>>>;
  offline?: InputMaybe<Scalars['Boolean']>;
  online?: InputMaybe<Scalars['Boolean']>;
  to?: InputMaybe<Scalars['DateTime']>;
};


export type QuerySearchClassesQueryArgs = {
  from?: InputMaybe<Scalars['DateTime']>;
  instructors?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']>>>;
  offline?: InputMaybe<Scalars['Boolean']>;
  online?: InputMaybe<Scalars['Boolean']>;
  to?: InputMaybe<Scalars['DateTime']>;
};


export type QuerySearchClassTitleAndDateArgs = {
  classTitle: Scalars['String'];
  date: Scalars['String'];
};


export type QuerySelectedEventBookingCardsArgs = {
  _id: Scalars['ObjectId'];
};


export type QuerySeriesArgs = {
  _id: Scalars['ObjectId'];
};


export type QuerySeriesTitleArgs = {
  title: Scalars['String'];
};


export type QuerySpecialClassReportArgs = {
  timeFrame: Scalars['String'];
};


export type QuerySpecialEventArgs = {
  _id: Scalars['ObjectId'];
};


export type QuerySpecialEventsPerMonthArgs = {
  viewedDate: Scalars['DateTime'];
};


export type QueryTopInstructorReportArgs = {
  bookingStatus: Scalars['String'];
  timeFrame: Scalars['String'];
};


export type QueryTopUserMembershipReportArgs = {
  timeFrame: Scalars['String'];
};


export type QueryTopUserReportArgs = {
  bookingStatus: Scalars['String'];
  timeFrame: Scalars['String'];
};


export type QueryUpcomingEventBookingCardsUserArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryUserArgs = {
  _id: Scalars['ObjectId'];
};


export type QueryWeeklyBookingReportArgs = {
  bookingStatus: Scalars['String'];
  timeFrame: Scalars['String'];
};

/** Regular class model */
export type RegularClass = {
  __typename?: 'RegularClass';
  _id: Scalars['ObjectId'];
  details: ClassDetails;
  instructors: Array<User>;
  offline: ClassCapacity;
  online: ClassCapacity;
  recurrenceId: Scalars['String'];
  schedule: ClassSchedule;
  status: ClassStatus;
  zoom?: Maybe<ClassZoom>;
};

/** Regular class input model */
export type RegularClassInput = {
  _id?: InputMaybe<Scalars['ObjectId']>;
  createZoomMeeting?: InputMaybe<Scalars['Boolean']>;
  details: ClassDetailsInput;
  instructors: Array<Scalars['ObjectId']>;
  offline: ClassCapacityInput;
  online: ClassCapacityInput;
  recurrenceId?: InputMaybe<Scalars['String']>;
  schedule: ClassScheduleInput;
  status: ClassStatusInput;
  zoom?: InputMaybe<ClassZoomInput>;
};

/** Class template model */
export type RegularClassTemplate = {
  __typename?: 'RegularClassTemplate';
  _id: Scalars['ObjectId'];
  details: ClassTemplateDetails;
  instructors?: Maybe<Array<Maybe<User>>>;
  offline: ClassTemplateCapacity;
  online: ClassTemplateCapacity;
  schedule: ClassTemplateSchedule;
};

/** Class template input model */
export type RegularClassTemplateInput = {
  _id?: InputMaybe<Scalars['ObjectId']>;
  details: ClassTemplateDetailsInput;
  instructors?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']>>>;
  offline: ClassTemplateCapacityInput;
  online: ClassTemplateCapacityInput;
  schedule: ClassTemplateScheduleInput;
};

export type ResponseMetadataClass = {
  __typename?: 'ResponseMetadataClass';
  attempts?: Maybe<Scalars['Float']>;
  cfId?: Maybe<Scalars['String']>;
  extendedRequestId?: Maybe<Scalars['String']>;
  httpStatusCode?: Maybe<Scalars['Float']>;
  requestId?: Maybe<Scalars['String']>;
  totalRetryDelay?: Maybe<Scalars['Float']>;
};

export type SearchResult = RegularClass | SpecialEvent;

/** Series model */
export type Series = {
  __typename?: 'Series';
  _id: Scalars['ObjectId'];
  description?: Maybe<Scalars['String']>;
  isPublished?: Maybe<Scalars['Boolean']>;
  regularClass?: Maybe<Array<RegularClass>>;
  specialEvent?: Maybe<Array<SpecialEvent>>;
  title: Scalars['String'];
};

export type SeriesInput = {
  _id?: InputMaybe<Scalars['ObjectId']>;
  description?: InputMaybe<Scalars['String']>;
  isPublished?: InputMaybe<Scalars['Boolean']>;
  regularClass: Array<InputMaybe<Scalars['ObjectId']>>;
  specialEvent: Array<InputMaybe<Scalars['ObjectId']>>;
  title: Scalars['String'];
};

export type Session = {
  __typename?: 'Session';
  _id: Scalars['ObjectId'];
  expires: Scalars['DateTime'];
  sessionToken: Scalars['String'];
  userId: Scalars['ObjectId'];
};

export type SpecialEvent = {
  __typename?: 'SpecialEvent';
  _id: Scalars['ObjectId'];
  details: EventDetails;
  instructors: Array<EventInstructor>;
  offline: EventCapacity;
  online: EventCapacity;
  recurrenceId: Scalars['String'];
  schedule: EventSchedule;
  status: EventStatus;
  zoom?: Maybe<ClassZoom>;
};

export type SpecialEventInput = {
  _id?: InputMaybe<Scalars['ObjectId']>;
  createZoomMeeting?: InputMaybe<Scalars['Boolean']>;
  details: EventDetailsInput;
  instructors: Array<Scalars['String']>;
  offline: EventCapacityInput;
  online: EventCapacityInput;
  schedule: EventScheduleInput;
  status: EventStatusInput;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ObjectId'];
  access: UserAccess;
  email?: Maybe<Scalars['String']>;
  emailVerified: Scalars['DateTime'];
  image?: Maybe<Scalars['String']>;
  membership: UserMembership;
  name: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  role: UserRole;
  username?: Maybe<Scalars['String']>;
};

export type UserAccess = {
  __typename?: 'UserAccess';
  approval: UserAccessApproval;
  ban: UserAccessBan;
  lastLoggedIn?: Maybe<Scalars['DateTime']>;
  register?: Maybe<UserAccessRegister>;
};

export type UserAccessApproval = {
  __typename?: 'UserAccessApproval';
  by?: Maybe<User>;
  date?: Maybe<Scalars['DateTime']>;
  isApproved?: Maybe<Scalars['Boolean']>;
};

export type UserAccessApprovalInput = {
  by?: InputMaybe<Scalars['ObjectId']>;
  date?: InputMaybe<Scalars['DateTime']>;
  isApproved: Scalars['Boolean'];
};

export type UserAccessBan = {
  __typename?: 'UserAccessBan';
  by?: Maybe<User>;
  date?: Maybe<Scalars['DateTime']>;
  isBanned: Scalars['Boolean'];
  reason?: Maybe<Scalars['String']>;
};

export type UserAccessBanInput = {
  by?: InputMaybe<Scalars['ObjectId']>;
  date?: InputMaybe<Scalars['DateTime']>;
  isBanned: Scalars['Boolean'];
  reason?: InputMaybe<Scalars['String']>;
};

export type UserAccessInput = {
  approval: UserAccessApprovalInput;
  ban: UserAccessBanInput;
  lastLoggedIn?: InputMaybe<Scalars['DateTime']>;
  register?: InputMaybe<UserAccessRegisterInput>;
};

export type UserAccessRegister = {
  __typename?: 'UserAccessRegister';
  date?: Maybe<Scalars['DateTime']>;
};

export type UserAccessRegisterInput = {
  date: Scalars['DateTime'];
};

export type UserMembership = {
  __typename?: 'UserMembership';
  isVIP?: Maybe<Scalars['Boolean']>;
  latest?: Maybe<Membership>;
};

export type UserProfileInputArgs = {
  _id: Scalars['ObjectId'];
  image?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  phone: Scalars['String'];
  username: Scalars['String'];
};

export type UserRole = {
  __typename?: 'UserRole';
  isAdmin: Scalars['Boolean'];
  isInstructor: Scalars['Boolean'];
  isSuperAdmin?: Maybe<Scalars['Boolean']>;
};

export type UserRoleInput = {
  isAdmin: Scalars['Boolean'];
  isInstructor: Scalars['Boolean'];
};

export type AnnouncementFieldsFragment = { __typename?: 'Announcement', _id: any, isEnabled?: boolean | null, isPrivate?: boolean | null, isPublic?: boolean | null, start: any, end?: any | null, text: string };

export type AnnouncementsQueryVariables = Exact<{ [key: string]: never; }>;


export type AnnouncementsQuery = { __typename?: 'Query', announcements: Array<{ __typename?: 'Announcement', _id: any, isEnabled?: boolean | null, isPrivate?: boolean | null, isPublic?: boolean | null, start: any, end?: any | null, text: string }> };

export type ActiveAnnouncementsQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveAnnouncementsQuery = { __typename?: 'Query', activeAnnouncements: Array<{ __typename?: 'Announcement', _id: any, isEnabled?: boolean | null, isPrivate?: boolean | null, isPublic?: boolean | null, start: any, end?: any | null, text: string }> };

export type ActivePrivateAnnouncementsQueryVariables = Exact<{ [key: string]: never; }>;


export type ActivePrivateAnnouncementsQuery = { __typename?: 'Query', activePrivateAnnouncements: Array<{ __typename?: 'Announcement', _id: any, isEnabled?: boolean | null, isPrivate?: boolean | null, isPublic?: boolean | null, start: any, end?: any | null, text: string }> };

export type ActivePublicAnnouncementsQueryVariables = Exact<{ [key: string]: never; }>;


export type ActivePublicAnnouncementsQuery = { __typename?: 'Query', activePublicAnnouncements: Array<{ __typename?: 'Announcement', _id: any, isEnabled?: boolean | null, isPrivate?: boolean | null, isPublic?: boolean | null, start: any, end?: any | null, text: string }> };

export type AddAnnouncementMutationVariables = Exact<{
  isEnabled: Scalars['Boolean'];
  isPrivate: Scalars['Boolean'];
  isPublic: Scalars['Boolean'];
  start: Scalars['DateTime'];
  end?: InputMaybe<Scalars['DateTime']>;
  text: Scalars['String'];
}>;


export type AddAnnouncementMutation = { __typename?: 'Mutation', addAnnouncement: { __typename?: 'Announcement', text: string } };

export type EditAnnouncementMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  isEnabled?: InputMaybe<Scalars['Boolean']>;
  isPrivate?: InputMaybe<Scalars['Boolean']>;
  isPublic?: InputMaybe<Scalars['Boolean']>;
  start?: InputMaybe<Scalars['DateTime']>;
  end?: InputMaybe<Scalars['DateTime']>;
  text?: InputMaybe<Scalars['String']>;
}>;


export type EditAnnouncementMutation = { __typename?: 'Mutation', editAnnouncement: { __typename?: 'Announcement', text: string } };

export type DeleteAnnouncementMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteAnnouncementMutation = { __typename?: 'Mutation', deleteAnnouncement: { __typename?: 'Announcement', text: string } };

export type BookingCardsQueryVariables = Exact<{ [key: string]: never; }>;


export type BookingCardsQuery = { __typename?: 'Query', bookingCards: Array<{ __typename?: 'BookingCard', _id: any, bookingCode: string, user?: { __typename?: 'User', name: string, image?: string | null } | null, booker?: { __typename?: 'User', name: string } | null, regularClass?: { __typename?: 'RegularClass', details: { __typename?: 'ClassDetails', title: string }, schedule: { __typename?: 'ClassSchedule', date?: any | null }, status: { __typename?: 'ClassStatus', isRunning?: boolean | null, isPublished?: boolean | null, isVIPOnly?: boolean | null } } | null, status: { __typename?: 'BookingCardStatus', value?: string | null, lastUpdateOn: any, updatedBy?: { __typename?: 'User', name: string } | null } }> };

export type ActiveBookingsQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type ActiveBookingsQuery = { __typename?: 'Query', activeBookings: Array<{ __typename?: 'BookingCard', _id: any, bookingCode: string, regularClass?: { __typename?: 'RegularClass', details: { __typename?: 'ClassDetails', title: string }, schedule: { __typename?: 'ClassSchedule', date?: any | null, duration?: number | null } } | null, status: { __typename?: 'BookingCardStatus', value?: string | null } }> };

export type BookingCardsUserQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type BookingCardsUserQuery = { __typename?: 'Query', bookingCardsUser: Array<{ __typename?: 'BookingCard', _id: any, bookingCode: string, regularClass?: { __typename?: 'RegularClass', details: { __typename?: 'ClassDetails', title: string }, schedule: { __typename?: 'ClassSchedule', date?: any | null } } | null, status: { __typename?: 'BookingCardStatus', value?: string | null, lastUpdateOn: any, updatedBy?: { __typename?: 'User', name: string } | null } }> };

export type AddBookingCardMutationVariables = Exact<{
  user: Scalars['ObjectId'];
  booker: Scalars['ObjectId'];
  regularClass: Scalars['ObjectId'];
  classType: Scalars['String'];
  seat: Scalars['Int'];
  updatedBy: Scalars['ObjectId'];
}>;


export type AddBookingCardMutation = { __typename?: 'Mutation', addBookingCard: Array<{ __typename?: 'BookingCard', _id: any, bookingCode: string }> };

export type CancelBookingCardMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
}>;


export type CancelBookingCardMutation = { __typename?: 'Mutation', cancelBookingCard: { __typename?: 'BookingCard', _id: any, bookingCode: string } };

export type EventInstructorsFragment = { __typename?: 'SpecialEvent', instructors: Array<{ __typename?: 'EventInstructor', name: string }> };

export type EventDetailsFragment = { __typename?: 'SpecialEvent', details: { __typename?: 'EventDetails', title: string, description?: string | null, tags?: Array<string | null> | null } };

export type EventScheduleFragment = { __typename?: 'SpecialEvent', schedule: { __typename?: 'EventSchedule', date?: any | null, duration?: number | null, rString?: string | null } };

export type EventStatusFragment = { __typename?: 'SpecialEvent', status: { __typename?: 'EventStatus', isRunning?: boolean | null, isPublished?: boolean | null, isVIPOnly?: boolean | null } };

export type EventCapacityFragment = { __typename?: 'EventCapacity', capacity?: number | null, availability?: number | null, bookingTimeLimit?: number | null, cost?: number | null, bookedSeat: number, confirmedSeat: number, rejectedSeat: number, booked?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null, confirmed?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null, rejected?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null };

export type EventZoomFragment = { __typename?: 'SpecialEvent', zoom?: { __typename?: 'ClassZoom', meetingId?: string | null, password?: string | null, joinUrl?: string | null } | null };

export type SpecialEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type SpecialEventsQuery = { __typename?: 'Query', specialEvents: Array<{ __typename?: 'SpecialEvent', _id: any, online: { __typename?: 'EventCapacity', capacity?: number | null, availability?: number | null, bookingTimeLimit?: number | null, cost?: number | null, bookedSeat: number, confirmedSeat: number, rejectedSeat: number, booked?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null, confirmed?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null, rejected?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null }, offline: { __typename?: 'EventCapacity', capacity?: number | null, availability?: number | null, bookingTimeLimit?: number | null, cost?: number | null, bookedSeat: number, confirmedSeat: number, rejectedSeat: number, booked?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null, confirmed?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null, rejected?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null }, details: { __typename?: 'EventDetails', title: string, description?: string | null, tags?: Array<string | null> | null }, instructors: Array<{ __typename?: 'EventInstructor', name: string }>, schedule: { __typename?: 'EventSchedule', date?: any | null, duration?: number | null, rString?: string | null }, status: { __typename?: 'EventStatus', isRunning?: boolean | null, isPublished?: boolean | null, isVIPOnly?: boolean | null }, zoom?: { __typename?: 'ClassZoom', meetingId?: string | null, password?: string | null, joinUrl?: string | null } | null }> };

export type SpecialEventQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type SpecialEventQuery = { __typename?: 'Query', specialEvent: { __typename: 'SpecialEvent', _id: any, online: { __typename?: 'EventCapacity', capacity?: number | null, availability?: number | null, bookingTimeLimit?: number | null, cost?: number | null, bookedSeat: number, confirmedSeat: number, rejectedSeat: number, booked?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null, confirmed?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null, rejected?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null }, offline: { __typename?: 'EventCapacity', capacity?: number | null, availability?: number | null, bookingTimeLimit?: number | null, cost?: number | null, bookedSeat: number, confirmedSeat: number, rejectedSeat: number, booked?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null, confirmed?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null, rejected?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null }, details: { __typename?: 'EventDetails', title: string, description?: string | null, tags?: Array<string | null> | null }, instructors: Array<{ __typename?: 'EventInstructor', name: string }>, schedule: { __typename?: 'EventSchedule', date?: any | null, duration?: number | null, rString?: string | null }, status: { __typename?: 'EventStatus', isRunning?: boolean | null, isPublished?: boolean | null, isVIPOnly?: boolean | null }, zoom?: { __typename?: 'ClassZoom', meetingId?: string | null, password?: string | null, joinUrl?: string | null } | null } };

export type AddZoomMeetingSpecialEventMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type AddZoomMeetingSpecialEventMutation = { __typename?: 'Mutation', addZoomMeetingSpecialEvent: { __typename?: 'SpecialEvent', _id: any } };

export type AddSpecialEventMutationVariables = Exact<{
  instructors: Array<Scalars['String']> | Scalars['String'];
  details: EventDetailsInput;
  online: EventCapacityInput;
  offline: EventCapacityInput;
  schedule: EventScheduleInput;
  status: EventStatusInput;
  createZoomMeeting?: InputMaybe<Scalars['Boolean']>;
}>;


export type AddSpecialEventMutation = { __typename?: 'Mutation', addSpecialEvent: number };

export type EditSingleSpecialEventMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  instructors: Array<Scalars['String']> | Scalars['String'];
  details: EventDetailsInput;
  online: EventCapacityInput;
  offline: EventCapacityInput;
  schedule: EventScheduleInput;
  status: EventStatusInput;
}>;


export type EditSingleSpecialEventMutation = { __typename?: 'Mutation', editSingleSpecialEvent: number };

export type EditRecurrenceSpecialEventMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  instructors: Array<Scalars['String']> | Scalars['String'];
  details: EventDetailsInput;
  online: EventCapacityInput;
  offline: EventCapacityInput;
  schedule: EventScheduleInput;
  status: EventStatusInput;
}>;


export type EditRecurrenceSpecialEventMutation = { __typename?: 'Mutation', editRecurrenceSpecialEvent: number };

export type EditFollowingSpecialEventMutationVariables = Exact<{
  input: SpecialEventInput;
  originalDate: Scalars['DateTime'];
}>;


export type EditFollowingSpecialEventMutation = { __typename?: 'Mutation', editFollowingSpecialEvent: number };

export type DeleteSingleSpecialEventMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
}>;


export type DeleteSingleSpecialEventMutation = { __typename?: 'Mutation', deleteSingleSpecialEvent: number };

export type DeleteRecurrenceSpecialEventMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
}>;


export type DeleteRecurrenceSpecialEventMutation = { __typename?: 'Mutation', deleteRecurrenceSpecialEvent: number };

export type DeleteFollowingSpecialEventMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  date: Scalars['DateTime'];
  updatedBy: Scalars['ObjectId'];
}>;


export type DeleteFollowingSpecialEventMutation = { __typename?: 'Mutation', deleteFollowingSpecialEvent: number };

export type UpdateSpecialEventStatusMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  isRunning: Scalars['Boolean'];
}>;


export type UpdateSpecialEventStatusMutation = { __typename?: 'Mutation', updateSpecialEventStatus: { __typename?: 'SpecialEvent', _id: any } };

export type DeleteSpecialEventStatusMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteSpecialEventStatusMutation = { __typename?: 'Mutation', deleteSpecialEventStatus: { __typename?: 'SpecialEvent', _id: any } };

export type EventBookingCardsQueryVariables = Exact<{ [key: string]: never; }>;


export type EventBookingCardsQuery = { __typename?: 'Query', eventBookingCards: Array<{ __typename?: 'EventBookingCard', _id: any }> };

export type EventBookingCardQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type EventBookingCardQuery = { __typename?: 'Query', eventBookingCard: { __typename?: 'EventBookingCard', _id: any, bookingCode: string, seat: number, classType: string, participants: Array<string>, createdAt?: any | null, updatedAt?: any | null, user: { __typename?: 'User', name: string }, payment: { __typename?: 'EventPayment', date: any, amount?: number | null, method: string, image?: string | null }, status: { __typename?: 'EventBookingCardStatus', value?: string | null, reason?: string | null, lastUpdateOn?: any | null, updatedBy?: { __typename?: 'User', name: string } | null } } };

export type SelectedEventBookingCardsQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type SelectedEventBookingCardsQuery = { __typename?: 'Query', selectedEventBookingCards: Array<{ __typename?: 'EventBookingCard', _id: any, bookingCode: string, seat: number, classType: string, participants: Array<string>, createdAt?: any | null, updatedAt?: any | null, user: { __typename?: 'User', name: string }, payment: { __typename?: 'EventPayment', date: any, amount?: number | null, method: string, image?: string | null }, status: { __typename?: 'EventBookingCardStatus', value?: string | null, reason?: string | null, lastUpdateOn?: any | null, updatedBy?: { __typename?: 'User', name: string } | null } }> };

export type AddEventBookingCardMutationVariables = Exact<{
  user: Scalars['ObjectId'];
  booker: Scalars['ObjectId'];
  event: Scalars['ObjectId'];
  classType: Scalars['String'];
  seat: Scalars['Int'];
  participants: Array<Scalars['String']> | Scalars['String'];
  payment: EventPaymentInput;
  status: EventBookingCardStatusInput;
  image?: InputMaybe<Scalars['Upload']>;
}>;


export type AddEventBookingCardMutation = { __typename?: 'Mutation', addEventBookingCard: { __typename?: 'EventBookingCard', _id: any, bookingCode: string } };

export type UpdateEventBookingRequestStatusMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  status: EventBookingCardStatusInput;
}>;


export type UpdateEventBookingRequestStatusMutation = { __typename?: 'Mutation', updateEventBookingRequestStatus: { __typename?: 'EventBookingCard', _id: any } };

export type DeleteEventBookingPaymentImageMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteEventBookingPaymentImageMutation = { __typename?: 'Mutation', deleteEventBookingPaymentImage: { __typename?: 'EventBookingCard', _id: any } };

export type UpdateSpecialEventBookingParticipantsMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  participants: Array<Scalars['String']> | Scalars['String'];
}>;


export type UpdateSpecialEventBookingParticipantsMutation = { __typename?: 'Mutation', updateSpecialEventBookingParticipants: { __typename?: 'EventBookingCard', _id: any } };

export type FeatureFragmentFragment = { __typename?: 'Feature', isEnabled?: boolean | null, featureKey: string, createdAt?: any | null, updatedAt?: any | null };

export type FeatureSeriesQueryVariables = Exact<{ [key: string]: never; }>;


export type FeatureSeriesQuery = { __typename?: 'Query', featureSeries: { __typename?: 'Feature', isEnabled?: boolean | null, featureKey: string, createdAt?: any | null, updatedAt?: any | null } };

export type FeatureTemplateQueryVariables = Exact<{ [key: string]: never; }>;


export type FeatureTemplateQuery = { __typename?: 'Query', featureTemplate: { __typename?: 'Feature', isEnabled?: boolean | null, featureKey: string, createdAt?: any | null, updatedAt?: any | null } };

export type FeatureAnalyticsQueryVariables = Exact<{ [key: string]: never; }>;


export type FeatureAnalyticsQuery = { __typename?: 'Query', featureAnalytics: { __typename?: 'Feature', isEnabled?: boolean | null, featureKey: string, createdAt?: any | null, updatedAt?: any | null } };

export type FeatureAutoApproveMembershipQueryVariables = Exact<{ [key: string]: never; }>;


export type FeatureAutoApproveMembershipQuery = { __typename?: 'Query', featureAutoApproveMembership: { __typename?: 'Feature', isEnabled?: boolean | null, featureKey: string, createdAt?: any | null, updatedAt?: any | null, by?: { __typename?: 'User', _id: any, name: string } | null } };

export type FeaturePageQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type FeaturePageQueryQuery = { __typename?: 'Query', featureSeries: { __typename?: 'Feature', isEnabled?: boolean | null, featureKey: string, createdAt?: any | null, updatedAt?: any | null }, featureTemplate: { __typename?: 'Feature', isEnabled?: boolean | null, featureKey: string, createdAt?: any | null, updatedAt?: any | null }, featureAnalytics: { __typename?: 'Feature', isEnabled?: boolean | null, featureKey: string, createdAt?: any | null, updatedAt?: any | null }, featureAutoApproveMembership: { __typename?: 'Feature', isEnabled?: boolean | null, featureKey: string, createdAt?: any | null, updatedAt?: any | null, by?: { __typename?: 'User', _id: any, name: string } | null } };

export type ToggleFeatureMutationVariables = Exact<{
  featureKey: Scalars['String'];
}>;


export type ToggleFeatureMutation = { __typename?: 'Mutation', toggleFeature: { __typename?: 'Feature', isEnabled?: boolean | null, featureKey: string, createdAt?: any | null, updatedAt?: any | null } };

export type SetAutoApproverAdminMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type SetAutoApproverAdminMutation = { __typename?: 'Mutation', setAutoApproverAdmin: { __typename?: 'Feature', isEnabled?: boolean | null, featureKey: string, createdAt?: any | null, updatedAt?: any | null } };

export type ListMembershipBucketObjectsQueryVariables = Exact<{
  mode: Scalars['String'];
}>;


export type ListMembershipBucketObjectsQuery = { __typename?: 'Query', listMembershipBucketObjects: { __typename?: 'AWSBucket', Name: string, KeyCount: number, MaxKeys: number, Prefix: string, IsTruncated: boolean, Contents: Array<{ __typename?: 'AWSFile', Key?: string | null, FileName?: string | null, Size?: number | null, LastModified?: any | null }> } };

export type ListEventBucketObjectsQueryVariables = Exact<{
  mode: Scalars['String'];
}>;


export type ListEventBucketObjectsQuery = { __typename?: 'Query', listEventBucketObjects: { __typename?: 'AWSBucket', Name: string, KeyCount: number, MaxKeys: number, Prefix: string, IsTruncated: boolean, Contents: Array<{ __typename?: 'AWSFile', Key?: string | null, FileName?: string | null, Size?: number | null, LastModified?: any | null }> } };

export type DeleteUnusedImagesMutationVariables = Exact<{
  prefix: Scalars['String'];
  fileNames: Array<Scalars['String']> | Scalars['String'];
}>;


export type DeleteUnusedImagesMutation = { __typename?: 'Mutation', deleteUnusedImages: { __typename?: 'DeleteObject', DeleteMarker?: boolean | null, VersionId?: string | null, Metadata: { __typename?: 'ResponseMetadataClass', httpStatusCode?: number | null, attempts?: number | null, totalRetryDelay?: number | null } } };

export type HolidayFieldsFragment = { __typename?: 'Holiday', _id: any, isEnabled?: boolean | null, start: any, end?: any | null, title: string };

export type HolidaysQueryVariables = Exact<{ [key: string]: never; }>;


export type HolidaysQuery = { __typename?: 'Query', holidays: Array<{ __typename?: 'Holiday', _id: any, isEnabled?: boolean | null, start: any, end?: any | null, title: string }> };

export type ActiveHolidaysQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveHolidaysQuery = { __typename?: 'Query', activeHolidays: Array<{ __typename?: 'Holiday', _id: any, isEnabled?: boolean | null, start: any, end?: any | null, title: string }> };

export type AddHolidayMutationVariables = Exact<{
  isEnabled: Scalars['Boolean'];
  start: Scalars['DateTime'];
  end?: InputMaybe<Scalars['DateTime']>;
  title: Scalars['String'];
}>;


export type AddHolidayMutation = { __typename?: 'Mutation', addHoliday: { __typename?: 'Holiday', title: string } };

export type EditHolidayMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  isEnabled: Scalars['Boolean'];
  start?: InputMaybe<Scalars['DateTime']>;
  end?: InputMaybe<Scalars['DateTime']>;
  title?: InputMaybe<Scalars['String']>;
}>;


export type EditHolidayMutation = { __typename?: 'Mutation', editHoliday: { __typename?: 'Holiday', title: string } };

export type DeleteHolidayMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteHolidayMutation = { __typename?: 'Mutation', deleteHoliday: { __typename?: 'Holiday', title: string } };

export type LevelFieldsFragment = { __typename?: 'Level', _id: any, isEnabled?: boolean | null, code: string, description: string };

export type ActiveLevelsQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveLevelsQuery = { __typename?: 'Query', activeLevels: Array<{ __typename?: 'Level', _id: any, isEnabled?: boolean | null, code: string, description: string }> };

export type LevelsQueryVariables = Exact<{ [key: string]: never; }>;


export type LevelsQuery = { __typename?: 'Query', levels: Array<{ __typename?: 'Level', _id: any, isEnabled?: boolean | null, code: string, description: string }> };

export type LevelQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type LevelQuery = { __typename?: 'Query', level: { __typename?: 'Level', _id: any, isEnabled?: boolean | null, code: string, description: string } };

export type AddLevelMutationVariables = Exact<{
  isEnabled: Scalars['Boolean'];
  code: Scalars['String'];
  description: Scalars['String'];
}>;


export type AddLevelMutation = { __typename?: 'Mutation', addLevel: { __typename?: 'Level', code: string, description: string } };

export type EditLevelMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  isEnabled: Scalars['Boolean'];
  code?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
}>;


export type EditLevelMutation = { __typename?: 'Mutation', editLevel: { __typename?: 'Level', code: string, description: string } };

export type DeleteLevelMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteLevelMutation = { __typename?: 'Mutation', deleteLevel: { __typename?: 'Level', code: string, description: string } };

export type GetAllLogsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllLogsQuery = { __typename?: 'Query', getAllLogs: Array<{ __typename?: 'Log', category: string, subCategory: string, message: string, createdAt?: any | null, user?: { __typename?: 'User', name: string } | null }> };

export type BalanceFieldsFragment = { __typename?: 'Membership', balance: { __typename?: 'MembershipBalance', available?: number | null, additional: number, transferIn?: number | null, transferOut?: number | null, validUntil: any } };

export type PaymentFieldsFragment = { __typename?: 'Membership', payment: { __typename?: 'MembershipPayment', amount: number, method: string, date: any, url?: string | null } };

export type MembershipsQueryVariables = Exact<{ [key: string]: never; }>;


export type MembershipsQuery = { __typename?: 'Query', memberships: Array<{ __typename?: 'Membership', _id: any, note?: string | null, createdAt?: any | null, updatedAt?: any | null, user?: { __typename?: 'User', name: string, image?: string | null, email?: string | null, username?: string | null } | null, booked: Array<{ __typename?: 'BookingCard', _id: any, bookingCode: string, cost: number, createdAt?: any | null } | null>, confirmed: Array<{ __typename?: 'BookingCard', _id: any, bookingCode: string, cost: number, createdAt?: any | null } | null>, cancelled: Array<{ __typename?: 'BookingCard', _id: any, bookingCode: string, cost: number, createdAt?: any | null } | null>, verified: { __typename?: 'MembershipVerified', isVerified?: boolean | null, reason?: string | null, date?: any | null, by?: { __typename?: 'User', name: string } | null }, balance: { __typename?: 'MembershipBalance', available?: number | null, additional: number, transferIn?: number | null, transferOut?: number | null, validUntil: any }, payment: { __typename?: 'MembershipPayment', amount: number, method: string, date: any, url?: string | null } }> };

export type MembershipsByUserQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type MembershipsByUserQuery = { __typename?: 'Query', membershipsByUser: Array<{ __typename?: 'Membership', _id: any, note?: string | null, createdAt?: any | null, updatedAt?: any | null, booked: Array<{ __typename?: 'BookingCard', _id: any } | null>, confirmed: Array<{ __typename?: 'BookingCard', _id: any } | null>, cancelled: Array<{ __typename?: 'BookingCard', _id: any } | null>, balance: { __typename?: 'MembershipBalance', additional: number, validUntil: any }, verified: { __typename?: 'MembershipVerified', isVerified?: boolean | null, reason?: string | null, date?: any | null }, payment: { __typename?: 'MembershipPayment', amount: number, method: string, date: any, url?: string | null } }> };

export type MembershipQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type MembershipQuery = { __typename?: 'Query', membership: { __typename?: 'Membership', _id: any, note?: string | null, createdAt?: any | null, updatedAt?: any | null, user?: { __typename?: 'User', name: string, image?: string | null } | null, booked: Array<{ __typename?: 'BookingCard', _id: any } | null>, confirmed: Array<{ __typename?: 'BookingCard', _id: any } | null>, cancelled: Array<{ __typename?: 'BookingCard', _id: any } | null>, verified: { __typename?: 'MembershipVerified', isVerified?: boolean | null, reason?: string | null, date?: any | null, by?: { __typename?: 'User', name: string } | null }, balance: { __typename?: 'MembershipBalance', available?: number | null, additional: number, transferIn?: number | null, transferOut?: number | null, validUntil: any }, payment: { __typename?: 'MembershipPayment', amount: number, method: string, date: any, url?: string | null } } };

export type MarkThisMembershipAsInvalidMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
}>;


export type MarkThisMembershipAsInvalidMutation = { __typename?: 'Mutation', markThisMembershipAsInvalid: { __typename?: 'Membership', _id: any } };

export type MarkThisAndFollowingMembershipAsInvalidMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
}>;


export type MarkThisAndFollowingMembershipAsInvalidMutation = { __typename?: 'Mutation', markThisAndFollowingMembershipAsInvalid: { __typename?: 'Membership', _id: any } };

export type AddMembershipMutationVariables = Exact<{
  user: Scalars['ObjectId'];
  membershipPackageId: Scalars['ObjectId'];
  note: Scalars['String'];
  payment: MembershipPaymentInput;
  image?: InputMaybe<Scalars['Upload']>;
}>;


export type AddMembershipMutation = { __typename?: 'Mutation', addMembership: { __typename?: 'Membership', _id: any } };

export type EditMembershipMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  balance: MembershipBalanceInput;
  payment: MembershipPaymentInput;
  verified: MembershipVerifiedInput;
}>;


export type EditMembershipMutation = { __typename?: 'Mutation', editMembership: { __typename?: 'Membership', _id: any } };

export type DeleteMembershipMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteMembershipMutation = { __typename?: 'Mutation', deleteMembership: { __typename?: 'Membership', _id: any } };

export type DeleteProofOfPaymentMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteProofOfPaymentMutation = { __typename?: 'Mutation', deleteProofOfPayment: { __typename?: 'Membership', _id: any } };

export type MembershipPackageFieldsFragment = { __typename?: 'MembershipPackage', _id: string, isEnabled?: boolean | null, name: string, additional: number, price: number, validity: number };

export type ActiveMembershipPackageQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveMembershipPackageQuery = { __typename?: 'Query', activeMembershipPackages: Array<{ __typename?: 'MembershipPackage', _id: string, isEnabled?: boolean | null, name: string, additional: number, price: number, validity: number }> };

export type MembershipPackagesQueryVariables = Exact<{ [key: string]: never; }>;


export type MembershipPackagesQuery = { __typename?: 'Query', membershipPackages: Array<{ __typename?: 'MembershipPackage', _id: string, isEnabled?: boolean | null, name: string, additional: number, price: number, validity: number }> };

export type AddMembershipPackageMutationVariables = Exact<{
  isEnabled: Scalars['Boolean'];
  name: Scalars['String'];
  additional: Scalars['Int'];
  price: Scalars['Int'];
  validity: Scalars['Int'];
}>;


export type AddMembershipPackageMutation = { __typename?: 'Mutation', addMembershipPackage: { __typename?: 'MembershipPackage', name: string } };

export type EditMembershipPackageMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  isEnabled: Scalars['Boolean'];
  name?: InputMaybe<Scalars['String']>;
  additional?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['Int']>;
  validity?: InputMaybe<Scalars['Int']>;
}>;


export type EditMembershipPackageMutation = { __typename?: 'Mutation', editMembershipPackage: { __typename?: 'MembershipPackage', name: string } };

export type DeleteMembershipPackageMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteMembershipPackageMutation = { __typename?: 'Mutation', deleteMembershipPackage: { __typename?: 'MembershipPackage', name: string } };

export type GetMessagesForUserQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type GetMessagesForUserQuery = { __typename?: 'Query', getUnreadNumberForUser: number, getMessagesForUser: Array<{ __typename?: 'Message', _id: any, isRead?: boolean | null, title: string, message: string, createdAt?: any | null, updatedAt?: any | null }> };

export type GetMessageQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type GetMessageQuery = { __typename?: 'Query', getMessage: { __typename?: 'Message', _id: any, isRead?: boolean | null, title: string, message: string, createdAt?: any | null, updatedAt?: any | null } };

export type MarkAllMessagesAsReadForUserMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type MarkAllMessagesAsReadForUserMutation = { __typename?: 'Mutation', markAllMessagesAsReadForUser: number };

export type DeleteAllReadMessagesForUserMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteAllReadMessagesForUserMutation = { __typename?: 'Mutation', deleteAllReadMessagesForUser: number };

export type BookingPageDataQueryVariables = Exact<{ [key: string]: never; }>;


export type BookingPageDataQuery = { __typename?: 'Query', regularClasses: Array<{ __typename?: 'RegularClass', _id: any, instructors: Array<{ __typename?: 'User', name: string, image?: string | null }>, details: { __typename?: 'ClassDetails', title: string, tags?: Array<string | null> | null, level: { __typename?: 'Level', description: string } }, online: { __typename?: 'ClassCapacity', capacity?: number | null, availability?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null }, offline: { __typename?: 'ClassCapacity', capacity?: number | null, availability?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null }, schedule: { __typename?: 'ClassSchedule', date?: any | null, duration?: number | null } }> };

export type MyBookingSectionQueryQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type MyBookingSectionQueryQuery = { __typename?: 'Query', activeBookings: Array<{ __typename: 'BookingCard', _id: any, bookingCode: string, classType: string, regularClass?: { __typename?: 'RegularClass', details: { __typename?: 'ClassDetails', title: string }, instructors: Array<{ __typename?: 'User', name: string, image?: string | null }>, schedule: { __typename?: 'ClassSchedule', date?: any | null, duration?: number | null }, online: { __typename?: 'ClassCapacity', cancelTimeLimit?: number | null }, offline: { __typename?: 'ClassCapacity', cancelTimeLimit?: number | null }, zoom?: { __typename?: 'ClassZoom', meetingId?: string | null, password?: string | null, joinUrl?: string | null } | null } | null, status: { __typename?: 'BookingCardStatus', value?: string | null } }>, bookingCardsUser: Array<{ __typename: 'BookingCard', _id: any, bookingCode: string, user?: { __typename?: 'User', name: string, image?: string | null } | null, regularClass?: { __typename?: 'RegularClass', details: { __typename?: 'ClassDetails', title: string }, instructors: Array<{ __typename?: 'User', name: string, image?: string | null }>, schedule: { __typename?: 'ClassSchedule', date?: any | null, duration?: number | null }, status: { __typename?: 'ClassStatus', isRunning?: boolean | null }, zoom?: { __typename?: 'ClassZoom', joinUrl?: string | null, meetingId?: string | null, password?: string | null } | null } | null, status: { __typename?: 'BookingCardStatus', value?: string | null } }>, upcomingEventBookingCardsUser: Array<{ __typename: 'EventBookingCard', _id: any, bookingCode: string, classType: string, event: { __typename?: 'SpecialEvent', details: { __typename?: 'EventDetails', title: string }, schedule: { __typename?: 'EventSchedule', date?: any | null, duration?: number | null }, instructors: Array<{ __typename?: 'EventInstructor', name: string }>, zoom?: { __typename?: 'ClassZoom', password?: string | null, meetingId?: string | null, joinUrl?: string | null } | null }, payment: { __typename?: 'EventPayment', date: any, amount?: number | null, method: string, image?: string | null }, status: { __typename?: 'EventBookingCardStatus', value?: string | null, reason?: string | null, lastUpdateOn?: any | null, updatedBy?: { __typename?: 'User', name: string } | null } }> };

export type MembershipSectionQueryQueryVariables = Exact<{
  userId: Scalars['ObjectId'];
}>;


export type MembershipSectionQueryQuery = { __typename?: 'Query', latestUserMembership: { __typename?: 'Membership', _id: any, note?: string | null, booked: Array<{ __typename?: 'BookingCard', _id: any } | null>, confirmed: Array<{ __typename?: 'BookingCard', _id: any } | null>, cancelled: Array<{ __typename?: 'BookingCard', _id: any } | null>, balance: { __typename?: 'MembershipBalance', available?: number | null, totalBookedCost: number, totalConfirmedCost: number, additional: number, transferIn?: number | null, transferOut?: number | null, validUntil: any }, payment: { __typename?: 'MembershipPayment', amount: number, method: string, date: any }, verified: { __typename?: 'MembershipVerified', isVerified?: boolean | null, date?: any | null } } };

export type TeachingScheduleQueryQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type TeachingScheduleQueryQuery = { __typename?: 'Query', activeClassesByInstructors: Array<{ __typename?: 'RegularClass', _id: any, details: { __typename?: 'ClassDetails', title: string }, schedule: { __typename?: 'ClassSchedule', date?: any | null, duration?: number | null }, status: { __typename?: 'ClassStatus', isRunning?: boolean | null, isVIPOnly?: boolean | null }, online: { __typename?: 'ClassCapacity', booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null }, offline: { __typename?: 'ClassCapacity', booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null }, zoom?: { __typename?: 'ClassZoom', meetingId?: string | null, password?: string | null, joinUrl?: string | null } | null }> };

export type MembershipFormDataQueryVariables = Exact<{ [key: string]: never; }>;


export type MembershipFormDataQuery = { __typename?: 'Query', activeMembershipPackages: Array<{ __typename?: 'MembershipPackage', _id: string, isEnabled?: boolean | null, name: string, price: number, additional: number, validity: number }>, activePaymentMethodsMembership: Array<{ __typename?: 'PaymentMethod', _id: any, isEnabled?: boolean | null, requireProof?: boolean | null, via: string }> };

export type SpecialEventBookingDataQueryVariables = Exact<{ [key: string]: never; }>;


export type SpecialEventBookingDataQuery = { __typename?: 'Query', activePaymentMethodsSpecialEvent: Array<{ __typename?: 'PaymentMethod', _id: any, isEnabled?: boolean | null, requireProof?: boolean | null, via: string }> };

export type SchedulePageDataQueryVariables = Exact<{
  viewedDate: Scalars['DateTime'];
}>;


export type SchedulePageDataQuery = { __typename?: 'Query', regularClassesPerMonth: Array<{ __typename: 'RegularClass', _id: any, instructors: Array<{ __typename?: 'User', _id: any, name: string, image?: string | null }>, details: { __typename?: 'ClassDetails', title: string, description?: string | null, tags?: Array<string | null> | null, level: { __typename?: 'Level', _id: any, isEnabled?: boolean | null, code: string, description: string } }, schedule: { __typename?: 'ClassSchedule', date?: any | null, isAllDay?: boolean | null, duration?: number | null }, status: { __typename?: 'ClassStatus', isRunning?: boolean | null, isPublished?: boolean | null, isVIPOnly?: boolean | null }, zoom?: { __typename?: 'ClassZoom', meetingId?: string | null, password?: string | null, joinUrl?: string | null } | null, online: { __typename?: 'ClassCapacity', capacity?: number | null, cancelTimeLimit?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null }, offline: { __typename?: 'ClassCapacity', capacity?: number | null, cancelTimeLimit?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null } }>, specialEventsPerMonth: Array<{ __typename: 'SpecialEvent', _id: any, instructors: Array<{ __typename?: 'EventInstructor', name: string }>, details: { __typename?: 'EventDetails', title: string, description?: string | null, tags?: Array<string | null> | null }, schedule: { __typename?: 'EventSchedule', date?: any | null, isAllDay?: boolean | null, duration?: number | null }, status: { __typename?: 'EventStatus', isRunning?: boolean | null, isPublished?: boolean | null, isVIPOnly?: boolean | null }, zoom?: { __typename?: 'ClassZoom', meetingId?: string | null, password?: string | null, joinUrl?: string | null } | null, online: { __typename?: 'EventCapacity', capacity?: number | null, booked?: Array<{ __typename?: 'EventBookingCard', seat: number } | null> | null, confirmed?: Array<{ __typename?: 'EventBookingCard', seat: number } | null> | null }, offline: { __typename?: 'EventCapacity', capacity?: number | null, booked?: Array<{ __typename?: 'EventBookingCard', seat: number } | null> | null, confirmed?: Array<{ __typename?: 'EventBookingCard', seat: number } | null> | null } }>, activeHolidays: Array<{ __typename?: 'Holiday', _id: any, isEnabled?: boolean | null, start: any, end?: any | null, title: string }> };

export type SearchClassesQueryQueryVariables = Exact<{
  from?: InputMaybe<Scalars['DateTime']>;
  to?: InputMaybe<Scalars['DateTime']>;
  online?: InputMaybe<Scalars['Boolean']>;
  offline?: InputMaybe<Scalars['Boolean']>;
  instructors?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']>> | InputMaybe<Scalars['ObjectId']>>;
}>;


export type SearchClassesQueryQuery = { __typename?: 'Query', searchClassesQuery: Array<{ __typename: 'RegularClass', _id: any, instructors: Array<{ __typename?: 'User', _id: any, name: string, image?: string | null }>, details: { __typename?: 'ClassDetails', title: string, description?: string | null, tags?: Array<string | null> | null, level: { __typename?: 'Level', _id: any, isEnabled?: boolean | null, code: string, description: string } }, schedule: { __typename?: 'ClassSchedule', date?: any | null, duration?: number | null }, status: { __typename?: 'ClassStatus', isRunning?: boolean | null, isPublished?: boolean | null, isVIPOnly?: boolean | null }, online: { __typename?: 'ClassCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null }, offline: { __typename?: 'ClassCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null } } | { __typename: 'SpecialEvent', _id: any, instructors: Array<{ __typename?: 'EventInstructor', name: string }>, details: { __typename?: 'EventDetails', title: string, description?: string | null, tags?: Array<string | null> | null }, schedule: { __typename?: 'EventSchedule', date?: any | null, duration?: number | null }, status: { __typename?: 'EventStatus', isRunning?: boolean | null, isPublished?: boolean | null, isVIPOnly?: boolean | null }, online: { __typename?: 'EventCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cost?: number | null, bookedSeat: number, confirmedSeat: number, rejectedSeat: number, booked?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null }, offline: { __typename?: 'EventCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cost?: number | null, bookedSeat: number, confirmedSeat: number, rejectedSeat: number, booked?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null } }> };

export type SearchAllClassesQueryQueryVariables = Exact<{
  from?: InputMaybe<Scalars['DateTime']>;
  to?: InputMaybe<Scalars['DateTime']>;
  online?: InputMaybe<Scalars['Boolean']>;
  offline?: InputMaybe<Scalars['Boolean']>;
  instructors?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']>> | InputMaybe<Scalars['ObjectId']>>;
}>;


export type SearchAllClassesQueryQuery = { __typename?: 'Query', searchAllClassesQuery: Array<{ __typename: 'RegularClass', _id: any, instructors: Array<{ __typename?: 'User', _id: any, name: string, image?: string | null }>, details: { __typename?: 'ClassDetails', title: string, description?: string | null, tags?: Array<string | null> | null, level: { __typename?: 'Level', _id: any, isEnabled?: boolean | null, code: string, description: string } }, schedule: { __typename?: 'ClassSchedule', date?: any | null, duration?: number | null }, status: { __typename?: 'ClassStatus', isRunning?: boolean | null, isPublished?: boolean | null, isVIPOnly?: boolean | null }, online: { __typename?: 'ClassCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null }, offline: { __typename?: 'ClassCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null } } | { __typename: 'SpecialEvent', _id: any, instructors: Array<{ __typename?: 'EventInstructor', name: string }>, details: { __typename?: 'EventDetails', title: string, description?: string | null, tags?: Array<string | null> | null }, schedule: { __typename?: 'EventSchedule', date?: any | null, duration?: number | null }, status: { __typename?: 'EventStatus', isRunning?: boolean | null, isPublished?: boolean | null, isVIPOnly?: boolean | null }, online: { __typename?: 'EventCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cost?: number | null, bookedSeat: number, confirmedSeat: number, rejectedSeat: number, booked?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null }, offline: { __typename?: 'EventCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cost?: number | null, bookedSeat: number, confirmedSeat: number, rejectedSeat: number, booked?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null } }> };

export type SearchClassTitleAndDateQueryVariables = Exact<{
  classTitle: Scalars['String'];
  date: Scalars['String'];
}>;


export type SearchClassTitleAndDateQuery = { __typename?: 'Query', searchClassTitleAndDate: Array<{ __typename: 'RegularClass', _id: any, details: { __typename?: 'ClassDetails', title: string, description?: string | null, tags?: Array<string | null> | null, level: { __typename?: 'Level', description: string } }, schedule: { __typename?: 'ClassSchedule', date?: any | null, duration?: number | null }, instructors: Array<{ __typename?: 'User', name: string }>, status: { __typename?: 'ClassStatus', isVIPOnly?: boolean | null }, online: { __typename?: 'ClassCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null }, offline: { __typename?: 'ClassCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null } } | { __typename: 'SpecialEvent', _id: any, details: { __typename?: 'EventDetails', title: string, description?: string | null, tags?: Array<string | null> | null }, schedule: { __typename?: 'EventSchedule', date?: any | null, duration?: number | null }, instructors: Array<{ __typename?: 'EventInstructor', name: string }>, status: { __typename?: 'EventStatus', isVIPOnly?: boolean | null }, online: { __typename?: 'EventCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cost?: number | null, bookedSeat: number, confirmedSeat: number, rejectedSeat: number, booked?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null }, offline: { __typename?: 'EventCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cost?: number | null, bookedSeat: number, confirmedSeat: number, rejectedSeat: number, booked?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null } }> };

export type PaymentMethodFieldsFragment = { __typename?: 'PaymentMethod', _id: any, isEnabled?: boolean | null, isEnabledForMembership?: boolean | null, isEnabledForSpecialEvent?: boolean | null, requireProof?: boolean | null, via: string };

export type ActivePaymentMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type ActivePaymentMethodsQuery = { __typename?: 'Query', activePaymentMethods: Array<{ __typename?: 'PaymentMethod', _id: any, isEnabled?: boolean | null, isEnabledForMembership?: boolean | null, isEnabledForSpecialEvent?: boolean | null, requireProof?: boolean | null, via: string }> };

export type ActivePaymentMethodsSpecialEventQueryVariables = Exact<{ [key: string]: never; }>;


export type ActivePaymentMethodsSpecialEventQuery = { __typename?: 'Query', activePaymentMethodsSpecialEvent: Array<{ __typename?: 'PaymentMethod', _id: any, isEnabled?: boolean | null, isEnabledForMembership?: boolean | null, isEnabledForSpecialEvent?: boolean | null, requireProof?: boolean | null, via: string }> };

export type ActivePaymentMethodsMembershipQueryVariables = Exact<{ [key: string]: never; }>;


export type ActivePaymentMethodsMembershipQuery = { __typename?: 'Query', activePaymentMethodsMembership: Array<{ __typename?: 'PaymentMethod', _id: any, isEnabled?: boolean | null, isEnabledForMembership?: boolean | null, isEnabledForSpecialEvent?: boolean | null, requireProof?: boolean | null, via: string }> };

export type PaymentMethodQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type PaymentMethodQuery = { __typename?: 'Query', paymentMethod: { __typename?: 'PaymentMethod', _id: any, isEnabled?: boolean | null, isEnabledForMembership?: boolean | null, isEnabledForSpecialEvent?: boolean | null, requireProof?: boolean | null, via: string } };

export type PaymentMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type PaymentMethodsQuery = { __typename?: 'Query', paymentMethods: Array<{ __typename?: 'PaymentMethod', _id: any, isEnabled?: boolean | null, isEnabledForMembership?: boolean | null, isEnabledForSpecialEvent?: boolean | null, requireProof?: boolean | null, via: string }> };

export type AddPaymentMethodMutationVariables = Exact<{
  isEnabled: Scalars['Boolean'];
  isEnabledForMembership?: InputMaybe<Scalars['Boolean']>;
  isEnabledForSpecialEvent?: InputMaybe<Scalars['Boolean']>;
  requireProof?: InputMaybe<Scalars['Boolean']>;
  via: Scalars['String'];
}>;


export type AddPaymentMethodMutation = { __typename?: 'Mutation', addPaymentMethod: { __typename?: 'PaymentMethod', via: string } };

export type EditPaymentMethodMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  isEnabled?: InputMaybe<Scalars['Boolean']>;
  isEnabledForMembership?: InputMaybe<Scalars['Boolean']>;
  isEnabledForSpecialEvent?: InputMaybe<Scalars['Boolean']>;
  requireProof?: InputMaybe<Scalars['Boolean']>;
  via?: InputMaybe<Scalars['String']>;
}>;


export type EditPaymentMethodMutation = { __typename?: 'Mutation', editPaymentMethod: { __typename?: 'PaymentMethod', via: string } };

export type DeletePaymentMethodMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeletePaymentMethodMutation = { __typename?: 'Mutation', deletePaymentMethod: { __typename?: 'PaymentMethod', via: string } };

export type RegularClassQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type RegularClassQuery = { __typename?: 'Query', regularClass: { __typename: 'RegularClass', details: { __typename?: 'ClassDetails', title: string, description?: string | null, tags?: Array<string | null> | null, level: { __typename?: 'Level', _id: any } }, instructors: Array<{ __typename?: 'User', _id: any, name: string, image?: string | null }>, schedule: { __typename?: 'ClassSchedule', date?: any | null, duration?: number | null, isAllDay?: boolean | null, rString?: string | null }, online: { __typename?: 'ClassCapacity', capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any, bookingCode: string, user?: { __typename?: 'User', name: string, image?: string | null } | null, status: { __typename?: 'BookingCardStatus', value?: string | null } } | null> | null }, offline: { __typename?: 'ClassCapacity', capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any, bookingCode: string, user?: { __typename?: 'User', name: string, image?: string | null } | null, status: { __typename?: 'BookingCardStatus', value?: string | null } } | null> | null }, status: { __typename?: 'ClassStatus', isRunning?: boolean | null, isPublished?: boolean | null, isVIPOnly?: boolean | null }, zoom?: { __typename?: 'ClassZoom', meetingId?: string | null, password?: string | null, joinUrl?: string | null } | null } };

export type RegularClassesQueryVariables = Exact<{ [key: string]: never; }>;


export type RegularClassesQuery = { __typename?: 'Query', regularClasses: Array<{ __typename?: 'RegularClass', _id: any, instructors: Array<{ __typename?: 'User', _id: any, name: string, image?: string | null }>, details: { __typename?: 'ClassDetails', title: string, description?: string | null, tags?: Array<string | null> | null, level: { __typename?: 'Level', _id: any, isEnabled?: boolean | null, code: string, description: string } }, schedule: { __typename?: 'ClassSchedule', date?: any | null, duration?: number | null }, status: { __typename?: 'ClassStatus', isRunning?: boolean | null, isPublished?: boolean | null, isVIPOnly?: boolean | null }, online: { __typename?: 'ClassCapacity', capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any, bookingCode: string } | null> | null }, offline: { __typename?: 'ClassCapacity', capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any, bookingCode: string } | null> | null } }> };

export type RegularClassesByInstructorsUsernameQueryVariables = Exact<{
  username: Scalars['String'];
  viewedDate: Scalars['DateTime'];
}>;


export type RegularClassesByInstructorsUsernameQuery = { __typename?: 'Query', regularClassesByInstructorsUsername: Array<{ __typename: 'RegularClass', _id: any, instructors: Array<{ __typename?: 'User', name: string, image?: string | null }>, details: { __typename?: 'ClassDetails', title: string }, schedule: { __typename?: 'ClassSchedule', date?: any | null, duration?: number | null, isAllDay?: boolean | null }, online: { __typename?: 'ClassCapacity', booked?: Array<{ __typename?: 'BookingCard', _id: any, user?: { __typename?: 'User', name: string, image?: string | null } | null } | null> | null }, offline: { __typename?: 'ClassCapacity', booked?: Array<{ __typename?: 'BookingCard', _id: any, user?: { __typename?: 'User', name: string, image?: string | null } | null } | null> | null }, status: { __typename?: 'ClassStatus', isRunning?: boolean | null, isPublished?: boolean | null, isVIPOnly?: boolean | null } }> };

export type RegularClassFormQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type RegularClassFormQueryQuery = { __typename?: 'Query', classTemplates: Array<{ __typename?: 'RegularClassTemplate', _id: any, details: { __typename?: 'ClassTemplateDetails', title: string } }>, levels: Array<{ __typename?: 'Level', _id: any, code: string, description: string }>, instructors: Array<{ __typename?: 'User', _id: any, name: string, image?: string | null }> };

export type AddRegularClassMutationVariables = Exact<{
  instructors: Array<Scalars['ObjectId']> | Scalars['ObjectId'];
  details: ClassDetailsInput;
  online: ClassCapacityInput;
  offline: ClassCapacityInput;
  schedule: ClassScheduleInput;
  status: ClassStatusInput;
  createZoomMeeting?: InputMaybe<Scalars['Boolean']>;
}>;


export type AddRegularClassMutation = { __typename?: 'Mutation', addRegularClass: number };

export type AddZoomMeetingRegularClassMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type AddZoomMeetingRegularClassMutation = { __typename?: 'Mutation', addZoomMeetingRegularClass: { __typename?: 'RegularClass', _id: any } };

export type EditSingleRegularClassMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  instructors: Array<Scalars['ObjectId']> | Scalars['ObjectId'];
  details: ClassDetailsInput;
  online: ClassCapacityInput;
  offline: ClassCapacityInput;
  schedule: ClassScheduleInput;
  status: ClassStatusInput;
}>;


export type EditSingleRegularClassMutation = { __typename?: 'Mutation', editSingleRegularClass: number };

export type EditRecurrenceRegularClassMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  instructors: Array<Scalars['ObjectId']> | Scalars['ObjectId'];
  details: ClassDetailsInput;
  online: ClassCapacityInput;
  offline: ClassCapacityInput;
  schedule: ClassScheduleInput;
  status: ClassStatusInput;
}>;


export type EditRecurrenceRegularClassMutation = { __typename?: 'Mutation', editRecurrenceRegularClass: number };

export type EditFollowingRegularClassMutationVariables = Exact<{
  input: RegularClassInput;
  originalDate: Scalars['DateTime'];
}>;


export type EditFollowingRegularClassMutation = { __typename?: 'Mutation', editFollowingRegularClass: number };

export type DeleteSingleRegularClassMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
}>;


export type DeleteSingleRegularClassMutation = { __typename?: 'Mutation', deleteSingleRegularClass: number };

export type DeleteRecurrenceRegularClassMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
}>;


export type DeleteRecurrenceRegularClassMutation = { __typename?: 'Mutation', deleteRecurrenceRegularClass: number };

export type DeleteFollowingRegularClassMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
  date: Scalars['DateTime'];
}>;


export type DeleteFollowingRegularClassMutation = { __typename?: 'Mutation', deleteFollowingRegularClass: number };

export type UpdateClassAttendanceMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  updatedBy: Scalars['ObjectId'];
  action: Scalars['String'];
  reason?: InputMaybe<Scalars['String']>;
}>;


export type UpdateClassAttendanceMutation = { __typename?: 'Mutation', updateClassAttendance: { __typename?: 'RegularClass', _id: any } };

export type OverallBookingReportQueryVariables = Exact<{ [key: string]: never; }>;


export type OverallBookingReportQuery = { __typename?: 'Query', overallBookingReport: Array<{ __typename?: 'BookingReport', count?: number | null, _id?: { __typename?: 'BookingReportId', classType?: string | null, status?: string | null } | null }> };

export type WeeklyBookingReportQueryVariables = Exact<{
  bookingStatus: Scalars['String'];
  timeFrame: Scalars['String'];
}>;


export type WeeklyBookingReportQuery = { __typename?: 'Query', weeklyBookingReport: Array<{ __typename?: 'BookingReport', count?: number | null, totalCost?: number | null, _id?: { __typename?: 'BookingReportId', classType?: string | null, status?: string | null, week?: number | null } | null }> };

export type TopUserReportQueryVariables = Exact<{
  bookingStatus: Scalars['String'];
  timeFrame: Scalars['String'];
}>;


export type TopUserReportQuery = { __typename?: 'Query', topUserReport: Array<{ __typename?: 'BookingReport', totalCost?: number | null, _id?: { __typename?: 'BookingReportId', user?: string | null } | null }> };

export type TopUserMembershipReportQueryVariables = Exact<{
  timeFrame: Scalars['String'];
}>;


export type TopUserMembershipReportQuery = { __typename?: 'Query', topUserMembershipReport: Array<{ __typename?: 'BookingReport', totalCost?: number | null, _id?: { __typename?: 'BookingReportId', user?: string | null } | null }> };

export type TopInstructorReportQueryVariables = Exact<{
  bookingStatus: Scalars['String'];
  timeFrame: Scalars['String'];
}>;


export type TopInstructorReportQuery = { __typename?: 'Query', topInstructorReport: Array<{ __typename?: 'BookingReport', totalCost?: number | null, _id?: { __typename?: 'BookingReportId', instructor?: string | null } | null }> };

export type InstructorPerformanceReportQueryVariables = Exact<{
  instructorId: Scalars['ObjectId'];
  timeFrame: Scalars['String'];
}>;


export type InstructorPerformanceReportQuery = { __typename?: 'Query', instructorPerformanceReport: Array<{ __typename?: 'BookingReport', count?: number | null, _id?: { __typename?: 'BookingReportId', instructor?: string | null, status?: string | null } | null }> };

export type SpecialClassReportQueryVariables = Exact<{
  timeFrame: Scalars['String'];
}>;


export type SpecialClassReportQuery = { __typename?: 'Query', specialClassReport: Array<{ __typename?: 'BookingReport', totalSeat?: number | null, count?: number | null, _id?: { __typename?: 'BookingReportId', classType?: string | null, week?: number | null } | null }> };

export type AllSeriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllSeriesQuery = { __typename?: 'Query', allSeries: Array<{ __typename?: 'Series', _id: any, isPublished?: boolean | null, title: string, description?: string | null, regularClass?: Array<{ __typename?: 'RegularClass', details: { __typename?: 'ClassDetails', title: string }, schedule: { __typename?: 'ClassSchedule', date?: any | null } }> | null, specialEvent?: Array<{ __typename?: 'SpecialEvent', details: { __typename?: 'EventDetails', title: string }, schedule: { __typename?: 'EventSchedule', date?: any | null } }> | null }> };

export type AllPublishedSeriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllPublishedSeriesQuery = { __typename?: 'Query', allPublishedSeries: Array<{ __typename?: 'Series', _id: any, isPublished?: boolean | null, title: string, description?: string | null, regularClass?: Array<{ __typename?: 'RegularClass', details: { __typename?: 'ClassDetails', title: string }, schedule: { __typename?: 'ClassSchedule', date?: any | null } }> | null, specialEvent?: Array<{ __typename?: 'SpecialEvent', details: { __typename?: 'EventDetails', title: string }, schedule: { __typename?: 'EventSchedule', date?: any | null } }> | null }> };

export type SeriesQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type SeriesQuery = { __typename?: 'Query', series: { __typename?: 'Series', _id: any, isPublished?: boolean | null, title: string, description?: string | null, regularClass?: Array<{ __typename: 'RegularClass', _id: any, details: { __typename?: 'ClassDetails', title: string }, schedule: { __typename?: 'ClassSchedule', date?: any | null }, instructors: Array<{ __typename?: 'User', name: string }> }> | null, specialEvent?: Array<{ __typename: 'SpecialEvent', _id: any, details: { __typename?: 'EventDetails', title: string }, schedule: { __typename?: 'EventSchedule', date?: any | null }, instructors: Array<{ __typename?: 'EventInstructor', name: string }> }> | null } };

export type SeriesTitleQueryVariables = Exact<{
  title: Scalars['String'];
}>;


export type SeriesTitleQuery = { __typename?: 'Query', seriesTitle: { __typename?: 'Series', _id: any, isPublished?: boolean | null, title: string, description?: string | null, regularClass?: Array<{ __typename: 'RegularClass', _id: any, details: { __typename?: 'ClassDetails', title: string, description?: string | null, tags?: Array<string | null> | null, level: { __typename?: 'Level', description: string } }, schedule: { __typename?: 'ClassSchedule', date?: any | null, duration?: number | null, isAllDay?: boolean | null }, instructors: Array<{ __typename?: 'User', name: string }>, status: { __typename?: 'ClassStatus', isVIPOnly?: boolean | null }, online: { __typename?: 'ClassCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null }, offline: { __typename?: 'ClassCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null, booked?: Array<{ __typename?: 'BookingCard', _id: any } | null> | null } }> | null, specialEvent?: Array<{ __typename: 'SpecialEvent', _id: any, details: { __typename?: 'EventDetails', title: string, description?: string | null, tags?: Array<string | null> | null }, schedule: { __typename?: 'EventSchedule', date?: any | null, duration?: number | null, isAllDay?: boolean | null }, instructors: Array<{ __typename?: 'EventInstructor', name: string }>, status: { __typename?: 'EventStatus', isVIPOnly?: boolean | null }, online: { __typename?: 'EventCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cost?: number | null, bookedSeat: number, confirmedSeat: number, rejectedSeat: number, booked?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null }, offline: { __typename?: 'EventCapacity', availability?: number | null, capacity?: number | null, bookingTimeLimit?: number | null, cost?: number | null, bookedSeat: number, confirmedSeat: number, rejectedSeat: number, booked?: Array<{ __typename?: 'EventBookingCard', _id: any } | null> | null } }> | null } };

export type IsSeriesTitleExistQueryVariables = Exact<{
  title: Scalars['String'];
}>;


export type IsSeriesTitleExistQuery = { __typename?: 'Query', isSeriesTitleExist: boolean };

export type AddSeriesMutationVariables = Exact<{
  isPublished: Scalars['Boolean'];
  title: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  regularClass: Array<InputMaybe<Scalars['ObjectId']>> | InputMaybe<Scalars['ObjectId']>;
  specialEvent: Array<InputMaybe<Scalars['ObjectId']>> | InputMaybe<Scalars['ObjectId']>;
}>;


export type AddSeriesMutation = { __typename?: 'Mutation', addSeries: { __typename?: 'Series', _id: any } };

export type EditSeriesMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  isPublished: Scalars['Boolean'];
  title: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  regularClass: Array<InputMaybe<Scalars['ObjectId']>> | InputMaybe<Scalars['ObjectId']>;
  specialEvent: Array<InputMaybe<Scalars['ObjectId']>> | InputMaybe<Scalars['ObjectId']>;
}>;


export type EditSeriesMutation = { __typename?: 'Mutation', editSeries: { __typename?: 'Series', _id: any } };

export type DeleteSeriesMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteSeriesMutation = { __typename?: 'Mutation', deleteSeries: { __typename?: 'Series', _id: any } };

export type ClassTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type ClassTemplatesQuery = { __typename?: 'Query', classTemplates: Array<{ __typename: 'RegularClassTemplate', _id: any, instructors?: Array<{ __typename?: 'User', _id: any, name: string, image?: string | null } | null> | null, details: { __typename?: 'ClassTemplateDetails', title: string, description?: string | null, tags?: Array<string | null> | null, level: { __typename?: 'Level', _id: any, description: string } }, online: { __typename?: 'ClassTemplateCapacity', capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null }, offline: { __typename?: 'ClassTemplateCapacity', capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null }, schedule: { __typename?: 'ClassTemplateSchedule', day?: Array<number> | null, startTime: any, duration?: number | null } }> };

export type ClassTemplateQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type ClassTemplateQuery = { __typename?: 'Query', classTemplate: { __typename: 'RegularClassTemplate', _id: any, instructors?: Array<{ __typename?: 'User', _id: any, name: string, image?: string | null } | null> | null, details: { __typename?: 'ClassTemplateDetails', title: string, description?: string | null, tags?: Array<string | null> | null, level: { __typename?: 'Level', _id: any, description: string } }, online: { __typename?: 'ClassTemplateCapacity', capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null }, offline: { __typename?: 'ClassTemplateCapacity', capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null }, schedule: { __typename?: 'ClassTemplateSchedule', day?: Array<number> | null, startTime: any, duration?: number | null } } };

export type ClassTemplatePriceListQueryVariables = Exact<{
  title: Scalars['String'];
}>;


export type ClassTemplatePriceListQuery = { __typename?: 'Query', classTemplatePriceList: { __typename: 'RegularClassTemplate', _id: any, instructors?: Array<{ __typename?: 'User', _id: any, name: string, image?: string | null } | null> | null, details: { __typename?: 'ClassTemplateDetails', title: string, description?: string | null, tags?: Array<string | null> | null, level: { __typename?: 'Level', _id: any, description: string } }, online: { __typename?: 'ClassTemplateCapacity', capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null }, offline: { __typename?: 'ClassTemplateCapacity', capacity?: number | null, bookingTimeLimit?: number | null, cancelTimeLimit?: number | null, cost?: number | null }, schedule: { __typename?: 'ClassTemplateSchedule', day?: Array<number> | null, startTime: any, duration?: number | null } } };

export type AddTemplateMutationVariables = Exact<{
  instructors?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']>> | InputMaybe<Scalars['ObjectId']>>;
  details: ClassTemplateDetailsInput;
  online: ClassTemplateCapacityInput;
  offline: ClassTemplateCapacityInput;
  schedule: ClassTemplateScheduleInput;
}>;


export type AddTemplateMutation = { __typename?: 'Mutation', addTemplate: { __typename?: 'RegularClassTemplate', details: { __typename?: 'ClassTemplateDetails', title: string } } };

export type EditTemplateMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  instructors?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']>> | InputMaybe<Scalars['ObjectId']>>;
  details: ClassTemplateDetailsInput;
  online: ClassTemplateCapacityInput;
  offline: ClassTemplateCapacityInput;
  schedule: ClassTemplateScheduleInput;
}>;


export type EditTemplateMutation = { __typename?: 'Mutation', editTemplate: { __typename?: 'RegularClassTemplate', details: { __typename?: 'ClassTemplateDetails', title: string } } };

export type DeleteTemplateMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteTemplateMutation = { __typename?: 'Mutation', deleteTemplate: { __typename?: 'RegularClassTemplate', details: { __typename?: 'ClassTemplateDetails', title: string } } };

export type IsUsernameAvailableQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type IsUsernameAvailableQuery = { __typename?: 'Query', isUsernameAvailable: boolean };

export type InstructorsQueryVariables = Exact<{ [key: string]: never; }>;


export type InstructorsQuery = { __typename?: 'Query', instructors: Array<{ __typename?: 'User', _id: any, name: string, image?: string | null, username?: string | null }> };

export type AdminsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminsQuery = { __typename?: 'Query', admins: Array<{ __typename?: 'User', _id: any, name: string, username?: string | null }> };

export type UserQueryVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', _id: any, name: string, username?: string | null, image?: string | null, email?: string | null, phone?: string | null, role: { __typename?: 'UserRole', isInstructor: boolean, isAdmin: boolean }, access: { __typename?: 'UserAccess', register?: { __typename?: 'UserAccessRegister', date?: any | null } | null, approval: { __typename?: 'UserAccessApproval', isApproved?: boolean | null, date?: any | null }, ban: { __typename?: 'UserAccessBan', isBanned: boolean, date?: any | null, reason?: string | null } }, membership: { __typename?: 'UserMembership', isVIP?: boolean | null, latest?: { __typename?: 'Membership', _id: any } | null } } };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', _id: any, name: string, username?: string | null, image?: string | null, email?: string | null, phone?: string | null, role: { __typename?: 'UserRole', isInstructor: boolean, isAdmin: boolean }, access: { __typename?: 'UserAccess', register?: { __typename?: 'UserAccessRegister', date?: any | null } | null, approval: { __typename?: 'UserAccessApproval', isApproved?: boolean | null, date?: any | null, by?: { __typename?: 'User', name: string } | null }, ban: { __typename?: 'UserAccessBan', isBanned: boolean, date?: any | null, reason?: string | null, by?: { __typename?: 'User', name: string } | null } }, membership: { __typename?: 'UserMembership', isVIP?: boolean | null, latest?: { __typename?: 'Membership', _id: any, note?: string | null, balance: { __typename?: 'MembershipBalance', available?: number | null } } | null } }> };

export type EditUserMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  username: Scalars['String'];
  name: Scalars['String'];
  phone: Scalars['String'];
  image?: InputMaybe<Scalars['String']>;
}>;


export type EditUserMutation = { __typename?: 'Mutation', editUser: { __typename?: 'User', _id: any, name: string, username?: string | null } };

export type EditUserRoleAndAccessMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  updaterId: Scalars['ObjectId'];
  role: UserRoleInput;
  access: UserAccessInput;
  isVIP: Scalars['Boolean'];
}>;


export type EditUserRoleAndAccessMutation = { __typename?: 'Mutation', editUserRoleAndAccess: { __typename?: 'User', _id: any, name: string } };

export type UploadProfileImageMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
  image: Scalars['Upload'];
}>;


export type UploadProfileImageMutation = { __typename?: 'Mutation', uploadProfileImage: boolean };

export type DeleteProfileImageMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type DeleteProfileImageMutation = { __typename?: 'Mutation', deleteProfileImage: boolean };

export type CleanUpUserDataMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type CleanUpUserDataMutation = { __typename?: 'Mutation', cleanUpUserData: boolean };

export const AnnouncementFieldsFragmentDoc = gql`
    fragment announcementFields on Announcement {
  _id
  isEnabled
  isPrivate
  isPublic
  start
  end
  text
}
    `;
export const EventInstructorsFragmentDoc = gql`
    fragment eventInstructors on SpecialEvent {
  instructors {
    name
  }
}
    `;
export const EventDetailsFragmentDoc = gql`
    fragment eventDetails on SpecialEvent {
  details {
    title
    description
    tags
  }
}
    `;
export const EventScheduleFragmentDoc = gql`
    fragment eventSchedule on SpecialEvent {
  schedule {
    date
    duration
    rString
  }
}
    `;
export const EventStatusFragmentDoc = gql`
    fragment eventStatus on SpecialEvent {
  status {
    isRunning
    isPublished
    isVIPOnly
  }
}
    `;
export const EventCapacityFragmentDoc = gql`
    fragment eventCapacity on EventCapacity {
  booked {
    _id
  }
  confirmed {
    _id
  }
  rejected {
    _id
  }
  capacity
  availability
  bookingTimeLimit
  cost
  bookedSeat
  confirmedSeat
  rejectedSeat
}
    `;
export const EventZoomFragmentDoc = gql`
    fragment eventZoom on SpecialEvent {
  zoom {
    meetingId
    password
    joinUrl
  }
}
    `;
export const FeatureFragmentFragmentDoc = gql`
    fragment featureFragment on Feature {
  isEnabled
  featureKey
  createdAt
  updatedAt
}
    `;
export const HolidayFieldsFragmentDoc = gql`
    fragment holidayFields on Holiday {
  _id
  isEnabled
  start
  end
  title
}
    `;
export const LevelFieldsFragmentDoc = gql`
    fragment levelFields on Level {
  _id
  isEnabled
  code
  description
}
    `;
export const BalanceFieldsFragmentDoc = gql`
    fragment balanceFields on Membership {
  balance {
    available
    additional
    transferIn
    transferOut
    validUntil
  }
}
    `;
export const PaymentFieldsFragmentDoc = gql`
    fragment paymentFields on Membership {
  payment {
    amount
    method
    date
    url
  }
}
    `;
export const MembershipPackageFieldsFragmentDoc = gql`
    fragment membershipPackageFields on MembershipPackage {
  _id
  isEnabled
  name
  additional
  price
  validity
}
    `;
export const PaymentMethodFieldsFragmentDoc = gql`
    fragment paymentMethodFields on PaymentMethod {
  _id
  isEnabled
  isEnabledForMembership
  isEnabledForSpecialEvent
  requireProof
  via
}
    `;
export const AnnouncementsDocument = gql`
    query Announcements {
  announcements {
    ...announcementFields
  }
}
    ${AnnouncementFieldsFragmentDoc}`;
export const ActiveAnnouncementsDocument = gql`
    query ActiveAnnouncements {
  activeAnnouncements {
    ...announcementFields
  }
}
    ${AnnouncementFieldsFragmentDoc}`;
export const ActivePrivateAnnouncementsDocument = gql`
    query ActivePrivateAnnouncements {
  activePrivateAnnouncements {
    ...announcementFields
  }
}
    ${AnnouncementFieldsFragmentDoc}`;
export const ActivePublicAnnouncementsDocument = gql`
    query ActivePublicAnnouncements {
  activePublicAnnouncements {
    ...announcementFields
  }
}
    ${AnnouncementFieldsFragmentDoc}`;
export const AddAnnouncementDocument = gql`
    mutation AddAnnouncement($isEnabled: Boolean!, $isPrivate: Boolean!, $isPublic: Boolean!, $start: DateTime!, $end: DateTime, $text: String!) {
  addAnnouncement(
    input: {isEnabled: $isEnabled, isPrivate: $isPrivate, isPublic: $isPublic, start: $start, end: $end, text: $text}
  ) {
    text
  }
}
    `;
export const EditAnnouncementDocument = gql`
    mutation EditAnnouncement($_id: ObjectId!, $isEnabled: Boolean, $isPrivate: Boolean, $isPublic: Boolean, $start: DateTime, $end: DateTime, $text: String) {
  editAnnouncement(
    input: {_id: $_id, isEnabled: $isEnabled, isPrivate: $isPrivate, isPublic: $isPublic, start: $start, end: $end, text: $text}
  ) {
    text
  }
}
    `;
export const DeleteAnnouncementDocument = gql`
    mutation DeleteAnnouncement($_id: ObjectId!) {
  deleteAnnouncement(_id: $_id) {
    text
  }
}
    `;
export const BookingCardsDocument = gql`
    query BookingCards {
  bookingCards {
    _id
    bookingCode
    user {
      name
      image
    }
    booker {
      name
    }
    regularClass {
      details {
        title
      }
      schedule {
        date
      }
      status {
        isRunning
        isPublished
        isVIPOnly
      }
    }
    status {
      value
      lastUpdateOn
      updatedBy {
        name
      }
    }
  }
}
    `;
export const ActiveBookingsDocument = gql`
    query ActiveBookings($_id: ObjectId!) {
  activeBookings(_id: $_id) {
    _id
    bookingCode
    regularClass {
      details {
        title
      }
      schedule {
        date
        duration
      }
    }
    status {
      value
    }
  }
}
    `;
export const BookingCardsUserDocument = gql`
    query BookingCardsUser($_id: ObjectId!) {
  bookingCardsUser(_id: $_id) {
    _id
    bookingCode
    regularClass {
      details {
        title
      }
      schedule {
        date
      }
    }
    status {
      value
      lastUpdateOn
      updatedBy {
        name
      }
    }
  }
}
    `;
export const AddBookingCardDocument = gql`
    mutation AddBookingCard($user: ObjectId!, $booker: ObjectId!, $regularClass: ObjectId!, $classType: String!, $seat: Int!, $updatedBy: ObjectId!) {
  addBookingCard(
    input: {user: $user, booker: $booker, regularClass: $regularClass, classType: $classType, seat: $seat, status: {value: "Scheduled", updatedBy: $updatedBy}}
  ) {
    _id
    bookingCode
  }
}
    `;
export const CancelBookingCardDocument = gql`
    mutation CancelBookingCard($_id: ObjectId!, $updatedBy: ObjectId!) {
  cancelBookingCard(
    _id: $_id
    updatedBy: $updatedBy
    bookingStatus: "Booking Cancelled"
  ) {
    _id
    bookingCode
  }
}
    `;
export const SpecialEventsDocument = gql`
    query SpecialEvents {
  specialEvents {
    _id
    ...eventDetails
    ...eventInstructors
    ...eventSchedule
    online {
      ...eventCapacity
    }
    offline {
      ...eventCapacity
    }
    ...eventStatus
    ...eventZoom
  }
}
    ${EventDetailsFragmentDoc}
${EventInstructorsFragmentDoc}
${EventScheduleFragmentDoc}
${EventCapacityFragmentDoc}
${EventStatusFragmentDoc}
${EventZoomFragmentDoc}`;
export const SpecialEventDocument = gql`
    query SpecialEvent($_id: ObjectId!) {
  specialEvent(_id: $_id) {
    __typename
    _id
    ...eventDetails
    ...eventInstructors
    ...eventSchedule
    online {
      ...eventCapacity
    }
    offline {
      ...eventCapacity
    }
    ...eventStatus
    ...eventZoom
  }
}
    ${EventDetailsFragmentDoc}
${EventInstructorsFragmentDoc}
${EventScheduleFragmentDoc}
${EventCapacityFragmentDoc}
${EventStatusFragmentDoc}
${EventZoomFragmentDoc}`;
export const AddZoomMeetingSpecialEventDocument = gql`
    mutation AddZoomMeetingSpecialEvent($_id: ObjectId!) {
  addZoomMeetingSpecialEvent(_id: $_id) {
    _id
  }
}
    `;
export const AddSpecialEventDocument = gql`
    mutation AddSpecialEvent($instructors: [String!]!, $details: EventDetailsInput!, $online: EventCapacityInput!, $offline: EventCapacityInput!, $schedule: EventScheduleInput!, $status: EventStatusInput!, $createZoomMeeting: Boolean) {
  addSpecialEvent(
    input: {instructors: $instructors, details: $details, online: $online, offline: $offline, schedule: $schedule, status: $status, createZoomMeeting: $createZoomMeeting}
  )
}
    `;
export const EditSingleSpecialEventDocument = gql`
    mutation EditSingleSpecialEvent($_id: ObjectId!, $instructors: [String!]!, $details: EventDetailsInput!, $online: EventCapacityInput!, $offline: EventCapacityInput!, $schedule: EventScheduleInput!, $status: EventStatusInput!) {
  editSingleSpecialEvent(
    input: {_id: $_id, instructors: $instructors, details: $details, online: $online, offline: $offline, schedule: $schedule, status: $status}
  )
}
    `;
export const EditRecurrenceSpecialEventDocument = gql`
    mutation EditRecurrenceSpecialEvent($_id: ObjectId!, $instructors: [String!]!, $details: EventDetailsInput!, $online: EventCapacityInput!, $offline: EventCapacityInput!, $schedule: EventScheduleInput!, $status: EventStatusInput!) {
  editRecurrenceSpecialEvent(
    input: {_id: $_id, instructors: $instructors, details: $details, online: $online, offline: $offline, schedule: $schedule, status: $status}
  )
}
    `;
export const EditFollowingSpecialEventDocument = gql`
    mutation EditFollowingSpecialEvent($input: SpecialEventInput!, $originalDate: DateTime!) {
  editFollowingSpecialEvent(input: $input, originalDate: $originalDate)
}
    `;
export const DeleteSingleSpecialEventDocument = gql`
    mutation DeleteSingleSpecialEvent($_id: ObjectId!, $updatedBy: ObjectId!) {
  deleteSingleSpecialEvent(_id: $_id, updatedBy: $updatedBy)
}
    `;
export const DeleteRecurrenceSpecialEventDocument = gql`
    mutation DeleteRecurrenceSpecialEvent($_id: ObjectId!, $updatedBy: ObjectId!) {
  deleteRecurrenceSpecialEvent(_id: $_id, updatedBy: $updatedBy)
}
    `;
export const DeleteFollowingSpecialEventDocument = gql`
    mutation DeleteFollowingSpecialEvent($_id: ObjectId!, $date: DateTime!, $updatedBy: ObjectId!) {
  deleteFollowingSpecialEvent(_id: $_id, date: $date, updatedBy: $updatedBy)
}
    `;
export const UpdateSpecialEventStatusDocument = gql`
    mutation UpdateSpecialEventStatus($_id: ObjectId!, $isRunning: Boolean!) {
  updateSpecialEventStatus(_id: $_id, isRunning: $isRunning) {
    _id
  }
}
    `;
export const DeleteSpecialEventStatusDocument = gql`
    mutation DeleteSpecialEventStatus($_id: ObjectId!) {
  deleteSpecialEventStatus(_id: $_id) {
    _id
  }
}
    `;
export const EventBookingCardsDocument = gql`
    query EventBookingCards {
  eventBookingCards {
    _id
  }
}
    `;
export const EventBookingCardDocument = gql`
    query EventBookingCard($_id: ObjectId!) {
  eventBookingCard(_id: $_id) {
    _id
    bookingCode
    user {
      name
    }
    seat
    classType
    participants
    payment {
      date
      amount
      method
      image
    }
    status {
      value
      reason
      lastUpdateOn
      updatedBy {
        name
      }
    }
    createdAt
    updatedAt
  }
}
    `;
export const SelectedEventBookingCardsDocument = gql`
    query SelectedEventBookingCards($_id: ObjectId!) {
  selectedEventBookingCards(_id: $_id) {
    _id
    bookingCode
    user {
      name
    }
    seat
    classType
    participants
    payment {
      date
      amount
      method
      image
    }
    status {
      value
      reason
      lastUpdateOn
      updatedBy {
        name
      }
    }
    createdAt
    updatedAt
  }
}
    `;
export const AddEventBookingCardDocument = gql`
    mutation AddEventBookingCard($user: ObjectId!, $booker: ObjectId!, $event: ObjectId!, $classType: String!, $seat: Int!, $participants: [String!]!, $payment: EventPaymentInput!, $status: EventBookingCardStatusInput!, $image: Upload) {
  addEventBookingCard(
    input: {user: $user, booker: $booker, event: $event, classType: $classType, seat: $seat, participants: $participants, payment: $payment, status: $status, image: $image}
  ) {
    _id
    bookingCode
  }
}
    `;
export const UpdateEventBookingRequestStatusDocument = gql`
    mutation UpdateEventBookingRequestStatus($_id: ObjectId!, $status: EventBookingCardStatusInput!) {
  updateEventBookingRequestStatus(_id: $_id, status: $status) {
    _id
  }
}
    `;
export const DeleteEventBookingPaymentImageDocument = gql`
    mutation DeleteEventBookingPaymentImage($_id: ObjectId!) {
  deleteEventBookingPaymentImage(_id: $_id) {
    _id
  }
}
    `;
export const UpdateSpecialEventBookingParticipantsDocument = gql`
    mutation UpdateSpecialEventBookingParticipants($_id: ObjectId!, $participants: [String!]!) {
  updateSpecialEventBookingParticipants(_id: $_id, participants: $participants) {
    _id
  }
}
    `;
export const FeatureSeriesDocument = gql`
    query FeatureSeries {
  featureSeries {
    ...featureFragment
  }
}
    ${FeatureFragmentFragmentDoc}`;
export const FeatureTemplateDocument = gql`
    query FeatureTemplate {
  featureTemplate {
    ...featureFragment
  }
}
    ${FeatureFragmentFragmentDoc}`;
export const FeatureAnalyticsDocument = gql`
    query FeatureAnalytics {
  featureAnalytics {
    ...featureFragment
  }
}
    ${FeatureFragmentFragmentDoc}`;
export const FeatureAutoApproveMembershipDocument = gql`
    query FeatureAutoApproveMembership {
  featureAutoApproveMembership {
    ...featureFragment
    by {
      _id
      name
    }
  }
}
    ${FeatureFragmentFragmentDoc}`;
export const FeaturePageQueryDocument = gql`
    query FeaturePageQuery {
  featureSeries {
    ...featureFragment
  }
  featureTemplate {
    ...featureFragment
  }
  featureAnalytics {
    ...featureFragment
  }
  featureAutoApproveMembership {
    ...featureFragment
    by {
      _id
      name
    }
  }
}
    ${FeatureFragmentFragmentDoc}`;
export const ToggleFeatureDocument = gql`
    mutation ToggleFeature($featureKey: String!) {
  toggleFeature(featureKey: $featureKey) {
    ...featureFragment
  }
}
    ${FeatureFragmentFragmentDoc}`;
export const SetAutoApproverAdminDocument = gql`
    mutation SetAutoApproverAdmin($_id: ObjectId!) {
  setAutoApproverAdmin(_id: $_id) {
    ...featureFragment
  }
}
    ${FeatureFragmentFragmentDoc}`;
export const ListMembershipBucketObjectsDocument = gql`
    query ListMembershipBucketObjects($mode: String!) {
  listMembershipBucketObjects(mode: $mode) {
    Name
    KeyCount
    MaxKeys
    Prefix
    IsTruncated
    Contents {
      Key
      FileName
      Size
      LastModified
    }
  }
}
    `;
export const ListEventBucketObjectsDocument = gql`
    query ListEventBucketObjects($mode: String!) {
  listEventBucketObjects(mode: $mode) {
    Name
    KeyCount
    MaxKeys
    Prefix
    IsTruncated
    Contents {
      Key
      FileName
      Size
      LastModified
    }
  }
}
    `;
export const DeleteUnusedImagesDocument = gql`
    mutation DeleteUnusedImages($prefix: String!, $fileNames: [String!]!) {
  deleteUnusedImages(input: {prefix: $prefix, fileNames: $fileNames}) {
    DeleteMarker
    VersionId
    Metadata {
      httpStatusCode
      attempts
      totalRetryDelay
    }
  }
}
    `;
export const HolidaysDocument = gql`
    query Holidays {
  holidays {
    ...holidayFields
  }
}
    ${HolidayFieldsFragmentDoc}`;
export const ActiveHolidaysDocument = gql`
    query ActiveHolidays {
  activeHolidays {
    ...holidayFields
  }
}
    ${HolidayFieldsFragmentDoc}`;
export const AddHolidayDocument = gql`
    mutation AddHoliday($isEnabled: Boolean!, $start: DateTime!, $end: DateTime, $title: String!) {
  addHoliday(
    input: {isEnabled: $isEnabled, start: $start, end: $end, title: $title}
  ) {
    title
  }
}
    `;
export const EditHolidayDocument = gql`
    mutation EditHoliday($_id: ObjectId!, $isEnabled: Boolean!, $start: DateTime, $end: DateTime, $title: String) {
  editHoliday(
    input: {_id: $_id, isEnabled: $isEnabled, start: $start, end: $end, title: $title}
  ) {
    title
  }
}
    `;
export const DeleteHolidayDocument = gql`
    mutation DeleteHoliday($_id: ObjectId!) {
  deleteHoliday(_id: $_id) {
    title
  }
}
    `;
export const ActiveLevelsDocument = gql`
    query ActiveLevels {
  activeLevels {
    ...levelFields
  }
}
    ${LevelFieldsFragmentDoc}`;
export const LevelsDocument = gql`
    query Levels {
  levels {
    ...levelFields
  }
}
    ${LevelFieldsFragmentDoc}`;
export const LevelDocument = gql`
    query Level($_id: ObjectId!) {
  level(_id: $_id) {
    ...levelFields
  }
}
    ${LevelFieldsFragmentDoc}`;
export const AddLevelDocument = gql`
    mutation AddLevel($isEnabled: Boolean!, $code: String!, $description: String!) {
  addLevel(input: {isEnabled: $isEnabled, code: $code, description: $description}) {
    code
    description
  }
}
    `;
export const EditLevelDocument = gql`
    mutation EditLevel($_id: ObjectId!, $isEnabled: Boolean!, $code: String, $description: String) {
  editLevel(
    input: {_id: $_id, isEnabled: $isEnabled, code: $code, description: $description}
  ) {
    code
    description
  }
}
    `;
export const DeleteLevelDocument = gql`
    mutation DeleteLevel($_id: ObjectId!) {
  deleteLevel(_id: $_id) {
    code
    description
  }
}
    `;
export const GetAllLogsDocument = gql`
    query GetAllLogs {
  getAllLogs {
    user {
      name
    }
    category
    subCategory
    message
    createdAt
  }
}
    `;
export const MembershipsDocument = gql`
    query Memberships {
  memberships {
    _id
    note
    user {
      name
      image
      email
      username
    }
    booked {
      _id
      bookingCode
      cost
      createdAt
    }
    confirmed {
      _id
      bookingCode
      cost
      createdAt
    }
    cancelled {
      _id
      bookingCode
      cost
      createdAt
    }
    ...balanceFields
    ...paymentFields
    verified {
      isVerified
      reason
      by {
        name
      }
      date
    }
    createdAt
    updatedAt
  }
}
    ${BalanceFieldsFragmentDoc}
${PaymentFieldsFragmentDoc}`;
export const MembershipsByUserDocument = gql`
    query MembershipsByUser($_id: ObjectId!) {
  membershipsByUser(_id: $_id) {
    _id
    note
    booked {
      _id
    }
    confirmed {
      _id
    }
    cancelled {
      _id
    }
    balance {
      additional
      validUntil
    }
    ...paymentFields
    verified {
      isVerified
      reason
      date
    }
    createdAt
    updatedAt
  }
}
    ${PaymentFieldsFragmentDoc}`;
export const MembershipDocument = gql`
    query Membership($_id: ObjectId!) {
  membership(_id: $_id) {
    _id
    user {
      name
      image
    }
    note
    booked {
      _id
    }
    confirmed {
      _id
    }
    cancelled {
      _id
    }
    ...balanceFields
    ...paymentFields
    verified {
      isVerified
      reason
      by {
        name
      }
      date
    }
    createdAt
    updatedAt
  }
}
    ${BalanceFieldsFragmentDoc}
${PaymentFieldsFragmentDoc}`;
export const MarkThisMembershipAsInvalidDocument = gql`
    mutation MarkThisMembershipAsInvalid($_id: ObjectId!, $updatedBy: ObjectId!) {
  markThisMembershipAsInvalid(_id: $_id, updatedBy: $updatedBy) {
    _id
  }
}
    `;
export const MarkThisAndFollowingMembershipAsInvalidDocument = gql`
    mutation MarkThisAndFollowingMembershipAsInvalid($_id: ObjectId!, $updatedBy: ObjectId!) {
  markThisAndFollowingMembershipAsInvalid(_id: $_id, updatedBy: $updatedBy) {
    _id
  }
}
    `;
export const AddMembershipDocument = gql`
    mutation AddMembership($user: ObjectId!, $membershipPackageId: ObjectId!, $note: String!, $payment: MembershipPaymentInput!, $image: Upload) {
  addMembership(
    user: $user
    membershipPackageId: $membershipPackageId
    note: $note
    payment: $payment
    image: $image
  ) {
    _id
  }
}
    `;
export const EditMembershipDocument = gql`
    mutation EditMembership($_id: ObjectId!, $balance: MembershipBalanceInput!, $payment: MembershipPaymentInput!, $verified: MembershipVerifiedInput!) {
  editMembership(
    _id: $_id
    balance: $balance
    payment: $payment
    verified: $verified
  ) {
    _id
  }
}
    `;
export const DeleteMembershipDocument = gql`
    mutation DeleteMembership($_id: ObjectId!) {
  deleteMembership(_id: $_id) {
    _id
  }
}
    `;
export const DeleteProofOfPaymentDocument = gql`
    mutation DeleteProofOfPayment($_id: ObjectId!) {
  deleteProofOfPayment(_id: $_id) {
    _id
  }
}
    `;
export const ActiveMembershipPackageDocument = gql`
    query ActiveMembershipPackage {
  activeMembershipPackages {
    ...membershipPackageFields
  }
}
    ${MembershipPackageFieldsFragmentDoc}`;
export const MembershipPackagesDocument = gql`
    query MembershipPackages {
  membershipPackages {
    ...membershipPackageFields
  }
}
    ${MembershipPackageFieldsFragmentDoc}`;
export const AddMembershipPackageDocument = gql`
    mutation AddMembershipPackage($isEnabled: Boolean!, $name: String!, $additional: Int!, $price: Int!, $validity: Int!) {
  addMembershipPackage(
    input: {isEnabled: $isEnabled, name: $name, additional: $additional, price: $price, validity: $validity}
  ) {
    name
  }
}
    `;
export const EditMembershipPackageDocument = gql`
    mutation EditMembershipPackage($_id: ObjectId!, $isEnabled: Boolean!, $name: String, $additional: Int, $price: Int, $validity: Int) {
  editMembershipPackage(
    input: {_id: $_id, isEnabled: $isEnabled, name: $name, additional: $additional, price: $price, validity: $validity}
  ) {
    name
  }
}
    `;
export const DeleteMembershipPackageDocument = gql`
    mutation DeleteMembershipPackage($_id: ObjectId!) {
  deleteMembershipPackage(_id: $_id) {
    name
  }
}
    `;
export const GetMessagesForUserDocument = gql`
    query GetMessagesForUser($_id: ObjectId!) {
  getUnreadNumberForUser(_id: $_id)
  getMessagesForUser(_id: $_id) {
    _id
    isRead
    title
    message
    createdAt
    updatedAt
  }
}
    `;
export const GetMessageDocument = gql`
    query GetMessage($_id: ObjectId!) {
  getMessage(_id: $_id) {
    _id
    isRead
    title
    message
    createdAt
    updatedAt
  }
}
    `;
export const MarkAllMessagesAsReadForUserDocument = gql`
    mutation MarkAllMessagesAsReadForUser($_id: ObjectId!) {
  markAllMessagesAsReadForUser(_id: $_id)
}
    `;
export const DeleteAllReadMessagesForUserDocument = gql`
    mutation DeleteAllReadMessagesForUser($_id: ObjectId!) {
  deleteAllReadMessagesForUser(_id: $_id)
}
    `;
export const BookingPageDataDocument = gql`
    query BookingPageData {
  regularClasses {
    _id
    instructors {
      name
      image
    }
    details {
      title
      level {
        description
      }
      tags
    }
    online {
      capacity
      booked {
        _id
      }
      availability
      bookingTimeLimit
      cancelTimeLimit
    }
    offline {
      capacity
      booked {
        _id
      }
      availability
      bookingTimeLimit
      cancelTimeLimit
    }
    schedule {
      date
      duration
    }
  }
}
    `;
export const MyBookingSectionQueryDocument = gql`
    query MyBookingSectionQuery($_id: ObjectId!) {
  activeBookings(_id: $_id) {
    __typename
    _id
    bookingCode
    regularClass {
      details {
        title
      }
      instructors {
        name
        image
      }
      schedule {
        date
        duration
      }
      online {
        cancelTimeLimit
      }
      offline {
        cancelTimeLimit
      }
      zoom {
        meetingId
        password
        joinUrl
      }
    }
    classType
    status {
      value
    }
  }
  bookingCardsUser(_id: $_id) {
    __typename
    _id
    bookingCode
    user {
      name
      image
    }
    regularClass {
      details {
        title
      }
      instructors {
        name
        image
      }
      schedule {
        date
        duration
      }
      status {
        isRunning
      }
      zoom {
        joinUrl
        meetingId
        password
      }
    }
    status {
      value
    }
  }
  upcomingEventBookingCardsUser(_id: $_id) {
    __typename
    _id
    bookingCode
    classType
    event {
      details {
        title
      }
      schedule {
        date
        duration
      }
      instructors {
        name
      }
      zoom {
        password
        meetingId
        joinUrl
      }
    }
    payment {
      date
      amount
      method
      image
    }
    status {
      value
      reason
      lastUpdateOn
      updatedBy {
        name
      }
    }
  }
}
    `;
export const MembershipSectionQueryDocument = gql`
    query MembershipSectionQuery($userId: ObjectId!) {
  latestUserMembership(_id: $userId) {
    _id
    note
    booked {
      _id
    }
    confirmed {
      _id
    }
    cancelled {
      _id
    }
    balance {
      available
      totalBookedCost
      totalConfirmedCost
      additional
      transferIn
      transferOut
      validUntil
    }
    payment {
      amount
      method
      date
    }
    verified {
      isVerified
      date
    }
  }
}
    `;
export const TeachingScheduleQueryDocument = gql`
    query TeachingScheduleQuery($_id: ObjectId!) {
  activeClassesByInstructors(_id: $_id) {
    _id
    details {
      title
    }
    schedule {
      date
      duration
    }
    status {
      isRunning
      isVIPOnly
    }
    online {
      booked {
        _id
      }
    }
    offline {
      booked {
        _id
      }
    }
    zoom {
      meetingId
      password
      joinUrl
    }
  }
}
    `;
export const MembershipFormDataDocument = gql`
    query MembershipFormData {
  activeMembershipPackages {
    _id
    isEnabled
    name
    price
    additional
    validity
  }
  activePaymentMethodsMembership {
    _id
    isEnabled
    requireProof
    via
  }
}
    `;
export const SpecialEventBookingDataDocument = gql`
    query SpecialEventBookingData {
  activePaymentMethodsSpecialEvent {
    _id
    isEnabled
    requireProof
    via
  }
}
    `;
export const SchedulePageDataDocument = gql`
    query SchedulePageData($viewedDate: DateTime!) {
  regularClassesPerMonth(viewedDate: $viewedDate) {
    __typename
    _id
    instructors {
      _id
      name
      image
    }
    details {
      title
      description
      level {
        _id
        isEnabled
        code
        description
      }
      tags
    }
    schedule {
      date
      isAllDay
      duration
    }
    status {
      isRunning
      isPublished
      isVIPOnly
    }
    zoom {
      meetingId
      password
      joinUrl
    }
    online {
      capacity
      booked {
        _id
      }
      cancelTimeLimit
    }
    offline {
      capacity
      booked {
        _id
      }
      cancelTimeLimit
    }
  }
  specialEventsPerMonth(viewedDate: $viewedDate) {
    __typename
    _id
    instructors {
      name
    }
    details {
      title
      description
      tags
    }
    schedule {
      date
      isAllDay
      duration
    }
    status {
      isRunning
      isPublished
      isVIPOnly
    }
    zoom {
      meetingId
      password
      joinUrl
    }
    online {
      capacity
      booked {
        seat
      }
      confirmed {
        seat
      }
    }
    offline {
      capacity
      booked {
        seat
      }
      confirmed {
        seat
      }
    }
  }
  activeHolidays {
    _id
    isEnabled
    start
    end
    title
  }
}
    `;
export const SearchClassesQueryDocument = gql`
    query SearchClassesQuery($from: DateTime, $to: DateTime, $online: Boolean, $offline: Boolean, $instructors: [ObjectId]) {
  searchClassesQuery(
    from: $from
    to: $to
    online: $online
    offline: $offline
    instructors: $instructors
  ) {
    __typename
    ... on RegularClass {
      _id
      instructors {
        _id
        name
        image
      }
      details {
        title
        description
        level {
          _id
          isEnabled
          code
          description
        }
        tags
      }
      schedule {
        date
        duration
      }
      status {
        isRunning
        isPublished
        isVIPOnly
      }
      online {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cancelTimeLimit
        cost
      }
      offline {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cancelTimeLimit
        cost
      }
    }
    ... on SpecialEvent {
      _id
      instructors {
        name
      }
      details {
        title
        description
        tags
      }
      schedule {
        date
        duration
      }
      status {
        isRunning
        isPublished
        isVIPOnly
      }
      online {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cost
        bookedSeat
        confirmedSeat
        rejectedSeat
      }
      offline {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cost
        bookedSeat
        confirmedSeat
        rejectedSeat
      }
    }
  }
}
    `;
export const SearchAllClassesQueryDocument = gql`
    query SearchAllClassesQuery($from: DateTime, $to: DateTime, $online: Boolean, $offline: Boolean, $instructors: [ObjectId]) {
  searchAllClassesQuery(
    from: $from
    to: $to
    online: $online
    offline: $offline
    instructors: $instructors
  ) {
    __typename
    ... on RegularClass {
      _id
      instructors {
        _id
        name
        image
      }
      details {
        title
        description
        level {
          _id
          isEnabled
          code
          description
        }
        tags
      }
      schedule {
        date
        duration
      }
      status {
        isRunning
        isPublished
        isVIPOnly
      }
      online {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cancelTimeLimit
        cost
      }
      offline {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cancelTimeLimit
        cost
      }
    }
    ... on SpecialEvent {
      _id
      instructors {
        name
      }
      details {
        title
        description
        tags
      }
      schedule {
        date
        duration
      }
      status {
        isRunning
        isPublished
        isVIPOnly
      }
      online {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cost
        bookedSeat
        confirmedSeat
        rejectedSeat
      }
      offline {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cost
        bookedSeat
        confirmedSeat
        rejectedSeat
      }
    }
  }
}
    `;
export const SearchClassTitleAndDateDocument = gql`
    query SearchClassTitleAndDate($classTitle: String!, $date: String!) {
  searchClassTitleAndDate(classTitle: $classTitle, date: $date) {
    __typename
    ... on RegularClass {
      _id
      details {
        title
        description
        level {
          description
        }
        tags
      }
      schedule {
        date
        duration
      }
      instructors {
        name
      }
      status {
        isVIPOnly
      }
      online {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cancelTimeLimit
        cost
      }
      offline {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cancelTimeLimit
        cost
      }
    }
    ... on SpecialEvent {
      _id
      details {
        title
        description
        tags
      }
      schedule {
        date
        duration
      }
      instructors {
        name
      }
      status {
        isVIPOnly
      }
      online {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cost
        bookedSeat
        confirmedSeat
        rejectedSeat
      }
      offline {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cost
        bookedSeat
        confirmedSeat
        rejectedSeat
      }
    }
  }
}
    `;
export const ActivePaymentMethodsDocument = gql`
    query ActivePaymentMethods {
  activePaymentMethods {
    ...paymentMethodFields
  }
}
    ${PaymentMethodFieldsFragmentDoc}`;
export const ActivePaymentMethodsSpecialEventDocument = gql`
    query ActivePaymentMethodsSpecialEvent {
  activePaymentMethodsSpecialEvent {
    ...paymentMethodFields
  }
}
    ${PaymentMethodFieldsFragmentDoc}`;
export const ActivePaymentMethodsMembershipDocument = gql`
    query ActivePaymentMethodsMembership {
  activePaymentMethodsMembership {
    ...paymentMethodFields
  }
}
    ${PaymentMethodFieldsFragmentDoc}`;
export const PaymentMethodDocument = gql`
    query PaymentMethod($_id: ObjectId!) {
  paymentMethod(_id: $_id) {
    ...paymentMethodFields
  }
}
    ${PaymentMethodFieldsFragmentDoc}`;
export const PaymentMethodsDocument = gql`
    query PaymentMethods {
  paymentMethods {
    ...paymentMethodFields
  }
}
    ${PaymentMethodFieldsFragmentDoc}`;
export const AddPaymentMethodDocument = gql`
    mutation AddPaymentMethod($isEnabled: Boolean!, $isEnabledForMembership: Boolean, $isEnabledForSpecialEvent: Boolean, $requireProof: Boolean, $via: String!) {
  addPaymentMethod(
    input: {isEnabled: $isEnabled, isEnabledForMembership: $isEnabledForMembership, isEnabledForSpecialEvent: $isEnabledForSpecialEvent, requireProof: $requireProof, via: $via}
  ) {
    via
  }
}
    `;
export const EditPaymentMethodDocument = gql`
    mutation EditPaymentMethod($_id: ObjectId!, $isEnabled: Boolean, $isEnabledForMembership: Boolean, $isEnabledForSpecialEvent: Boolean, $requireProof: Boolean, $via: String) {
  editPaymentMethod(
    input: {_id: $_id, isEnabled: $isEnabled, isEnabledForMembership: $isEnabledForMembership, isEnabledForSpecialEvent: $isEnabledForSpecialEvent, requireProof: $requireProof, via: $via}
  ) {
    via
  }
}
    `;
export const DeletePaymentMethodDocument = gql`
    mutation DeletePaymentMethod($_id: ObjectId!) {
  deletePaymentMethod(_id: $_id) {
    via
  }
}
    `;
export const RegularClassDocument = gql`
    query RegularClass($_id: ObjectId!) {
  regularClass(_id: $_id) {
    __typename
    details {
      title
      description
      level {
        _id
      }
      tags
    }
    instructors {
      _id
      name
      image
    }
    schedule {
      date
      duration
      isAllDay
      rString
    }
    online {
      booked {
        _id
        bookingCode
        user {
          name
          image
        }
        status {
          value
        }
      }
      capacity
      bookingTimeLimit
      cancelTimeLimit
      cost
    }
    offline {
      booked {
        _id
        bookingCode
        user {
          name
          image
        }
        status {
          value
        }
      }
      capacity
      bookingTimeLimit
      cancelTimeLimit
      cost
    }
    status {
      isRunning
      isPublished
      isVIPOnly
    }
    zoom {
      meetingId
      password
      joinUrl
    }
  }
}
    `;
export const RegularClassesDocument = gql`
    query RegularClasses {
  regularClasses {
    _id
    instructors {
      _id
      name
      image
    }
    details {
      title
      description
      level {
        _id
        isEnabled
        code
        description
      }
      tags
    }
    schedule {
      date
      duration
    }
    status {
      isRunning
      isPublished
      isVIPOnly
    }
    online {
      capacity
      booked {
        _id
        bookingCode
      }
      bookingTimeLimit
      cancelTimeLimit
      cost
    }
    offline {
      capacity
      booked {
        _id
        bookingCode
      }
      bookingTimeLimit
      cancelTimeLimit
      cost
    }
  }
}
    `;
export const RegularClassesByInstructorsUsernameDocument = gql`
    query RegularClassesByInstructorsUsername($username: String!, $viewedDate: DateTime!) {
  regularClassesByInstructorsUsername(
    username: $username
    viewedDate: $viewedDate
  ) {
    __typename
    _id
    instructors {
      name
      image
    }
    details {
      title
    }
    schedule {
      date
      duration
      isAllDay
    }
    online {
      booked {
        _id
        user {
          name
          image
        }
      }
    }
    offline {
      booked {
        _id
        user {
          name
          image
        }
      }
    }
    status {
      isRunning
      isPublished
      isVIPOnly
    }
  }
}
    `;
export const RegularClassFormQueryDocument = gql`
    query RegularClassFormQuery {
  classTemplates {
    _id
    details {
      title
    }
  }
  levels {
    _id
    code
    description
  }
  instructors {
    _id
    name
    image
  }
}
    `;
export const AddRegularClassDocument = gql`
    mutation AddRegularClass($instructors: [ObjectId!]!, $details: ClassDetailsInput!, $online: ClassCapacityInput!, $offline: ClassCapacityInput!, $schedule: ClassScheduleInput!, $status: ClassStatusInput!, $createZoomMeeting: Boolean) {
  addRegularClass(
    input: {instructors: $instructors, details: $details, online: $online, offline: $offline, schedule: $schedule, status: $status, createZoomMeeting: $createZoomMeeting}
  )
}
    `;
export const AddZoomMeetingRegularClassDocument = gql`
    mutation AddZoomMeetingRegularClass($_id: ObjectId!) {
  addZoomMeetingRegularClass(_id: $_id) {
    _id
  }
}
    `;
export const EditSingleRegularClassDocument = gql`
    mutation EditSingleRegularClass($_id: ObjectId!, $instructors: [ObjectId!]!, $details: ClassDetailsInput!, $online: ClassCapacityInput!, $offline: ClassCapacityInput!, $schedule: ClassScheduleInput!, $status: ClassStatusInput!) {
  editSingleRegularClass(
    input: {_id: $_id, instructors: $instructors, details: $details, online: $online, offline: $offline, schedule: $schedule, status: $status}
  )
}
    `;
export const EditRecurrenceRegularClassDocument = gql`
    mutation EditRecurrenceRegularClass($_id: ObjectId!, $instructors: [ObjectId!]!, $details: ClassDetailsInput!, $online: ClassCapacityInput!, $offline: ClassCapacityInput!, $schedule: ClassScheduleInput!, $status: ClassStatusInput!) {
  editRecurrenceRegularClass(
    input: {_id: $_id, instructors: $instructors, details: $details, online: $online, offline: $offline, schedule: $schedule, status: $status}
  )
}
    `;
export const EditFollowingRegularClassDocument = gql`
    mutation EditFollowingRegularClass($input: RegularClassInput!, $originalDate: DateTime!) {
  editFollowingRegularClass(input: $input, originalDate: $originalDate)
}
    `;
export const DeleteSingleRegularClassDocument = gql`
    mutation DeleteSingleRegularClass($_id: ObjectId!, $updatedBy: ObjectId!) {
  deleteSingleRegularClass(_id: $_id, updatedBy: $updatedBy)
}
    `;
export const DeleteRecurrenceRegularClassDocument = gql`
    mutation DeleteRecurrenceRegularClass($_id: ObjectId!, $updatedBy: ObjectId!) {
  deleteRecurrenceRegularClass(_id: $_id, updatedBy: $updatedBy)
}
    `;
export const DeleteFollowingRegularClassDocument = gql`
    mutation DeleteFollowingRegularClass($_id: ObjectId!, $updatedBy: ObjectId!, $date: DateTime!) {
  deleteFollowingRegularClass(_id: $_id, updatedBy: $updatedBy, date: $date)
}
    `;
export const UpdateClassAttendanceDocument = gql`
    mutation UpdateClassAttendance($_id: ObjectId!, $updatedBy: ObjectId!, $action: String!, $reason: String) {
  updateClassAttendance(
    _id: $_id
    updatedBy: $updatedBy
    action: $action
    reason: $reason
  ) {
    _id
  }
}
    `;
export const OverallBookingReportDocument = gql`
    query OverallBookingReport {
  overallBookingReport {
    _id {
      classType
      status
    }
    count
  }
}
    `;
export const WeeklyBookingReportDocument = gql`
    query WeeklyBookingReport($bookingStatus: String!, $timeFrame: String!) {
  weeklyBookingReport(bookingStatus: $bookingStatus, timeFrame: $timeFrame) {
    _id {
      classType
      status
      week
    }
    count
    totalCost
  }
}
    `;
export const TopUserReportDocument = gql`
    query TopUserReport($bookingStatus: String!, $timeFrame: String!) {
  topUserReport(bookingStatus: $bookingStatus, timeFrame: $timeFrame) {
    _id {
      user
    }
    totalCost
  }
}
    `;
export const TopUserMembershipReportDocument = gql`
    query TopUserMembershipReport($timeFrame: String!) {
  topUserMembershipReport(timeFrame: $timeFrame) {
    _id {
      user
    }
    totalCost
  }
}
    `;
export const TopInstructorReportDocument = gql`
    query TopInstructorReport($bookingStatus: String!, $timeFrame: String!) {
  topInstructorReport(bookingStatus: $bookingStatus, timeFrame: $timeFrame) {
    _id {
      instructor
    }
    totalCost
  }
}
    `;
export const InstructorPerformanceReportDocument = gql`
    query InstructorPerformanceReport($instructorId: ObjectId!, $timeFrame: String!) {
  instructorPerformanceReport(instructorId: $instructorId, timeFrame: $timeFrame) {
    _id {
      instructor
      status
    }
    count
  }
}
    `;
export const SpecialClassReportDocument = gql`
    query SpecialClassReport($timeFrame: String!) {
  specialClassReport(timeFrame: $timeFrame) {
    _id {
      classType
      week
    }
    totalSeat
    count
  }
}
    `;
export const AllSeriesDocument = gql`
    query AllSeries {
  allSeries {
    _id
    isPublished
    title
    description
    regularClass {
      details {
        title
      }
      schedule {
        date
      }
    }
    specialEvent {
      details {
        title
      }
      schedule {
        date
      }
    }
  }
}
    `;
export const AllPublishedSeriesDocument = gql`
    query AllPublishedSeries {
  allPublishedSeries {
    _id
    isPublished
    title
    description
    regularClass {
      details {
        title
      }
      schedule {
        date
      }
    }
    specialEvent {
      details {
        title
      }
      schedule {
        date
      }
    }
  }
}
    `;
export const SeriesDocument = gql`
    query Series($_id: ObjectId!) {
  series(_id: $_id) {
    _id
    isPublished
    title
    description
    regularClass {
      __typename
      _id
      details {
        title
      }
      schedule {
        date
      }
      instructors {
        name
      }
    }
    specialEvent {
      __typename
      _id
      details {
        title
      }
      schedule {
        date
      }
      instructors {
        name
      }
    }
  }
}
    `;
export const SeriesTitleDocument = gql`
    query SeriesTitle($title: String!) {
  seriesTitle(title: $title) {
    _id
    isPublished
    title
    description
    regularClass {
      __typename
      _id
      details {
        title
        description
        level {
          description
        }
        tags
      }
      schedule {
        date
        duration
        isAllDay
      }
      instructors {
        name
      }
      status {
        isVIPOnly
      }
      online {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cancelTimeLimit
        cost
      }
      offline {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cancelTimeLimit
        cost
      }
    }
    specialEvent {
      __typename
      _id
      details {
        title
        description
        tags
      }
      schedule {
        date
        duration
        isAllDay
      }
      instructors {
        name
      }
      status {
        isVIPOnly
      }
      online {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cost
        bookedSeat
        confirmedSeat
        rejectedSeat
      }
      offline {
        availability
        capacity
        booked {
          _id
        }
        bookingTimeLimit
        cost
        bookedSeat
        confirmedSeat
        rejectedSeat
      }
    }
  }
}
    `;
export const IsSeriesTitleExistDocument = gql`
    query IsSeriesTitleExist($title: String!) {
  isSeriesTitleExist(title: $title)
}
    `;
export const AddSeriesDocument = gql`
    mutation AddSeries($isPublished: Boolean!, $title: String!, $description: String, $regularClass: [ObjectId]!, $specialEvent: [ObjectId]!) {
  addSeries(
    input: {isPublished: $isPublished, title: $title, description: $description, regularClass: $regularClass, specialEvent: $specialEvent}
  ) {
    _id
  }
}
    `;
export const EditSeriesDocument = gql`
    mutation EditSeries($_id: ObjectId!, $isPublished: Boolean!, $title: String!, $description: String, $regularClass: [ObjectId]!, $specialEvent: [ObjectId]!) {
  editSeries(
    input: {_id: $_id, isPublished: $isPublished, title: $title, description: $description, regularClass: $regularClass, specialEvent: $specialEvent}
  ) {
    _id
  }
}
    `;
export const DeleteSeriesDocument = gql`
    mutation DeleteSeries($_id: ObjectId!) {
  deleteSeries(_id: $_id) {
    _id
  }
}
    `;
export const ClassTemplatesDocument = gql`
    query ClassTemplates {
  classTemplates {
    __typename
    _id
    instructors {
      _id
      name
      image
    }
    details {
      title
      description
      level {
        _id
        description
      }
      tags
    }
    online {
      capacity
      bookingTimeLimit
      cancelTimeLimit
      cost
    }
    offline {
      capacity
      bookingTimeLimit
      cancelTimeLimit
      cost
    }
    schedule {
      day
      startTime
      duration
    }
  }
}
    `;
export const ClassTemplateDocument = gql`
    query ClassTemplate($_id: ObjectId!) {
  classTemplate(_id: $_id) {
    __typename
    _id
    instructors {
      _id
      name
      image
    }
    details {
      title
      description
      level {
        _id
        description
      }
      tags
    }
    online {
      capacity
      bookingTimeLimit
      cancelTimeLimit
      cost
    }
    offline {
      capacity
      bookingTimeLimit
      cancelTimeLimit
      cost
    }
    schedule {
      day
      startTime
      duration
    }
  }
}
    `;
export const ClassTemplatePriceListDocument = gql`
    query ClassTemplatePriceList($title: String!) {
  classTemplatePriceList(title: $title) {
    __typename
    _id
    instructors {
      _id
      name
      image
    }
    details {
      title
      description
      level {
        _id
        description
      }
      tags
    }
    online {
      capacity
      bookingTimeLimit
      cancelTimeLimit
      cost
    }
    offline {
      capacity
      bookingTimeLimit
      cancelTimeLimit
      cost
    }
    schedule {
      day
      startTime
      duration
    }
  }
}
    `;
export const AddTemplateDocument = gql`
    mutation AddTemplate($instructors: [ObjectId], $details: ClassTemplateDetailsInput!, $online: ClassTemplateCapacityInput!, $offline: ClassTemplateCapacityInput!, $schedule: ClassTemplateScheduleInput!) {
  addTemplate(
    input: {instructors: $instructors, details: $details, online: $online, offline: $offline, schedule: $schedule}
  ) {
    details {
      title
    }
  }
}
    `;
export const EditTemplateDocument = gql`
    mutation EditTemplate($_id: ObjectId!, $instructors: [ObjectId], $details: ClassTemplateDetailsInput!, $online: ClassTemplateCapacityInput!, $offline: ClassTemplateCapacityInput!, $schedule: ClassTemplateScheduleInput!) {
  editTemplate(
    input: {_id: $_id, instructors: $instructors, details: $details, online: $online, offline: $offline, schedule: $schedule}
  ) {
    details {
      title
    }
  }
}
    `;
export const DeleteTemplateDocument = gql`
    mutation DeleteTemplate($_id: ObjectId!) {
  deleteTemplate(_id: $_id) {
    details {
      title
    }
  }
}
    `;
export const IsUsernameAvailableDocument = gql`
    query IsUsernameAvailable($username: String!) {
  isUsernameAvailable(username: $username)
}
    `;
export const InstructorsDocument = gql`
    query Instructors {
  instructors {
    _id
    name
    image
    username
  }
}
    `;
export const AdminsDocument = gql`
    query Admins {
  admins {
    _id
    name
    username
  }
}
    `;
export const UserDocument = gql`
    query User($_id: ObjectId!) {
  user(_id: $_id) {
    _id
    name
    username
    image
    email
    phone
    role {
      isInstructor
      isAdmin
    }
    access {
      register {
        date
      }
      approval {
        isApproved
        date
      }
      ban {
        isBanned
        date
        reason
      }
    }
    membership {
      isVIP
      latest {
        _id
      }
    }
  }
}
    `;
export const UsersDocument = gql`
    query Users {
  users {
    _id
    name
    username
    image
    email
    phone
    role {
      isInstructor
      isAdmin
    }
    access {
      register {
        date
      }
      approval {
        isApproved
        date
        by {
          name
        }
      }
      ban {
        isBanned
        date
        by {
          name
        }
        reason
      }
    }
    membership {
      isVIP
      latest {
        _id
        note
        balance {
          available
        }
      }
    }
  }
}
    `;
export const EditUserDocument = gql`
    mutation EditUser($_id: ObjectId!, $username: String!, $name: String!, $phone: String!, $image: String) {
  editUser(
    input: {_id: $_id, username: $username, name: $name, phone: $phone, image: $image}
  ) {
    _id
    name
    username
  }
}
    `;
export const EditUserRoleAndAccessDocument = gql`
    mutation EditUserRoleAndAccess($_id: ObjectId!, $updaterId: ObjectId!, $role: UserRoleInput!, $access: UserAccessInput!, $isVIP: Boolean!) {
  editUserRoleAndAccess(
    _id: $_id
    updaterId: $updaterId
    role: $role
    access: $access
    isVIP: $isVIP
  ) {
    _id
    name
  }
}
    `;
export const UploadProfileImageDocument = gql`
    mutation UploadProfileImage($_id: ObjectId!, $image: Upload!) {
  uploadProfileImage(_id: $_id, image: $image)
}
    `;
export const DeleteProfileImageDocument = gql`
    mutation DeleteProfileImage($_id: ObjectId!) {
  deleteProfileImage(_id: $_id)
}
    `;
export const CleanUpUserDataDocument = gql`
    mutation CleanUpUserData($_id: ObjectId!) {
  cleanUpUserData(_id: $_id)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Announcements(variables?: AnnouncementsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AnnouncementsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AnnouncementsQuery>(AnnouncementsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Announcements', 'query');
    },
    ActiveAnnouncements(variables?: ActiveAnnouncementsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ActiveAnnouncementsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActiveAnnouncementsQuery>(ActiveAnnouncementsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ActiveAnnouncements', 'query');
    },
    ActivePrivateAnnouncements(variables?: ActivePrivateAnnouncementsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ActivePrivateAnnouncementsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActivePrivateAnnouncementsQuery>(ActivePrivateAnnouncementsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ActivePrivateAnnouncements', 'query');
    },
    ActivePublicAnnouncements(variables?: ActivePublicAnnouncementsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ActivePublicAnnouncementsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActivePublicAnnouncementsQuery>(ActivePublicAnnouncementsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ActivePublicAnnouncements', 'query');
    },
    AddAnnouncement(variables: AddAnnouncementMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddAnnouncementMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddAnnouncementMutation>(AddAnnouncementDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddAnnouncement', 'mutation');
    },
    EditAnnouncement(variables: EditAnnouncementMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditAnnouncementMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditAnnouncementMutation>(EditAnnouncementDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditAnnouncement', 'mutation');
    },
    DeleteAnnouncement(variables: DeleteAnnouncementMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteAnnouncementMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteAnnouncementMutation>(DeleteAnnouncementDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteAnnouncement', 'mutation');
    },
    BookingCards(variables?: BookingCardsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<BookingCardsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BookingCardsQuery>(BookingCardsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'BookingCards', 'query');
    },
    ActiveBookings(variables: ActiveBookingsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ActiveBookingsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActiveBookingsQuery>(ActiveBookingsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ActiveBookings', 'query');
    },
    BookingCardsUser(variables: BookingCardsUserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<BookingCardsUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BookingCardsUserQuery>(BookingCardsUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'BookingCardsUser', 'query');
    },
    AddBookingCard(variables: AddBookingCardMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddBookingCardMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddBookingCardMutation>(AddBookingCardDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddBookingCard', 'mutation');
    },
    CancelBookingCard(variables: CancelBookingCardMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CancelBookingCardMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CancelBookingCardMutation>(CancelBookingCardDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CancelBookingCard', 'mutation');
    },
    SpecialEvents(variables?: SpecialEventsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SpecialEventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SpecialEventsQuery>(SpecialEventsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SpecialEvents', 'query');
    },
    SpecialEvent(variables: SpecialEventQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SpecialEventQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SpecialEventQuery>(SpecialEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SpecialEvent', 'query');
    },
    AddZoomMeetingSpecialEvent(variables: AddZoomMeetingSpecialEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddZoomMeetingSpecialEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddZoomMeetingSpecialEventMutation>(AddZoomMeetingSpecialEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddZoomMeetingSpecialEvent', 'mutation');
    },
    AddSpecialEvent(variables: AddSpecialEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddSpecialEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddSpecialEventMutation>(AddSpecialEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddSpecialEvent', 'mutation');
    },
    EditSingleSpecialEvent(variables: EditSingleSpecialEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditSingleSpecialEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditSingleSpecialEventMutation>(EditSingleSpecialEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditSingleSpecialEvent', 'mutation');
    },
    EditRecurrenceSpecialEvent(variables: EditRecurrenceSpecialEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditRecurrenceSpecialEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditRecurrenceSpecialEventMutation>(EditRecurrenceSpecialEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditRecurrenceSpecialEvent', 'mutation');
    },
    EditFollowingSpecialEvent(variables: EditFollowingSpecialEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditFollowingSpecialEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditFollowingSpecialEventMutation>(EditFollowingSpecialEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditFollowingSpecialEvent', 'mutation');
    },
    DeleteSingleSpecialEvent(variables: DeleteSingleSpecialEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteSingleSpecialEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteSingleSpecialEventMutation>(DeleteSingleSpecialEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteSingleSpecialEvent', 'mutation');
    },
    DeleteRecurrenceSpecialEvent(variables: DeleteRecurrenceSpecialEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteRecurrenceSpecialEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteRecurrenceSpecialEventMutation>(DeleteRecurrenceSpecialEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteRecurrenceSpecialEvent', 'mutation');
    },
    DeleteFollowingSpecialEvent(variables: DeleteFollowingSpecialEventMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteFollowingSpecialEventMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteFollowingSpecialEventMutation>(DeleteFollowingSpecialEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteFollowingSpecialEvent', 'mutation');
    },
    UpdateSpecialEventStatus(variables: UpdateSpecialEventStatusMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateSpecialEventStatusMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateSpecialEventStatusMutation>(UpdateSpecialEventStatusDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateSpecialEventStatus', 'mutation');
    },
    DeleteSpecialEventStatus(variables: DeleteSpecialEventStatusMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteSpecialEventStatusMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteSpecialEventStatusMutation>(DeleteSpecialEventStatusDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteSpecialEventStatus', 'mutation');
    },
    EventBookingCards(variables?: EventBookingCardsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EventBookingCardsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<EventBookingCardsQuery>(EventBookingCardsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EventBookingCards', 'query');
    },
    EventBookingCard(variables: EventBookingCardQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EventBookingCardQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<EventBookingCardQuery>(EventBookingCardDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EventBookingCard', 'query');
    },
    SelectedEventBookingCards(variables: SelectedEventBookingCardsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SelectedEventBookingCardsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SelectedEventBookingCardsQuery>(SelectedEventBookingCardsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SelectedEventBookingCards', 'query');
    },
    AddEventBookingCard(variables: AddEventBookingCardMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddEventBookingCardMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddEventBookingCardMutation>(AddEventBookingCardDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddEventBookingCard', 'mutation');
    },
    UpdateEventBookingRequestStatus(variables: UpdateEventBookingRequestStatusMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateEventBookingRequestStatusMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateEventBookingRequestStatusMutation>(UpdateEventBookingRequestStatusDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateEventBookingRequestStatus', 'mutation');
    },
    DeleteEventBookingPaymentImage(variables: DeleteEventBookingPaymentImageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteEventBookingPaymentImageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteEventBookingPaymentImageMutation>(DeleteEventBookingPaymentImageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteEventBookingPaymentImage', 'mutation');
    },
    UpdateSpecialEventBookingParticipants(variables: UpdateSpecialEventBookingParticipantsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateSpecialEventBookingParticipantsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateSpecialEventBookingParticipantsMutation>(UpdateSpecialEventBookingParticipantsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateSpecialEventBookingParticipants', 'mutation');
    },
    FeatureSeries(variables?: FeatureSeriesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FeatureSeriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FeatureSeriesQuery>(FeatureSeriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'FeatureSeries', 'query');
    },
    FeatureTemplate(variables?: FeatureTemplateQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FeatureTemplateQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FeatureTemplateQuery>(FeatureTemplateDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'FeatureTemplate', 'query');
    },
    FeatureAnalytics(variables?: FeatureAnalyticsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FeatureAnalyticsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FeatureAnalyticsQuery>(FeatureAnalyticsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'FeatureAnalytics', 'query');
    },
    FeatureAutoApproveMembership(variables?: FeatureAutoApproveMembershipQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FeatureAutoApproveMembershipQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FeatureAutoApproveMembershipQuery>(FeatureAutoApproveMembershipDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'FeatureAutoApproveMembership', 'query');
    },
    FeaturePageQuery(variables?: FeaturePageQueryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FeaturePageQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FeaturePageQueryQuery>(FeaturePageQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'FeaturePageQuery', 'query');
    },
    ToggleFeature(variables: ToggleFeatureMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ToggleFeatureMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ToggleFeatureMutation>(ToggleFeatureDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ToggleFeature', 'mutation');
    },
    SetAutoApproverAdmin(variables: SetAutoApproverAdminMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SetAutoApproverAdminMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SetAutoApproverAdminMutation>(SetAutoApproverAdminDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SetAutoApproverAdmin', 'mutation');
    },
    ListMembershipBucketObjects(variables: ListMembershipBucketObjectsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ListMembershipBucketObjectsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListMembershipBucketObjectsQuery>(ListMembershipBucketObjectsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ListMembershipBucketObjects', 'query');
    },
    ListEventBucketObjects(variables: ListEventBucketObjectsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ListEventBucketObjectsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListEventBucketObjectsQuery>(ListEventBucketObjectsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ListEventBucketObjects', 'query');
    },
    DeleteUnusedImages(variables: DeleteUnusedImagesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteUnusedImagesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteUnusedImagesMutation>(DeleteUnusedImagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteUnusedImages', 'mutation');
    },
    Holidays(variables?: HolidaysQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<HolidaysQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HolidaysQuery>(HolidaysDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Holidays', 'query');
    },
    ActiveHolidays(variables?: ActiveHolidaysQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ActiveHolidaysQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActiveHolidaysQuery>(ActiveHolidaysDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ActiveHolidays', 'query');
    },
    AddHoliday(variables: AddHolidayMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddHolidayMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddHolidayMutation>(AddHolidayDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddHoliday', 'mutation');
    },
    EditHoliday(variables: EditHolidayMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditHolidayMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditHolidayMutation>(EditHolidayDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditHoliday', 'mutation');
    },
    DeleteHoliday(variables: DeleteHolidayMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteHolidayMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteHolidayMutation>(DeleteHolidayDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteHoliday', 'mutation');
    },
    ActiveLevels(variables?: ActiveLevelsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ActiveLevelsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActiveLevelsQuery>(ActiveLevelsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ActiveLevels', 'query');
    },
    Levels(variables?: LevelsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LevelsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LevelsQuery>(LevelsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Levels', 'query');
    },
    Level(variables: LevelQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LevelQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LevelQuery>(LevelDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Level', 'query');
    },
    AddLevel(variables: AddLevelMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddLevelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddLevelMutation>(AddLevelDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddLevel', 'mutation');
    },
    EditLevel(variables: EditLevelMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditLevelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditLevelMutation>(EditLevelDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditLevel', 'mutation');
    },
    DeleteLevel(variables: DeleteLevelMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteLevelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteLevelMutation>(DeleteLevelDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteLevel', 'mutation');
    },
    GetAllLogs(variables?: GetAllLogsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAllLogsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllLogsQuery>(GetAllLogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetAllLogs', 'query');
    },
    Memberships(variables?: MembershipsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MembershipsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MembershipsQuery>(MembershipsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Memberships', 'query');
    },
    MembershipsByUser(variables: MembershipsByUserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MembershipsByUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MembershipsByUserQuery>(MembershipsByUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MembershipsByUser', 'query');
    },
    Membership(variables: MembershipQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MembershipQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MembershipQuery>(MembershipDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Membership', 'query');
    },
    MarkThisMembershipAsInvalid(variables: MarkThisMembershipAsInvalidMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MarkThisMembershipAsInvalidMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<MarkThisMembershipAsInvalidMutation>(MarkThisMembershipAsInvalidDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MarkThisMembershipAsInvalid', 'mutation');
    },
    MarkThisAndFollowingMembershipAsInvalid(variables: MarkThisAndFollowingMembershipAsInvalidMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MarkThisAndFollowingMembershipAsInvalidMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<MarkThisAndFollowingMembershipAsInvalidMutation>(MarkThisAndFollowingMembershipAsInvalidDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MarkThisAndFollowingMembershipAsInvalid', 'mutation');
    },
    AddMembership(variables: AddMembershipMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddMembershipMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddMembershipMutation>(AddMembershipDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddMembership', 'mutation');
    },
    EditMembership(variables: EditMembershipMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditMembershipMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditMembershipMutation>(EditMembershipDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditMembership', 'mutation');
    },
    DeleteMembership(variables: DeleteMembershipMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteMembershipMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteMembershipMutation>(DeleteMembershipDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteMembership', 'mutation');
    },
    DeleteProofOfPayment(variables: DeleteProofOfPaymentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteProofOfPaymentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteProofOfPaymentMutation>(DeleteProofOfPaymentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteProofOfPayment', 'mutation');
    },
    ActiveMembershipPackage(variables?: ActiveMembershipPackageQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ActiveMembershipPackageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActiveMembershipPackageQuery>(ActiveMembershipPackageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ActiveMembershipPackage', 'query');
    },
    MembershipPackages(variables?: MembershipPackagesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MembershipPackagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MembershipPackagesQuery>(MembershipPackagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MembershipPackages', 'query');
    },
    AddMembershipPackage(variables: AddMembershipPackageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddMembershipPackageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddMembershipPackageMutation>(AddMembershipPackageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddMembershipPackage', 'mutation');
    },
    EditMembershipPackage(variables: EditMembershipPackageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditMembershipPackageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditMembershipPackageMutation>(EditMembershipPackageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditMembershipPackage', 'mutation');
    },
    DeleteMembershipPackage(variables: DeleteMembershipPackageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteMembershipPackageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteMembershipPackageMutation>(DeleteMembershipPackageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteMembershipPackage', 'mutation');
    },
    GetMessagesForUser(variables: GetMessagesForUserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetMessagesForUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMessagesForUserQuery>(GetMessagesForUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetMessagesForUser', 'query');
    },
    GetMessage(variables: GetMessageQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetMessageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMessageQuery>(GetMessageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetMessage', 'query');
    },
    MarkAllMessagesAsReadForUser(variables: MarkAllMessagesAsReadForUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MarkAllMessagesAsReadForUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<MarkAllMessagesAsReadForUserMutation>(MarkAllMessagesAsReadForUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MarkAllMessagesAsReadForUser', 'mutation');
    },
    DeleteAllReadMessagesForUser(variables: DeleteAllReadMessagesForUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteAllReadMessagesForUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteAllReadMessagesForUserMutation>(DeleteAllReadMessagesForUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteAllReadMessagesForUser', 'mutation');
    },
    BookingPageData(variables?: BookingPageDataQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<BookingPageDataQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BookingPageDataQuery>(BookingPageDataDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'BookingPageData', 'query');
    },
    MyBookingSectionQuery(variables: MyBookingSectionQueryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MyBookingSectionQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MyBookingSectionQueryQuery>(MyBookingSectionQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MyBookingSectionQuery', 'query');
    },
    MembershipSectionQuery(variables: MembershipSectionQueryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MembershipSectionQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MembershipSectionQueryQuery>(MembershipSectionQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MembershipSectionQuery', 'query');
    },
    TeachingScheduleQuery(variables: TeachingScheduleQueryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TeachingScheduleQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TeachingScheduleQueryQuery>(TeachingScheduleQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'TeachingScheduleQuery', 'query');
    },
    MembershipFormData(variables?: MembershipFormDataQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MembershipFormDataQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MembershipFormDataQuery>(MembershipFormDataDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MembershipFormData', 'query');
    },
    SpecialEventBookingData(variables?: SpecialEventBookingDataQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SpecialEventBookingDataQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SpecialEventBookingDataQuery>(SpecialEventBookingDataDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SpecialEventBookingData', 'query');
    },
    SchedulePageData(variables: SchedulePageDataQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SchedulePageDataQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SchedulePageDataQuery>(SchedulePageDataDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SchedulePageData', 'query');
    },
    SearchClassesQuery(variables?: SearchClassesQueryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchClassesQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchClassesQueryQuery>(SearchClassesQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SearchClassesQuery', 'query');
    },
    SearchAllClassesQuery(variables?: SearchAllClassesQueryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchAllClassesQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchAllClassesQueryQuery>(SearchAllClassesQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SearchAllClassesQuery', 'query');
    },
    SearchClassTitleAndDate(variables: SearchClassTitleAndDateQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchClassTitleAndDateQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchClassTitleAndDateQuery>(SearchClassTitleAndDateDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SearchClassTitleAndDate', 'query');
    },
    ActivePaymentMethods(variables?: ActivePaymentMethodsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ActivePaymentMethodsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActivePaymentMethodsQuery>(ActivePaymentMethodsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ActivePaymentMethods', 'query');
    },
    ActivePaymentMethodsSpecialEvent(variables?: ActivePaymentMethodsSpecialEventQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ActivePaymentMethodsSpecialEventQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActivePaymentMethodsSpecialEventQuery>(ActivePaymentMethodsSpecialEventDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ActivePaymentMethodsSpecialEvent', 'query');
    },
    ActivePaymentMethodsMembership(variables?: ActivePaymentMethodsMembershipQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ActivePaymentMethodsMembershipQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActivePaymentMethodsMembershipQuery>(ActivePaymentMethodsMembershipDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ActivePaymentMethodsMembership', 'query');
    },
    PaymentMethod(variables: PaymentMethodQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PaymentMethodQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PaymentMethodQuery>(PaymentMethodDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'PaymentMethod', 'query');
    },
    PaymentMethods(variables?: PaymentMethodsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PaymentMethodsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PaymentMethodsQuery>(PaymentMethodsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'PaymentMethods', 'query');
    },
    AddPaymentMethod(variables: AddPaymentMethodMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddPaymentMethodMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddPaymentMethodMutation>(AddPaymentMethodDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddPaymentMethod', 'mutation');
    },
    EditPaymentMethod(variables: EditPaymentMethodMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditPaymentMethodMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditPaymentMethodMutation>(EditPaymentMethodDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditPaymentMethod', 'mutation');
    },
    DeletePaymentMethod(variables: DeletePaymentMethodMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeletePaymentMethodMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletePaymentMethodMutation>(DeletePaymentMethodDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeletePaymentMethod', 'mutation');
    },
    RegularClass(variables: RegularClassQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RegularClassQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegularClassQuery>(RegularClassDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RegularClass', 'query');
    },
    RegularClasses(variables?: RegularClassesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RegularClassesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegularClassesQuery>(RegularClassesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RegularClasses', 'query');
    },
    RegularClassesByInstructorsUsername(variables: RegularClassesByInstructorsUsernameQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RegularClassesByInstructorsUsernameQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegularClassesByInstructorsUsernameQuery>(RegularClassesByInstructorsUsernameDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RegularClassesByInstructorsUsername', 'query');
    },
    RegularClassFormQuery(variables?: RegularClassFormQueryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RegularClassFormQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegularClassFormQueryQuery>(RegularClassFormQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RegularClassFormQuery', 'query');
    },
    AddRegularClass(variables: AddRegularClassMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddRegularClassMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddRegularClassMutation>(AddRegularClassDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddRegularClass', 'mutation');
    },
    AddZoomMeetingRegularClass(variables: AddZoomMeetingRegularClassMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddZoomMeetingRegularClassMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddZoomMeetingRegularClassMutation>(AddZoomMeetingRegularClassDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddZoomMeetingRegularClass', 'mutation');
    },
    EditSingleRegularClass(variables: EditSingleRegularClassMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditSingleRegularClassMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditSingleRegularClassMutation>(EditSingleRegularClassDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditSingleRegularClass', 'mutation');
    },
    EditRecurrenceRegularClass(variables: EditRecurrenceRegularClassMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditRecurrenceRegularClassMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditRecurrenceRegularClassMutation>(EditRecurrenceRegularClassDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditRecurrenceRegularClass', 'mutation');
    },
    EditFollowingRegularClass(variables: EditFollowingRegularClassMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditFollowingRegularClassMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditFollowingRegularClassMutation>(EditFollowingRegularClassDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditFollowingRegularClass', 'mutation');
    },
    DeleteSingleRegularClass(variables: DeleteSingleRegularClassMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteSingleRegularClassMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteSingleRegularClassMutation>(DeleteSingleRegularClassDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteSingleRegularClass', 'mutation');
    },
    DeleteRecurrenceRegularClass(variables: DeleteRecurrenceRegularClassMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteRecurrenceRegularClassMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteRecurrenceRegularClassMutation>(DeleteRecurrenceRegularClassDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteRecurrenceRegularClass', 'mutation');
    },
    DeleteFollowingRegularClass(variables: DeleteFollowingRegularClassMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteFollowingRegularClassMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteFollowingRegularClassMutation>(DeleteFollowingRegularClassDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteFollowingRegularClass', 'mutation');
    },
    UpdateClassAttendance(variables: UpdateClassAttendanceMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateClassAttendanceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateClassAttendanceMutation>(UpdateClassAttendanceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateClassAttendance', 'mutation');
    },
    OverallBookingReport(variables?: OverallBookingReportQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OverallBookingReportQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OverallBookingReportQuery>(OverallBookingReportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'OverallBookingReport', 'query');
    },
    WeeklyBookingReport(variables: WeeklyBookingReportQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<WeeklyBookingReportQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WeeklyBookingReportQuery>(WeeklyBookingReportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'WeeklyBookingReport', 'query');
    },
    TopUserReport(variables: TopUserReportQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TopUserReportQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TopUserReportQuery>(TopUserReportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'TopUserReport', 'query');
    },
    TopUserMembershipReport(variables: TopUserMembershipReportQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TopUserMembershipReportQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TopUserMembershipReportQuery>(TopUserMembershipReportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'TopUserMembershipReport', 'query');
    },
    TopInstructorReport(variables: TopInstructorReportQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TopInstructorReportQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TopInstructorReportQuery>(TopInstructorReportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'TopInstructorReport', 'query');
    },
    InstructorPerformanceReport(variables: InstructorPerformanceReportQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InstructorPerformanceReportQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<InstructorPerformanceReportQuery>(InstructorPerformanceReportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'InstructorPerformanceReport', 'query');
    },
    SpecialClassReport(variables: SpecialClassReportQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SpecialClassReportQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SpecialClassReportQuery>(SpecialClassReportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SpecialClassReport', 'query');
    },
    AllSeries(variables?: AllSeriesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AllSeriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllSeriesQuery>(AllSeriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AllSeries', 'query');
    },
    AllPublishedSeries(variables?: AllPublishedSeriesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AllPublishedSeriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllPublishedSeriesQuery>(AllPublishedSeriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AllPublishedSeries', 'query');
    },
    Series(variables: SeriesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SeriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SeriesQuery>(SeriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Series', 'query');
    },
    SeriesTitle(variables: SeriesTitleQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SeriesTitleQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SeriesTitleQuery>(SeriesTitleDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SeriesTitle', 'query');
    },
    IsSeriesTitleExist(variables: IsSeriesTitleExistQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<IsSeriesTitleExistQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<IsSeriesTitleExistQuery>(IsSeriesTitleExistDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'IsSeriesTitleExist', 'query');
    },
    AddSeries(variables: AddSeriesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddSeriesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddSeriesMutation>(AddSeriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddSeries', 'mutation');
    },
    EditSeries(variables: EditSeriesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditSeriesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditSeriesMutation>(EditSeriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditSeries', 'mutation');
    },
    DeleteSeries(variables: DeleteSeriesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteSeriesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteSeriesMutation>(DeleteSeriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteSeries', 'mutation');
    },
    ClassTemplates(variables?: ClassTemplatesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ClassTemplatesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ClassTemplatesQuery>(ClassTemplatesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ClassTemplates', 'query');
    },
    ClassTemplate(variables: ClassTemplateQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ClassTemplateQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ClassTemplateQuery>(ClassTemplateDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ClassTemplate', 'query');
    },
    ClassTemplatePriceList(variables: ClassTemplatePriceListQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ClassTemplatePriceListQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ClassTemplatePriceListQuery>(ClassTemplatePriceListDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ClassTemplatePriceList', 'query');
    },
    AddTemplate(variables: AddTemplateMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddTemplateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddTemplateMutation>(AddTemplateDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddTemplate', 'mutation');
    },
    EditTemplate(variables: EditTemplateMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditTemplateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditTemplateMutation>(EditTemplateDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditTemplate', 'mutation');
    },
    DeleteTemplate(variables: DeleteTemplateMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteTemplateMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteTemplateMutation>(DeleteTemplateDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteTemplate', 'mutation');
    },
    IsUsernameAvailable(variables: IsUsernameAvailableQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<IsUsernameAvailableQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<IsUsernameAvailableQuery>(IsUsernameAvailableDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'IsUsernameAvailable', 'query');
    },
    Instructors(variables?: InstructorsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InstructorsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<InstructorsQuery>(InstructorsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Instructors', 'query');
    },
    Admins(variables?: AdminsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AdminsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AdminsQuery>(AdminsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Admins', 'query');
    },
    User(variables: UserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserQuery>(UserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'User', 'query');
    },
    Users(variables?: UsersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UsersQuery>(UsersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Users', 'query');
    },
    EditUser(variables: EditUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditUserMutation>(EditUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditUser', 'mutation');
    },
    EditUserRoleAndAccess(variables: EditUserRoleAndAccessMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditUserRoleAndAccessMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditUserRoleAndAccessMutation>(EditUserRoleAndAccessDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditUserRoleAndAccess', 'mutation');
    },
    UploadProfileImage(variables: UploadProfileImageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UploadProfileImageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UploadProfileImageMutation>(UploadProfileImageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UploadProfileImage', 'mutation');
    },
    DeleteProfileImage(variables: DeleteProfileImageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteProfileImageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteProfileImageMutation>(DeleteProfileImageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteProfileImage', 'mutation');
    },
    CleanUpUserData(variables: CleanUpUserDataMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CleanUpUserDataMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CleanUpUserDataMutation>(CleanUpUserDataDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CleanUpUserData', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;