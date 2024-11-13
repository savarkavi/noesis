import ky from "ky";

export const kyInstance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  parseJson: (text) => {
    return JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) return new Date(value);
      return value;
    });
  },
});
