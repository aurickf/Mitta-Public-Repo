import "reflect-metadata";

import { connectMongo } from "@/utils/connectDB";
import { ApolloServer } from "apollo-server-micro";
import { GraphQLError } from "graphql";
import processRequest from "graphql-upload/public/processRequest.js";
import micro_cors from "micro-cors";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

import { NextApiRequest, NextApiResponse } from "next";

import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "src/schema/scalar";

import { CustomSession, CustomUser } from "@/interface/Session";
import { AnnouncementResolver } from "src/schema/announcement.resolver";
import { BookingCardResolver } from "src/schema/bookingCard.resolver";
import { ClassesResolver } from "src/schema/classes.resolver";
import { CounterResolver } from "src/schema/counter.resolver";
import { EventBookingResolver } from "src/schema/eventBookingCard.resolver";
import { FeatureResolver } from "src/schema/feature.resolver";
import { FileResolver } from "src/schema/file.resolver";
import { HolidayResolver } from "src/schema/holiday.resolver";
import { LevelResolver } from "src/schema/level.resolver";
import { LogResolver } from "src/schema/log.resolver";
import { MembershipResolver } from "src/schema/membership.resolver";
import { MembershipPackageResolver } from "src/schema/membershipPackage.resolver";
import { MessageResolver } from "src/schema/message.resolver";
import { PaymentMethodResolver } from "src/schema/paymentMethod.resolver";
import { RegularClassResolver } from "src/schema/regularClass.resolver";
import { RegularClassTemplateResolver } from "src/schema/regularClassTemplate.resolver";
import { BookingCardReportResolver } from "src/schema/report.resolver";
import { SeriesResolver } from "src/schema/series.resolver";
import { SessionResolver } from "src/schema/session.resolver";
import { SpecialEventResolver } from "src/schema/specialEvent.resolver";
import { UserResolver } from "src/schema/user.resolver";
import { buildSchema } from "type-graphql";
import { customAuthChecker } from "./custom-auth-checker";

interface CustomRequest extends NextApiRequest {
  filePayload: any;
  user: CustomUser;
}

const cors = micro_cors({
  origin: "https://studio.apollographql.com",
  allowCredentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE"],
  allowHeaders: [
    "access-control-allow-credentials",
    "access-control-allow-origin",
    "content-type",
  ],
});

const schema = await buildSchema({
  resolvers: [
    AnnouncementResolver,
    BookingCardResolver,
    BookingCardReportResolver,
    ClassesResolver,
    CounterResolver,
    EventBookingResolver,
    FeatureResolver,
    FileResolver,
    HolidayResolver,
    LevelResolver,
    LogResolver,
    MembershipResolver,
    MembershipPackageResolver,
    MessageResolver,
    PaymentMethodResolver,
    RegularClassResolver,
    RegularClassTemplateResolver,
    SessionResolver,
    SpecialEventResolver,
    SeriesResolver,
    UserResolver,
  ],
  scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
  authChecker: customAuthChecker,
  authMode: "null",
});

const apolloServer = new ApolloServer({
  schema,
  csrfPrevention: true,
  cache: "bounded",
  debug: false,
  context: async ({ req, res }) => {
    return {
      db: await connectMongo(),
      user: req?.user,
    };
  },
  formatError: (error: GraphQLError) => {
    if (!error.originalError) return error;

    const data = error.originalError;
    const message = error.message || "An error occurred";
    const code = error.extensions.code || 500;
    const name = error.originalError.name;

    return {
      name,
      message,
      status: code,
      data,
    };
  },
});

const startServer = apolloServer.start();

const handler = async (req: CustomRequest, res: NextApiResponse) => {
  /**
   * Inject user to request for typegraphql decorator @Authorized
   */
  const session: CustomSession = await unstable_getServerSession(
    req,
    res,
    authOptions
  );
  req.user = session?.user;

  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  /**
   * Required for file upload
   */
  const contentType = req.headers["content-type"];
  if (contentType && contentType.startsWith("multipart/form-data")) {
    req.filePayload = await processRequest(req, res);
  }

  await startServer;

  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
};

export default cors(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
