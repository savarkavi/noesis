import { LinkMetadata } from "@/lib/types";
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

export async function POST(req: Request) {
  const { url } = await req.json();

  try {
    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

    const browser = await puppeteer.launch({
      args: isLocal
        ? puppeteer.defaultArgs()
        : [...chromium.args, "--hide-scrollbars", "incognito", "--no-sandbox"],
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const metadata: LinkMetadata = await page.evaluate(() => {
      const getMetaContent = (property: string) =>
        (
          document.querySelector(
            `meta[property="${property}"]`,
          ) as HTMLMetaElement
        )?.content ||
        (document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement)
          ?.content;

      return {
        title:
          document.querySelector("title")?.innerText ||
          getMetaContent("og:title") ||
          "",
        description:
          getMetaContent("og:description") ||
          getMetaContent("description") ||
          "",
        image: getMetaContent("og:image") || "",
        url: getMetaContent("og:url") || window.location.href,
      };
    });

    await browser.close();

    return Response.json(metadata);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
