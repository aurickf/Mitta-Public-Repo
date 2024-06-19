import React from "react";

const BankAccountInfo = () => {
  return (
    <div className="text-center py-2 my-2 bg-fuchsia-200 text-fuchsia-800 border border-fuchsia-300 rounded relative">
      <div className="text-sm italic">Please make payment to</div>
      <div className="flex gap-2 justify-center align-middle">
        <div>{process.env.NEXT_PUBLIC_BANK_TRANSFER_ACCOUNT}</div>
        <div>-</div>
        <div>{process.env.NEXT_PUBLIC_BANK_TRANSFER_BENEFICIARY_NAME}</div>
      </div>
    </div>
  );
};

export default BankAccountInfo;
