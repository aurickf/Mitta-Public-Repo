import { Theme } from "next-auth";
import { createTransport } from "nodemailer";

export interface RowTable {
  label: string;
  content: string;
}

export const formatTable = (rows: Array<RowTable>) => {
  const result = rows.map((row) => {
    return `<tr>
      <td align="left" style="padding-right:10px">${row.label}</td>
      <td align="right">${row.content}</td>
    </tr>`;
  });

  return result.toString().replace(/(\<\/tr\>\,\<tr\>)/g, "</tr><tr>");
};

export const normalizeIdentifier = (identifier: string): string => {
  // Get the first two elements only,
  // separated by `@` from user input.
  let [local, domain] = identifier.toLowerCase().trim().split("@");
  // The part before "@" can contain a ","
  // but we remove it on the domain part
  domain = domain.split(",")[0];
  return `${local}@${domain}`;

  // You can also throw an error, which will redirect the user
  // to the error page with error=EmailSignin in the URL
  // if (identifier.split("@").length > 2) {
  //   throw new Error("Only one email allowed")
  // }
};

export const sendVerificationRequest = async (params) => {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);

  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: textVerificationRequest({ url, host }),
    html: htmlVerificationRequest({ url, host, theme }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
};

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
const htmlVerificationRequest = (params: {
  url: string;
  host: string;
  theme: Theme;
}) => {
  const { url, host, theme } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = theme.brandColor || "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
};

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
const textVerificationRequest = ({
  url,
  host,
}: {
  url: string;
  host: string;
}) => {
  return `Sign in to ${host}\n${url}\n\n`;
};

export interface EmailParams {
  /**
   * Recipient email address
   */
  identifier: string;
  /**
   * Email Subject
   */
  subject: string;
  /**
   * Header in email body
   */
  header: string;
  /**
   * HTML message body
   */
  htmlMessage: string;
  /**
   * Plain text body
   */
  plainTextMessage: string;
}

/**
 * Send email
 *
 * @param params
 */
export const sendNotificationEmail = async (params: EmailParams) => {
  const { identifier, subject, header, htmlMessage, plainTextMessage } = params;

  const server = {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  };

  const from = process.env.EMAIL_FROM;

  //@ts-ignore
  const transport = createTransport(server);

  const result = await transport.sendMail({
    to: normalizeIdentifier(identifier),
    from,
    subject,
    text: textMessageFormat({ message: plainTextMessage }),
    html: htmlMessageFormat({ header, message: htmlMessage }),
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
};

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
const htmlMessageFormat = (params: {
  url?: string;
  host?: string;
  theme?: Theme;
  message: string;
  header: string;
}) => {
  const { theme, message, header } = params;

  const brandColor = theme?.brandColor || "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme?.buttonText || "#fff",
  };

  return `
<body style="background: ${color.background};">
  <div width="100%" border="0" cellspacing="20" cellpadding="0"
  style="background: ${color.mainBackground}; max-width: 800px; margin: auto; border-radius: 10px;">
    <div align="center"
    style="padding: 15px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
      <table>
        <tr style="font-size: 18px;">
          <td align="center" style="padding-bottom: 15px;" colspan="2">
          ${header}
          </td>
        </tr>
        ${message}
      </table>

    </div>
    <div align="center"
    style="padding: 0px 0px 10px 0px; font-size: 10px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
      This is an automated message. Do not reply to this e-mail, we do not check Inbox on this address.
    </div>

  </div>
</body>
`;
};

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
const textMessageFormat = ({
  url,
  host,
  message,
}: {
  url?: string;
  host?: string;
  message: string;
}) => {
  return `${message}\n\n`;
};
