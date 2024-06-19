import MembershipForm from "@/components/Form/MembershipForm";
import ProfileForm from "@/components/Form/ProfileForm";
import Layout from "@/components/Layout/Layout";
import MembershipHistory from "@/components/Membership/MembershipHistory";
import MiniSearch from "@/components/MiniSearch";
import {
  booleanDataTableTemplate,
  filterElementCheckbox,
} from "@/components/Template";
import DTFormat from "@/components/UI/DTFormat";
import LoadingSkeleton from "@/components/UI/LoadingSkeleton";
import useExportPDF from "@/hooks/useExportPDF";
import useSearchAndFilter from "@/hooks/useSearchAndFilter";
import { useSession } from "next-auth/react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { FilterMatchMode } from "primereact/api";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { ToggleButton } from "primereact/togglebutton";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useReducer, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { EditUserRoleAndAccess, Users } from "src/api";
import { User } from "src/generated/graphql";

// ========== COLUMN ARRAY =========== //

const UserPage = () => {
  const columns = [
    {
      field: "name",
      header: "Name",
      sortable: true,
      preselected: true,
      body: (rowData) => {
        return (
          <div className="flex justify-between">
            <div className="my-auto">{rowData.name}</div>
            {rowData?.role?.isInstructor && rowData?.image && (
              <Avatar image={rowData?.image} shape="circle" />
            )}
          </div>
        );
      },
    },
    { field: "username", header: "Username", sortable: true },
    {
      field: "membership.latest.balance.available",
      header: "Latest Membership",
      sortable: true,
      preselected: true,
      body: (rowData) => {
        if (rowData?.membership?.latest)
          return (
            <div className="flex flex-wrap gap-2 justify-start">
              <Tag>{rowData?.membership?.latest?.note}</Tag>
              <div className="my-auto italic text-sm">{`${rowData?.membership?.latest?.balance?.available} points`}</div>
            </div>
          );
      },
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
      body: (rowData) => {
        return (
          <div className="flex justify-between gap-2">
            <div className="my-auto grow">{rowData.email}</div>
            <div>
              <CopyToClipboard text={rowData.email}>
                <Button
                  icon="pi pi-copy"
                  className="p-button-rounded p-button-text p-button-sm"
                  onClick={() =>
                    toast.current.show({
                      severity: "success",
                      summary: "Email copied to clipboard",
                      detail: rowData.email,
                    })
                  }
                />
              </CopyToClipboard>
            </div>
          </div>
        );
      },
    },
    {
      field: "phone",
      header: "Phone",
      sortable: true,
      body: (rowData) => {
        return (
          <div className="flex justify-between gap-2">
            <div className="my-auto grow">{rowData.phone}</div>
            <div>
              <CopyToClipboard text={rowData.phone}>
                <Button
                  icon="pi pi-copy"
                  className="p-button-rounded p-button-text p-button-sm"
                  onClick={() =>
                    toast.current.show({
                      severity: "success",
                      summary: "Phone copied to clipboard",
                      detail: rowData.phone,
                    })
                  }
                />
              </CopyToClipboard>
              <Button
                icon="pi pi-whatsapp"
                className="p-button-rounded p-button-text p-button-sm"
                onClick={() => window.open(`https://wa.me/${rowData.phone}`)}
              />
            </div>
          </div>
        );
      },
    },
    {
      field: "role.isInstructor",
      header: "Instructor",
      sortable: true,
      dataType: "boolean",
      body: (rowData) =>
        booleanDataTableTemplate({
          validate: rowData.role.isInstructor,
          trueValue: "Instructor",
          trueSeverity: "warning",
          falseValue: "Member",
          falseSeverity: "info",
        }),
      filter: true,
      filterElement: filterElementCheckbox,
      preselected: true,
    },
    {
      field: "membership.isVIP",
      header: "Privilege",
      sortable: true,
      dataType: "boolean",
      body: (rowData) =>
        booleanDataTableTemplate({
          validate: rowData.membership.isVIP,
          trueValue: "VIP",
          trueSeverity: "warning",
          falseValue: "Non-VIP",
          falseSeverity: "info",
        }),
      filter: true,
      filterElement: filterElementCheckbox,
    },
    {
      field: "role.isAdmin",
      header: "Admin",
      sortable: true,
      dataType: "boolean",
      body: (rowData) =>
        booleanDataTableTemplate({
          validate: rowData.role.isAdmin,
          trueValue: "Admin",
          trueSeverity: "warning",
          falseValue: "Not Admin",
          falseSeverity: "info",
        }),
      filter: true,
      filterElement: filterElementCheckbox,
      preselected: true,
    },
    {
      field: "access.approval.isApproved",
      header: "Approval",
      sortable: true,
      dataType: "boolean",
      body: (rowData) =>
        booleanDataTableTemplate({
          validate: rowData.access.approval.isApproved,
          trueValue: "Approved",
          trueSeverity: "success",
          falseValue: "Pending",
          falseSeverity: "warning",
        }),
      filter: true,
      filterElement: filterElementCheckbox,
    },
    {
      field: "access.ban.isBanned",
      header: "Ban Status",
      sortable: true,
      dataType: "boolean",
      body: (rowData) => {
        return (
          <div className="text-center">
            <div className="flex gap-1">
              <div className="my-auto">
                {booleanDataTableTemplate({
                  validate: rowData.access.ban.isBanned,
                  trueValue: "Banned",
                  trueSeverity: "warning",
                  falseValue: "OK",
                  falseSeverity: "success",
                })}
              </div>

              {rowData.access.ban.isBanned && (
                <div className="my-auto">
                  <Button
                    className="p-button-rounded p-button-text p-button-sm btnBanned"
                    icon="pi pi-info-circle"
                  />
                  <Tooltip target=".btnBanned" position="bottom">
                    <div className="text-xs my-1">
                      <div className="mx-auto">
                        <div>{rowData.access.ban.by?.name}</div>
                        <div>
                          <DTFormat value={rowData.access.ban?.date} />
                        </div>
                      </div>
                      <div className="italic">{rowData.access.ban?.reason}</div>
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        );
      },
      filter: true,
      filterElement: filterElementCheckbox,
      preselected: true,
    },
  ];

  const globalFilterFields = ["name", "username", "email", "phone"];

  const { data: session } = useSession();
  const dataset = useQuery(["users"], () => Users());
  const queryClient = useQueryClient();

  const editUserRoleAndAccess = useMutation(EditUserRoleAndAccess, {
    onSuccess(data) {
      toast.current.show({
        severity: "success",
        summary: "Done",
        detail: `User ${data.editUserRoleAndAccess.name} updated`,
      });
      onRowUnselect();
    },
  });

  const updateUserHandler = async () => {
    const values = {
      ...state,
      isVIP: state.membership.isVIP,
      _id: selectedRow._id,
      updaterId: session.user._id,
    };

    delete values.membership;

    try {
      await editUserRoleAndAccess.mutateAsync(values);
    } catch (error) {
      error.response.errors.forEach((err) => onError(err));
    }
  };

  const toast = useRef<Toast>();

  /**
   * Search and filter custom hook
   */
  const [showDialog, setShowDialog] = useState(false);
  const { filters, searchAndFilter, clearFilter, columnComponents } =
    useSearchAndFilter({
      columns,
      initialFilterValue: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        "role.isInstructor": {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },
        "membership.isVIP": {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },
        "role.isAdmin": {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },
        "access.approval.isApproved": {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },
        "access.ban.isBanned": {
          value: null,
          matchMode: FilterMatchMode.EQUALS,
        },
      },
    });

  const [selectedRow, setSelectedRow] = useState<User>(null);

  const onRowSelect = (e) => {
    setSelectedRow(e.data);
    setShowDialog(true);
    dispatch({ type: "reset" });
  };

  const onRowUnselect = () => {
    queryClient.invalidateQueries(["users"]);

    setSelectedRow(null);
    setShowDialog(false);
  };

  const onSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Done",
      detail: message,
    });
    onRowUnselect();
  };

  const onError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Failed",
      detail: `${error.message}`,
    });
  };

  /**
   * Reducer to handle role, access and VIP membership changes
   *
   */

  const initialState = {
    membership: {
      isVIP: selectedRow?.membership?.isVIP,
    },
    role: {
      isInstructor: selectedRow?.role?.isInstructor,
      isAdmin: selectedRow?.role?.isAdmin,
    },
    access: {
      approval: {
        isApproved: selectedRow?.access?.approval?.isApproved,
      },
      ban: {
        isBanned: selectedRow?.access?.ban?.isBanned,
        reason: selectedRow?.access?.ban?.reason ?? "",
      },
    },
  };

  const init = (initialState) => {
    return initialState;
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "VIP":
        return {
          ...state,
          membership: {
            isVIP: action.value,
          },
        };

      case "approval":
        return {
          ...state,
          access: {
            ...state.access,
            approval: {
              isApproved: action.value,
            },
          },
        };

      case "ban":
        return {
          ...state,
          access: {
            ...state.access,
            ban: {
              ...state.access.ban,
              isBanned: action.value,
            },
          },
        };

      case "banReason":
        return {
          ...state,
          access: {
            ...state.access,
            ban: {
              ...state.access.ban,
              reason: action.value,
            },
          },
        };

      case "instructor":
        return {
          ...state,
          role: {
            ...state.role,
            isInstructor: action.value,
          },
        };

      case "admin":
        return {
          ...state,
          role: {
            ...state.role,
            isAdmin: action.value,
          },
        };

      case "reset":
        return init(initialState);

      default:
        break;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState, init);

  useEffect(() => {
    clearFilter();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dt = useRef(null);

  const downloadCSV = () => {
    dt.current.exportCSV();
  };

  const { downloadPDF } = useExportPDF();

  return (
    <Layout>
      <Toast ref={toast} />
      <Toolbar
        className="bg-white/50 my-3"
        right={
          <div className="flex gap-2">
            <Button
              label="PDF"
              className="p-button-sm"
              onClick={() => {
                downloadPDF({ prefix: "user", tableId: "#dataTable" });
              }}
            />
            <Button label="CSV" className="p-button-sm" onClick={downloadCSV} />
          </div>
        }
      />
      <Card>
        {searchAndFilter("Search name, username, email, phone")}
        <DataTable
          id="dataTable"
          value={dataset.data?.users}
          loading={dataset.isLoading}
          responsiveLayout="scroll"
          selectionMode="single"
          selection={selectedRow}
          onRowSelect={onRowSelect}
          onRowUnselect={onRowUnselect}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={globalFilterFields}
          emptyMessage="No user found"
          sortField="name"
          sortOrder={1}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          paginatorLeft={`Total : ${dataset.data?.users?.length} users`}
          paginatorRight={true}
        >
          {columnComponents}
        </DataTable>
      </Card>
      <Dialog
        visible={showDialog}
        onHide={onRowUnselect}
        className="w-full md:w-6/12"
      >
        {selectedRow && (
          <>
            <div className="text-xl text-center mb-4">{selectedRow.name}</div>
            <Accordion multiple>
              <AccordionTab header="Update Profile">
                <ProfileForm
                  userId={selectedRow._id}
                  onSuccess={onSuccess}
                  onError={onError}
                />
              </AccordionTab>
              <AccordionTab header="Update User Access and Role">
                <>
                  <div className="flex justify-between my-4">
                    <div className="my-auto">Access</div>
                    {!selectedRow.access.approval.isApproved ? (
                      <ToggleButton
                        onLabel="Approved"
                        offLabel="Pending"
                        checked={state.access.approval.isApproved}
                        onChange={() =>
                          dispatch({
                            type: "approval",
                            value: !state.access.approval.isApproved,
                          })
                        }
                      />
                    ) : (
                      <div>Approved</div>
                    )}
                  </div>
                  <div className="flex justify-between my-4">
                    <div className="my-auto">Ban</div>
                    <ToggleButton
                      checked={state.access.ban.isBanned}
                      onChange={() =>
                        dispatch({
                          type: "ban",
                          value: !state.access.ban.isBanned,
                        })
                      }
                    />
                  </div>
                  {state.access.ban.isBanned && (
                    <InputText
                      className="w-full"
                      placeholder="Ban reason"
                      value={state.access.ban.reason}
                      onChange={(e) =>
                        dispatch({
                          type: "banReason",
                          value: e.target.value,
                        })
                      }
                    />
                  )}
                  <Divider />
                  <div className="flex justify-between my-4">
                    <div className="my-auto">VIP access</div>
                    <ToggleButton
                      checked={state.membership.isVIP}
                      onChange={() =>
                        dispatch({
                          type: "VIP",
                          value: !state.membership.isVIP,
                        })
                      }
                    />
                  </div>
                  <Divider />
                  <div className="flex justify-between my-4">
                    <div className="my-auto">Instructor</div>
                    <ToggleButton
                      checked={state.role.isInstructor}
                      onChange={() =>
                        dispatch({
                          type: "instructor",
                          value: !state.role.isInstructor,
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-between my-4">
                    <div className="my-auto">Administrator</div>
                    <ToggleButton
                      checked={state.role.isAdmin}
                      onChange={() =>
                        dispatch({
                          type: "admin",
                          value: !state.role.isAdmin,
                        })
                      }
                    />
                  </div>
                  <Divider />
                  <div className="text-right">
                    <Button
                      label="Reset"
                      className="p-button-text mr-5"
                      type="button"
                      onClick={() => dispatch({ type: "reset" })}
                    />
                    <Button
                      label="Save"
                      icon="pi pi-save"
                      onClick={updateUserHandler}
                      loading={editUserRoleAndAccess.isLoading}
                    />
                  </div>
                </>
              </AccordionTab>
              <AccordionTab header="Book on behalf">
                <MiniSearch
                  user={selectedRow}
                  booker={session.user}
                  onSuccess={onSuccess}
                  onError={onError}
                />
              </AccordionTab>
              <AccordionTab header="New Membership">
                <MembershipForm
                  userId={selectedRow._id}
                  onSuccess={onSuccess}
                  onError={onError}
                />
              </AccordionTab>
              <AccordionTab header="Membership History">
                <MembershipHistory userId={selectedRow._id} />
              </AccordionTab>
            </Accordion>
          </>
        )}
      </Dialog>
    </Layout>
  );
};

UserPage.auth = {
  role: "admin",
  loading: <LoadingSkeleton />,
  unauthorized: "/auth/unauthorized",
};

export default UserPage;
