import { NextResponse } from "next/server";

const engineURI =
  process.env.IS_SELF_HOSTED === "true"
    ? process.env.EXEC_ENGINE_URI
    : "https://" + process.env.RAPID_API_HOST;

export const POST = async (req, res) => {
  // instance of judge0

  const jsonBody = await req.json();
  const { srcCode, langId, inputTestCase } = jsonBody;
  console.log(langId);

  const isSelfHosted = process.env.IS_SELF_HOSTED === "true";

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source_code: srcCode,
      language_id: +langId,
      stdin: inputTestCase,
    }),
  };

  if (!isSelfHosted) {
    options.headers["x-rapidapi-key"] = process.env.RAPID_API_KEY;
    options.headers["x-rapidAPI-host"] = process.env.RAPID_API_HOST;
  }

  try {
    const res = await fetch(
      `${engineURI}/submissions/?base64_encoded=false&fields=*`,
      options
    );
    const data = await res.json();

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ msg: "Error" }, { status: 400 });
  }
};

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  const options = {
    method: "GET",
  };

  if (process.env.IS_SELF_HOSTED === "false") {
    options.headers = {
      "x-rapidapi-key": process.env.RAPID_API_KEY,
      "x-rapidAPI-host": process.env.RAPID_API_HOST,
    };
  }

  while (true) {
    try {
      const res = await fetch(
        `${engineURI}/submissions/${token}?base64_encoded=false&fields=*`,
        options
      );
      const data = await res.json();
      console.log(data);
      if (data.status.id === 3) {
        const strData = data.stdout;
        return NextResponse.json({ res: strData }, { status: 200 });
      } else if (data.status.id > 3) {
        const status = data.status.id;
        return NextResponse.json({ status }, { status: 400 });
      }
    } catch (e) {
      return NextResponse.json(e, { status: 400 });
    }
  }
};
