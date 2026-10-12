// Per-deal email templates for the transaction Email generator. Sample copy ...
// edit freely. Merge fields fill from the deal: {{buyer}} {{first_name}}
// {{address}} {{closing_date}} {{agent}} {{office}}. `to` is the recipient role,
// resolved to an address from the deal's people.

export type EmailTo = "buyer" | "listing_agent" | "lender" | "buyer_title" | "insurance";
export type EmailTemplate = {
  id: string; group: string; name: string; to: EmailTo;
  subject: string; body: string; stages?: string[]; // which pipeline stages it fits
};

export const EMAIL_GROUPS = ["Your current emails", "Under contract", "Closing", "After closing"];

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
];
