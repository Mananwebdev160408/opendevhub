"use client"

import * as React from "react"
import { Copy, Check, Play, RefreshCw, Eye } from "lucide-react"
import { CopyBtn } from "./ToolHelpers"

export function JwtDecoderTool() {
  const [jwt, setJwt] = React.useState("")
  const [header, setHeader] = React.useState("")
  const [payload, setPayload] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setError(null)
    setHeader("")
    setPayload("")
    if (!jwt.trim()) return

    const parts = jwt.split(".")
    if (parts.length < 2 || parts.length > 3) {
      setError("Invalid JWT structure. A JWT must consist of 3 parts separated by dots.")
      return
    }

    try {
      const base64Decode = (str: string) => {
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
        while (base64.length % 4) base64 += "="
        return decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        )
      }

      const decodedHeader = JSON.parse(base64Decode(parts[0]))
      const decodedPayload = JSON.parse(base64Decode(parts[1]))

      setHeader(JSON.stringify(decodedHeader, null, 2))
      setPayload(JSON.stringify(decodedPayload, null, 2))
    } catch (e: any) {
      setError(e.message || "Decoding JWT failed. Make sure the input string is a valid base64url encoded JWT.")
    }
  }, [jwt])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">JWT DECODER</span>
      
      <div>
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">PASTE JWT TOKEN:</span>
        <textarea
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="w-full h-24 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
        />
      </div>

      {error ? (
        <div className="border-2 border-destructive bg-red-950/20 p-3 text-xs text-red-400 font-bold">
          {error}
        </div>
      ) : jwt.trim() ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-accent font-bold">HEADER (ALGORITHM & TYPE)</span>
              <CopyBtn value={header} />
            </div>
            <pre className="w-full h-56 bg-zinc-950 border-2 border-border p-3 text-[11px] overflow-auto leading-relaxed select-all">
              {header}
            </pre>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-primary font-bold">PAYLOAD (DATA CLAIMS)</span>
              <CopyBtn value={payload} />
            </div>
            <pre className="w-full h-56 bg-zinc-950 border-2 border-border p-3 text-[11px] overflow-auto leading-relaxed select-all">
              {payload}
            </pre>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-zinc-800 text-xs text-zinc-600">
          Decoded token properties will be printed here.
        </div>
      )}
    </div>
  )
}

export function UuidGeneratorTool() {
  const [count, setCount] = React.useState(5)
  const [uuids, setUuuids] = React.useState<string[]>([])

  const generateUUIDs = () => {
    const list = []
    for (let i = 0; i < count; i++) {
      list.push(
        "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0
          const v = c === "x" ? r : (r & 0x3) | 0x8
          return v.toString(16)
        })
      )
    }
    setUuuids(list)
  }

  React.useEffect(() => {
    generateUUIDs()
  }, [])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">UUID V4 GENERATOR</span>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1)))}
            className="w-16 border-2 border-foreground bg-black px-2 py-0.5 text-xs text-foreground text-center"
          />
          <button
            onClick={generateUUIDs}
            className="px-3 py-1 bg-accent text-accent-foreground font-bold border-2 border-foreground text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_0px_#ffffff] hover:bg-teal-400 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            GENERATE
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border-2 border-border p-4 relative">
        <div className="absolute right-4 top-4">
          <CopyBtn value={uuids.join("\n")} />
        </div>
        <div className="space-y-1.5 select-all pr-20 max-h-72 overflow-y-auto">
          {uuids.map((uuid, i) => (
            <div key={i} className="text-xs text-foreground select-all">
              {uuid}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function HashGeneratorTool() {
  const [text, setText] = React.useState("opendevhub")
  const [sha256, setSha256] = React.useState("")
  const [sha512, setSha512] = React.useState("")
  const [md5, setMd5] = React.useState("")

  const calcMd5 = (string: string) => {
    function RotateLeft(lValue: number, iShiftBits: number) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function AddUnsigned(lX: number, lY: number) {
      const lX8 = lX & 0x80000000;
      const lY8 = lY & 0x80000000;
      const lX4 = lX & 0x40000000;
      const lY4 = lY & 0x40000000;
      const lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
      if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
      if (lX4 | lY4) {
        if (lResult & 0x40000000) return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      }
      return lResult ^ lX8 ^ lY8;
    }
    function F(x: number, y: number, z: number) { return (x & y) | (~x & z); }
    function G(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
    function H(x: number, y: number, z: number) { return x ^ y ^ z; }
    function I(x: number, y: number, z: number) { return y ^ (x | ~z); }
    function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }
    function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }
    function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }
    function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }
    function ConvertToWordArray(string: string) {
      let lWordCount;
      const lMessageLength = string.length;
      const lNumberOfWords_temp1 = lMessageLength + 8;
      const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      const lWordArray = Array(lNumberOfWords);
      let lBytePosition = 0;
      let lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    }
    function WordToHex(lValue: number) {
      let WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
      }
      return WordToHexValue;
    }
    let x = ConvertToWordArray(string);
    let k, AA, BB, CC, DD, a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;
    const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    const S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    for (k = 0; k < x.length; k += 16) {
      AA = a; BB = b; CC = c; DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478); d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
      c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB); b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF); d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
      c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613); b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8); d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
      c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1); b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122); d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
      c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E); b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);

      a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562); d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
      c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51); b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D); d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681); b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6); d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
      c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87); b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
      a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905); d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
      c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9); b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);

      a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942); d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
      c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122); b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
      a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44); d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
      c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60); b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
      a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6); d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
      c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085); b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
      a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039); d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
      c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8); b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);

      a = II(a, b, c, d, x[k + 0], S41, 0xF4292244); d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
      c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7); b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3); d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
      c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D); b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F); d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
      c = II(c, d, a, b, x[k + 6], S43, 0xA3014314); b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
      a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82); d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
      c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB); b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
      a = AddUnsigned(a, AA); b = AddUnsigned(b, BB); c = AddUnsigned(c, CC); d = AddUnsigned(d, DD);
    }
    return (WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d)).toLowerCase();
  }

  React.useEffect(() => {
    if (!text) {
      setSha256("")
      setSha512("")
      setMd5("")
      return
    }

    setMd5(calcMd5(text))

    const encodeText = new TextEncoder().encode(text)
    
    crypto.subtle.digest("SHA-256", encodeText).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
      setSha256(hashHex)
    })

    crypto.subtle.digest("SHA-512", encodeText).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
      setSha512(hashHex)
    })
  }, [text])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">CRYPTOGRAPHIC HASH GENERATOR</span>
      
      <div>
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">INPUT TEXT STRING:</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to hash..."
          className="w-full h-20 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
        />
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-accent font-bold uppercase">SHA-256 Hash</span>
            {sha256 && <CopyBtn value={sha256} />}
          </div>
          <div className="w-full bg-zinc-950 border border-border p-2.5 text-xs text-foreground select-all break-all leading-normal">
            {sha256 || "Waiting for input..."}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-primary font-bold uppercase">SHA-512 Hash</span>
            {sha512 && <CopyBtn value={sha512} />}
          </div>
          <div className="w-full bg-zinc-950 border border-border p-2.5 text-xs text-foreground select-all break-all leading-normal">
            {sha512 || "Waiting for input..."}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-yellow-400 font-bold uppercase">MD5 Hash</span>
            {md5 && <CopyBtn value={md5} />}
          </div>
          <div className="w-full bg-zinc-950 border border-border p-2.5 text-xs text-foreground select-all break-all leading-normal">
            {md5 || "Waiting for input..."}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Base64Tool() {
  const [input, setInput] = React.useState("Hello OpenDev Hub")
  const [mode, setMode] = React.useState<"encode" | "decode">("encode")
  const [output, setOutput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setError(null)
    if (!input) {
      setOutput("")
      return
    }

    try {
      if (mode === "encode") {
        setOutput(btoa(input))
      } else {
        setOutput(atob(input))
      }
    } catch (e: any) {
      setError(e.message || "Failed processing Base64. Make sure input string is formatted correctly.")
      setOutput("")
    }
  }, [input, mode])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">BASE64 ENCODER / DECODER</span>
        <div className="flex border-2 border-foreground bg-black select-none">
          <button
            onClick={() => setMode("encode")}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "encode" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "decode" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">
            {mode === "encode" ? "PLAIN TEXT INPUT:" : "BASE64 CODED INPUT:"}
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Type normal string..." : "Paste base64 code..."}
            className="w-full h-64 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">
              {mode === "encode" ? "BASE64 CODED OUTPUT:" : "PLAIN TEXT OUTPUT:"}
            </span>
            {output && <CopyBtn value={output} />}
          </div>
          {error ? (
            <div className="w-full h-64 bg-red-950/20 border-2 border-destructive p-3 text-xs text-red-400 overflow-y-auto leading-relaxed">
              <strong>CONVERSION FAULT:</strong>
              <p className="mt-2">{error}</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Output will display here..."
              className="w-full h-64 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function UrlTool() {
  const [input, setInput] = React.useState("https://opendevhub.com/search?q=developer tools&lang=ts")
  const [mode, setMode] = React.useState<"encode" | "decode">("encode")
  const [output, setOutput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setError(null)
    if (!input) {
      setOutput("")
      return
    }

    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
    } catch (e: any) {
      setError(e.message || "Failed decoding string URL.")
      setOutput("")
    }
  }, [input, mode])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">URL ENCODER / DECODER</span>
        <div className="flex border-2 border-foreground bg-black select-none">
          <button
            onClick={() => setMode("encode")}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "encode" ? "bg-primary text-primary-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "decode" ? "bg-primary text-primary-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">INPUT:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste query string..."
            className="w-full h-64 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">CONVERTED OUTPUT:</span>
            {output && <CopyBtn value={output} />}
          </div>
          {error ? (
            <div className="w-full h-64 bg-red-950/20 border-2 border-destructive p-3 text-xs text-red-400 overflow-y-auto leading-relaxed">
              <strong>URL ERROR:</strong>
              <p className="mt-2">{error}</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Output will display here..."
              className="w-full h-64 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function PasswordGeneratorTool() {
  const [length, setLength] = React.useState(16)
  const [includeUpper, setIncludeUpper] = React.useState(true)
  const [includeLower, setIncludeLower] = React.useState(true)
  const [includeNumbers, setIncludeNumbers] = React.useState(true)
  const [includeSymbols, setIncludeSymbols] = React.useState(true)
  const [password, setPassword] = React.useState("")
  const [strength, setStrength] = React.useState("")

  const generatePassword = () => {
    let charset = ""
    if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-="

    if (!charset) {
      setPassword("SELECT AT LEAST ONE OPTION")
      setStrength("")
      return
    }

    let result = ""
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(result)

    let score = 0
    if (result.length >= 12) score++
    if (result.length >= 16) score++
    if (includeUpper && includeLower) score++
    if (includeNumbers) score++
    if (includeSymbols) score++

    if (score <= 2) setStrength("WEAK")
    else if (score <= 4) setStrength("MEDIUM")
    else setStrength("STRONG")
  }

  React.useEffect(() => {
    generatePassword()
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">RANDOM PASSWORD GENERATOR</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-bold text-zinc-400 mb-1">
              <span>LENGTH:</span>
              <span>{length} CHARS</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="w-full accent-accent bg-zinc-900 border border-zinc-800 p-1 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold select-none">
            <label className="flex items-center gap-2 border border-zinc-800 p-2 cursor-pointer bg-zinc-950">
              <input type="checkbox" checked={includeUpper} onChange={(e) => setIncludeUpper(e.target.checked)} className="accent-primary" />
              <span>A-Z KEYS</span>
            </label>
            <label className="flex items-center gap-2 border border-zinc-800 p-2 cursor-pointer bg-zinc-950">
              <input type="checkbox" checked={includeLower} onChange={(e) => setIncludeLower(e.target.checked)} className="accent-primary" />
              <span>a-z KEYS</span>
            </label>
            <label className="flex items-center gap-2 border border-zinc-800 p-2 cursor-pointer bg-zinc-950">
              <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="accent-primary" />
              <span>0-9 NUMS</span>
            </label>
            <label className="flex items-center gap-2 border border-zinc-800 p-2 cursor-pointer bg-zinc-950">
              <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="accent-primary" />
              <span>SPECIALS</span>
            </label>
          </div>
        </div>

        <div className="border-4 border-foreground p-5 bg-card relative shadow-[3px_3px_0px_0px_#ffffff] flex flex-col justify-between h-36">
          <div className="absolute right-4 top-4">
            {password !== "SELECT AT LEAST ONE OPTION" && <CopyBtn value={password} />}
          </div>
          <div className="text-sm font-black text-foreground break-all select-all pr-16 pt-2">
            {password}
          </div>
          {strength && (
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-bold uppercase">SECURITY STRENGTH:</span>
              <span className={`text-[10px] font-black px-2 py-0.5 border ${
                strength === "STRONG" 
                  ? "border-green-800 bg-green-950 text-green-400" 
                  : strength === "MEDIUM" 
                  ? "border-yellow-800 bg-yellow-950 text-yellow-400" 
                  : "border-red-800 bg-red-950 text-red-400"
              }`}>
                {strength}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function HtmlEntityCoderTool() {
  const [input, setInput] = React.useState("<div>Welcome to OpenDev Hub! & enjoy 100% offline tools.</div>")
  const [mode, setMode] = React.useState<"encode" | "decode">("encode")
  const [output, setOutput] = React.useState("")

  React.useEffect(() => {
    if (!input) {
      setOutput("")
      return
    }

    if (mode === "encode") {
      setOutput(input.replace(/[\u00A0-\u9999<>&"]/g, (c) => `&#${c.charCodeAt(0)};`))
    } else {
      const doc = new DOMParser().parseFromString(input, "text/html")
      setOutput(doc.documentElement.textContent || "")
    }
  }, [input, mode])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">HTML ENTITY ENCODER / DECODER</span>
        <div className="flex border-2 border-foreground bg-black select-none">
          <button
            onClick={() => setMode("encode")}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "encode" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "decode" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">
            {mode === "encode" ? "PLAIN TEXT INPUT:" : "HTML ENTITIES INPUT:"}
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">
              {mode === "encode" ? "HTML ENTITIES OUTPUT:" : "PLAIN TEXT OUTPUT:"}
            </span>
            {output && <CopyBtn value={output} />}
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-64 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
          />
        </div>
      </div>
    </div>
  )
}
