type Props = {
  title: string;
  data: Record<number, number | undefined>;
};

function TableRow({ title, data }: Props) {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <p
        style={{
          borderWidth: 0.1,
          borderColor: "#000",
          border: "solid",
          padding: 5,
          margin: 0,
          width: 150,
        }}
      >
        {title}
      </p>
      {Object.entries(data).map(([key, value]) => (
        <p
          key={key}
          style={{
            width: 50,
            margin: 0,
            borderWidth: 0.1,
            borderLeftWidth: 0,
            borderColor: "#000",
            border: "solid",
            padding: 5,
          }}
        >
          {value}
        </p>
      ))}
    </div>
  );
}

export default TableRow;
