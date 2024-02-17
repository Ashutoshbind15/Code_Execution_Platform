import { NextResponse } from "next/server";

const engineURI = process.env.EXEC_ENGINE_URI;
export const POST = async (req, res) => {
  // instance of judge0

  const jsonBody = await req.json();

  const { srcCode, langId } = jsonBody;

  console.log(srcCode.toString(), langId);

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source_code: btoa(srcCode.toString()),
      language_id: +langId,
      //   stdin: btoa("world"),
    }),
  };

  try {
    const res = await fetch(
      `${engineURI}/submissions/?base64_encoded=true&fields=*`,
      options
    );
    const data = await res.json();
    console.log(data);
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

  try {
    const res = await fetch(
      `${engineURI}/submissions/${token}?base64_encoded=true&fields=*`,
      options
    );
    const data = await res.json();
    const strData = atob(data.stdout);
    return NextResponse.json(strData, { status: 200 });
  } catch (e) {
    return NextResponse.json({ msg: "Error" }, { status: 400 });
  }
};
