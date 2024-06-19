const IDR = (props: { value: number }) => {
  return (
    <span>
      {props.value.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        currencyDisplay: "code",
        maximumFractionDigits: 0,
      })}
    </span>
  );
};

export default IDR;
