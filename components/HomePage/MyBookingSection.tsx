import { sortMixedBookingAsc } from "@/utils/sort";
import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import { TabPanel, TabView } from "primereact/tabview";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CancelBookingCard, MyBookingSectionQuery } from "src/api";
import { BookingCard as BookingCardType } from "src/generated/graphql";
import BookingCard from "../BookingCard";

type BookingStatusValue =
  | "Scheduled"
  | "Confirmed"
  | "Booking Cancelled"
  | "Class Cancelled";

const filterBookingData = (
  bookingCards: Array<
    BookingCardType & { status: { value: BookingStatusValue } }
  >
) => {
  const scheduledBookings = (bookingCards || []).filter(
    (bookingCard) => bookingCard.status.value === "Scheduled"
  );

  const confirmedBookings = (bookingCards || []).filter(
    (bookingCard) => bookingCard.status.value === "Confirmed"
  );

  const cancelledBookings = (bookingCards || []).filter(
    (bookingCard) =>
      bookingCard.status.value === "Booking Cancelled" ||
      bookingCard.status.value === "Class Cancelled"
  );

  return {
    scheduledBookings,
    confirmedBookings,
    cancelledBookings,
  };
};

const MyBookingSection = (props) => {
  const { toast } = props;
  const { data: session } = useSession();

  /**
   * Hooks
   */
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  /**
   * Queries
   */

  const dataset = useQuery(
    ["MyBookingSection"],
    () => MyBookingSectionQuery({ _id: session.user._id }),
    { refetchOnMount: true }
  );
  const queryClient = useQueryClient();

  /**
   * Mutations
   */

  const cancelBooking = useMutation(CancelBookingCard, {
    onSuccess: () => {
      toast.current.show({
        severity: "success",
        summary: "OK",
        detail: "Booking cancelled",
      });
      queryClient.invalidateQueries(["MembershipSection"]);
      queryClient.invalidateQueries(["MyBookingSection"]);
      queryClient.invalidateQueries(["SearchClassesQuery"]);
      queryClient.invalidateQueries(["allMessage"]);
    },
    onSettled: () => {
      setShowBookingDetails(false);
      setSelectedBooking(null);
    },
  });

  /**
   * Utils
   */

  const onError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: `${error.message}`,
    });
  };

  const onCancel = async () => {
    try {
      await cancelBooking.mutateAsync({
        _id: selectedBooking._id,
        updatedBy: session.user._id,
      });
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  const upcomingBookingHandler = (item) => {
    setShowBookingDetails(true);
    setSelectedBooking(item);
  };

  const { scheduledBookings, confirmedBookings, cancelledBookings } =
    // @ts-ignore
    filterBookingData(dataset.data?.bookingCardsUser);

  let allBookingData = [
    ...(dataset.data?.upcomingEventBookingCardsUser || []),
    ...(dataset.data?.activeBookings || []),
    // @ts-ignore
  ].sort(sortMixedBookingAsc);

  /**
   * Templates
   */
  const upcomingBookingTemplate = (item) => {
    return (
      <BookingCard
        value={item}
        mode="upcoming"
        onClick={upcomingBookingHandler}
        loading={cancelBooking.isLoading}
      />
    );
  };

  const pastBookingTemplate = (item) => {
    return <BookingCard value={item} mode="past" />;
  };

  /**
   * Renders
   */
  const title = (
    <div className="flex justify-between">
      <div className="my-auto">My Booking</div>
      <div>
        <Button
          label="Regular Class Booking History"
          icon="pi pi-clock"
          onClick={() => setShowBookingHistory(true)}
          disabled={dataset.isLoading}
        />
      </div>
    </div>
  );

  return (
    <div id="my_booking">
      <Card title={title} className="my-2 bg-white/50">
        <DataView
          loading={dataset.isLoading}
          className="customDataView"
          value={allBookingData}
          itemTemplate={upcomingBookingTemplate}
          layout="list"
          emptyMessage="You have no upcoming class."
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10]}
          paginatorLeft={true}
          paginatorRight={true}
          alwaysShowPaginator={false}
          paginatorClassName="bg-white/10"
        />
        <Dialog
          visible={showBookingDetails}
          header="Booking Details"
          onHide={() => {
            setSelectedBooking(null);
            setShowBookingDetails(false);
          }}
          className="w-full md:w-9/12 lg:w-7/12"
        >
          {selectedBooking && (
            <BookingCard
              value={selectedBooking}
              mode="detail"
              onCancel={onCancel}
              loading={cancelBooking.isLoading}
            />
          )}
        </Dialog>
        <Sidebar
          visible={showBookingHistory}
          onHide={() => setShowBookingHistory(false)}
          fullScreen
          closeOnEscape
          blockScroll
          className="bg-neutral-50"
        >
          <div className="md:w-8/12 mx-auto">
            <div className="mb-3 ">
              <div className="text-2xl mb-2">Regular Class Booking History</div>
              <div className="text-xs italic">
                <ul>
                  <li>
                    This section only displays your booking history for regular
                    classes.
                  </li>
                  <li>
                    For up-coming Special Class Registration, please go to My
                    Booking in Home.
                  </li>
                </ul>
              </div>
            </div>
            <TabView className="customTabView">
              <TabPanel header="Upcoming class">
                <DataView
                  className="customDataView"
                  value={scheduledBookings}
                  itemTemplate={pastBookingTemplate}
                  layout="list"
                  emptyMessage="You have no scheduled booking yet."
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  paginatorLeft={true}
                  paginatorRight={true}
                  alwaysShowPaginator={false}
                  paginatorClassName="bg-white/10"
                />
              </TabPanel>
              <TabPanel header="Attended">
                <DataView
                  className="customDataView"
                  value={confirmedBookings}
                  itemTemplate={pastBookingTemplate}
                  layout="list"
                  emptyMessage="You have no confirmed booking yet."
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  paginatorLeft={true}
                  paginatorRight={true}
                  alwaysShowPaginator={false}
                  paginatorClassName="bg-white/10"
                />
              </TabPanel>
              <TabPanel header="Cancelled">
                <DataView
                  className="customDataView"
                  value={cancelledBookings}
                  itemTemplate={pastBookingTemplate}
                  layout="list"
                  emptyMessage="You have no cancelled booking yet."
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  paginatorLeft={true}
                  paginatorRight={true}
                  alwaysShowPaginator={false}
                  paginatorClassName="bg-white/10"
                />
              </TabPanel>
            </TabView>
          </div>
        </Sidebar>
      </Card>
    </div>
  );
};

export default MyBookingSection;
