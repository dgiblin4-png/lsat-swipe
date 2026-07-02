import { useState, useEffect, useRef } from "react";

// ─── QUESTION BANK ───────────────────────────────────────────────────────────
const ALL_QUESTIONS = [
  // WEAKEN
  {
    id: 1, type: "Weaken", difficulty: "Medium",
    stimulus: "Studies show that people who drink coffee daily are less likely to develop Parkinson's disease than those who don't. Therefore, coffee drinking must prevent Parkinson's disease.",
    question: "Which of the following, if true, most weakens the argument?",
    choices: [
      { label: "A", text: "Coffee contains antioxidants beneficial to brain health." },
      { label: "B", text: "People who develop early Parkinson's symptoms often lose their sense of smell, making coffee less appealing." },
      { label: "C", text: "Several studies in different countries have replicated this correlation." },
      { label: "D", text: "Some coffee drinkers do eventually develop Parkinson's disease." },
      { label: "E", text: "Decaffeinated coffee drinkers show a similar reduction in risk." },
    ],
    correct: "B",
    explanation: "B introduces reverse causation — early Parkinson's may reduce coffee drinking, explaining the correlation without coffee being protective."
  },
  {
    id: 2, type: "Weaken", difficulty: "Hard",
    stimulus: "Our city's crime rate dropped 20% in the two years after we installed surveillance cameras downtown. The cameras are clearly responsible for the reduction.",
    question: "Which of the following most seriously weakens this conclusion?",
    choices: [
      { label: "A", text: "Surveillance cameras are expensive to install and maintain." },
      { label: "B", text: "The national crime rate also dropped 22% during the same period." },
      { label: "C", text: "Some residents have raised privacy concerns about the cameras." },
      { label: "D", text: "The cameras have helped police solve several crimes after the fact." },
      { label: "E", text: "Other cities have also installed surveillance cameras downtown." },
    ],
    correct: "B",
    explanation: "If crime fell nationally by a similar margin, the local cameras may have had no independent effect — the city's decline could simply mirror a broader trend."
  },
  {
    id: 3, type: "Weaken", difficulty: "Easy",
    stimulus: "XYZ University's engineering graduates earn higher salaries than graduates of any other program at the university. Therefore, studying engineering at XYZ leads to higher earning potential.",
    question: "Which of the following, if true, most weakens the argument?",
    choices: [
      { label: "A", text: "XYZ's engineering program is ranked among the top 20 nationally." },
      { label: "B", text: "Engineering students at XYZ come from wealthier families on average and have better pre-existing professional networks." },
      { label: "C", text: "XYZ's engineering program is more difficult than its other programs." },
      { label: "D", text: "Some engineering graduates earn less than the average for their class." },
      { label: "E", text: "XYZ recently expanded its engineering department." },
    ],
    correct: "B",
    explanation: "If engineering students already have advantages that lead to higher earnings, the program itself may not be the cause — selection bias undermines the causal claim."
  },
  // ASSUMPTION
  {
    id: 4, type: "Assumption", difficulty: "Medium",
    stimulus: "The city should ban plastic bags to reduce pollution. Other cities that have banned plastic bags have seen significant reductions in plastic litter.",
    question: "The argument above assumes which of the following?",
    choices: [
      { label: "A", text: "Plastic bag bans are popular with most residents." },
      { label: "B", text: "Plastic bags are the primary source of pollution in those other cities." },
      { label: "C", text: "Conditions in our city are similar enough to those other cities that a ban would produce similar results." },
      { label: "D", text: "Paper bags are better for the environment than plastic bags." },
      { label: "E", text: "The city government has the legal authority to enact such a ban." },
    ],
    correct: "C",
    explanation: "The argument moves from 'it worked there' to 'it will work here.' That leap requires assuming the cities are comparable."
  },
  {
    id: 5, type: "Assumption", difficulty: "Hard",
    stimulus: "Since the new principal took over, test scores at Jefferson High have risen every year. We should hire her methods consultant to improve scores at other schools.",
    question: "Which of the following is an assumption on which the argument depends?",
    choices: [
      { label: "A", text: "The principal's methods are the primary cause of the score increases at Jefferson High." },
      { label: "B", text: "Test scores are the most important measure of school quality." },
      { label: "C", text: "The methods consultant is available to work with other schools." },
      { label: "D", text: "Other schools have lower test scores than Jefferson High." },
      { label: "E", text: "The principal herself cannot be hired away from Jefferson High." },
    ],
    correct: "A",
    explanation: "The argument recommends replicating the principal's methods, which only makes sense if those methods — not some other factor — caused the improvement."
  },
  {
    id: 6, type: "Assumption", difficulty: "Medium",
    stimulus: "Dr. Reyes publishes more research papers per year than any other faculty member. She must be the most productive researcher in the department.",
    question: "The argument above assumes which of the following?",
    choices: [
      { label: "A", text: "All research papers have equal value regardless of journal prestige." },
      { label: "B", text: "Publication count is a reliable proxy for research productivity." },
      { label: "C", text: "Dr. Reyes has been at the department longer than her colleagues." },
      { label: "D", text: "Other faculty members are not pursuing grants or patents instead of papers." },
      { label: "E", text: "The department values quantity of output over quality." },
    ],
    correct: "B",
    explanation: "Equating publication count with productivity requires assuming that number of papers is a valid measure of research output."
  },
  // MUST BE TRUE
  {
    id: 7, type: "Must Be True", difficulty: "Medium",
    stimulus: "All registered voters in this district received a ballot. No one who received a ballot failed to vote. Maria is a resident of this district who voted.",
    question: "If the statements above are all true, which must also be true?",
    choices: [
      { label: "A", text: "Maria is a registered voter in this district." },
      { label: "B", text: "Everyone who voted is a registered voter." },
      { label: "C", text: "Maria received a ballot." },
      { label: "D", text: "All residents of this district voted." },
      { label: "E", text: "Only registered voters voted." },
    ],
    correct: "C",
    explanation: "We can't confirm Maria is registered, but if she voted, she must have had a ballot — you cannot vote without one."
  },
  {
    id: 8, type: "Must Be True", difficulty: "Easy",
    stimulus: "No mammals are cold-blooded. All whales are mammals. Some ocean creatures are whales.",
    question: "Which of the following must be true based on the statements above?",
    choices: [
      { label: "A", text: "All ocean creatures are warm-blooded." },
      { label: "B", text: "Some ocean creatures are warm-blooded." },
      { label: "C", text: "No ocean creatures are cold-blooded." },
      { label: "D", text: "All warm-blooded creatures are mammals." },
      { label: "E", text: "Some mammals live in the ocean." },
    ],
    correct: "B",
    explanation: "Whales are mammals, mammals are warm-blooded, and some ocean creatures are whales — so some ocean creatures must be warm-blooded. E is also true but B is the more direct inference tested here."
  },
  {
    id: 9, type: "Must Be True", difficulty: "Hard",
    stimulus: "Every employee who completed the training program received a certification. Some employees who received certifications were promoted. No employee without a certification was promoted.",
    question: "Which of the following must be true?",
    choices: [
      { label: "A", text: "Every employee who completed the training program was promoted." },
      { label: "B", text: "Some employees who completed the training program were promoted." },
      { label: "C", text: "All promoted employees completed the training program." },
      { label: "D", text: "Some employees who completed the training program were not promoted." },
      { label: "E", text: "No employee was promoted without completing the training program." },
    ],
    correct: "E",
    explanation: "No certification = no promotion. Certification requires training. Therefore no training = no promotion. E must be true."
  },
  // FLAW
  {
    id: 10, type: "Flaw", difficulty: "Medium",
    stimulus: "Senator Hayes voted against the infrastructure bill. Senator Hayes must not care about the welfare of working people, since the bill would have created thousands of jobs.",
    question: "The argument above is flawed because it:",
    choices: [
      { label: "A", text: "Mistakes a correlation for a causation." },
      { label: "B", text: "Assumes that opposing one policy means opposing the goals of that policy." },
      { label: "C", text: "Relies on an appeal to emotion rather than logic." },
      { label: "D", text: "Fails to account for the cost of the infrastructure bill." },
      { label: "E", text: "Generalizes from a single case to all cases." },
    ],
    correct: "B",
    explanation: "Voting against a bill doesn't mean opposing its stated goals — Hayes may have supported job creation but opposed this particular approach."
  },
  {
    id: 11, type: "Flaw", difficulty: "Hard",
    stimulus: "People who exercise regularly report being happier than those who don't. If you want to be happy, you should exercise regularly.",
    question: "The reasoning above is most vulnerable to criticism because it:",
    choices: [
      { label: "A", text: "Fails to define what counts as 'regular' exercise." },
      { label: "B", text: "Does not consider that happy people may simply be more likely to exercise." },
      { label: "C", text: "Assumes that self-reported happiness is unreliable." },
      { label: "D", text: "Overlooks the physical health benefits of exercise." },
      { label: "E", text: "Treats one study as conclusive proof." },
    ],
    correct: "B",
    explanation: "The argument assumes exercise causes happiness, but the relationship could be reversed — happier people may simply be more inclined to exercise."
  },
  {
    id: 12, type: "Flaw", difficulty: "Easy",
    stimulus: "My grandfather smoked his whole life and lived to 95. Smoking clearly isn't as dangerous as doctors claim.",
    question: "The argument above is flawed primarily because it:",
    choices: [
      { label: "A", text: "Appeals to an authority figure." },
      { label: "B", text: "Draws a general conclusion from a single exceptional case." },
      { label: "C", text: "Fails to cite peer-reviewed medical studies." },
      { label: "D", text: "Assumes that longevity is the only measure of health." },
      { label: "E", text: "Contradicts established scientific consensus without evidence." },
    ],
    correct: "B",
    explanation: "One anecdote — however compelling — cannot override population-level statistical evidence. This is a classic hasty generalization."
  },
  // STRENGTHEN
  {
    id: 13, type: "Strengthen", difficulty: "Medium",
    stimulus: "Archaeologists discovered pottery shards at a coastal site dated to 3,000 BCE alongside fish bones. They concluded the site was used by a fishing community.",
    question: "Which of the following most strengthens the archaeologists' conclusion?",
    choices: [
      { label: "A", text: "The pottery shards match styles found at other confirmed fishing villages of the same era." },
      { label: "B", text: "Fish bones are commonly found at sites used for ceremonial purposes." },
      { label: "C", text: "The site is located near a river, not the ocean." },
      { label: "D", text: "Pottery from 3,000 BCE is rarely preserved in good condition." },
      { label: "E", text: "Archaeologists often disagree about how to interpret coastal site discoveries." },
    ],
    correct: "A",
    explanation: "A directly bolsters the conclusion by connecting the physical evidence to a known pattern from confirmed fishing villages."
  },
  {
    id: 14, type: "Strengthen", difficulty: "Easy",
    stimulus: "The town council argues that building a new library will increase property values in the surrounding neighborhood.",
    question: "Which of the following, if true, most strengthens this argument?",
    choices: [
      { label: "A", text: "Libraries are popular with families who have young children." },
      { label: "B", text: "In comparable towns, neighborhoods near newly built libraries saw property values rise an average of 8% within three years." },
      { label: "C", text: "The new library will be larger than the current one." },
      { label: "D", text: "The town council has approved library construction before." },
      { label: "E", text: "Property values in the town have been stable for five years." },
    ],
    correct: "B",
    explanation: "B provides direct empirical precedent from comparable situations — the closest thing to proof the argument could have."
  },
  {
    id: 15, type: "Strengthen", difficulty: "Hard",
    stimulus: "A pharmaceutical company claims its new drug reduces migraine frequency. In a trial, patients taking the drug reported 40% fewer migraines than before the trial began.",
    question: "Which of the following, if true, most strengthens the claim that the drug is responsible for the reduction?",
    choices: [
      { label: "A", text: "The drug has been approved in two other countries." },
      { label: "B", text: "Patients in a control group who took a placebo reported only a 5% reduction in migraines." },
      { label: "C", text: "Migraines are known to fluctuate naturally over time." },
      { label: "D", text: "The trial lasted six months." },
      { label: "E", text: "All patients in the trial had suffered from migraines for at least two years." },
    ],
    correct: "B",
    explanation: "The placebo comparison is exactly what the argument needs — it rules out the possibility that the reduction was due to natural fluctuation or the placebo effect."
  },
  // PARALLEL REASONING
  {
    id: 16, type: "Parallel Reasoning", difficulty: "Medium",
    stimulus: "If it rains, the game will be cancelled. It is raining. Therefore, the game will be cancelled.",
    question: "Which of the following most closely parallels the reasoning above?",
    choices: [
      { label: "A", text: "If the market opens high, stocks will rise. Stocks rose. Therefore, the market opened high." },
      { label: "B", text: "The game was cancelled. It must have rained." },
      { label: "C", text: "If the power goes out, the alarm won't sound. The power went out. Therefore, the alarm won't sound." },
      { label: "D", text: "If she studies, she passes. She didn't study. Therefore, she won't pass." },
      { label: "E", text: "It rains often in spring. It is spring. Therefore, it will rain." },
    ],
    correct: "C",
    explanation: "The original is modus ponens: If P then Q; P; therefore Q. Only C follows the same valid structure exactly."
  },
  {
    id: 17, type: "Parallel Reasoning", difficulty: "Hard",
    stimulus: "All members of the board voted for the merger. Since Tricia is not a member of the board, she did not vote for the merger.",
    question: "Which of the following has the same flawed reasoning?",
    choices: [
      { label: "A", text: "All doctors attended the conference. Since Liu attended the conference, Liu must be a doctor." },
      { label: "B", text: "All licensed pilots passed the safety exam. Marcus passed the safety exam, so Marcus is a licensed pilot." },
      { label: "C", text: "Everyone who won a prize entered the contest. Since Sofia did not win a prize, she did not enter the contest." },
      { label: "D", text: "All board members received a bonus. Since Karl received a bonus, Karl is a board member." },
      { label: "E", text: "No non-members attended the gala. Since Petra is a member, she attended the gala." },
    ],
    correct: "B",
    explanation: "The original wrongly concludes 'not A, therefore not B' from 'All A are B.' B commits the same flaw: passing the exam doesn't mean you're a pilot, just as Tricia's non-membership doesn't mean she didn't vote."
  },
  // MAIN POINT
  {
    id: 18, type: "Main Point", difficulty: "Easy",
    stimulus: "Many parents believe that limiting screen time improves children's sleep. However, recent studies show that the content children consume matters more than the total time spent. A child watching educational programming for two hours may sleep better than one who spends thirty minutes on fast-paced action games.",
    question: "Which of the following best expresses the main point of the passage?",
    choices: [
      { label: "A", text: "Parents should not worry about their children's screen time." },
      { label: "B", text: "Educational programming is always beneficial for children." },
      { label: "C", text: "The type of screen content affects children's sleep more than total screen time does." },
      { label: "D", text: "Action games are harmful to children's development." },
      { label: "E", text: "Recent sleep studies are more reliable than parental intuition." },
    ],
    correct: "C",
    explanation: "The passage's central claim is the contrast between the conventional focus on duration and the finding that content type is what actually matters."
  },
  {
    id: 19, type: "Main Point", difficulty: "Medium",
    stimulus: "Cities that have adopted congestion pricing — charging drivers a fee to enter downtown areas during peak hours — have consistently seen reductions in traffic and improvements in air quality. Critics worry that the fees burden low-income commuters. But studies show most low-income workers commute by public transit, not personal vehicles, and congestion pricing revenue is typically reinvested into transit improvements.",
    question: "The main point of the argument is that:",
    choices: [
      { label: "A", text: "Congestion pricing always improves air quality in cities." },
      { label: "B", text: "Low-income workers should be exempt from congestion pricing fees." },
      { label: "C", text: "The equity concerns about congestion pricing are less serious than critics suggest." },
      { label: "D", text: "Public transit is superior to personal vehicle commuting." },
      { label: "E", text: "Cities should prioritize air quality over commuter convenience." },
    ],
    correct: "C",
    explanation: "The argument acknowledges the criticism then systematically rebuts it — the main point is that the equity objection doesn't hold up under scrutiny."
  },
  // RESOLVE THE PARADOX
  {
    id: 20, type: "Resolve the Paradox", difficulty: "Medium",
    stimulus: "Despite widespread awareness campaigns about the dangers of texting while driving, the number of accidents caused by distracted driving has increased every year for the past five years.",
    question: "Which of the following, if true, best resolves this apparent paradox?",
    choices: [
      { label: "A", text: "Texting while driving is illegal in most states." },
      { label: "B", text: "The awareness campaigns have been largely funded by the government." },
      { label: "C", text: "Smartphone use has increased dramatically, and even drivers who know the risks often engage in distracted behavior." },
      { label: "D", text: "Many accidents caused by distracted driving go unreported." },
      { label: "E", text: "The campaigns have successfully reduced texting among teenage drivers." },
    ],
    correct: "C",
    explanation: "Knowing the risk and changing the behavior are different things. C explains why awareness hasn't translated into fewer accidents — the temptation and opportunity have grown faster than the deterrence."
  },
  {
    id: 21, type: "Resolve the Paradox", difficulty: "Hard",
    stimulus: "A hospital implemented a strict hand-washing protocol for all staff. In the six months following implementation, the rate of hospital-acquired infections increased.",
    question: "Which of the following, if true, best explains this seemingly contradictory result?",
    choices: [
      { label: "A", text: "Hand-washing protocols are effective at preventing the spread of bacteria." },
      { label: "B", text: "The hospital simultaneously began admitting patients with more severe underlying conditions who were more susceptible to infection." },
      { label: "C", text: "Some staff members were not fully trained on the new protocol." },
      { label: "D", text: "The hospital's infection rate had been declining before the protocol was introduced." },
      { label: "E", text: "Hand-washing alone cannot eliminate all pathogens in a hospital environment." },
    ],
    correct: "B",
    explanation: "If the patient population shifted to higher-risk individuals, infection rates could rise even with improved hygiene — the protocol may be working, but the baseline risk increased."
  },
  // INFERENCE
  {
    id: 22, type: "Inference", difficulty: "Easy",
    stimulus: "The Eastbrook Nature Reserve was established to protect the habitat of the Eastern Meadowlark. Since the reserve's founding, the meadowlark population has tripled. However, the reserve's operating budget has been cut by 40% this year.",
    question: "Which of the following can be most reasonably inferred from the passage?",
    choices: [
      { label: "A", text: "The Eastern Meadowlark population will decline following the budget cut." },
      { label: "B", text: "The reserve was previously overfunded." },
      { label: "C", text: "The reserve has been at least partially successful in its primary mission." },
      { label: "D", text: "Budget cuts will force the reserve to reduce its protected land area." },
      { label: "E", text: "The meadowlark population tripled because of the reserve alone." },
    ],
    correct: "C",
    explanation: "A tripling of the target species strongly suggests the reserve has made progress toward its mission — this is the most modest, defensible inference."
  },
  {
    id: 23, type: "Inference", difficulty: "Medium",
    stimulus: "No country that has adopted Policy X has experienced a recession within five years of adoption. Verantia adopted Policy X three years ago. Verantia's economy is currently growing at 3% annually.",
    question: "Which of the following can properly be inferred from the statements above?",
    choices: [
      { label: "A", text: "Policy X causes economic growth." },
      { label: "B", text: "Verantia will not experience a recession in the next two years." },
      { label: "C", text: "Verantia's growth rate is attributable to Policy X." },
      { label: "D", text: "Verantia has not experienced a recession since adopting Policy X." },
      { label: "E", text: "Policy X should be adopted by all countries seeking to avoid recession." },
    ],
    correct: "D",
    explanation: "The passage says no adopting country has had a recession within five years. Verantia adopted Policy X three years ago and is currently growing — so it hasn't had a recession during this window. D follows directly."
  },
  // EVALUATE THE ARGUMENT
  {
    id: 24, type: "Evaluate", difficulty: "Hard",
    stimulus: "Our marketing team ran an online ad campaign for four weeks and found that website traffic increased by 35% during that period. We should increase the ad budget, since the campaign clearly drove more visitors to the site.",
    question: "Which of the following would be most useful to know in evaluating the argument above?",
    choices: [
      { label: "A", text: "What percentage of website visitors make a purchase?" },
      { label: "B", text: "Whether website traffic typically increases by a similar amount during this time of year regardless of advertising." },
      { label: "C", text: "How the ads were designed and which platform they ran on." },
      { label: "D", text: "Whether competitors also ran ad campaigns during this period." },
      { label: "E", text: "What the current total marketing budget is." },
    ],
    correct: "B",
    explanation: "The key flaw is assuming the campaign caused the increase. Knowing whether seasonal traffic patterns produce similar spikes would help determine if the campaign made any difference at all."
  },
  // PRINCIPLE
  {
    id: 25, type: "Principle", difficulty: "Medium",
    stimulus: "A hospital's ethics board ruled that a patient has the right to refuse treatment, even if that treatment would save their life, provided the patient is mentally competent and fully informed of the consequences.",
    question: "Which of the following situations best conforms to the principle described above?",
    choices: [
      { label: "A", text: "A doctor overrides a patient's refusal of chemotherapy because the patient's family requests it." },
      { label: "B", text: "A mentally competent patient who understands that refusing dialysis will result in death is allowed to refuse dialysis." },
      { label: "C", text: "A patient in a coma is given emergency surgery without prior consent." },
      { label: "D", text: "A patient is told only the benefits of a procedure before being asked to consent." },
      { label: "E", text: "A patient's refusal of treatment is overridden because doctors believe the patient is not thinking clearly." },
    ],
    correct: "B",
    explanation: "B satisfies all three conditions: the patient is mentally competent, fully informed, and choosing to refuse — exactly what the principle protects."
  },
  {
    id: 26, type: "Principle", difficulty: "Hard",
    stimulus: "A journalist should publish information that serves the public interest, but should not publish information whose primary effect is to harm private individuals without providing any corresponding public benefit.",
    question: "Which of the following best applies this principle?",
    choices: [
      { label: "A", text: "A journalist publishes a public official's voting record, which embarrasses the official." },
      { label: "B", text: "A journalist reveals a private citizen's medical history because it is interesting to readers." },
      { label: "C", text: "A journalist declines to name a crime victim who has requested anonymity, even though naming them would increase readership." },
      { label: "D", text: "A journalist publishes all information gathered during an investigation, regardless of relevance." },
      { label: "E", text: "A journalist withholds information about a public official's criminal conduct to protect the official's family." },
    ],
    correct: "C",
    explanation: "C follows the principle precisely: withholding the name harms no private individual and the public interest gain (higher readership) is insufficient to justify the harm — so the journalist correctly declines."
  },
  // METHOD OF REASONING
  {
    id: 27, type: "Method of Reasoning", difficulty: "Medium",
    stimulus: "Counselor: You argue that students should be allowed to use AI tools on all assignments. But last month you said that students should be required to complete work independently to build skills. These positions are contradictory, so your current argument should be rejected.",
    question: "The counselor's argument proceeds by:",
    choices: [
      { label: "A", text: "Providing evidence that contradicts the student's current position." },
      { label: "B", text: "Demonstrating that the student's conclusion leads to an absurd outcome." },
      { label: "C", text: "Pointing out an inconsistency between the student's current and past positions." },
      { label: "D", text: "Appealing to the authority of educational research." },
      { label: "E", text: "Showing that the student's argument relies on a false assumption." },
    ],
    correct: "C",
    explanation: "The counselor doesn't attack the argument's logic or evidence — they identify a contradiction between what the student claims now and what they claimed previously."
  },
  {
    id: 28, type: "Method of Reasoning", difficulty: "Hard",
    stimulus: "The proposed regulation would require all restaurants to post calorie counts. Proponents say this will reduce obesity. But regulations requiring calorie posting have been in effect in New York City for over a decade, and obesity rates there have not declined faster than in cities without such regulations.",
    question: "The argument above uses which of the following methods of reasoning?",
    choices: [
      { label: "A", text: "It identifies a logical contradiction in the proponents' position." },
      { label: "B", text: "It uses a counterexample to challenge a causal claim." },
      { label: "C", text: "It argues that the proposed regulation is too costly to implement." },
      { label: "D", text: "It attacks the credibility of the regulation's proponents." },
      { label: "E", text: "It proposes an alternative explanation for rising obesity rates." },
    ],
    correct: "B",
    explanation: "The argument cites the New York City experience as a real-world counterexample — the regulation was tried and didn't produce the claimed outcome."
  },
  // NECESSARY vs SUFFICIENT
  {
    id: 29, type: "Assumption", difficulty: "Hard",
    stimulus: "To be eligible for the scholarship, students must have a GPA above 3.5 and demonstrate financial need. Priya has a 3.8 GPA and has demonstrated financial need, so she is eligible for the scholarship.",
    question: "The conclusion above is valid only if which of the following is assumed?",
    choices: [
      { label: "A", text: "Priya intends to apply for the scholarship." },
      { label: "B", text: "GPA and financial need are the only eligibility requirements." },
      { label: "C", text: "The scholarship committee will approve all eligible students." },
      { label: "D", text: "Priya's GPA will remain above 3.5 until the scholarship is awarded." },
      { label: "E", text: "Other students with higher GPAs are not competing for the same scholarship." },
    ],
    correct: "B",
    explanation: "The argument concludes eligibility from meeting two criteria — but this only works if those are the only criteria. Additional unstated requirements could still disqualify Priya."
  },
  {
    id: 30, type: "Flaw", difficulty: "Hard",
    stimulus: "We should not trust the environmental impact report on the new pipeline. The report was commissioned by the pipeline company itself.",
    question: "Which of the following most accurately describes the flaw in the argument above?",
    choices: [
      { label: "A", text: "It assumes that all environmental impact reports are biased." },
      { label: "B", text: "It rejects a source based on potential bias without demonstrating that the report's conclusions are actually wrong." },
      { label: "C", text: "It fails to consider the qualifications of the researchers who wrote the report." },
      { label: "D", text: "It overgeneralizes from the pipeline company's past behavior." },
      { label: "E", text: "It confuses the motivation for commissioning a report with the content of the report." },
    ],
    correct: "B",
    explanation: "This is an ad hominem / genetic fallacy. Pointing to a conflict of interest raises doubt but doesn't prove the report is wrong — the argument needs to show the conclusions are actually flawed."
  },
];

const QUESTION_TYPES = ["All", ...Array.from(new Set(ALL_QUESTIONS.map(q => q.type)))];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
const SWIPE_THRESHOLD = 90;

// ─── VIEWS ────────────────────────────────────────────────────────────────────
const VIEWS = { HOME: "home", DRILL: "drill", REVIEW: "review", FINISH: "finish" };

export default function App() {
  const [view, setView] = useState(VIEWS.HOME);
  const [filterType, setFilterType] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");
  const [timerMode, setTimerMode] = useState(false); // false | "perQ" | "section"
  const [history, setHistory] = useState([]); // {qId, correct, selectedLabel, timeSpent}
  const [drillState, setDrillState] = useState(null);

  function startDrill() {
    const pool = ALL_QUESTIONS.filter(q =>
      (filterType === "All" || q.type === filterType) &&
      (filterDiff === "All" || q.difficulty === filterDiff)
    );
    if (pool.length === 0) return;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setDrillState({
      questions: shuffled,
      index: 0,
      selected: null,
      submitted: false,
      streak: 0,
      score: 0,
      sessionHistory: [],
      timerSeconds: timerMode === "perQ" ? 80 : timerMode === "section" ? pool.length * 80 : null,
      questionStartTime: Date.now(),
    });
    setView(VIEWS.DRILL);
  }

  function finishDrill(sessionHistory, score) {
    setHistory(h => [...h, ...sessionHistory]);
    setView(VIEWS.FINISH);
    setDrillState(ds => ({ ...ds, finalScore: score, finalSession: sessionHistory }));
  }

  return (
    <div style={S.root}>
      {view === VIEWS.HOME && (
        <HomeScreen
          filterType={filterType} setFilterType={setFilterType}
          filterDiff={filterDiff} setFilterDiff={setFilterDiff}
          timerMode={timerMode} setTimerMode={setTimerMode}
          onStart={startDrill}
          onReview={() => setView(VIEWS.REVIEW)}
          totalSeen={history.length}
          totalCorrect={history.filter(h => h.correct).length}
        />
      )}
      {view === VIEWS.DRILL && drillState && (
        <DrillScreen
          drillState={drillState}
          setDrillState={setDrillState}
          onFinish={finishDrill}
          onHome={() => setView(VIEWS.HOME)}
        />
      )}
      {view === VIEWS.FINISH && drillState && (
        <FinishScreen
          sessionHistory={drillState.finalSession || []}
          score={drillState.finalScore || 0}
          questions={ALL_QUESTIONS}
          onHome={() => setView(VIEWS.HOME)}
          onReview={() => setView(VIEWS.REVIEW)}
        />
      )}
      {view === VIEWS.REVIEW && (
        <ReviewScreen
          history={history}
          questions={ALL_QUESTIONS}
          onHome={() => setView(VIEWS.HOME)}
        />
      )}
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ filterType, setFilterType, filterDiff, setFilterDiff, timerMode, setTimerMode, onStart, onReview, totalSeen, totalCorrect }) {
  const available = ALL_QUESTIONS.filter(q =>
    (filterType === "All" || q.type === filterType) &&
    (filterDiff === "All" || q.difficulty === filterDiff)
  ).length;

  return (
    <div style={S.homeRoot}>
      <div style={S.homeHeader}>
        <div style={S.homeLogo}>LSAT<span style={S.logoBlue}>Swipe</span></div>
        <div style={S.homeSubtitle}>Daily prep. One card at a time.</div>
      </div>

      {totalSeen > 0 && (
        <div style={S.statsBar}>
          <div style={S.statItem}>
            <span style={S.statNum}>{totalSeen}</span>
            <span style={S.statLabel}>Practiced</span>
          </div>
          <div style={S.statDivider} />
          <div style={S.statItem}>
            <span style={S.statNum}>{totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : 0}%</span>
            <span style={S.statLabel}>Accuracy</span>
          </div>
          <div style={S.statDivider} />
          <div style={S.statItem}>
            <span style={S.statNum}>{totalCorrect}</span>
            <span style={S.statLabel}>Correct</span>
          </div>
        </div>
      )}

      <div style={S.section}>
        <div style={S.sectionLabel}>Question Type</div>
        <div style={S.pillRow}>
          {QUESTION_TYPES.map(t => (
            <button key={t} style={{ ...S.pill, ...(filterType === t ? S.pillActive : {}) }} onClick={() => setFilterType(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={S.section}>
        <div style={S.sectionLabel}>Difficulty</div>
        <div style={S.pillRow}>
          {DIFFICULTIES.map(d => (
            <button key={d} style={{ ...S.pill, ...(filterDiff === d ? S.pillActive : {}) }} onClick={() => setFilterDiff(d)}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <div style={S.section}>
        <div style={S.sectionLabel}>Timer Mode</div>
        <div style={S.pillRow}>
          {[["Off", false], ["1:20 / Q", "perQ"], ["Full Section", "section"]].map(([label, val]) => (
            <button key={label} style={{ ...S.pill, ...(timerMode === val ? S.pillActive : {}) }} onClick={() => setTimerMode(val)}>
              {label}
            </button>
          ))}
        </div>
        {timerMode === "perQ" && <div style={S.timerNote}>1 min 20 sec per question — real LSAT pace</div>}
        {timerMode === "section" && <div style={S.timerNote}>Total time based on question count</div>}
      </div>

      <div style={S.availableNote}>{available} question{available !== 1 ? "s" : ""} in this set</div>

      <button style={{ ...S.startBtn, opacity: available === 0 ? 0.4 : 1 }} onClick={onStart} disabled={available === 0}>
        Start Session →
      </button>

      {totalSeen > 0 && (
        <button style={S.reviewBtn} onClick={onReview}>
          Review Past Questions
        </button>
      )}
    </div>
  );
}

// ─── DRILL SCREEN ─────────────────────────────────────────────────────────────
function DrillScreen({ drillState, setDrillState, onFinish, onHome }) {
  const { questions, index, selected, submitted, streak, score, sessionHistory, timerSeconds, questionStartTime } = drillState;
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [animating, setAnimating] = useState(null);
  const dragStart = useRef(null);
  const cardRef = useRef(null);
  const timerRef = useRef(null);

  const done = index >= questions.length;
  const q = done ? null : questions[index];
  const isCorrect = submitted && selected === q?.correct;

  useEffect(() => {
    if (timerSeconds === null || submitted || done) return;
    setTimeLeft(timerSeconds);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // auto submit with no answer
          setDrillState(ds => ({ ...ds, submitted: true }));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, timerSeconds]);

  useEffect(() => {
    if (submitted) clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  useEffect(() => {
    if (done) {
      onFinish(sessionHistory, score);
    }
  }, [done]);

  function handleSelect(label) {
    if (submitted) return;
    setDrillState(ds => ({ ...ds, selected: label }));
  }

  function handleSubmit() {
    if (!selected || submitted) return;
    clearInterval(timerRef.current);
    setDrillState(ds => ({ ...ds, submitted: true }));
  }

  function advance() {
    const correct = selected === q.correct;
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const direction = correct ? "right" : "left";
    setAnimating(direction);
    setTimeout(() => {
      setDrillState(ds => ({
        ...ds,
        index: ds.index + 1,
        selected: null,
        submitted: false,
        streak: correct ? ds.streak + 1 : 0,
        score: correct ? ds.score + 1 : ds.score,
        sessionHistory: [...ds.sessionHistory, { qId: q.id, correct, selectedLabel: selected, timeSpent }],
        timerSeconds: ds.timerSeconds !== null ? (drillState.timerMode === "perQ" ? 80 : ds.timerSeconds) : null,
        questionStartTime: Date.now(),
      }));
      setAnimating(null);
      setDragX(0);
      setTimeLeft(timerSeconds);
    }, 380);
  }

  function onPointerDown(e) {
    if (!submitted) return;
    dragStart.current = e.clientX;
    setDragging(true);
    cardRef.current?.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragging) return;
    setDragX(e.clientX - dragStart.current);
  }
  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(dragX) > SWIPE_THRESHOLD) advance();
    else setDragX(0);
  }

  const cardStyle = animating
    ? { transform: `translateX(${animating === "right" ? 115 : -115}%) rotate(${animating === "right" ? 16 : -16}deg)`, opacity: 0, transition: "transform 0.38s cubic-bezier(.4,0,.2,1), opacity 0.3s ease" }
    : dragging
    ? { transform: `translateX(${dragX}px) rotate(${dragX * 0.035}deg)`, transition: "none", cursor: "grabbing" }
    : { transform: "translateX(0) rotate(0deg)", transition: "transform 0.2s ease" };

  const pct = timerSeconds ? (timeLeft / timerSeconds) : 1;
  const timerColor = pct > 0.5 ? "#22c55e" : pct > 0.25 ? "#f59e0b" : "#ef4444";

  if (done) return null;

  return (
    <div style={S.drillRoot}>
      <div style={S.drillHeader}>
        <button style={S.backBtn} onClick={onHome}>← Home</button>
        <div style={S.drillStats}>
          {streak >= 2 && <span style={S.streak}>🔥 {streak}</span>}
          <span style={S.scoreChip}>{score}/{questions.length}</span>
        </div>
      </div>

      <div style={S.progressTrack}>
        <div style={{ ...S.progressFill, width: `${(index / questions.length) * 100}%` }} />
      </div>

      {timerSeconds !== null && (
        <div style={S.timerRow}>
          <div style={S.timerTrack}>
            <div style={{ ...S.timerFill, width: `${pct * 100}%`, background: timerColor, transition: "width 1s linear, background 0.5s" }} />
          </div>
          <span style={{ ...S.timerNum, color: timerColor }}>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
        </div>
      )}

      <div style={S.cardWrap}>
        <div style={{ ...S.swipeIndicator, ...S.swipeRight, opacity: dragX > 30 ? Math.min((dragX - 30) / 70, 0.85) : 0 }}>✓ Next</div>
        <div style={{ ...S.swipeIndicator, ...S.swipeLeft, opacity: dragX < -30 ? Math.min((-dragX - 30) / 70, 0.85) : 0 }}>Next ✗</div>

        <div ref={cardRef} style={{ ...S.card, ...cardStyle, userSelect: "none" }}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>

          <div style={S.cardMeta}>
            <span style={S.typeTag}>{q.type}</span>
            <span style={{ ...S.diffTag, color: q.difficulty === "Easy" ? "#4ade80" : q.difficulty === "Medium" ? "#fbbf24" : "#f87171" }}>
              {q.difficulty}
            </span>
          </div>

          <p style={S.stimulus}>{q.stimulus}</p>
          <p style={S.questionText}>{q.question}</p>

          <div style={S.choices}>
            {q.choices.map(c => {
              let bg = "#162032", border = "1.5px solid #2d3f55", color = "#cbd5e1";
              if (submitted) {
                if (c.label === q.correct) { bg = "#0d3320"; border = "1.5px solid #22c55e"; color = "#86efac"; }
                else if (c.label === selected && selected !== q.correct) { bg = "#3b0a0a"; border = "1.5px solid #ef4444"; color = "#fca5a5"; }
              } else if (c.label === selected) {
                bg = "#0f2a4a"; border = "1.5px solid #60a5fa"; color = "#bfdbfe";
              }
              return (
                <button key={c.label} style={{ ...S.choice, background: bg, border, color }} onClick={() => handleSelect(c.label)}>
                  <span style={S.choiceLabel}>{c.label}</span>
                  <span style={S.choiceText}>{c.text}</span>
                </button>
              );
            })}
          </div>

          {submitted && (
            <div style={S.explanation}>
              <div style={{ color: isCorrect ? "#4ade80" : "#f87171", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                {isCorrect ? "✓ Correct" : `✗ Answer: ${q.correct}`}
              </div>
              <p style={S.explanationText}>{q.explanation}</p>
            </div>
          )}
        </div>
      </div>

      <div style={S.actionRow}>
        {!submitted ? (
          <button style={{ ...S.submitBtn, opacity: selected ? 1 : 0.35, cursor: selected ? "pointer" : "default" }}
            onClick={handleSubmit} disabled={!selected}>
            Check Answer
          </button>
        ) : (
          <div style={S.nextRow}>
            <button style={S.nextBtn} onClick={advance}>Next →</button>
            <div style={S.dragHint}>or drag the card</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FINISH SCREEN ────────────────────────────────────────────────────────────
function FinishScreen({ sessionHistory, score, questions, onHome, onReview }) {
  const total = sessionHistory.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const missed = sessionHistory.filter(h => !h.correct);

  return (
    <div style={S.finishRoot}>
      <div style={S.finishCard}>
        <div style={S.finishEmoji}>{pct >= 80 ? "🎯" : pct >= 60 ? "📈" : "📚"}</div>
        <h2 style={S.finishTitle}>Session Complete</h2>
        <div style={S.finishScore}>{score}<span style={S.finishTotal}>/{total}</span></div>
        <div style={S.pctBar}><div style={{ ...S.pctFill, width: `${pct}%`, background: pct >= 70 ? "#22c55e" : "#f59e0b" }} /></div>
        <div style={S.pctLabel}>{pct}% accuracy</div>
        <p style={S.finishMsg}>
          {pct === 100 ? "Perfect. Flawless logic." : pct >= 80 ? "Strong session. Keep the streak going." : pct >= 60 ? "Good work. Review your misses." : "Tough set. Review and go again."}
        </p>

        {missed.length > 0 && (
          <div style={S.missedSection}>
            <div style={S.missedTitle}>Missed ({missed.length})</div>
            {missed.map(h => {
              const q = questions.find(q => q.id === h.qId);
              if (!q) return null;
              return (
                <div key={h.qId} style={S.missedItem}>
                  <span style={S.missedType}>{q.type}</span>
                  <span style={S.missedQ}>{q.stimulus.slice(0, 60)}…</span>
                  <span style={S.missedAnswer}>You: {h.selectedLabel || "—"} · Correct: {q.correct}</span>
                </div>
              );
            })}
          </div>
        )}

        <div style={S.finishBtns}>
          <button style={S.restartBtn} onClick={onHome}>New Session</button>
          <button style={S.reviewLinkBtn} onClick={onReview}>Full Review</button>
        </div>
      </div>
    </div>
  );
}

// ─── REVIEW SCREEN ────────────────────────────────────────────────────────────
function ReviewScreen({ history, questions, onHome }) {
  const [filter, setFilter] = useState("All"); // All | Correct | Missed
  const [expandedId, setExpandedId] = useState(null);

  const seen = questions.filter(q => history.some(h => h.qId === q.id));
  const filtered = seen.filter(q => {
    const h = history.filter(h => h.qId === q.id);
    const lastAttempt = h[h.length - 1];
    if (filter === "Correct") return lastAttempt?.correct;
    if (filter === "Missed") return lastAttempt && !lastAttempt.correct;
    return true;
  });

  if (history.length === 0) {
    return (
      <div style={S.reviewRoot}>
        <div style={S.reviewHeader}>
          <button style={S.backBtn} onClick={onHome}>← Home</button>
          <span style={S.reviewTitle}>Review</span>
        </div>
        <div style={S.emptyState}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ color: "#64748b", fontSize: 14 }}>No questions practiced yet.</div>
          <button style={{ ...S.startBtn, marginTop: 20 }} onClick={onHome}>Start a Session</button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.reviewRoot}>
      <div style={S.reviewHeader}>
        <button style={S.backBtn} onClick={onHome}>← Home</button>
        <span style={S.reviewTitle}>Review</span>
      </div>

      <div style={S.pillRow}>
        {["All", "Correct", "Missed"].map(f => (
          <button key={f} style={{ ...S.pill, ...(filter === f ? S.pillActive : {}) }} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div style={S.reviewList}>
        {filtered.length === 0 && <div style={{ color: "#475569", textAlign: "center", padding: 32, fontSize: 14 }}>No questions in this filter.</div>}
        {filtered.map(q => {
          const attempts = history.filter(h => h.qId === q.id);
          const last = attempts[attempts.length - 1];
          const expanded = expandedId === q.id;
          return (
            <div key={q.id} style={S.reviewCard} onClick={() => setExpandedId(expanded ? null : q.id)}>
              <div style={S.reviewCardHeader}>
                <div style={S.reviewCardMeta}>
                  <span style={S.typeTag}>{q.type}</span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>{attempts.length}x attempted</span>
                </div>
                <span style={{ color: last?.correct ? "#4ade80" : "#f87171", fontWeight: 700, fontSize: 13 }}>
                  {last?.correct ? "✓" : "✗"}
                </span>
              </div>
              <p style={S.reviewStimulus}>{q.stimulus.slice(0, 100)}{q.stimulus.length > 100 ? "…" : ""}</p>
              {expanded && (
                <div style={S.reviewExpanded}>
                  <p style={{ ...S.stimulus, marginBottom: 10 }}>{q.stimulus}</p>
                  <p style={{ ...S.questionText, marginBottom: 10 }}>{q.question}</p>
                  {q.choices.map(c => (
                    <div key={c.label} style={{
                      ...S.reviewChoice,
                      background: c.label === q.correct ? "#0d3320" : "#0f172a",
                      border: c.label === q.correct ? "1px solid #22c55e" : "1px solid #1e293b",
                      color: c.label === q.correct ? "#86efac" : "#64748b",
                    }}>
                      <span style={S.choiceLabel}>{c.label}</span>
                      <span style={{ fontSize: 13 }}>{c.text}</span>
                    </div>
                  ))}
                  <div style={S.explanation}>
                    <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>Explanation</div>
                    <p style={S.explanationText}>{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  root: { minHeight: "100vh", background: "#080f1a", fontFamily: "'Inter', system-ui, sans-serif", color: "#e2e8f0" },

  // HOME
  homeRoot: { maxWidth: 480, margin: "0 auto", padding: "28px 20px 60px", display: "flex", flexDirection: "column", gap: 0 },
  homeHeader: { marginBottom: 24 },
  homeLogo: { fontSize: 28, fontWeight: 900, letterSpacing: "-1px", color: "#f1f5f9" },
  logoBlue: { color: "#38bdf8" },
  homeSubtitle: { fontSize: 13, color: "#475569", marginTop: 4 },
  statsBar: { display: "flex", background: "#0f1f33", border: "1px solid #1e3a55", borderRadius: 14, padding: "14px 0", marginBottom: 28, justifyContent: "space-around" },
  statItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  statNum: { fontSize: 22, fontWeight: 800, color: "#38bdf8" },
  statLabel: { fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 },
  statDivider: { width: 1, background: "#1e3a55" },
  section: { marginBottom: 22 },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  pillRow: { display: "flex", flexWrap: "wrap", gap: 7, padding: "0 0 4px" },
  pill: { padding: "7px 14px", borderRadius: 99, border: "1.5px solid #1e3a55", background: "#0f1f33", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" },
  pillActive: { background: "#0c2d4a", border: "1.5px solid #38bdf8", color: "#38bdf8" },
  timerNote: { fontSize: 11, color: "#475569", marginTop: 8 },
  availableNote: { fontSize: 12, color: "#334155", marginBottom: 16, textAlign: "center" },
  startBtn: { width: "100%", padding: "15px", background: "linear-gradient(135deg, #0ea5e9, #6366f1)", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer", letterSpacing: "-0.3px" },
  reviewBtn: { width: "100%", marginTop: 10, padding: "13px", background: "transparent", color: "#475569", border: "1.5px solid #1e3a55", borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: "pointer" },

  // DRILL
  drillRoot: { maxWidth: 480, margin: "0 auto", padding: "0 0 40px", display: "flex", flexDirection: "column", minHeight: "100vh" },
  drillHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px 8px" },
  backBtn: { background: "none", border: "none", color: "#475569", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "4px 0" },
  drillStats: { display: "flex", alignItems: "center", gap: 8 },
  streak: { fontSize: 14, fontWeight: 700, color: "#fb923c" },
  scoreChip: { background: "#0f1f33", border: "1px solid #1e3a55", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, color: "#64748b" },
  progressTrack: { width: "100%", height: 2, background: "#0f1f33" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #0ea5e9, #6366f1)", transition: "width 0.4s ease" },
  timerRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 18px 4px" },
  timerTrack: { flex: 1, height: 4, background: "#0f1f33", borderRadius: 99, overflow: "hidden" },
  timerFill: { height: "100%", borderRadius: 99 },
  timerNum: { fontSize: 13, fontWeight: 800, minWidth: 36, textAlign: "right" },
  cardWrap: { position: "relative", flex: 1, padding: "14px 16px 0", display: "flex", flexDirection: "column" },
  swipeIndicator: { position: "absolute", top: 28, zIndex: 10, fontWeight: 800, fontSize: 18, borderRadius: 8, padding: "5px 14px", pointerEvents: "none", transition: "opacity 0.1s", border: "2.5px solid" },
  swipeRight: { right: 28, color: "#4ade80", borderColor: "#4ade80", background: "rgba(13,51,32,0.85)" },
  swipeLeft: { left: 28, color: "#f87171", borderColor: "#f87171", background: "rgba(59,10,10,0.85)" },
  card: { background: "#0f1f33", borderRadius: 18, border: "1px solid #1e3a55", padding: "20px 18px 18px", boxShadow: "0 12px 50px rgba(0,0,0,0.6)", touchAction: "none" },
  cardMeta: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  typeTag: { display: "inline-block", background: "#0c2d4a", color: "#38bdf8", fontSize: 10, fontWeight: 800, letterSpacing: 0.8, borderRadius: 6, padding: "3px 9px", textTransform: "uppercase", border: "1px solid #164e6b" },
  diffTag: { fontSize: 11, fontWeight: 700 },
  stimulus: { fontSize: 13.5, lineHeight: 1.7, color: "#94a3b8", marginBottom: 14 },
  questionText: { fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 12, lineHeight: 1.5 },
  choices: { display: "flex", flexDirection: "column", gap: 7 },
  choice: { display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.12s, border 0.12s" },
  choiceLabel: { fontWeight: 800, fontSize: 12, minWidth: 16, marginTop: 1, flexShrink: 0 },
  choiceText: { fontSize: 13, lineHeight: 1.5 },
  explanation: { marginTop: 14, background: "#060d18", borderRadius: 10, padding: "12px 14px", borderLeft: "3px solid #1e3a55" },
  explanationText: { fontSize: 12.5, color: "#64748b", lineHeight: 1.65, margin: 0 },
  actionRow: { padding: "14px 16px 0" },
  submitBtn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #0ea5e9, #6366f1)", color: "#fff", border: "none", borderRadius: 13, fontSize: 15, fontWeight: 800, transition: "opacity 0.2s" },
  nextRow: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  nextBtn: { width: "100%", padding: "14px", background: "#0f1f33", color: "#e2e8f0", border: "1.5px solid #1e3a55", borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: "pointer" },
  dragHint: { fontSize: 11, color: "#334155" },

  // FINISH
  finishRoot: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px" },
  finishCard: { background: "#0f1f33", border: "1px solid #1e3a55", borderRadius: 22, padding: "32px 24px", maxWidth: 420, width: "100%" },
  finishEmoji: { fontSize: 44, marginBottom: 10, textAlign: "center" },
  finishTitle: { fontSize: 20, fontWeight: 800, color: "#f1f5f9", textAlign: "center", marginBottom: 8 },
  finishScore: { fontSize: 48, fontWeight: 900, color: "#38bdf8", textAlign: "center", lineHeight: 1 },
  finishTotal: { fontSize: 24, color: "#334155" },
  pctBar: { background: "#060d18", borderRadius: 99, height: 6, overflow: "hidden", margin: "14px 0 6px" },
  pctFill: { height: "100%", borderRadius: 99, transition: "width 0.8s ease" },
  pctLabel: { fontSize: 12, color: "#475569", textAlign: "center", marginBottom: 12 },
  finishMsg: { fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 1.6, marginBottom: 20 },
  missedSection: { background: "#060d18", borderRadius: 12, padding: "14px", marginBottom: 20 },
  missedTitle: { fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  missedItem: { display: "flex", flexDirection: "column", gap: 2, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #0f1f33" },
  missedType: { fontSize: 10, color: "#38bdf8", fontWeight: 700, textTransform: "uppercase" },
  missedQ: { fontSize: 12, color: "#94a3b8", lineHeight: 1.5 },
  missedAnswer: { fontSize: 11, color: "#f87171" },
  finishBtns: { display: "flex", gap: 10 },
  restartBtn: { flex: 1, padding: "13px", background: "linear-gradient(135deg, #0ea5e9, #6366f1)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer" },
  reviewLinkBtn: { flex: 1, padding: "13px", background: "transparent", color: "#475569", border: "1.5px solid #1e3a55", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" },

  // REVIEW
  reviewRoot: { maxWidth: 480, margin: "0 auto", padding: "0 0 60px" },
  reviewHeader: { display: "flex", alignItems: "center", gap: 12, padding: "16px 18px 12px" },
  reviewTitle: { fontSize: 16, fontWeight: 800, color: "#f1f5f9" },
  reviewList: { padding: "0 16px", display: "flex", flexDirection: "column", gap: 10, marginTop: 14 },
  reviewCard: { background: "#0f1f33", border: "1px solid #1e3a55", borderRadius: 14, padding: "14px 16px", cursor: "pointer" },
  reviewCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  reviewCardMeta: { display: "flex", alignItems: "center", gap: 8 },
  reviewStimulus: { fontSize: 12.5, color: "#64748b", lineHeight: 1.5, margin: 0 },
  reviewExpanded: { marginTop: 14, borderTop: "1px solid #1e3a55", paddingTop: 14 },
  reviewChoice: { display: "flex", gap: 10, padding: "8px 10px", borderRadius: 8, marginBottom: 6, alignItems: "flex-start" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" },
};
