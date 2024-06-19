import Boolean from "@/components/UI/Boolean";
import { DateTime } from "luxon";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { Tag } from "primereact/tag";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Level, MembershipPackage } from "src/generated/graphql";
import DTFormat from "../UI/DTFormat";
import IDR from "../UI/IDR";

// DataTable Template

const bookingCardTemplate = (
  rowData: any,
  keyword: "booked" | "confirmed" | "cancelled"
) => {
  if (rowData[keyword].length > 0)
    return (
      <Inplace>
        <InplaceDisplay>
          <Button type="button" size="small" icon="pi pi-eye" text />
        </InplaceDisplay>
        <InplaceContent>
          {rowData[keyword].map((bookingCard, i) => {
            return (
              <div
                key={i}
                className="text-center odd:bg-wisteria-100 even:bg-violet-100 rounded py-1 my-1"
              >
                <div className="border-b border-neutral-300">
                  <div>{bookingCard.bookingCode}</div>
                  <div>{bookingCard.cost} points</div>
                </div>
                <div className="text-xs pt-1">
                  {bookingCard.createdAt &&
                    DateTime.fromISO(bookingCard.createdAt).toFormat(
                      "dd LLL yyyy HH:mm:ss"
                    )}
                </div>
              </div>
            );
          })}
        </InplaceContent>
      </Inplace>
    );
};

export const bookedTemplate = (rowData) => {
  return bookingCardTemplate(rowData, "booked");
};

export const confirmedTemplate = (rowData) => {
  return bookingCardTemplate(rowData, "confirmed");
};
export const cancelledTemplate = (rowData) => {
  return bookingCardTemplate(rowData, "cancelled");
};

export const booleanTemplate = (value, tooltip = "") => {
  return <Boolean value={value} tooltip={tooltip} />;
};

export const booleanDataTableTemplate = ({
  validate,
  trueValue,
  falseValue,
  trueSeverity,
  falseSeverity,
}) => {
  if (validate) return <Tag severity={trueSeverity} value={trueValue} />;
  return <Tag severity={falseSeverity} value={falseValue} />;
};

export const classStatusTemplate = (rowData) => {
  return <div></div>;
};

export const classTemplate = (rowData) => {
  const icons = [];
  rowData.regularClass?.status?.isPublished
    ? icons.push("🔊")
    : icons.push("🔇");
  rowData.regularClass?.status?.isVIPOnly && icons.push("⭐");

  if (rowData.regularClass?.details)
    return (
      <div>
        <div className="flex justify-end md:justify-start gap-2">
          <div className="my-auto">{rowData.regularClass?.details?.title}</div>
          <div>
            {rowData.regularClass?.status?.isVIPOnly && (
              <Tag severity="warning">VIP</Tag>
            )}
          </div>
        </div>
        <div className="flex justify-end md:justify-start gap-2">
          <div>
            {rowData.regularClass?.status?.isPublished ? (
              <Tag severity="success">Published</Tag>
            ) : (
              <Tag severity="danger">Not Published</Tag>
            )}
          </div>
          <div>
            {rowData.regularClass?.status?.isRunning === true && (
              <Tag severity="success">Confirmed</Tag>
            )}
            {rowData.regularClass?.status?.isRunning === false && (
              <Tag severity="danger">Class Cancelled</Tag>
            )}
            {rowData.regularClass?.status?.isRunning === null && (
              <Tag>Scheduled to Run</Tag>
            )}
          </div>
        </div>
      </div>
    );
  return <div>Deleted Class</div>;
};

export const dateOnlyTemplate = (value) => {
  return <DTFormat value={value} dateOnly />;
};

export const dateAndTimeTemplate = (value) => {
  return <DTFormat value={value} />;
};

export const priceTemplate = (value) => {
  return <IDR value={value} />;
};

export const levelItemTemplate = (option: Level) => {
  return (
    <div>
      {option.code} - {option.description}
    </div>
  );
};

export const selectedLevelTemplate = (option: Level, props) => {
  if (option) {
    return (
      <div>
        {option.code} - {option.description}
      </div>
    );
  } else {
    return <div>{props.placeholder}</div>;
  }
};

export const verifiedTemplate = (rowData) => {
  if (rowData?.verified?.isVerified === null) return <></>;

  return (
    <div className="text-xs text-center">
      <div className="my-2">{booleanTemplate(rowData.verified.isVerified)}</div>
      <div>
        <div>{rowData.verified?.reason}</div>
        <div>
          <DTFormat value={rowData.verified.date} dateOnly />
        </div>
        <div>{rowData.verified.by?.name}</div>
      </div>
    </div>
  );
};

export const userTemplate = (rowData) => {
  return rowData.user?.name ?? "Deleted User";
};

// Dropdown Template
export const membershipItemTemplate = (options: MembershipPackage) => {
  return (
    <div className="flex justify-between my-auto">
      <div>
        <div>
          {options.name} ({options.additional} points)
        </div>
        <div className="text-sm italic text-gray-600">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(options.price)}
        </div>
      </div>
      <Tag severity="info"> {options.validity} days </Tag>
    </div>
  );
};

export const membershipValueTemplate = (options, props) => {
  if (options) {
    return (
      <div className="flex justify-between">
        <div>
          <div>
            {options.name} ({options.additional} points)
          </div>
          <div className="text-sm italic text-gray-600">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(options.price)}
          </div>
        </div>
        <Tag severity="info"> {options.validity} days </Tag>
      </div>
    );
  }
  return <span>{props.placeholder}</span>;
};

// FILTER ELEMENTS
export const filterElementCheckbox = (options) => {
  return (
    <TriStateCheckbox
      value={options.value}
      onChange={(e) => options.filterCallback(e.value)}
    />
  );
};

export const filterElementDropdown = (options, dropdownOptions) => {
  return (
    <Dropdown
      value={options.value}
      options={dropdownOptions}
      onChange={(e) => options.filterCallback(e.value)}
    />
  );
};

export const filterElementDate = (options) => {
  return (
    <Calendar
      value={options.value}
      onChange={(e) => {
        options.filterCallback(e.value, options.index);
      }}
      dateFormat="dd M yy"
      placeholder="Select date"
    />
  );
};
