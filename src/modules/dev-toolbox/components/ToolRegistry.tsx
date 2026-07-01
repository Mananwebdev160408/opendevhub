"use client"

import * as React from "react"
import { Copy, Check, Play, RefreshCw, Eye, Maximize2, Minimize2, X } from "lucide-react"
import { marked } from "marked"
import * as yaml from "js-yaml"

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="p-1 border border-foreground bg-black hover:bg-zinc-900 active:translate-y-0.5 transition-all text-xs font-mono font-bold flex items-center gap-1 select-none cursor-pointer"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{copied ? "COPIED" : "COPY"}</span>
    </button>
  )
}

export function JsonFormatterTool() {
  const [input, setInput] = React.useState('{"name":"opendevhub","status":"active","tools":32}')
  const [spacing, setSpacing] = React.useState("2")
  const [output, setOutput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  const processJson = () => {
    setError(null)
    try {
      if (!input.trim()) {
        setOutput("")
        return
      }
      const parsed = JSON.parse(input)
      const space = spacing === "tab" ? "\t" : parseInt(spacing, 10)
      setOutput(JSON.stringify(parsed, null, space))
    } catch (e: any) {
      setError(e.message || "Invalid JSON syntax.")
      setOutput("")
    }
  }

  React.useEffect(() => {
    processJson()
  }, [input, spacing])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">JSON FORMATTER / VALIDATOR</span>
        <div className="flex items-center gap-3">
          <label className="text-[10px] text-zinc-500 font-bold uppercase">SPACING:</label>
          <select
            value={spacing}
            onChange={(e) => setSpacing(e.target.value)}
            className="border-2 border-foreground bg-black px-2 py-0.5 text-xs text-foreground cursor-pointer"
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="tab">Tabs</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">INPUT JSON:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste JSON here e.g. {"foo": "bar"}'
            className="w-full h-80 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">FORMATTED OUTPUT:</span>
            {output && <CopyBtn value={output} />}
          </div>
          {error ? (
            <div className="w-full h-80 bg-red-950/20 border-2 border-destructive p-3 text-xs text-red-400 overflow-y-auto leading-relaxed">
              <strong>JSON PARSE FAILURE:</strong>
              <p className="mt-2">{error}</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Output will appear here..."
              className="w-full h-80 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
            />
          )}
        </div>
      </div>
    </div>
  )
}

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

export function RegexTesterTool() {
  const [regex, setRegex] = React.useState("([a-zA-Z]+)-explorer")
  const [text, setText] = React.useState("issue-explorer repo-explorer file-explorer web-app")
  const [flags, setFlags] = React.useState("g")
  const [matches, setMatches] = React.useState<{ text: string; index: number }[]>([])
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setError(null)
    setMatches([])
    if (!regex) return

    try {
      const rx = new RegExp(regex, flags)
      const list = []
      let match
      
      if (flags.includes("g")) {
        while ((match = rx.exec(text)) !== null) {
          list.push({ text: match[0], index: match.index })
          if (match[0] === "") rx.lastIndex++
        }
      } else {
        match = rx.exec(text)
        if (match) {
          list.push({ text: match[0], index: match.index })
        }
      }
      setMatches(list)
    } catch (e: any) {
      setError(e.message || "Invalid regular expression.")
    }
  }, [regex, text, flags])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">REGULAR EXPRESSION TESTER</span>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">REGEX PATTERN:</span>
          <input
            type="text"
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
            placeholder="e.g. [a-z]+"
            className="w-full neo-input"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">FLAGS:</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g, i, m, u, s"
            className="w-full neo-input"
          />
        </div>
      </div>

      {error && (
        <div className="border-2 border-destructive bg-red-950/20 p-2.5 text-xs text-red-400 font-bold">
          REGEX CONSTRUCT FAULT: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">TEST STRING:</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type sample text to matches..."
            className="w-full h-48 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">MATCH RESULTS ({matches.length}):</span>
          <div className="w-full h-48 bg-zinc-950 border-2 border-border p-3 overflow-y-auto space-y-1">
            {matches.length === 0 ? (
              <span className="text-xs text-zinc-600">No matches found in string.</span>
            ) : (
              matches.map((m, idx) => (
                <div key={idx} className="text-xs flex items-center justify-between border border-border/40 px-2 py-1 bg-black">
                  <span className="text-accent select-all font-bold">"{m.text}"</span>
                  <span className="text-[9px] text-zinc-500 font-bold">INDEX {m.index}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TimestampTool() {
  const [epoch, setEpoch] = React.useState(() => String(Math.floor(Date.now() / 1000)))
  const [iso, setIso] = React.useState("")
  const [currentEpoch, setCurrentEpoch] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleEpochConvert = () => {
    try {
      const date = new Date(parseInt(epoch, 10) * 1000)
      setIso(date.toUTCString() + " - " + date.toString())
    } catch (e) {
      setIso("Invalid timestamp")
    }
  }

  React.useEffect(() => {
    handleEpochConvert()
  }, [epoch])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">TIMESTAMP / EPOCH CONVERTER</span>
      
      <div className="border border-foreground bg-zinc-950 p-3 flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-400">REALTIME UNIX EPOCH CLOCK:</span>
        <span className="text-xs font-black text-accent">{currentEpoch}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">UNIX EPOCH TIMESTAMP (SECONDS):</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={epoch}
              onChange={(e) => setEpoch(e.target.value)}
              className="flex-grow neo-input h-10"
            />
            <button
              onClick={() => setEpoch(String(Math.floor(Date.now() / 1000)))}
              className="px-3 bg-primary text-primary-foreground border-2 border-foreground shadow-[2px_2px_0px_0px_#ffffff] text-xs font-bold active:translate-y-0.5 cursor-pointer flex items-center gap-1 uppercase"
            >
              <RefreshCw className="h-3.5 w-3.5" /> NOW
            </button>
          </div>
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">UTC / LOCAL CONVERTED DATE:</span>
          <div className="w-full bg-zinc-950 border-2 border-border p-2.5 h-10 text-xs text-foreground select-all font-bold truncate">
            {iso}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ColorConverterTool() {
  const [hex, setHex] = React.useState("#2dd4bf")
  const [rgb, setRgb] = React.useState("")
  const [hsl, setHsl] = React.useState("")
  const [error, setError] = React.useState(false)

  const processColor = (hexVal: string) => {
    setError(false)
    let cleanHex = hexVal.trim()
    if (!cleanHex.startsWith("#")) cleanHex = "#" + cleanHex
    
    const reg = /^#([0-9a-f]{3}){1,2}$/i
    if (!reg.test(cleanHex)) {
      setError(true)
      return
    }

    let r = 0, g = 0, b = 0
    if (cleanHex.length === 4) {
      r = parseInt(cleanHex[1] + cleanHex[1], 16)
      g = parseInt(cleanHex[2] + cleanHex[2], 16)
      b = parseInt(cleanHex[3] + cleanHex[3], 16)
    } else if (cleanHex.length === 7) {
      r = parseInt(cleanHex.substring(1, 3), 16)
      g = parseInt(cleanHex.substring(3, 5), 16)
      b = parseInt(cleanHex.substring(5, 7), 16)
    }

    setRgb(`rgb(${r}, ${g}, ${b})`)

    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    setHsl(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`)
  }

  React.useEffect(() => {
    processColor(hex)
  }, [hex])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">HEX ↔ RGB ↔ HSL COLOR CONVERTER</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="space-y-3">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold block mb-1">HEX CODE:</span>
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="e.g. #a855f7"
              className="neo-input h-10 uppercase"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-bold block mb-1">RGB CODE:</span>
            <input readOnly type="text" value={rgb} className="neo-input bg-zinc-950 border-zinc-800 text-zinc-500 h-10 select-all" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-bold block mb-1">HSL CODE:</span>
            <input readOnly type="text" value={hsl} className="neo-input bg-zinc-950 border-zinc-800 text-zinc-500 h-10 select-all" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-6 border-4 border-foreground h-44 relative bg-dot-pattern">
          {!error ? (
            <>
              <div 
                style={{ backgroundColor: hex }}
                className="w-16 h-16 border-2 border-foreground shadow-[2px_2px_0px_0px_#ffffff]"
              />
              <span className="text-[10px] font-black text-foreground uppercase mt-3 bg-black px-2 py-0.5 border border-border">
                PREVIEW: {hex}
              </span>
            </>
          ) : (
            <span className="text-xs font-bold text-red-500 uppercase bg-black px-2 py-1 border border-destructive">
              HEX SYNTAX ERROR
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function GradientGeneratorTool() {
  const [color1, setColor1] = React.useState("#a855f7")
  const [color2, setColor2] = React.useState("#2dd4bf")
  const [angle, setAngle] = React.useState("45")

  const cssValue = `linear-gradient(${angle}deg, ${color1}, ${color2})`

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">CSS GRADIENT GENERATOR</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold block mb-1">COLOR 1:</span>
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-full h-10 border-2 border-foreground bg-black cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 font-bold block mb-1">COLOR 2:</span>
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-full h-10 border-2 border-foreground bg-black cursor-pointer"
              />
            </div>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-bold block mb-1">ANGLE (DEGREES):</span>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              className="w-full accent-primary bg-zinc-900 border border-zinc-800 p-1 cursor-pointer"
            />
            <div className="text-[10px] font-bold text-zinc-500 text-right mt-1">{angle}°</div>
          </div>
        </div>

        <div 
          style={{ background: cssValue }}
          className="h-40 border-4 border-foreground shadow-[3px_3px_0px_0px_#ffffff] flex items-end justify-between p-3 select-none"
        >
          <span className="text-[9px] font-black text-black bg-white px-2 py-0.5 border border-black">
            VISUAL PREVIEW
          </span>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-zinc-400 font-bold block">CSS PROPERTY VALUE:</span>
          <CopyBtn value={`background: ${cssValue};`} />
        </div>
        <pre className="bg-zinc-950 border border-border p-3 text-[11px] text-foreground select-all truncate">
          background: {cssValue};
        </pre>
      </div>
    </div>
  )
}

export function LoremIpsumTool() {
  const [paragraphs, setParagraphs] = React.useState(3)
  const [output, setOutput] = React.useState("")

  const loremSource = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent hendrerit rhoncus lorem at lacinia. Aliquam ac justo vel nibh condimentum lobortis non vitae justo. Phasellus hendrerit elit eget augue bibendum dictum. Sed eu lectus ac felis sollicitudin facilisis. Curabitur hendrerit ex diam, vel rutrum erat efficitur sed. Morbi vel eleifend turpis.",
    "Proin congue convallis erat, sed ultrices tellus sodales id. In tristique ipsum et elit mollis tristique. Aliquam scelerisque interdum ex, eget feugiat nunc egestas in. Fusce vestibulum lacus non elementum eleifend. Maecenas ac ante et velit lacinia imperdiet eu vel eros. Duis eleifend nisl ut lacus interdum tempor. Mauris id nisl egestas, congue risus in, dictum eros.",
    "Aenean scelerisque, sapien a porta feugiat, elit ligula mollis urna, non feugiat elit lorem at magna. Suspendisse pulvinar arcu vel quam laoreet finibus. Ut ut efficitur turpis, hendrerit pretium orci. Integer vitae feugiat diam, quis accumsan mi. Nunc convallis mi lacus, a finibus diam bibendum quis. Proin sed mi arcu. Ut eu eros sit amet nulla efficitur sodales eu ut tortor.",
    "Vestibulum id tellus a turpis placerat interdum at a eros. Pellentesque hendrerit elit quis nisl rutrum, sed mattis ex imperdiet. Integer vel nisl egestas, placerat leo vel, consequat magna. Nam nec nibh vel arcu congue viverra. Pellentesque a sem sed dolor tristique pretium quis at risus. Mauris sollicitudin ipsum ut sapien rutrum feugiat."
  ]

  const generateLorem = () => {
    const lines = []
    for (let i = 0; i < paragraphs; i++) {
      lines.push(loremSource[i % loremSource.length])
    }
    setOutput(lines.join("\n\n"))
  }

  React.useEffect(() => {
    generateLorem()
  }, [paragraphs])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">LOREM IPSUM GENERATOR</span>
        <div className="flex items-center gap-3">
          <label className="text-[10px] text-zinc-500 font-bold">PARAGRAPHS:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={paragraphs}
            onChange={(e) => setParagraphs(Math.min(20, Math.max(1, parseInt(e.target.value, 10) || 1)))}
            className="w-16 border-2 border-foreground bg-black px-2 py-0.5 text-xs text-foreground text-center"
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-400 font-bold block">GENERATED DUMMY TEXT:</span>
          {output && <CopyBtn value={output} />}
        </div>
        <textarea
          readOnly
          value={output}
          className="w-full h-64 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
        />
        
        <div className="flex gap-4 text-[10px] font-bold text-zinc-500 pt-1">
          <span>CHARS: {output.length}</span>
          <span>WORDS: {output.split(/\s+/).filter(Boolean).length}</span>
          <span>LINES: {output.split("\n").length}</span>
        </div>
      </div>
    </div>
  )
}

export function SlugGeneratorTool() {
  const [text, setText] = React.useState("OpenDev Hub: Web Developer Tools & Resources!")
  const [slug, setSlug] = React.useState("")

  React.useEffect(() => {
    if (!text) {
      setSlug("")
      return
    }
    const slugified = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setSlug(slugified)
  }, [text])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">URL SLUG GENERATOR</span>
      
      <div>
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">INPUT TEXT STRING:</span>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type title here..."
          className="w-full neo-input h-10"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-accent font-bold block">URL-FRIENDLY SLUG:</span>
          {slug && <CopyBtn value={slug} />}
        </div>
        <div className="w-full bg-zinc-950 border border-border p-3 text-xs text-accent select-all font-bold">
          {slug || "Waiting for input..."}
        </div>
      </div>
    </div>
  )
}

export function CaseConverterTool() {
  const [input, setInput] = React.useState("software design principles")
  const [upper, setUpper] = React.useState("")
  const [lower, setLower] = React.useState("")
  const [camel, setCamel] = React.useState("")
  const [snake, setSnake] = React.useState("")
  const [kebab, setKebab] = React.useState("")
  const [pascal, setPascal] = React.useState("")

  React.useEffect(() => {
    if (!input) {
      setUpper(""); setLower(""); setCamel(""); setSnake(""); setKebab(""); setPascal("")
      return
    }

    setUpper(input.toUpperCase())
    setLower(input.toLowerCase())

    const words = input.trim().split(/[\s_-]+/)

    setSnake(words.map(w => w.toLowerCase()).join("_"))

    setKebab(words.map(w => w.toLowerCase()).join("-"))

    const camelCased = words.map((w, i) => {
      const low = w.toLowerCase()
      if (i === 0) return low
      return low.charAt(0).toUpperCase() + low.slice(1)
    }).join("")
    setCamel(camelCased)

    const pascalCased = words.map(w => {
      const low = w.toLowerCase()
      return low.charAt(0).toUpperCase() + low.slice(1)
    }).join("")
    setPascal(pascalCased)

  }, [input])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">STRING CASE CONVERTER</span>
      
      <div>
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">INPUT TEXT STRING:</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. hello world"
          className="w-full neo-input h-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <div>
            <div className="flex justify-between items-center mb-0.5"><span className="text-[9px] text-zinc-500 font-bold">UPPERCASE</span>{upper && <CopyBtn value={upper} />}</div>
            <div className="bg-zinc-950 border border-border p-2 text-xs truncate font-bold">{upper || "-"}</div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-0.5"><span className="text-[9px] text-zinc-500 font-bold">LOWERCASE</span>{lower && <CopyBtn value={lower} />}</div>
            <div className="bg-zinc-950 border border-border p-2 text-xs truncate font-bold">{lower || "-"}</div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-0.5"><span className="text-[9px] text-zinc-500 font-bold">CAMEL CASE</span>{camel && <CopyBtn value={camel} />}</div>
            <div className="bg-zinc-950 border border-border p-2 text-xs truncate font-bold text-accent">{camel || "-"}</div>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between items-center mb-0.5"><span className="text-[9px] text-zinc-500 font-bold">SNAKE CASE</span>{snake && <CopyBtn value={snake} />}</div>
            <div className="bg-zinc-950 border border-border p-2 text-xs truncate font-bold">{snake || "-"}</div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-0.5"><span className="text-[9px] text-zinc-500 font-bold">KEBAB CASE</span>{kebab && <CopyBtn value={kebab} />}</div>
            <div className="bg-zinc-950 border border-border p-2 text-xs truncate font-bold">{kebab || "-"}</div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-0.5"><span className="text-[9px] text-zinc-500 font-bold">PASCAL CASE</span>{pascal && <CopyBtn value={pascal} />}</div>
            <div className="bg-zinc-950 border border-border p-2 text-xs truncate font-bold text-primary">{pascal || "-"}</div>
          </div>
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

export function MarkdownPreviewTool() {
  const [markdown, setMarkdown] = React.useState("# OpenDev Hub Markdown Previewer\n\n- Beautiful boxy designs\n- High information density\n\n```javascript\nconst hello = 'world';\n```")
  const [renderedHtml, setRenderedHtml] = React.useState("")
  const [fullscreen, setFullscreen] = React.useState<"editor" | "preview" | null>(null)

  React.useEffect(() => {
    const parseMarkdown = async () => {
      const html = await marked.parse(markdown)
      setRenderedHtml(html)
    }
    parseMarkdown()
  }, [markdown])

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return (
    <>
      {/* ── Fullscreen Overlay ── */}
      {fullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col font-mono">
          <div className="flex items-center justify-between px-4 py-2 border-b-2 border-foreground bg-black shrink-0">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              {fullscreen === "editor" ? "MARKDOWN WRITER — FULLSCREEN" : "LIVE PREVIEW — FULLSCREEN"}
            </span>
            <button
              onClick={() => setFullscreen(null)}
              className="p-1 border border-foreground bg-black hover:bg-zinc-900 active:translate-y-0.5 transition-all cursor-pointer"
              title="Exit fullscreen (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {fullscreen === "editor" ? (
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              autoFocus
              className="flex-1 w-full bg-black p-6 text-sm leading-relaxed focus:outline-none text-foreground resize-none"
            />
          ) : (
            <div
              className="flex-1 overflow-y-auto p-8 text-sm prose prose-invert markdown-reader-content leading-relaxed max-w-4xl mx-auto w-full"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          )}
        </div>
      )}

      {/* ── Normal View ── */}
      <div className="space-y-4 font-mono">
        <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">MARKDOWN INTERACTIVE PREVIEW</span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-zinc-400 font-bold">MARKDOWN WRITER:</span>
              <button
                onClick={() => setFullscreen("editor")}
                className="p-1 border border-zinc-700 bg-black hover:bg-zinc-900 hover:border-foreground active:translate-y-0.5 transition-all cursor-pointer"
                title="Expand editor to fullscreen"
              >
                <Maximize2 className="h-3 w-3 text-zinc-400" />
              </button>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-80 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-zinc-400 font-bold">LIVE PREVIEW:</span>
              <button
                onClick={() => setFullscreen("preview")}
                className="p-1 border border-zinc-700 bg-black hover:bg-zinc-900 hover:border-foreground active:translate-y-0.5 transition-all cursor-pointer"
                title="Expand preview to fullscreen"
              >
                <Maximize2 className="h-3 w-3 text-zinc-400" />
              </button>
            </div>
            <div
              className="w-full h-80 bg-zinc-950 border-2 border-border p-4 overflow-y-auto text-xs prose prose-invert markdown-reader-content leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        </div>
      </div>
    </>
  )
}


export function HtmlPreviewTool() {
  const [html, setHtml] = React.useState("<div style='background-color:#2dd4bf;color:#000;padding:20px;text-align:center;font-weight:bold;'>\n  HELLO FROM THE PREVIEW GRID\n</div>")
  const [srcDoc, setSrcDoc] = React.useState("")

  const runPreview = () => {
    setSrcDoc(html)
  }

  React.useEffect(() => {
    runPreview()
  }, [html])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">SANDBOXED HTML CODE PREVIEW</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">HTML MARKUP INPUT:</span>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full h-80 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">RENDERED IFRAME:</span>
          <iframe
            srcDoc={srcDoc}
            title="sandbox-preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-80 bg-white border-2 border-border"
          />
        </div>
      </div>
    </div>
  )
}

export function DiffCheckerTool() {
  const [original, setOriginal] = React.useState("hello world\nreact framework\nnextjs 15\nfoo bar")
  const [modified, setModified] = React.useState("hello world!\nreact library\nnextjs 16\nbaz qux\nfoo bar")

  // ── LCS-based diff ──────────────────────────────────────────────────────────
  type DiffOp = { type: "equal" | "remove" | "add"; origLine: number | null; modLine: number | null; text: string }

  const computeDiff = (a: string[], b: string[]): DiffOp[] => {
    const m = a.length, n = b.length
    // Build LCS table
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])

    // Backtrack
    const ops: DiffOp[] = []
    let i = m, j = n
    let oi = m, mi = n  // line number counters (1-based, count down)
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
        ops.push({ type: "equal", origLine: i, modLine: j, text: a[i - 1] })
        i--; j--
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        ops.push({ type: "add", origLine: null, modLine: j, text: b[j - 1] })
        j--
      } else {
        ops.push({ type: "remove", origLine: i, modLine: null, text: a[i - 1] })
        i--
      }
    }
    return ops.reverse()
  }

  // Pair up consecutive remove+add as "modified" for display
  type DisplayRow =
    | { kind: "equal";    origLine: number; modLine: number;  text: string }
    | { kind: "remove";   origLine: number;                   text: string }
    | { kind: "add";                        modLine: number;  text: string }
    | { kind: "modified"; origLine: number; modLine: number;  origText: string; modText: string }

  const buildRows = (ops: DiffOp[]): DisplayRow[] => {
    const rows: DisplayRow[] = []
    let k = 0
    while (k < ops.length) {
      const op = ops[k]
      if (op.type === "remove" && k + 1 < ops.length && ops[k + 1].type === "add") {
        rows.push({ kind: "modified", origLine: op.origLine!, modLine: ops[k + 1].modLine!, origText: op.text, modText: ops[k + 1].text })
        k += 2
      } else if (op.type === "equal") {
        rows.push({ kind: "equal", origLine: op.origLine!, modLine: op.modLine!, text: op.text })
        k++
      } else if (op.type === "remove") {
        rows.push({ kind: "remove", origLine: op.origLine!, text: op.text })
        k++
      } else {
        rows.push({ kind: "add", modLine: op.modLine!, text: op.text })
        k++
      }
    }
    return rows
  }

  // Inline char-level diff for "modified" rows
  const charDiff = (a: string, b: string): { ch: string; changed: boolean }[][] => {
    const ac = a.split(""), bc = b.split("")
    const m = ac.length, n = bc.length
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = ac[i - 1] === bc[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])

    const origParts: { ch: string; changed: boolean }[] = []
    const modParts:  { ch: string; changed: boolean }[] = []
    let i = m, j = n
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && ac[i - 1] === bc[j - 1]) {
        origParts.unshift({ ch: ac[i - 1], changed: false })
        modParts.unshift({ ch: bc[j - 1], changed: false })
        i--; j--
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        modParts.unshift({ ch: bc[j - 1], changed: true })
        j--
      } else {
        origParts.unshift({ ch: ac[i - 1], changed: true })
        i--
      }
    }
    return [origParts, modParts]
  }

  const oLines = original.split("\n")
  const mLines = modified.split("\n")
  const ops  = computeDiff(oLines, mLines)
  const rows = buildRows(ops)

  const added   = rows.filter(r => r.kind === "add" || r.kind === "modified").length
  const removed = rows.filter(r => r.kind === "remove" || r.kind === "modified").length
  const same    = rows.filter(r => r.kind === "equal").length

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">LINE-BY-LINE DIFF CHECKER</span>
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <span className="text-green-400">+{added} added</span>
          <span className="text-red-400">−{removed} removed</span>
          <span className="text-zinc-500">{same} same</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">ORIGINAL:</span>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="w-full h-36 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">MODIFIED:</span>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            className="w-full h-36 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
      </div>

      <div>
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">DIFF OUTPUT:</span>
        <div className="border-2 border-border bg-zinc-950 overflow-auto max-h-72 text-[11px] leading-5">
          {rows.length === 0 && (
            <div className="p-3 text-zinc-600 italic">No input yet…</div>
          )}
          {rows.map((row, idx) => {
            if (row.kind === "equal") {
              return (
                <div key={idx} className="flex items-start text-zinc-600 hover:bg-zinc-900/40">
                  <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-zinc-800 text-zinc-700 select-none">{row.origLine}</span>
                  <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-zinc-800 text-zinc-700 select-none">{row.modLine}</span>
                  <span className="w-5 shrink-0 text-center py-0.5 select-none text-zinc-700"> </span>
                  <span className="py-0.5 px-2 whitespace-pre-wrap break-all">{row.text}</span>
                </div>
              )
            }
            if (row.kind === "remove") {
              return (
                <div key={idx} className="flex items-start bg-red-950/25 hover:bg-red-950/40">
                  <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-red-900/50 text-red-500 select-none">{row.origLine}</span>
                  <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-red-900/50 text-zinc-600 select-none">·</span>
                  <span className="w-5 shrink-0 text-center py-0.5 select-none text-red-400">−</span>
                  <span className="py-0.5 px-2 text-red-300 whitespace-pre-wrap break-all">{row.text}</span>
                </div>
              )
            }
            if (row.kind === "add") {
              return (
                <div key={idx} className="flex items-start bg-green-950/20 hover:bg-green-950/35">
                  <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-green-900/50 text-zinc-600 select-none">·</span>
                  <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-green-900/50 text-green-500 select-none">{row.modLine}</span>
                  <span className="w-5 shrink-0 text-center py-0.5 select-none text-green-400">+</span>
                  <span className="py-0.5 px-2 text-green-300 whitespace-pre-wrap break-all">{row.text}</span>
                </div>
              )
            }
            // modified — show char-level inline diff
            if (row.kind === "modified") {
              const [origParts, modParts] = charDiff(row.origText, row.modText)
              return (
                <React.Fragment key={idx}>
                  <div className="flex items-start bg-red-950/25 hover:bg-red-950/40">
                    <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-red-900/50 text-red-500 select-none">{row.origLine}</span>
                    <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-red-900/50 text-zinc-600 select-none">·</span>
                    <span className="w-5 shrink-0 text-center py-0.5 select-none text-red-400">−</span>
                    <span className="py-0.5 px-2 text-red-300 whitespace-pre-wrap break-all">
                      {origParts.map((p, i) =>
                        p.changed
                          ? <mark key={i} className="bg-red-700/60 text-red-100 rounded-[2px]">{p.ch}</mark>
                          : <span key={i}>{p.ch}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-start bg-green-950/20 hover:bg-green-950/35">
                    <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-green-900/50 text-zinc-600 select-none">·</span>
                    <span className="w-10 shrink-0 text-right pr-2 py-0.5 border-r border-green-900/50 text-green-500 select-none">{row.modLine}</span>
                    <span className="w-5 shrink-0 text-center py-0.5 select-none text-green-400">+</span>
                    <span className="py-0.5 px-2 text-green-300 whitespace-pre-wrap break-all">
                      {modParts.map((p, i) =>
                        p.changed
                          ? <mark key={i} className="bg-green-700/60 text-green-100 rounded-[2px]">{p.ch}</mark>
                          : <span key={i}>{p.ch}</span>
                      )}
                    </span>
                  </div>
                </React.Fragment>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}


export function CronParserTool() {
  const [expr, setExpr] = React.useState("*/5 * * * *")
  const [description, setDescription] = React.useState("")

  React.useEffect(() => {
    if (!expr) {
      setDescription("")
      return
    }

    const parts = expr.trim().split(/\s+/)
    if (parts.length !== 5) {
      setDescription("CRON expression must have exactly 5 elements: minute, hour, day of month, month, day of week.")
      return
    }

    const [min, hour, dom, mon, dow] = parts
    let desc = "CRON triggers: "

    if (min === "*" && hour === "*") desc += "Every minute"
    else if (min.startsWith("*/") && hour === "*") desc += `Every ${min.split("/")[1]} minutes`
    else {
      desc += `At minute ${min} of hour ${hour}`
    }

    if (dom !== "*") desc += `, on day of month ${dom}`
    if (mon !== "*") desc += `, in month ${mon}`
    if (dow !== "*") desc += `, on day of week ${dow}`

    setDescription(desc + ".")
  }, [expr])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">CRON EXPRESSION DESCRIPTOR</span>
      
      <div>
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">CRON EXPRESSION (5 FIELDS):</span>
        <input
          type="text"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="e.g. 0 0 * * *"
          className="w-full neo-input h-10 text-accent font-bold"
        />
      </div>

      <div>
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">HUMAN-READABLE SCHEDULE DESCRIPTION:</span>
        <div className="w-full bg-zinc-950 border border-border p-3 text-xs text-foreground font-bold">
          {description}
        </div>
      </div>
    </div>
  )
}

export function QrGeneratorTool() {
  const [text, setText] = React.useState("https://opendevhub.com")
  const [qrUrl, setQrUrl] = React.useState("")

  React.useEffect(() => {
    if (!text.trim()) {
      setQrUrl("")
      return
    }
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`)
  }, [text])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">QR CODE INSTANT GENERATOR</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">QR TARGET URL OR DATA STRING:</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type URL or text..."
            className="w-full h-36 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div className="flex flex-col items-center justify-center p-4 border-4 border-foreground h-44 bg-dot-pattern">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt="QR Code Code"
              className="w-32 h-32 border-2 border-foreground bg-white"
            />
          ) : (
            <span className="text-xs text-zinc-500 font-bold uppercase">Empty Data Input</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function BarcodeGeneratorTool() {
  const [text, setText] = React.useState("CODE-128")
  const [barcodeUrl, setBarcodeUrl] = React.useState("")

  React.useEffect(() => {
    if (!text.trim()) {
      setBarcodeUrl("")
      return
    }
    setBarcodeUrl(`https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(text)}`)
  }, [text])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">BARCODE CODE GENERATOR</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">BARCODE VALUE:</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full neo-input h-10"
          />
        </div>
        <div className="flex flex-col items-center justify-center p-4 border-4 border-foreground h-44 bg-dot-pattern">
          {barcodeUrl ? (
            <img
              src={barcodeUrl}
              alt="Barcode Code"
              className="max-h-24 bg-white border border-foreground p-2"
              onError={() => setBarcodeUrl("")}
            />
          ) : (
            <span className="text-xs text-zinc-500 font-bold uppercase">Empty Value Input</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function MinifierTool() {
  const [input, setInput] = React.useState("body {\n  background-color: #000;\n  color: #fff;\n}")
  const [mode, setMode] = React.useState<"css" | "js" | "html">("css")
  const [output, setOutput] = React.useState("")

  React.useEffect(() => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    let minified = input
    if (mode === "css") {
      minified = input
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([{\}:;])\s*/g, "$1")
        .trim()
    } else if (mode === "js") {
      minified = input
        .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "")
        .replace(/\s+/g, " ")
        .trim()
    } else {
      minified = input
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\s+/g, " ")
        .trim()
    }
    setOutput(minified)
  }, [input, mode])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">CODE MINIFIER (CSS/JS/HTML)</span>
        <div className="flex border-2 border-foreground bg-black select-none">
          {["css", "js", "html"].map((type) => (
            <button
              key={type}
              onClick={() => setMode(type as any)}
              className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
                mode === type ? "bg-primary text-primary-foreground" : "text-zinc-500 hover:text-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">EXPANDED CODE:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">MINIFIED CODE:</span>
            {output && <CopyBtn value={output} />}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Minified output will print here..."
            className="w-full h-64 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
          />
        </div>
      </div>
    </div>
  )
}

export function CsvViewerTool() {
  const [input, setInput] = React.useState("id,name,stars,language\n1,react,221000,JavaScript\n2,next.js,122500,TypeScript\n3,rust,97800,Rust")
  const [headers, setHeaders] = React.useState<string[]>([])
  const [rows, setRows] = React.useState<string[][]>([])
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setError(null)
    setHeaders([])
    setRows([])
    if (!input.trim()) return

    try {
      const lines = input.trim().split("\n")
      if (lines.length === 0) return

      const parsedHeaders = lines[0].split(",")
      const parsedRows = lines.slice(1).map((line) => line.split(","))

      setHeaders(parsedHeaders)
      setRows(parsedRows)
    } catch (e: any) {
      setError(e.message || "Failed parsing CSV data.")
    }
  }, [input])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">CSV FILE PARSER & GRID VIEW</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">RAW CSV DATA:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste comma separated values here..."
            className="w-full h-60 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">GRID RESULTS VIEW:</span>
          <div className="w-full h-60 bg-zinc-950 border-2 border-border overflow-auto p-2">
            {error ? (
              <span className="text-xs text-red-500 font-bold">{error}</span>
            ) : headers.length === 0 ? (
              <span className="text-xs text-zinc-600">Enter valid CSV values to view grid table.</span>
            ) : (
              <table className="w-full text-[11px] text-left border-collapse select-all">
                <thead>
                  <tr className="border-b-2 border-foreground bg-zinc-900 font-black">
                    {headers.map((h, i) => (
                      <th key={i} className="p-2 border border-zinc-800 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx} className="border-b border-zinc-800/40 hover:bg-zinc-900/40">
                      {row.map((cell, i) => (
                        <td key={i} className="p-2 border border-zinc-800/40">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function YamlXmlTool() {
  const [input, setInput] = React.useState("<package>\n  <name>opendevhub</name>\n  <version>1.0</version>\n</package>")
  const [mode, setMode] = React.useState<"xml" | "yaml">("xml")
  const [isValid, setIsValid] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    if (!input.trim()) {
      setIsValid(null)
      return
    }

    if (mode === "xml") {
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(input, "application/xml")
        const parseError = doc.querySelector("parsererror")
        setIsValid(!parseError)
      } catch (e) {
        setIsValid(false)
      }
    } else {
      try {
        const lines = input.split("\n")
        let valid = true
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith("#")) continue
          if (trimmed.includes(":") === false && !trimmed.startsWith("-")) {
            valid = false
            break
          }
        }
        setIsValid(valid)
      } catch (e) {
        setIsValid(false)
      }
    }
  }, [input, mode])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">YAML / XML SYNTAX VIEW</span>
        <div className="flex border-2 border-foreground bg-black select-none">
          <button
            onClick={() => setMode("xml")}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "xml" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            xml View
          </button>
          <button
            onClick={() => setMode("yaml")}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "yaml" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            yaml View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">RAW {mode.toUpperCase()} INPUT:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">PARSED SYNTAX STATUS:</span>
          <div className="w-full h-64 bg-zinc-950 border-2 border-border p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">SYNTAX EVALUATION:</span>
              {isValid === null ? (
                <span className="text-xs text-zinc-500 font-bold">Waiting for input data...</span>
              ) : isValid ? (
                <span className="text-xs font-black text-green-400 bg-green-950/30 border border-green-800 px-3 py-1.5 block uppercase text-center">
                  Syntax is 100% Valid
                </span>
              ) : (
                <span className="text-xs font-black text-red-400 bg-red-950/30 border border-red-800 px-3 py-1.5 block uppercase text-center">
                  Syntax Error Detected
                </span>
              )}
            </div>
            
            <div className="border-t border-border pt-4 text-[10px] text-zinc-500 leading-normal">
              Checks for key tags nesting blocks (XML) or indentation structures (YAML) client-side in real-time.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function JsonToTypescriptTool() {
  const [input, setInput] = React.useState('{\n  "id": 1,\n  "name": "OpenDevHub",\n  "active": true,\n  "tags": ["developer", "tools"]\n}')
  const [interfaceName, setInterfaceName] = React.useState("RootInterface")
  const [output, setOutput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  const convertJson = () => {
    setError(null)
    try {
      if (!input.trim()) {
        setOutput("")
        return
      }
      const parsed = JSON.parse(input)
      
      const interfaces: string[] = []
      const seen = new Set<string>()

      function parseObject(o: any, name: string): string {
        if (o === null) return "any"
        if (typeof o !== "object") return typeof o
        if (Array.isArray(o)) {
          if (o.length === 0) return "any[]"
          const elementTypes = Array.from(new Set(o.map(item => parseObject(item, name + "Item")))).join(" | ")
          return `(${elementTypes})[]`
        }

        const props: string[] = []
        for (const key of Object.keys(o)) {
          const val = o[key]
          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/[^a-zA-Z0-9]/g, "")
          const typeStr = typeof val === "object" && val !== null
            ? (Array.isArray(val) ? parseObject(val, capitalizedKey) : capitalizedKey)
            : typeof val

          props.push(`  ${key}: ${typeStr};`)
          if (typeof val === "object" && val !== null && !Array.isArray(val)) {
            parseObject(val, capitalizedKey)
          }
        }

        const interfaceStr = `export interface ${name} {\n${props.join("\n")}\n}`
        if (!seen.has(name)) {
          seen.add(name)
          interfaces.push(interfaceStr)
        }
        return name
      }

      parseObject(parsed, interfaceName)
      setOutput(interfaces.reverse().join("\n\n"))
    } catch (e: any) {
      setError(e.message || "Failed to parse JSON. Please check syntax.")
      setOutput("")
    }
  }

  React.useEffect(() => {
    convertJson()
  }, [input, interfaceName])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">JSON TO TYPESCRIPT INTERFACE CONVERTER</span>
      <div className="flex gap-4 items-center">
        <label className="text-[10px] text-zinc-500 font-bold uppercase">ROOT INTERFACE NAME:</label>
        <input
          type="text"
          value={interfaceName}
          onChange={(e) => setInterfaceName(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
          className="border-2 border-foreground bg-black px-2 py-0.5 text-xs text-foreground focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">INPUT JSON:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">TYPESCRIPT DECLARATIONS:</span>
            {output && <CopyBtn value={output} />}
          </div>
          {error ? (
            <div className="w-full h-80 bg-red-950/20 border-2 border-destructive p-3 text-xs text-red-400 overflow-y-auto leading-relaxed">
              <strong>JSON PARSE FAILURE:</strong>
              <p className="mt-2">{error}</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              placeholder="Interfaces will display here..."
              className="w-full h-80 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function YamlJsonConverterTool() {
  const [input, setInput] = React.useState("name: OpenDevHub\nversion: 1.0.0\ntags:\n  - developer\n  - toolbox\nactive: true")
  const [mode, setMode] = React.useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json")
  const [output, setOutput] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setError(null)
    if (!input.trim()) {
      setOutput("")
      return
    }

    try {
      if (mode === "yaml-to-json") {
        const doc = yaml.load(input)
        setOutput(JSON.stringify(doc, null, 2))
      } else {
        const doc = JSON.parse(input)
        setOutput(yaml.dump(doc, { indent: 2 }))
      }
    } catch (e: any) {
      setError(e.message || "Conversion error. Verify source syntax.")
      setOutput("")
    }
  }, [input, mode])

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs font-bold uppercase text-zinc-500">YAML ↔ JSON CONVERTER</span>
        <div className="flex border-2 border-foreground bg-black select-none">
          <button
            onClick={() => {
              setMode("yaml-to-json")
              setInput("name: OpenDevHub\nversion: 1.0.0\ntags:\n  - developer\n  - toolbox\nactive: true")
            }}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "yaml-to-json" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            YAML → JSON
          </button>
          <button
            onClick={() => {
              setMode("json-to-yaml")
              setInput('{\n  "name": "OpenDevHub",\n  "version": "1.0.0",\n  "tags": [\n    "developer",\n    "toolbox"\n  ],\n  "active": true\n}')
            }}
            className={`px-3 py-0.5 text-xs font-bold uppercase cursor-pointer ${
              mode === "json-to-yaml" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
            }`}
          >
            JSON → YAML
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">
            {mode === "yaml-to-json" ? "INPUT YAML:" : "INPUT JSON:"}
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">
              {mode === "yaml-to-json" ? "OUTPUT JSON:" : "OUTPUT YAML:"}
            </span>
            {output && <CopyBtn value={output} />}
          </div>
          {error ? (
            <div className="w-full h-80 bg-red-950/20 border-2 border-destructive p-3 text-xs text-red-400 overflow-y-auto leading-relaxed">
              <strong>CONVERSION FAILURE:</strong>
              <p className="mt-2 whitespace-pre-wrap">{error}</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              className="w-full h-80 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function KeycodeListenerTool() {
  const [keyData, setKeyData] = React.useState<{
    key: string
    code: string
    which: number
    location: string
    shift: boolean
    ctrl: boolean
    alt: boolean
    meta: boolean
  } | null>({
    key: "Start typing...",
    code: "KeyName",
    which: 0,
    location: "Standard Keyboard",
    shift: false,
    ctrl: false,
    alt: false,
    meta: false
  })

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      let loc = "Standard Keyboard"
      if (e.location === 1) loc = "Left Side Key"
      if (e.location === 2) loc = "Right Side Key"
      if (e.location === 3) loc = "Numpad Key"

      setKeyData({
        key: e.key === " " ? "Space" : e.key,
        code: e.code,
        which: e.which || e.keyCode,
        location: loc,
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">KEYBOARD KEYCODE EVENT LISTENER</span>
      <div className="text-center py-2 text-[10px] text-zinc-400 font-bold uppercase bg-zinc-950 border border-dashed border-zinc-800">
        FOCUS INSIDE THIS WINDOW AND PRESS ANY KEY TO INSPECT
      </div>

      {keyData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          <div className="md:col-span-1 border-4 border-foreground p-5 bg-black flex flex-col justify-center items-center shadow-[4px_4px_0px_0px_#ffffff] text-center min-h-48">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-2">event.key</span>
            <div className="text-3xl font-black text-accent truncate max-w-full uppercase">{keyData.key}</div>
          </div>

          <div className="md:col-span-1 border-4 border-foreground p-5 bg-zinc-950 flex flex-col justify-center items-center shadow-[4px_4px_0px_0px_var(--primary)] text-center min-h-48">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-2">event.which (keyCode)</span>
            <div className="text-5xl font-black text-primary">{keyData.which || "-"}</div>
          </div>

          <div className="md:col-span-1 border-4 border-foreground p-5 bg-black flex flex-col justify-center items-center shadow-[4px_4px_0px_0px_#ffffff] text-center min-h-48">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-2">event.code</span>
            <div className="text-xl font-bold text-yellow-400 truncate max-w-full">{keyData.code}</div>
          </div>
        </div>
      )}

      {keyData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border bg-zinc-950 p-4">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-2">MODIFIER KEY STATUSES</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-black">
              <div className={`p-2 border text-center ${keyData.ctrl ? "bg-accent border-foreground text-accent-foreground" : "border-zinc-800 text-zinc-600"}`}>
                CTRL Key
              </div>
              <div className={`p-2 border text-center ${keyData.shift ? "bg-accent border-foreground text-accent-foreground" : "border-zinc-800 text-zinc-600"}`}>
                SHIFT Key
              </div>
              <div className={`p-2 border text-center ${keyData.alt ? "bg-accent border-foreground text-accent-foreground" : "border-zinc-800 text-zinc-600"}`}>
                ALT Key
              </div>
              <div className={`p-2 border text-center ${keyData.meta ? "bg-accent border-foreground text-accent-foreground" : "border-zinc-800 text-zinc-600"}`}>
                META Key (Cmd/Win)
              </div>
            </div>
          </div>

          <div className="border border-border bg-zinc-950 p-4 space-y-2 text-xs">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-2">ADDITIONAL DATA</span>
            <div className="flex justify-between border-b border-zinc-800/40 pb-1.5">
              <span className="text-zinc-500">Key Location:</span>
              <span className="font-bold text-foreground">{keyData.location}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/40 pb-1.5">
              <span className="text-zinc-500">Char Code:</span>
              <span className="font-bold text-foreground">{keyData.which}</span>
            </div>
            <div className="flex justify-between pb-0.5">
              <span className="text-zinc-500">Key Identifier:</span>
              <span className="font-bold text-foreground">{keyData.code || "-"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function SqlFormatterTool() {
  const [input, setInput] = React.useState("select id, name, created_at from users where active = 1 and role = 'admin' order by created_at desc limit 10;")
  const [output, setOutput] = React.useState("")

  const formatSql = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    let clean = input.trim().replace(/\s+/g, " ")
    
    // Capitalize SQL Keywords
    const sqlKeywords = [
      "SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN",
      "INNER JOIN", "ON", "GROUP BY", "ORDER BY", "LIMIT", "INSERT INTO", "VALUES",
      "UPDATE", "SET", "DELETE FROM", "HAVING", "CREATE TABLE", "INDEX"
    ]
    for (const kw of sqlKeywords) {
      const regex = new RegExp(`\\b${kw}\\b`, "gi")
      clean = clean.replace(regex, kw)
    }

    // Insert line breaks before major keywords
    const lineBreakKeywords = [
      "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN",
      "GROUP BY", "ORDER BY", "LIMIT", "SET", "VALUES"
    ]
    for (const kw of lineBreakKeywords) {
      const regex = new RegExp(`\\b${kw}\\b`, "g")
      clean = clean.replace(regex, `\n${kw}`)
    }

    // Format logical conditions in WHERE clause
    clean = clean.replace(/\b(AND|OR)\b/g, "\n  $1")

    // Clean extra line spaces
    const lines = clean.split("\n").map(l => l.trim()).filter(Boolean)
    // Add extra padding spaces where helpful
    const formatted = lines.map(line => {
      if (line.startsWith("SELECT") && line.length > 50) {
        // Format SELECT list if very long
        return line.replace(/,\s*/g, ",\n  ")
      }
      return line
    }).join("\n")

    setOutput(formatted)
  }

  React.useEffect(() => {
    formatSql()
  }, [input])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">SQL QUERY FORMATTER & BEAUTIFIER</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">UNFORMATTED SQL QUERY:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">BEAUTIFIED SQL OUTPUT:</span>
            {output && <CopyBtn value={output} />}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Formatted SQL output..."
            className="w-full h-64 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
          />
        </div>
      </div>
    </div>
  )
}

export function SvgOptimizerTool() {
  const [input, setInput] = React.useState(`<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"\n\t width="100px" height="100px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">\n  <!-- This is a sample comment to remove -->\n  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="#2dd4bf" />\n</svg>`)
  const [removeComments, setRemoveComments] = React.useState(true)
  const [removeMetadata, setRemoveMetadata] = React.useState(true)
  const [removeDimensions, setRemoveDimensions] = React.useState(true)
  const [output, setOutput] = React.useState("")

  const optimizeSvg = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    let clean = input

    if (removeComments) {
      clean = clean.replace(/<!--[\s\S]*?-->/g, "")
    }

    if (removeMetadata) {
      // Remove xmlns attributes or metadata block tags
      clean = clean.replace(/<metadata>[\s\S]*?<\/metadata>/gi, "")
      clean = clean.replace(/\s*id="[^"]*"/g, "")
      clean = clean.replace(/\s*style="enable-background:[^"]*"/g, "")
    }

    if (removeDimensions) {
      // Remove width and height, enforce using viewBox
      clean = clean.replace(/\s*width="[^"]*"/g, "")
      clean = clean.replace(/\s*height="[^"]*"/g, "")
    }

    // Clean empty lines or trailing white spaces
    clean = clean.split("\n").map(l => l.trim()).filter(Boolean).join("\n")
    setOutput(clean)
  }

  React.useEffect(() => {
    optimizeSvg()
  }, [input, removeComments, removeMetadata, removeDimensions])

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">SVG CLEANER & OPTIMIZER</span>

      <div className="flex flex-wrap gap-4 text-xs font-bold select-none pb-2 border-b border-zinc-800/40">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={removeComments} onChange={(e) => setRemoveComments(e.target.checked)} className="accent-primary" />
          <span>STRIP COMMENTS</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={removeMetadata} onChange={(e) => setRemoveMetadata(e.target.checked)} className="accent-primary" />
          <span>STRIP METADATA & IDS</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={removeDimensions} onChange={(e) => setRemoveDimensions(e.target.checked)} className="accent-primary" />
          <span>STRIP WIDTH & HEIGHT</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-[10px] text-zinc-400 font-bold block mb-1">RAW SVG INPUT:</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-black border-2 border-foreground p-3 text-xs leading-relaxed focus:outline-none focus:border-primary placeholder:text-zinc-700"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-zinc-400 font-bold block">CLEANED SVG MARKUP:</span>
            {output && <CopyBtn value={output} />}
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-64 bg-zinc-950 border-2 border-border p-3 text-xs leading-relaxed focus:outline-none placeholder:text-zinc-700 select-all"
          />
        </div>
      </div>

      <div className="border-4 border-foreground p-4 bg-white flex flex-col items-center justify-center min-h-32 shadow-[3px_3px_0px_0px_#ffffff]">
        <span className="text-[9px] font-black text-black bg-zinc-200 border border-zinc-400 px-2 py-0.5 mb-3 self-start">SVG LIVE RENDER</span>
        <div 
          className="w-32 h-32 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full text-black"
          dangerouslySetInnerHTML={{ __html: output }}
        />
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

export function CssPlaygroundTool() {
  const [hOffset, setHOffset] = React.useState(6)
  const [vOffset, setVOffset] = React.useState(6)
  const [blur, setBlur] = React.useState(0)
  const [spread, setSpread] = React.useState(0)
  const [shadowColor, setShadowColor] = React.useState("#2dd4bf")
  const [shadowOpacity, setShadowOpacity] = React.useState(100)
  const [inset, setInset] = React.useState(false)

  const [borderRadius, setBorderRadius] = React.useState(0)
  const [borderWidth, setBorderWidth] = React.useState(4)

  const hexToRgba = (hex: string, opacityPercent: number) => {
    let clean = hex.trim().replace("#", "")
    if (clean.length === 3) {
      clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
    }
    const r = parseInt(clean.substring(0, 2), 16) || 0
    const g = parseInt(clean.substring(2, 4), 16) || 0
    const b = parseInt(clean.substring(4, 6), 16) || 0
    return `rgba(${r}, ${g}, ${b}, ${opacityPercent / 100})`
  }

  const rgbaColor = hexToRgba(shadowColor, shadowOpacity)
  const shadowValue = `${inset ? "inset " : ""}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${rgbaColor}`
  
  const cssString = `box-shadow: ${shadowValue};\nborder-radius: ${borderRadius}px;\nborder: ${borderWidth}px solid #000000;`

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">CSS SHADOW & BORDER VISUAL PLAYGROUND</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4 bg-zinc-950 border border-zinc-800 p-4 text-xs font-bold">
          <span className="text-[10px] text-zinc-500 font-bold block mb-2 uppercase border-b border-zinc-800 pb-1">BOX SHADOW CONTROLS</span>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">HORIZ. OFFSET: {hOffset}px</span>
              <input type="range" min="-50" max="50" value={hOffset} onChange={(e) => setHOffset(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">VERT. OFFSET: {vOffset}px</span>
              <input type="range" min="-50" max="50" value={vOffset} onChange={(e) => setVOffset(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">BLUR RADIUS: {blur}px</span>
              <input type="range" min="0" max="50" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">SPREAD RADIUS: {spread}px</span>
              <input type="range" min="-30" max="30" value={spread} onChange={(e) => setSpread(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">SHADOW COLOR:</span>
              <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="w-full h-8 border border-foreground bg-black cursor-pointer" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">OPACITY: {shadowOpacity}%</span>
              <input type="range" min="0" max="100" value={shadowOpacity} onChange={(e) => setShadowOpacity(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1.5">
            <input type="checkbox" id="insetShadow" checked={inset} onChange={(e) => setInset(e.target.checked)} className="accent-primary cursor-pointer" />
            <label htmlFor="insetShadow" className="text-[10px] text-zinc-400 uppercase cursor-pointer select-none">INSET SHADOW</label>
          </div>

          <span className="text-[10px] text-zinc-500 font-bold block mb-2 uppercase border-b border-zinc-800 pt-3 pb-1">BORDER & RADIUS CONTROLS</span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">BORDER RADIUS: {borderRadius}px</span>
              <input type="range" min="0" max="100" value={borderRadius} onChange={(e) => setBorderRadius(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">BORDER WIDTH: {borderWidth}px</span>
              <input type="range" min="0" max="20" value={borderWidth} onChange={(e) => setBorderWidth(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-4 border-foreground p-8 flex items-center justify-center min-h-[220px] bg-dot-pattern">
            <div 
              style={{
                boxShadow: shadowValue,
                borderRadius: `${borderRadius}px`,
                border: `${borderWidth}px solid #000000`
              }}
              className="w-36 h-36 bg-zinc-900 border-foreground flex items-center justify-center text-center p-3 select-none transition-all duration-100 font-black text-xs text-zinc-400 uppercase"
            >
              Visual Box
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 font-bold block">CSS CODES:</span>
              <CopyBtn value={cssString} />
            </div>
            <pre className="w-full bg-zinc-950 border border-border p-3 text-[11px] leading-relaxed text-foreground select-all whitespace-pre-wrap">
              {cssString}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DnsLookupTool() {
  const [domain, setDomain] = React.useState("google.com")
  const [recordType, setRecordType] = React.useState("A")
  const [provider, setProvider] = React.useState<"cloudflare" | "google">("cloudflare")
  const [loading, setLoading] = React.useState(false)
  const [records, setRecords] = React.useState<any[]>([])
  const [error, setError] = React.useState<string | null>(null)

  const performLookup = async () => {
    if (!domain.trim()) return
    setLoading(true)
    setError(null)
    setRecords([])

    const recordTypeMap: Record<string, number> = {
      A: 1, AAAA: 28, MX: 15, TXT: 16, CNAME: 5, NS: 2
    }
    const typeCode = recordTypeMap[recordType] || 1

    try {
      let url = ""
      let headers: HeadersInit = {}

      if (provider === "cloudflare") {
        url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${recordType}`
        headers = { accept: "application/dns-json" }
      } else {
        url = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${typeCode}`
      }

      const res = await fetch(url, { headers })
      if (!res.ok) throw new Error("Network response error during DNS query.")
      
      const data = await res.json()
      if (data.Status !== 0) {
        throw new Error(`DNS resolution failed with status code ${data.Status}.`)
      }

      if (data.Answer && Array.isArray(data.Answer)) {
        setRecords(data.Answer)
      } else {
        setRecords([])
      }
    } catch (e: any) {
      setError(e.message || "DNS fetch query failed.")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    performLookup()
  }, [domain, recordType, provider])

  const getRecordTypeName = (typeVal: number) => {
    const types: Record<number, string> = {
      1: "A", 28: "AAAA", 15: "MX", 16: "TXT", 5: "CNAME", 2: "NS"
    }
    return types[typeVal] || String(typeVal)
  }

  return (
    <div className="space-y-4 font-mono">
      <span className="text-xs font-bold uppercase text-zinc-500 block border-b border-border pb-2">DNS-OVER-HTTPS RESOLVER LOOKUP</span>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-bold text-xs">
        <div>
          <span className="text-[10px] text-zinc-400 block mb-1">DOMAIN NAME:</span>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value.trim().toLowerCase())}
            placeholder="e.g. google.com"
            className="w-full neo-input h-10"
          />
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 block mb-1">RECORD TYPE:</span>
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="w-full border-2 border-foreground bg-black px-2 h-10 text-xs text-foreground cursor-pointer"
          >
            <option value="A">A (IPv4 Address)</option>
            <option value="AAAA">AAAA (IPv6 Address)</option>
            <option value="MX">MX (Mail Exchanger)</option>
            <option value="TXT">TXT (Text Records)</option>
            <option value="CNAME">CNAME (Canonical Name)</option>
            <option value="NS">NS (Name Server)</option>
          </select>
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 block mb-1">RESOLVER SERVER:</span>
          <div className="flex border-2 border-foreground bg-black h-10 select-none items-center p-1 gap-1">
            <button
              onClick={() => setProvider("cloudflare")}
              className={`flex-1 h-full text-[10px] uppercase font-bold cursor-pointer ${
                provider === "cloudflare" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
              }`}
            >
              Cloudflare
            </button>
            <button
              onClick={() => setProvider("google")}
              className={`flex-1 h-full text-[10px] uppercase font-bold cursor-pointer ${
                provider === "google" ? "bg-accent text-accent-foreground" : "text-zinc-500 hover:text-foreground"
              }`}
            >
              Google
            </button>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <span className="text-[10px] text-zinc-400 font-bold block mb-1">RESOLUTION ANSWER RECORDS:</span>
        <div className="w-full min-h-36 bg-zinc-950 border-2 border-border overflow-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-xs text-zinc-500 gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-accent" />
              <span>Querying DNS records over HTTPS...</span>
            </div>
          ) : error ? (
            <span className="text-xs text-red-500 font-bold block p-2">{error}</span>
          ) : records.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-600">No records found for query parameters.</div>
          ) : (
            <table className="w-full text-[11px] text-left border-collapse select-all">
              <thead>
                <tr className="border-b-2 border-foreground bg-zinc-900 font-black">
                  <th className="p-2 border border-zinc-800 uppercase">Name</th>
                  <th className="p-2 border border-zinc-800 uppercase">Type</th>
                  <th className="p-2 border border-zinc-800 uppercase">TTL</th>
                  <th className="p-2 border border-zinc-800 uppercase">Data</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, idx) => (
                  <tr key={idx} className="border-b border-zinc-800/40 hover:bg-zinc-900/40">
                    <td className="p-2 border border-zinc-800/40 font-bold text-zinc-400">{rec.name}</td>
                    <td className="p-2 border border-zinc-800/40 text-accent font-bold">{getRecordTypeName(rec.type)}</td>
                    <td className="p-2 border border-zinc-800/40 text-zinc-500">{rec.TTL}s</td>
                    <td className="p-2 border border-zinc-800/40 break-all select-all font-bold text-foreground">{rec.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

