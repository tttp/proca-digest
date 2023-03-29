const nodemailer = require("nodemailer");
require('dotenv').config()
const { subject, html, insertVariables } = require("./template");
const { supabase } = require("./api");
const getTargets = require("./targets").getTargets;


const campaign = "restorenaturepics";
const templateName = "initialDigest";
const sourceName = "restorenaturepics";

const targets = getTargets(sourceName);

// it is set to send emails with gmail
// usual pasword won't work, use app password https://support.google.com/accounts/answer/18583

const sendDigest = async (s, h, email) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });


  let info = await transporter.sendMail({
    from: '"Bruce Wayne 🦇" <bruce.wayne@gmail.com>', // sender address
    to: "ivana@fixthestatusquo.org", // list of receivers
    // to: email,
    subject: s, // Subject line
    text: "Proca digest", // plain text body
    html: h, // html body
  });

  console.log("Message sent: %s", info.messageId);

  // Preview only available when sending through an Ethereal account!!
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // add lang to template record?
  //we dont have target_id on source, use email instead???
    const { data, error } = await supabase
  .from('digest')
  .insert([
    { subject: s, body: h, status: "sent", template: "templateName", email: "someEmail@mail.com", target_id: "123e4567-e89b-12d3-a456-426614174000", variables: {} }// , template: `${campaign}/${name}` },
  ])

  if (error) console.log('error saving template', error)
}

const main = async () => {
  for (const i in targets) {
    const target = targets[i];
    const s = subject(campaign, templateName, target.lang)
    const h = html(campaign, templateName, target.lang)

    if (!s) {
      console.error("Subject or HTML not found:", target);
      // return;
    } else if (!h) {
      console.error("Subject or HTML not found:", target);
      // return;
    } else {

      // fetch variables
      // insert variables in template
      insertVariables(h, variables = "");

      await sendDigest(s, h, target.email);
    }
  }
}

main().catch(console.error);