function convertToCSV(arr, customHeader) {
  const separator = ",";
  let keys = Object.keys(arr[0]);
  const filteredHeaders = customHeader.filter((cHeader) =>
    keys.includes(cHeader.key)
  );
  keys = [];
  let header = [];

  for (const { label, key } of filteredHeaders) {
    keys.push(key);
    header.push(label);
  }

  header = header.join(separator);

  const rows = arr.map((obj) => {
    return keys
      .map((key) => {
        const cell =
          obj[key] === null || obj[key] === undefined ? "" : obj[key];
        return JSON.stringify(cell);
      })
      .join(separator);
  });

  return header + "\n" + rows.join("\n");
}

function downloadCSV(data, fileName = "data") {
  const filename = `${fileName}.csv`;
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
