export interface ZoomMeetingRequest {
  /**
   * Class title
   */
  topic: string;

  /**
   * Class start time
   */
  start_time: Date;

  /**
   * set timezone to UTC as mongoDB store in UTC format
   */
  timezone: "UTC";

  /**
   * Class duration
   */
  duration: number;

  /**
   * Meeting password, use 4-digit random alphanumeric
   */
  password: string;

  /**
   * The type of meeting:
   *
   * 1 — An instant meeting.
   * 2 — A scheduled meeting.
   * 3 — A recurring meeting with no fixed time.
   * 8 — A recurring meeting with fixed time.
   *
   * Usually goes with 2
   */
  type: 1 | 2 | 3 | 8;

  settings: {
    /**
     * Instructors email address in one string value, separated by ;
     */
    alternative_hosts?: string;
    /**
     * Notify alternative host thru email
     */
    alternative_hosts_email_notification?: boolean;
    /**
     * Enable waiting room
     */
    waiting_room: boolean;
    /**
     * Enable attendee to join before host
     */
    join_before_host: boolean;
    /**
     * Mute attendee on entry
     */
    mute_upon_entry: boolean;
  };
}
