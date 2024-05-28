// done as javascript so we can generate the email rather than committing a
// massive chunk into git.
'use strict';

const crypto = require("crypto");

const b64LineLenght = 76;
const byteLineLength = b64LineLenght * 3/4;

const uniqueLineCount = 100;

const dummyLines = new Array(uniqueLineCount).fill(undefined);
const lineBreak = Buffer.from("\r\n");
const blockQuoteSp = Buffer.from("> ");
const quotedEmptyLine = Buffer.from(">\r\n");

const randomLines = dummyLines.map(() => crypto.randomBytes(byteLineLength));

const b64Lines = randomLines.map((bytes) => Buffer.from(bytes.toString('base64'), 'ascii'))
    .map((b64Line) => Buffer.concat([b64Line, lineBreak]));
const quotedB64Lines = b64Lines.map((line) => Buffer.concat([blockQuoteSp, line]));

const b64Block = Buffer.concat(b64Lines);
const quotedB64Block = Buffer.concat(quotedB64Lines);

function randomHex(bytes) { return crypto.randomBytes(bytes).toString('hex'); }

const boundary = "--------" + randomHex(12);
const inReplyTo = randomHex(15);
const emailStart = `
Content-Type: multipart/mixed; boundary="${boundary}"
Message-ID: <${randomHex(15)}@plaintext.email>
Date: Thu, 2 May 2024 12:34:56 +0100
User-Agent: Mozilla Thunderbird
Subject: RE: Enquiry about services
To: "Company HTML Info" <html.info@company.email>
References: <${inReplyTo}@company.email>,
 <${randomHex(15)}@plaintext.email>
From: "Mr Plain" <i.like@plaintext.email>
In-Reply-To: <${inReplyTo}@company.email>
MIME-Version: 1.0

--${boundary}
Content-Type: text/plain; charset=UTF-8; format=flowed
Content-Transfer-Encoding: 8bit

Hello Company,

Thank you for the information, I have read it as instructed, and completed 
the form, please find attached.

Best regards,
Mr Plain

On 02/05/2024 09:54, Company HTML Info wrote:
> Dear Mr Plain
> Thank you for your email, please read the attached documents and return the 
> attached form.
> Best regards,
> Company HTML Info
`.trim().replace(/\r?\n/g, '\r\n');
const quotedB64Block2M = Buffer.concat(
    new Array(Math.ceil(2*1024*1024/quotedB64Block.length)).fill(undefined)
        .map(() => quotedB64Block));
const b64Attachment1M = Buffer.concat(
    new Array(Math.ceil(1*1024*1024/quotedB64Block.length)).fill(undefined)
        .map(() => b64Block));

function toBufLine(str) {
    return Buffer.concat([Buffer.from(str, 'utf-8'), lineBreak]);
}

const email = Buffer.concat([
    toBufLine(emailStart),
    quotedEmptyLine,
    quotedEmptyLine,
    quotedB64Block2M,
    toBufLine("--" + boundary),
    toBufLine('Content-Type: application/pdf; name="form.pdf"'),
    toBufLine('Content-Disposition: attachment; filename="form.pdf"'),
    toBufLine('Content-Transfer-Encoding: base64'),
    lineBreak,
    b64Attachment1M,
    lineBreak,
    toBufLine(boundary + "--"),
]);

module.exports = email;
