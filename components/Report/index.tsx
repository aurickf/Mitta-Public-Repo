const dropdownBookingStatusOptions = [
  {
    label: "Confirmed",
    value: "Confirmed",
  },
  {
    label: "Scheduled",
    value: "Scheduled",
  },
  {
    label: "Booking Cancelled",
    value: "Booking Cancelled",
  },
  {
    label: "Class Cancelled",
    value: "Class Cancelled",
  },
];

const dropdownMembershipStatusOptions = [
  {
    label: "Approved",
    value: true,
  },
  {
    label: "Rejected",
    value: false,
  },
  {
    label: "Pending",
    value: "",
  },
];

const dropdownTimeFrameOptions = [
  {
    label: "All time",
    value: "allTime",
  },
  {
    label: "This year",
    value: "thisYear",
  },
  {
    label: "This month",
    value: "thisMonth",
  },
  {
    label: "This week",
    value: "thisWeek",
  },
  {
    label: "Last year",
    value: "lastYear",
  },
  {
    label: "Last month",
    value: "lastMonth",
  },
  {
    label: "Last week",
    value: "lastWeek",
  },
  {
    label: "Past 3 month",
    value: "past3Month",
  },
  {
    label: "Past 6 month",
    value: "past6Month",
  },
  {
    label: "Past 12 month",
    value: "past12Month",
  },
];

const getLightTheme = () => {
  const backgroundColor = [
    "BlueViolet",
    "DarkOrchid",
    "RebeccaPurple",
    "CornflowerBlue",
  ];

  const hoverBackgroundColor = [
    "BlueViolet",
    "DarkOrchid",
    "RebeccaPurple",
    "CornflowerBlue",
  ];

  const lightOptions = {
    plugins: {
      legend: {
        labels: {
          color: "black",
        },
      },
    },
  };

  const polarOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
    scales: {
      r: {
        grid: {
          color: "#ebedef",
        },
      },
    },
  };

  const radarOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
    scales: {
      r: {
        pointLabels: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
        angleLines: {
          color: "#ebedef",
        },
      },
    },
  };

  let basicOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
    },
  };

  let horizontalOptions = {
    indexAxis: "y",
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
    },
  };

  let stackedOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltips: {
        mode: "index",
        intersect: false,
      },
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
    },
  };

  let multiAxisOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
      tooltips: {
        mode: "index",
        intersect: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        ticks: {
          min: 0,
          max: 100,
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
          color: "#ebedef",
        },
        ticks: {
          min: 0,
          max: 100,
          color: "#495057",
        },
      },
    },
  };

  return {
    backgroundColor,
    hoverBackgroundColor,
    lightOptions,
    polarOptions,
    radarOptions,
    basicOptions,
    horizontalOptions,
    stackedOptions,
    multiAxisOptions,
  };
};

export {
  dropdownBookingStatusOptions,
  dropdownMembershipStatusOptions,
  dropdownTimeFrameOptions,
  getLightTheme,
};
