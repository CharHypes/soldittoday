// Per-deal email templates for the transaction Email generator. Sample copy ...
// edit freely. Merge fields fill from the deal: {{buyer}} {{first_name}}
// {{address}} {{closing_date}} {{agent}} {{office}}. `to` is the recipient role,
// resolved to an address from the deal's people.

export type EmailTo = "buyer" | "seller" | "listing_agent" | "buyer_agent" | "lender" | "buyer_title" | "title" | "insurance";
export type EmailTemplate = {
  id: string; group: string; name: string; to: EmailTo;
  subject: string; body: string; stages?: string[]; // which pipeline / listing stages it fits
  audience?: "buyer" | "seller"; // which workspace it belongs to (default buyer)
};

export const EMAIL_GROUPS = ["Your current emails", "New listing", "Under contract", "Closing", "After closing"];

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "buyerWelcome", group: "Your current emails", name: "Buyer Welcome", to: "buyer", stages: ["lead", "buyer"],
    subject: "Welcome ... let's find your home, {{first_name}}",
    body: `Hi {{first_name}},

Welcome, and thank you for trusting us with your home search. We are so glad to be working with you.

Here is how we will work together:
- We will set you up on a live search that matches exactly what you are looking for
- When something great comes up, we will tour it together
- When you are ready, we will write a strong offer and negotiate hard for you

If anything at all comes to mind, just reply here or call us anytime.

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "askTitle", group: "Your current emails", name: "Ask Listing Agent for Seller's Title", to: "listing_agent",
    subject: "Seller's title company ... {{address}}",
    body: `Hi,

We are representing the buyer on {{address}} and getting the file set up.

Could you let us know which title company the seller is using, along with a contact there? We want to make sure both sides are coordinated for a smooth close on {{closing_date}}.

Thank you,
{{agent}}
{{office}}`,
  },
  {
    id: "insurance", group: "Your current emails", name: "Insurance Request", to: "buyer",
    subject: "Homeowner's insurance for {{address}}",
    body: `Hi {{first_name}},

One important to-do for closing: you will need a homeowner's insurance policy in place on {{address}} before we get to the table.

If you have an agent you love, reach out to them for a quote. If you would like a recommendation, just say the word and we will connect you with someone great.

Please send us the policy or binder once you have it so we can pass it to your lender.

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "titleOrder", group: "Your current emails", name: "Title Order", to: "buyer_title",
    subject: "Title order ... {{address}}",
    body: `Hi,

Please open title for the purchase below:

Property: {{address}}
Buyer: {{buyer}}
Target closing: {{closing_date}}

Let us know what you need from us to get started, and please send over the title commitment when it is ready.

Thank you,
{{agent}}
{{office}}`,
  },
  {
    id: "underContract", group: "Under contract", name: "Under Contract Intro", to: "buyer", stages: ["under_contract"],
    subject: "You're under contract on {{address}}!",
    body: `Hi {{first_name}},

Great news ... we are officially under contract on {{address}}.

Here is what happens next: the home inspection, the appraisal through your lender, and final loan approval. We will be right beside you for each step.

We are targeting a closing of {{closing_date}}. We will keep you posted the whole way, and you can always follow along in your portal.

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "appraisal", group: "Under contract", name: "Appraisal Ordered Update", to: "buyer", stages: ["under_contract"],
    subject: "Appraisal update for {{address}}",
    body: `Hi {{first_name}},

Quick update ... the appraisal on {{address}} has been ordered through your lender. This is the step where a licensed appraiser confirms the home's value for the loan.

There is nothing you need to do right now. We will let you know the moment it comes back, and we will handle anything that comes up.

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "clearToClose", group: "Closing", name: "Clear to Close", to: "buyer", stages: ["under_contract"],
    subject: "You're clear to close on {{address}}!",
    body: `Hi {{first_name}},

Wonderful news ... you are clear to close on {{address}}.

That means your loan is fully approved and we are on track for closing on {{closing_date}}. We will send the final details (time, place, and what to bring) shortly, along with your final numbers.

Almost home. We could not be happier for you.

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "settlement", group: "Closing", name: "Settlement Figures Request", to: "buyer_title",
    subject: "Settlement figures request ... {{address}}",
    body: `Hi,

Could you please prepare the preliminary buyer's settlement figures for {{address}}, targeting a close of {{closing_date}}?

We would like to review them with our buyer ahead of time so there are no surprises at the table. Please send them over as soon as they are ready.

Thank you,
{{agent}}
{{office}}`,
  },
  {
    id: "congrats", group: "After closing", name: "Congrats / Keys", to: "buyer", stages: ["closed"],
    subject: "Congratulations ... welcome home, {{first_name}}!",
    body: `Hi {{first_name}},

Congratulations ... {{address}} is officially yours! It has been such a joy helping you get here.

Keep every closing document somewhere safe, and keep our number handy ... for a trusted plumber, a question about your taxes, or your next move someday, we are always here for you.

Welcome home. We are so happy for you.

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "review", group: "After closing", name: "Review Request", to: "buyer", stages: ["closed"],
    subject: "A quick favor, {{first_name}}?",
    body: `Hi {{first_name}},

We hope you are settling in beautifully at {{address}}.

If you have a minute, would you leave us a quick review? It genuinely means the world to a small team like ours, and it helps other families find their way home too. We will send the link in a follow-up.

Thank you for trusting us. It was an honor.

Warmly,
{{agent}}
{{office}}`,
  },

  // ===== Seller / listing-side (audience: "seller"). Merge fields: {{seller}} {{first_name}} {{address}} {{closing_date}} {{agent}} {{office}} =====
  {
    id: "sellerListingLive", group: "New listing", name: "Listing Is Live", to: "seller", audience: "seller", stages: ["active"],
    subject: "Your home at {{address}} is officially live!",
    body: `Hi {{first_name}},

Great news ... {{address}} is now live on the market. The listing is active across the MLS and the major sites, and we are already driving eyes to it.

Here is what happens next on our end:
- We monitor every showing and gather feedback for you
- We send you a weekly update on views, saves, and showing activity
- We handle every inquiry and offer that comes in

If you ever have a question or want to tweak anything, just reply here. We are honored to represent you.

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "sellerWeeklyUpdate", group: "New listing", name: "Weekly Seller Update", to: "seller", audience: "seller", stages: ["active"],
    subject: "This week on {{address}}",
    body: `Hi {{first_name}},

Here is your weekly update on {{address}}:
- Showings this week:
- Online views / saves:
- Feedback highlights:

Our read on where we stand:

We will keep the momentum going. Reply any time with questions.

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "sellerShowingFeedback", group: "New listing", name: "Showing Feedback Request", to: "buyer_agent", audience: "seller", stages: ["active"],
    subject: "Feedback on {{address}}?",
    body: `Hi,

Thank you for showing {{address}}. When you have a moment, we would love any feedback from you and your buyer ... what they thought of the home, the price, and whether it is a fit.

It helps us serve our seller well, and we are always happy to return the favor.

Thank you,
{{agent}}
{{office}}`,
  },
  {
    id: "sellerOfferReceived", group: "Under contract", name: "Offer Received", to: "seller", audience: "seller", stages: ["active", "pending"],
    subject: "We have an offer on {{address}}",
    body: `Hi {{first_name}},

We received an offer on {{address}}. I would like to walk you through the terms so you can make the best decision ... price, financing, contingencies, and timeline.

When is a good time to connect today? I will have everything laid out for you.

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "sellerUnderContract", group: "Under contract", name: "Under Contract Intro", to: "seller", audience: "seller", stages: ["pending"],
    subject: "We are under contract on {{address}}!",
    body: `Hi {{first_name}},

Congratulations ... {{address}} is officially under contract. Here is what to expect over the next few weeks:
- Inspection and any repair requests
- Appraisal
- The buyer's financing moving to clear-to-close
- Final walkthrough and closing

We will guide you through each step and keep you updated. Nothing moves without you knowing about it.

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "sellerOpenTitle", group: "Under contract", name: "Open Title (Listing)", to: "title", audience: "seller", stages: ["pending"],
    subject: "Please open title ... {{address}}",
    body: `Hi,

We are under contract on {{address}} and would like to open title.

Seller: {{seller}}
Property: {{address}}
Target close: {{closing_date}}

Please let us know what you need from the seller to get started, and send over the title commitment when it is ready. Thank you for helping us close this smoothly.

Thank you,
{{agent}}
{{office}}`,
  },
  {
    id: "sellerInspection", group: "Under contract", name: "Inspection Update", to: "seller", audience: "seller", stages: ["pending"],
    subject: "Inspection update ... {{address}}",
    body: `Hi {{first_name}},

The buyer completed their inspection on {{address}}. Here is where things stand and what, if anything, they are asking for:

My recommendation:

Let's talk through it so we respond in a way that protects your bottom line and keeps the deal on track.

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "sellerAppraisal", group: "Under contract", name: "Appraisal Scheduled", to: "seller", audience: "seller", stages: ["pending"],
    subject: "Appraisal scheduled for {{address}}",
    body: `Hi {{first_name}},

The buyer's lender has ordered the appraisal on {{address}}. The appraiser will visit the home, and we will let you know the result as soon as it is in.

You do not need to do anything ... just leave the home accessible and in showing shape. We will handle the rest.

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "sellerClearToClose", group: "Closing", name: "Clear to Close", to: "seller", audience: "seller", stages: ["pending"],
    subject: "We are clear to close on {{address}}!",
    body: `Hi {{first_name}},

Wonderful news ... the buyer is clear to close on {{address}}, and we are on track for {{closing_date}}.

Before closing we will:
- Confirm your final walkthrough window
- Review your settlement figures together
- Coordinate keys, garage remotes, and any items you are leaving

I will be with you at the table. Almost there!

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "sellerSettlement", group: "Closing", name: "Settlement Figures Request", to: "title", audience: "seller", stages: ["pending"],
    subject: "Seller settlement figures ... {{address}}",
    body: `Hi,

Could you please prepare the preliminary seller settlement figures for {{address}}, targeting a close of {{closing_date}}?

We would like to review them with our seller ahead of time so there are no surprises at the table. Please send them over as soon as they are ready.

Thank you,
{{agent}}
{{office}}`,
  },
  {
    id: "sellerCongrats", group: "After closing", name: "Congrats / Sold", to: "seller", audience: "seller", stages: ["sold", "closed"],
    subject: "Congratulations ... {{address}} is SOLD!",
    body: `Hi {{first_name}},

It is official ... {{address}} is sold! Thank you for trusting us to represent your home. It truly was a pleasure.

If you need anything at all as you settle into your next chapter ... a referral, a question, a recommendation ... we are always here for you.

Warmly,
{{agent}}
{{office}}`,
  },
  {
    id: "sellerReview", group: "After closing", name: "Review Request", to: "seller", audience: "seller", stages: ["sold", "closed"],
    subject: "Would you share a quick review?",
    body: `Hi {{first_name}},

Now that {{address}} has closed, would you be willing to share a short review of your experience with us? A few honest sentences make a world of difference for our small team.

I will send the link in a follow-up ... and thank you, truly, for letting us be part of this.

Warmly,
{{agent}}
{{office}}`,
  },
];
