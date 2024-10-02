export default function formatDate(appwriteDate) {
  const date = new Date(appwriteDate);

  // Extract date components
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  // Extract time components
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Determine AM/PM and adjust hours
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format
  hours = String(hours).padStart(2, "0");

  // Format the date and time
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}
