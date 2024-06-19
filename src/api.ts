import { GraphQLClient } from "graphql-request";
import { QueryClient } from "react-query";

import { getSdk } from "src/generated/graphql";

export const gqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_BACKEND_GRAPHQL
);
/**
 * This header is required for uploading file
 */
gqlClient.setHeader("Apollo-Require-Preflight", "true");

type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;

const clientWrapper: SdkFunctionWrapper = async <T>(
  action: () => Promise<T>
): Promise<T> => {
  const result = await action();
  return result;
};

export const {
  Announcements,
  ActiveAnnouncements,
  ActivePrivateAnnouncements,
  ActivePublicAnnouncements,
  AddAnnouncement,
  EditAnnouncement,
  DeleteAnnouncement,

  Levels,
  ActiveLevels,
  AddLevel,
  EditLevel,
  DeleteLevel,

  Holidays,
  ActiveHolidays,
  AddHoliday,
  EditHoliday,
  DeleteHoliday,

  ActivePaymentMethods,
  ActivePaymentMethodsSpecialEvent,
  ActivePaymentMethodsMembership,
  PaymentMethods,
  PaymentMethod,
  AddPaymentMethod,
  EditPaymentMethod,
  DeletePaymentMethod,

  MembershipPackages,
  AddMembershipPackage,
  EditMembershipPackage,
  DeleteMembershipPackage,

  FeaturePageQuery,
  FeatureTemplate,
  FeatureSeries,
  FeatureAnalytics,
  FeatureAutoApproveMembership,
  MembershipFormData,
  MyBookingSectionQuery,
  MembershipSectionQuery,
  TeachingScheduleQuery,
  SchedulePageData,
  SearchClassesQuery,
  SearchAllClassesQuery,
  SpecialEventBookingData,

  ToggleFeature,
  SetAutoApproverAdmin,
  CleanUpUserData,

  Membership,
  Memberships,
  MembershipsByUser,
  MarkThisMembershipAsInvalid,
  MarkThisAndFollowingMembershipAsInvalid,
  AddMembership,
  EditMembership,
  DeleteMembership,
  DeleteProofOfPayment,

  RegularClass,
  RegularClasses,
  RegularClassesByInstructorsUsername,
  RegularClassFormQuery,
  AddRegularClass,
  AddZoomMeetingRegularClass,
  EditFollowingRegularClass,
  EditRecurrenceRegularClass,
  EditSingleRegularClass,
  UpdateClassAttendance,
  SearchClassTitleAndDate,
  DeleteFollowingRegularClass,
  DeleteRecurrenceRegularClass,
  DeleteSingleRegularClass,

  SpecialEvents,
  SpecialEvent,
  AddZoomMeetingSpecialEvent,
  AddSpecialEvent,
  EditSingleSpecialEvent,
  EditRecurrenceSpecialEvent,
  EditFollowingSpecialEvent,
  DeleteSingleSpecialEvent,
  DeleteRecurrenceSpecialEvent,
  DeleteFollowingSpecialEvent,

  SelectedEventBookingCards,
  EventBookingCard,
  EventBookingCards,

  AddEventBookingCard,
  DeleteEventBookingPaymentImage,
  UpdateEventBookingRequestStatus,
  UpdateSpecialEventStatus,
  DeleteSpecialEventStatus,
  UpdateSpecialEventBookingParticipants,

  User,
  Users,
  Admins,
  Instructors,
  EditUser,
  EditUserRoleAndAccess,
  IsUsernameAvailable,
  UploadProfileImage,
  DeleteProfileImage,

  ClassTemplates,
  ClassTemplate,
  ClassTemplatePriceList,
  AddTemplate,
  EditTemplate,
  DeleteTemplate,

  BookingCards,
  BookingCardsUser,
  AddBookingCard,
  CancelBookingCard,

  AllSeries,
  AllPublishedSeries,
  Series,
  SeriesTitle,
  AddSeries,
  EditSeries,
  DeleteSeries,
  IsSeriesTitleExist,

  OverallBookingReport,
  WeeklyBookingReport,
  TopUserReport,
  TopUserMembershipReport,
  TopInstructorReport,
  InstructorPerformanceReport,
  SpecialClassReport,

  ListMembershipBucketObjects,
  ListEventBucketObjects,
  DeleteUnusedImages,

  GetMessagesForUser,
  GetMessage,
  MarkAllMessagesAsReadForUser,
  DeleteAllReadMessagesForUser,

  GetAllLogs,
} = getSdk(gqlClient, clientWrapper);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});
