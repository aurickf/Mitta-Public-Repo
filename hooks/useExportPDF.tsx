import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";
import { DateTime } from "luxon";

const useExportPDF = () => {
  const downloadPDF = ({
    prefix,
    tableId,
  }: {
    /**
     * prefix : file name prefix
     */
    prefix: string;
    /**
     * tableId: id of the table to be printed to PDF
     */
    tableId?: string;
  }) => {
    let html = `[role="table"]`;
    if (tableId) {
      html = `${tableId} [role="table"]`;
    }
    const now = DateTime.now();
    const nowForFileName = now.toFormat("yyyy-LL-dd HH_mm_ss");
    const nowForHeader = now.toFormat("dd LLL yyyy HH:mm:ss");
    const fileName = `${prefix}_${nowForFileName}.pdf`;

    const doc = new jsPDF({ orientation: "l", format: "a4" });
    doc.setFontSize(8);
    doc.text(
      `Module : ${prefix} | Export time: ${nowForHeader} | File name: ${fileName}`,
      14,
      8
    );

    autoTable(doc, {
      html,
      headStyles: {
        fillColor: "A87EB8",
      },
    });

    doc.save(fileName);
  };

  return { downloadPDF };
};

export default useExportPDF;
