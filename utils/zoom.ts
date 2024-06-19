import { ZoomMeetingRequest } from "@/interface/Zoom";
import axios from "axios";
import qs from "query-string";

const ZOOM_OAUTH_ENDPOINT = "https://zoom.us/oauth/token";
const ZOOM_ENDPOINT = "https://api.zoom.us/v2";

const meetingOptions = ({
  topic,
  start_time,
  duration,
  password,
}: {
  topic: string;
  start_time: Date;
  duration: number;
  password?: string;
}): ZoomMeetingRequest => {
  return {
    topic,
    start_time,
    duration,
    timezone: "UTC",
    ...(password && { password }),
    type: 2,
    settings: {
      waiting_room: false,
      join_before_host: true,
      mute_upon_entry: true,
    },
  };
};

const getAccessToken = async () => {
  const encodedAccessString = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString("base64");

  try {
    return await axios.post(
      ZOOM_OAUTH_ENDPOINT,
      qs.stringify({
        grant_type: "account_credentials",
        account_id: process.env.ZOOM_ACCOUNT_ID,
      }),
      {
        headers: {
          Authorization: `Basic ${encodedAccessString}`,
        },
      }
    );
  } catch (e) {
    console.error(e?.message, e?.response?.data);
  }
};

const getMeetings = async () => {
  const url = `${ZOOM_ENDPOINT}/users/me/meetings`;

  try {
    const token = await getAccessToken();

    return await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
  } catch (e) {
    console.error(e?.message, e?.response?.data);
  }
};

const createMeeting = async (meetingOptions: ZoomMeetingRequest) => {
  const url = `${ZOOM_ENDPOINT}/users/me/meetings`;

  try {
    const token = await getAccessToken();

    return await axios.post(url, meetingOptions, {
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
  } catch (e) {
    console.error(e?.message, e?.response?.data);
  }
};

const getMeeting = async (meetingId: string) => {
  const url = `${ZOOM_ENDPOINT}/meetings/${meetingId}`;

  try {
    const token = await getAccessToken();

    return await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
  } catch (e) {
    console.error(e?.message, e?.response?.data);
  }
};

const editMeeting = async (
  meetingId: string,
  meetingOptions: ZoomMeetingRequest
) => {
  const url = `${ZOOM_ENDPOINT}/meetings/${meetingId}`;

  try {
    const token = await getAccessToken();

    return await axios.patch(url, meetingOptions, {
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
  } catch (e) {
    console.error(e?.message, e?.response?.data);
  }
};

const deleteMeeting = async (meetingId: string) => {
  const url = `${ZOOM_ENDPOINT}/meetings/${meetingId}`;

  try {
    const token = await getAccessToken();

    return await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
  } catch (e) {
    console.error(e?.message, e?.response?.data);
  }
};

export {
  getAccessToken,
  getMeetings,
  getMeeting,
  createMeeting,
  editMeeting,
  deleteMeeting,
  meetingOptions,
};
