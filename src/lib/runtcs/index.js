import { NextResponse } from "next/server";

const engineURI =
  process.env.IS_SELF_HOSTED === "true"
    ? process.env.EXEC_ENGINE_URI
    : "https://" + process.env.RAPID_API_HOST;

export const getToken = async (body) => {
  const { srcCode, langId, inputTestCase } = body;

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

    return data.token;
  } catch (e) {
    console.error(e);
  }
};

export const getResult = async (token) => {
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
      if (data.status.id === 3) {
        const strData = data.stdout;
        return { res: strData, status: 200 };
      } else if (data.status.id > 3) {
        const status = data.status.id;
        throw new Error(data.status);
      }
    } catch (e) {
      console.error(e);
    }
  }
};
