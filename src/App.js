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
// ── NEW QUESTIONS 31-100 ──────────────────────────────────────────────────
  {
    id: 31, type: "Weaken", difficulty: "Medium",
    stimulus: "A study found that students who take handwritten notes perform better on exams than those who type their notes on laptops. Therefore, schools should ban laptops in classrooms to improve student performance.",
    question: "Which of the following, if true, most weakens the argument?",
    choices: [
      { label: "A", text: "Students who handwrite notes tend to be more engaged during lectures." },
      { label: "B", text: "The students who chose to handwrite notes were already higher-achieving students before the study began." },
      { label: "C", text: "Laptops are expensive and not all students can afford them." },
      { label: "D", text: "Some students type faster than they write by hand." },
      { label: "E", text: "The study was conducted across multiple universities." },
    ],
    correct: "B",
    explanation: "If high-achieving students self-selected into handwriting, the study reflects selection bias rather than a causal effect of note-taking method."
  },
  {
    id: 32, type: "Weaken", difficulty: "Hard",
    stimulus: "A nutritionist argues that the Mediterranean diet is the healthiest diet in the world, pointing to studies showing populations in Mediterranean countries have lower rates of heart disease than populations in Northern Europe.",
    question: "Which of the following most seriously weakens the nutritionist's conclusion?",
    choices: [
      { label: "A", text: "Mediterranean countries have warmer climates than Northern European countries." },
      { label: "B", text: "Mediterranean populations also have more physically active lifestyles and stronger social bonds, both of which independently reduce heart disease." },
      { label: "C", text: "The Mediterranean diet is expensive and difficult to maintain outside Mediterranean countries." },
      { label: "D", text: "Some Mediterranean countries have higher rates of other diseases." },
      { label: "E", text: "Heart disease is one of the leading causes of death worldwide." },
    ],
    correct: "B",
    explanation: "If lifestyle and social factors also differ between the populations, the diet cannot be isolated as the cause of lower heart disease rates."
  },
  {
    id: 33, type: "Weaken", difficulty: "Easy",
    stimulus: "The new downtown bike lane has reduced car traffic on Main Street by 15%. We should add bike lanes to all major streets to reduce citywide traffic.",
    question: "Which of the following most weakens this argument?",
    choices: [
      { label: "A", text: "Bike lanes are less expensive to build than new roads." },
      { label: "B", text: "The reduction in Main Street traffic was accompanied by a 20% increase in traffic on the parallel side streets, suggesting drivers simply rerouted." },
      { label: "C", text: "Many residents support expanding the bike lane network." },
      { label: "D", text: "Cyclists do not contribute to air pollution the way cars do." },
      { label: "E", text: "Main Street has more commercial activity than other streets." },
    ],
    correct: "B",
    explanation: "If traffic simply shifted to other streets, the bike lane reduced traffic on one street without reducing citywide traffic."
  },
  {
    id: 34, type: "Weaken", difficulty: "Hard",
    stimulus: "Countries that spend more per student on public education consistently produce higher-scoring students on international assessments. Therefore, increasing education spending is the most effective way to improve student outcomes.",
    question: "Which of the following most weakens the argument?",
    choices: [
      { label: "A", text: "Some countries with low education spending still score well on international assessments." },
      { label: "B", text: "Higher-spending countries tend to be wealthier overall, and student outcomes correlate strongly with family income regardless of school spending." },
      { label: "C", text: "International assessments do not capture all dimensions of educational quality." },
      { label: "D", text: "Education spending has increased in most developed countries over the past two decades." },
      { label: "E", text: "Teacher salaries account for the majority of education spending in most countries." },
    ],
    correct: "B",
    explanation: "If national wealth drives both spending and outcomes, spending may be a byproduct of wealth rather than a cause of better student performance."
  },
  {
    id: 35, type: "Weaken", difficulty: "Medium",
    stimulus: "Patients at hospitals with more nurses per patient have better recovery outcomes. Hiring more nurses is therefore the key to improving hospital quality.",
    question: "Which of the following most weakens this conclusion?",
    choices: [
      { label: "A", text: "Nurses provide essential direct patient care that doctors cannot always provide." },
      { label: "B", text: "Better-funded hospitals can afford both more nurses and better equipment, and it may be the equipment driving improved outcomes." },
      { label: "C", text: "Some hospitals are understaffed due to nursing shortages." },
      { label: "D", text: "Patient recovery is influenced by many factors beyond hospital care." },
      { label: "E", text: "Hiring additional nurses increases hospital operating costs." },
    ],
    correct: "B",
    explanation: "If funding drives both nurse hiring and equipment quality, the equipment could be the real cause of better outcomes."
  },
  {
    id: 36, type: "Assumption", difficulty: "Medium",
    stimulus: "This history textbook was written by a professor at a prestigious university, so it must be accurate and unbiased.",
    question: "Which of the following is an assumption on which the argument depends?",
    choices: [
      { label: "A", text: "Prestigious universities employ only the most qualified professors." },
      { label: "B", text: "Employment at a prestigious university ensures accuracy and lack of bias in scholarly work." },
      { label: "C", text: "History textbooks are more likely to be biased than other academic works." },
      { label: "D", text: "The professor has published other books that were well-received." },
      { label: "E", text: "Students learn history more effectively from textbooks than from lectures." },
    ],
    correct: "B",
    explanation: "The argument moves from 'prestigious institution' to 'accurate and unbiased' — this only works if institutional prestige guarantees those qualities."
  },
  {
    id: 37, type: "Assumption", difficulty: "Hard",
    stimulus: "To reduce youth obesity, the city should tax sugary drinks. Studies show that higher prices lead consumers to purchase less of a product.",
    question: "The argument assumes which of the following?",
    choices: [
      { label: "A", text: "Sugary drinks are the primary cause of youth obesity." },
      { label: "B", text: "Young people will not simply switch to other high-calorie beverages or foods that are equally affordable." },
      { label: "C", text: "The tax revenue will be used to fund health education programs." },
      { label: "D", text: "Parents are primarily responsible for children's dietary choices." },
      { label: "E", text: "Sugary drink consumption has increased among youth in recent years." },
    ],
    correct: "B",
    explanation: "The conclusion requires assuming the reduced consumption is not offset by substituting equally unhealthy alternatives."
  },
  {
    id: 38, type: "Assumption", difficulty: "Easy",
    stimulus: "Marcus finished the marathon in under three hours. Only elite runners finish marathons in under three hours. Therefore, Marcus must be an elite runner.",
    question: "Which of the following is assumed by the argument?",
    choices: [
      { label: "A", text: "Marcus has been running competitively for many years." },
      { label: "B", text: "Finishing a marathon in under three hours is not something non-elite runners ever achieve." },
      { label: "C", text: "Elite runners train more hours per week than recreational runners." },
      { label: "D", text: "The marathon course Marcus ran was regulation length." },
      { label: "E", text: "Marcus did not use performance-enhancing substances." },
    ],
    correct: "B",
    explanation: "The argument treats 'only elite runners finish under three hours' as a clean rule — which requires B to hold without exception."
  },
  {
    id: 39, type: "Assumption", difficulty: "Hard",
    stimulus: "The government should fund basic scientific research because such research has historically led to technological breakthroughs that benefit society.",
    question: "Which of the following is an assumption underlying this argument?",
    choices: [
      { label: "A", text: "Private companies are unwilling to fund basic scientific research." },
      { label: "B", text: "Government funding of research will continue to produce breakthroughs comparable to those produced historically." },
      { label: "C", text: "Technological breakthroughs always improve quality of life for all citizens." },
      { label: "D", text: "Basic research is more valuable than applied research." },
      { label: "E", text: "The government has sufficient funds to support scientific research." },
    ],
    correct: "B",
    explanation: "The historical track record justifies future funding only if past patterns are expected to continue."
  },
  {
    id: 40, type: "Assumption", difficulty: "Medium",
    stimulus: "The crime rate in Westville dropped significantly after the city installed streetlights in previously dark neighborhoods. Other cities should install more streetlights to reduce crime.",
    question: "Which of the following is an assumption the argument depends on?",
    choices: [
      { label: "A", text: "Dark streets are the primary cause of crime in all cities." },
      { label: "B", text: "The conditions that made streetlights effective in Westville exist in other cities as well." },
      { label: "C", text: "Streetlights are less expensive than other crime prevention measures." },
      { label: "D", text: "Crime rates have been rising in most cities." },
      { label: "E", text: "Westville's police department did not also increase patrols during the same period." },
    ],
    correct: "B",
    explanation: "Recommending the same solution for other cities assumes those cities share whatever conditions made streetlights work in Westville."
  },
  {
    id: 41, type: "Must Be True", difficulty: "Medium",
    stimulus: "Some lawyers are politicians. All politicians are public figures. No private citizen is a public figure.",
    question: "Which of the following must be true?",
    choices: [
      { label: "A", text: "All lawyers are public figures." },
      { label: "B", text: "Some lawyers are not private citizens." },
      { label: "C", text: "All public figures are politicians." },
      { label: "D", text: "No lawyers are private citizens." },
      { label: "E", text: "Some politicians are lawyers." },
    ],
    correct: "B",
    explanation: "Some lawyers are politicians, those lawyers are public figures, and public figures are not private citizens — so some lawyers are not private citizens."
  },
  {
    id: 42, type: "Must Be True", difficulty: "Hard",
    stimulus: "Every applicant who passed the written exam was invited to interview. Several applicants who were invited to interview did not receive job offers. All applicants who received job offers had passed the written exam.",
    question: "Which of the following must be true?",
    choices: [
      { label: "A", text: "Every applicant who passed the written exam received a job offer." },
      { label: "B", text: "Some applicants who passed the written exam did not receive job offers." },
      { label: "C", text: "No applicant received a job offer without being invited to interview." },
      { label: "D", text: "Most applicants who interviewed were rejected." },
      { label: "E", text: "Passing the written exam is sufficient to receive a job offer." },
    ],
    correct: "C",
    explanation: "All job offer recipients passed the exam and were therefore invited to interview. So no one got a job offer without being interviewed. C must be true."
  },
  {
    id: 43, type: "Must Be True", difficulty: "Medium",
    stimulus: "All of the red marbles in the bag are large. Some of the large marbles in the bag are heavy. None of the heavy marbles are blue.",
    question: "Which of the following must be true?",
    choices: [
      { label: "A", text: "All red marbles are heavy." },
      { label: "B", text: "Some large marbles are red." },
      { label: "C", text: "No large marbles are blue." },
      { label: "D", text: "No red marbles are blue." },
      { label: "E", text: "Some heavy marbles are red." },
    ],
    correct: "B",
    explanation: "All red marbles are large — so the group of large marbles must contain all the red ones. Therefore some large marbles are red."
  },
  {
    id: 44, type: "Must Be True", difficulty: "Hard",
    stimulus: "No chef at the restaurant has fewer than five years of experience. All chefs with more than ten years of experience have won at least one award. Some chefs at the restaurant have won awards.",
    question: "Which of the following must also be true?",
    choices: [
      { label: "A", text: "All chefs at the restaurant have won awards." },
      { label: "B", text: "Some chefs at the restaurant have more than ten years of experience." },
      { label: "C", text: "Every chef who has won an award has more than ten years of experience." },
      { label: "D", text: "All chefs with five years of experience have won awards." },
      { label: "E", text: "No chef with exactly five years of experience has won an award." },
    ],
    correct: "B",
    explanation: "Some chefs at the restaurant have won awards. Since awards require 10+ years of experience, some chefs must have more than ten years."
  },
  {
    id: 45, type: "Flaw", difficulty: "Easy",
    stimulus: "We should not listen to Senator Kim's proposal to increase the minimum wage. She has received substantial donations from labor unions, so she clearly cannot be trusted to give unbiased economic advice.",
    question: "The argument is flawed because it:",
    choices: [
      { label: "A", text: "Fails to consider the economic evidence for raising the minimum wage." },
      { label: "B", text: "Attacks the senator's character rather than addressing the merits of her proposal." },
      { label: "C", text: "Assumes that labor unions always act in the public interest." },
      { label: "D", text: "Overgeneralizes from one politician's behavior to all politicians." },
      { label: "E", text: "Confuses correlation with causation." },
    ],
    correct: "B",
    explanation: "This is an ad hominem attack — the argument dismisses the proposal by attacking the proposer's motives rather than engaging with the substance."
  },
  {
    id: 46, type: "Flaw", difficulty: "Medium",
    stimulus: "Either we invest heavily in renewable energy now, or we will face catastrophic climate change within 50 years. Since investing heavily in renewable energy is too expensive, we must accept that catastrophic climate change is inevitable.",
    question: "The argument above is flawed because it:",
    choices: [
      { label: "A", text: "Assumes that climate change is caused entirely by energy production." },
      { label: "B", text: "Presents only two options when other alternatives may exist." },
      { label: "C", text: "Relies on a prediction that cannot be verified." },
      { label: "D", text: "Fails to define what counts as catastrophic climate change." },
      { label: "E", text: "Assumes that cost is the only relevant factor in energy policy." },
    ],
    correct: "B",
    explanation: "This is a false dilemma — the argument ignores middle-ground alternatives like moderate investment, efficiency measures, or carbon capture."
  },
  {
    id: 47, type: "Flaw", difficulty: "Hard",
    stimulus: "In a survey, 80% of people who regularly attend religious services reported being happy with their lives. Therefore, attending religious services causes people to be happier.",
    question: "The argument is most vulnerable to criticism because it:",
    choices: [
      { label: "A", text: "Uses a sample that may not be representative of the general population." },
      { label: "B", text: "Treats self-reported happiness as equivalent to objective wellbeing." },
      { label: "C", text: "Concludes that correlation implies causation without ruling out alternative explanations." },
      { label: "D", text: "Ignores the happiness levels of people who attend services but report being unhappy." },
      { label: "E", text: "Relies on a survey rather than a controlled experiment." },
    ],
    correct: "C",
    explanation: "The correlation between service attendance and happiness could be explained multiple ways — happier people may be more likely to attend services, or a third factor may drive both."
  },
  {
    id: 48, type: "Flaw", difficulty: "Medium",
    stimulus: "The ancient Romans had a sophisticated legal system, advanced engineering, and a complex economy. Modern Western civilization also has these features. Therefore, modern Western civilization must be descended from Roman civilization.",
    question: "The argument is flawed because it:",
    choices: [
      { label: "A", text: "Fails to consider that Roman civilization eventually collapsed." },
      { label: "B", text: "Assumes that sharing characteristics proves a direct lineage rather than independent development." },
      { label: "C", text: "Overstates the sophistication of Roman engineering." },
      { label: "D", text: "Ignores other ancient civilizations that had similar features." },
      { label: "E", text: "Conflates legal systems with cultural identity." },
    ],
    correct: "B",
    explanation: "Similar features do not prove descent — civilizations can independently develop similar institutions without one causing the other."
  },
  {
    id: 49, type: "Strengthen", difficulty: "Easy",
    stimulus: "The mayor claims that the new public transit expansion will reduce downtown traffic congestion.",
    question: "Which of the following most strengthens this claim?",
    choices: [
      { label: "A", text: "The transit expansion will add 12 new bus routes connecting residential neighborhoods directly to the downtown core." },
      { label: "B", text: "Public transit expansions are popular with environmental advocacy groups." },
      { label: "C", text: "The city has a history of completing infrastructure projects on time." },
      { label: "D", text: "Traffic congestion costs the city millions of dollars annually in lost productivity." },
      { label: "E", text: "The transit expansion has bipartisan political support." },
    ],
    correct: "A",
    explanation: "New routes connecting residential areas to downtown give commuters a viable alternative to driving, directly supporting the claim that congestion will decrease."
  },
  {
    id: 50, type: "Strengthen", difficulty: "Medium",
    stimulus: "A school district argues that its new reading intervention program improved literacy among struggling third-graders.",
    question: "Which of the following most strengthens the district's argument?",
    choices: [
      { label: "A", text: "The program was developed by experienced literacy specialists." },
      { label: "B", text: "Third-graders in a comparable district without the program showed no improvement in literacy over the same period." },
      { label: "C", text: "Teachers in the district received training on how to implement the program." },
      { label: "D", text: "The program has received positive media coverage." },
      { label: "E", text: "Literacy rates among third-graders have been declining nationally." },
    ],
    correct: "B",
    explanation: "A comparison group that showed no improvement isolates the program as the cause of improvement, ruling out natural maturation or other factors."
  },
  {
    id: 51, type: "Strengthen", difficulty: "Hard",
    stimulus: "Researchers claim that a newly discovered enzyme can break down microplastics in ocean water, potentially offering a solution to plastic pollution.",
    question: "Which of the following most strengthens the researchers' claim?",
    choices: [
      { label: "A", text: "Microplastic pollution is one of the most pressing environmental problems facing the world's oceans." },
      { label: "B", text: "In controlled laboratory tests, the enzyme broke down 90% of microplastic samples within 48 hours without producing harmful byproducts." },
      { label: "C", text: "The enzyme was discovered in bacteria living near a plastic recycling facility." },
      { label: "D", text: "Several environmental organizations have expressed interest in funding further research." },
      { label: "E", text: "Current methods of removing microplastics from ocean water are expensive and inefficient." },
    ],
    correct: "B",
    explanation: "Controlled lab results showing high effectiveness and safety directly support the claim that the enzyme can break down microplastics."
  },
  {
    id: 52, type: "Strengthen", difficulty: "Medium",
    stimulus: "An economist argues that raising the federal minimum wage will not significantly increase unemployment.",
    question: "Which of the following most strengthens this argument?",
    choices: [
      { label: "A", text: "Most minimum wage workers are employed in service industries." },
      { label: "B", text: "Studies of past minimum wage increases found no statistically significant increase in unemployment in states that raised their wages compared to neighboring states that did not." },
      { label: "C", text: "The current federal minimum wage has not been raised in over a decade." },
      { label: "D", text: "Labor unions support raising the minimum wage." },
      { label: "E", text: "Many economists disagree about the effects of minimum wage increases." },
    ],
    correct: "B",
    explanation: "Historical evidence from natural experiments directly supports the claim that employment effects are minimal."
  },
  {
    id: 53, type: "Parallel Reasoning", difficulty: "Easy",
    stimulus: "All birds have feathers. Penguins are birds. Therefore, penguins have feathers.",
    question: "Which of the following most closely parallels the reasoning above?",
    choices: [
      { label: "A", text: "All fish live in water. Dolphins live in water. Therefore, dolphins are fish." },
      { label: "B", text: "All mammals are warm-blooded. Whales are mammals. Therefore, whales are warm-blooded." },
      { label: "C", text: "Some reptiles are dangerous. Crocodiles are reptiles. Therefore, crocodiles are dangerous." },
      { label: "D", text: "All cats are mammals. Some mammals are large. Therefore, some cats are large." },
      { label: "E", text: "No insects are mammals. Spiders are not insects. Therefore, spiders are mammals." },
    ],
    correct: "B",
    explanation: "All A are B; C is A; therefore C is B. Only B follows this exact valid syllogism structure."
  },
  {
    id: 54, type: "Parallel Reasoning", difficulty: "Hard",
    stimulus: "The committee will approve the proposal only if both the budget and the timeline are acceptable. The timeline is not acceptable. Therefore, the committee will not approve the proposal.",
    question: "Which of the following most closely parallels this reasoning?",
    choices: [
      { label: "A", text: "The engine will start only if it has fuel and a working battery. The battery is dead. Therefore, the engine will not start." },
      { label: "B", text: "The team will win only if they score more points than the opponent. They scored fewer points. Therefore, they lost." },
      { label: "C", text: "The package will arrive on time only if it is shipped today. It was shipped today. Therefore, it will arrive on time." },
      { label: "D", text: "You will get the job only if you interview well. You interviewed poorly. Therefore, you will not get the job." },
      { label: "E", text: "The project will succeed if the team works hard and has sufficient resources. The team worked hard. Therefore, the project will succeed." },
    ],
    correct: "A",
    explanation: "The original requires both conditions; one fails; therefore the outcome fails. A matches: both fuel AND battery needed; battery fails; engine will not start."
  },
  {
    id: 55, type: "Resolve the Paradox", difficulty: "Easy",
    stimulus: "A major airline reduced its ticket prices by 30% but saw its total revenue increase over the following year.",
    question: "Which of the following best resolves this apparent paradox?",
    choices: [
      { label: "A", text: "The airline also reduced its operating costs during the same period." },
      { label: "B", text: "The lower prices attracted so many new passengers that the increase in volume more than offset the lower price per ticket." },
      { label: "C", text: "Other airlines did not reduce their prices during the same period." },
      { label: "D", text: "The airline added several new international routes during the year." },
      { label: "E", text: "Fuel prices decreased during the same period." },
    ],
    correct: "B",
    explanation: "Price elasticity — if demand increases enough in response to lower prices, total revenue (price times quantity) can still rise."
  },
  {
    id: 56, type: "Resolve the Paradox", difficulty: "Medium",
    stimulus: "Eating breakfast has been shown to improve concentration. Yet students at Northfield Academy who eat breakfast in the school cafeteria consistently score lower on morning exams than students who skip breakfast.",
    question: "Which of the following best explains this paradox?",
    choices: [
      { label: "A", text: "The school cafeteria serves high-sugar, low-nutrient options that cause energy crashes before exams." },
      { label: "B", text: "Some students at Northfield eat breakfast at home rather than at school." },
      { label: "C", text: "Morning exams are more difficult than afternoon exams at Northfield." },
      { label: "D", text: "Students who skip breakfast tend to go to sleep earlier the night before." },
      { label: "E", text: "The school cafeteria is noisy and crowded, causing stress before exams." },
    ],
    correct: "A",
    explanation: "If cafeteria food is poor quality, it explains why cafeteria breakfast specifically hurts performance — not all breakfasts are equal."
  },
  {
    id: 57, type: "Resolve the Paradox", difficulty: "Hard",
    stimulus: "A country enacted strict gun control laws, and gun violence decreased. However, overall violent crime increased during the same period.",
    question: "Which of the following best resolves this apparent paradox?",
    choices: [
      { label: "A", text: "Gun control laws are controversial and opposed by many citizens." },
      { label: "B", text: "Criminals who could no longer obtain guns turned to other weapons, leading to an increase in non-gun violent crime that exceeded the decrease in gun violence." },
      { label: "C", text: "The gun control laws were difficult to enforce in rural areas." },
      { label: "D", text: "Overall crime rates are influenced by many social and economic factors." },
      { label: "E", text: "Other countries with strict gun laws have lower overall violent crime rates." },
    ],
    correct: "B",
    explanation: "Weapon substitution — reduced gun violence offset by increased non-gun violence — explains why overall violent crime rose even as gun violence fell."
  },
  {
    id: 58, type: "Inference", difficulty: "Medium",
    stimulus: "The Alderton Bridge was built in 1887 and has never been structurally reinforced. Engineering standards require that any bridge over 100 years old that has not been reinforced be inspected annually. The Alderton Bridge was last inspected in 2019.",
    question: "Which of the following can be properly inferred?",
    choices: [
      { label: "A", text: "The Alderton Bridge is structurally unsafe." },
      { label: "B", text: "The Alderton Bridge is not in compliance with current engineering inspection standards." },
      { label: "C", text: "The bridge will need to be demolished within the next decade." },
      { label: "D", text: "The agency responsible for the bridge has been negligent." },
      { label: "E", text: "Bridges built before 1900 are more dangerous than those built afterward." },
    ],
    correct: "B",
    explanation: "The bridge is over 100 years old and unreinforced, requiring annual inspection. Last inspected in 2019 means it has not been inspected annually — it is out of compliance."
  },
  {
    id: 59, type: "Inference", difficulty: "Easy",
    stimulus: "All of the paintings in the Harwick Gallery are either oil paintings or watercolors. None of the watercolors in the gallery were painted before 1900. The gallery contains several paintings from the 1800s.",
    question: "Which of the following can be properly inferred?",
    choices: [
      { label: "A", text: "All paintings from the 1800s in the gallery are oil paintings." },
      { label: "B", text: "The gallery specializes in 19th century art." },
      { label: "C", text: "Watercolor painting was not practiced before 1900." },
      { label: "D", text: "Oil paintings are more valuable than watercolors." },
      { label: "E", text: "The gallery owns more oil paintings than watercolors." },
    ],
    correct: "A",
    explanation: "Paintings are either oil or watercolor; watercolors are all post-1900; therefore the 1800s paintings must all be oil paintings."
  },
  {
    id: 60, type: "Inference", difficulty: "Hard",
    stimulus: "Economists studying the gig economy found that gig workers earn less per hour on average than traditionally employed workers in comparable roles, once expenses are accounted for. However, gig workers consistently report higher job satisfaction than traditionally employed workers.",
    question: "Which of the following is most strongly supported by the passage?",
    choices: [
      { label: "A", text: "Most workers prefer higher job satisfaction to higher pay." },
      { label: "B", text: "Gig work is economically superior to traditional employment for most workers." },
      { label: "C", text: "Job satisfaction and hourly compensation are not always correlated." },
      { label: "D", text: "Traditional employers should offer more flexibility to compete with the gig economy." },
      { label: "E", text: "Gig workers are unaware of how much less they earn than traditionally employed workers." },
    ],
    correct: "C",
    explanation: "The passage shows gig workers earn less but report higher satisfaction — directly demonstrating that pay and satisfaction do not always move together."
  },
  {
    id: 61, type: "Main Point", difficulty: "Hard",
    stimulus: "Critics argue that social media companies should be held legally liable for harmful user content. However, this would require proactive censorship at massive scale — technically impossible and a threat to free expression. A better approach would be requiring transparency about moderation practices so users can make informed platform choices.",
    question: "Which of the following best expresses the main point?",
    choices: [
      { label: "A", text: "Social media companies currently do not do enough to moderate harmful content." },
      { label: "B", text: "Legal liability for user content is technically impossible to implement." },
      { label: "C", text: "Rather than imposing liability, policymakers should require platforms to be transparent about their moderation practices." },
      { label: "D", text: "Free expression should never be restricted by social media companies." },
      { label: "E", text: "Users are ultimately responsible for the content they post on social media." },
    ],
    correct: "C",
    explanation: "The passage argues against liability and proposes transparency as an alternative — C captures both the rejection of one approach and the advocacy for another."
  },
  {
    id: 62, type: "Main Point", difficulty: "Medium",
    stimulus: "Many parents enroll their children in intensive tutoring to boost college admission prospects. While tutoring can improve test scores, admissions officers at selective universities increasingly value intellectual curiosity, resilience, and authentic passion — qualities tutoring cannot provide. Parents may therefore be investing in the wrong kind of preparation.",
    question: "The main point of the passage is that:",
    choices: [
      { label: "A", text: "Tutoring programs are ineffective at raising test scores." },
      { label: "B", text: "Selective universities should place less emphasis on test scores in admissions." },
      { label: "C", text: "Parents focused on tutoring may be neglecting preparation that matters more for selective college admissions." },
      { label: "D", text: "Intellectual curiosity cannot be developed through any formal program." },
      { label: "E", text: "College admissions processes are unfair to students who cannot afford tutoring." },
    ],
    correct: "C",
    explanation: "The passage acknowledges tutoring works for scores but argues the qualities that matter most for admissions are not what tutoring provides."
  },
  {
    id: 63, type: "Evaluate", difficulty: "Medium",
    stimulus: "A city council member argues that planting more trees in urban neighborhoods will significantly reduce violent crime rates, citing studies showing that neighborhoods with more green space have lower crime rates.",
    question: "Which of the following would be most useful in evaluating this argument?",
    choices: [
      { label: "A", text: "How much it costs to plant and maintain urban trees." },
      { label: "B", text: "Whether neighborhoods with more green space differ from others in ways that independently reduce crime, such as higher income levels." },
      { label: "C", text: "What types of trees are most effective at reducing urban heat." },
      { label: "D", text: "Whether the city council member has a background in urban planning." },
      { label: "E", text: "How many other cities have implemented similar tree-planting programs." },
    ],
    correct: "B",
    explanation: "The argument assumes green space causes lower crime, but if greener neighborhoods differ in other crime-reducing ways, the trees may not be the operative factor."
  },
  {
    id: 64, type: "Evaluate", difficulty: "Hard",
    stimulus: "A tech company claims its AI-powered hiring tool reduces racial bias in candidate screening by removing names and photos from applications. Therefore, candidates selected by the tool will be chosen purely on merit.",
    question: "Which of the following would be most important to know in evaluating this claim?",
    choices: [
      { label: "A", text: "Whether the company's human HR team also reviews applications after the AI screens them." },
      { label: "B", text: "Whether the AI was trained on historical hiring data that may itself reflect past discriminatory practices." },
      { label: "C", text: "How many candidates the tool screens per month." },
      { label: "D", text: "Whether applicants are informed that an AI is screening their applications." },
      { label: "E", text: "What percentage of the company's current workforce belongs to minority groups." },
    ],
    correct: "B",
    explanation: "If the AI learned from biased historical data, it may replicate those biases through proxies even without names and photos."
  },
  {
    id: 65, type: "Principle", difficulty: "Easy",
    stimulus: "A company should only advertise a product as new and improved if the product has undergone a substantive change that meaningfully benefits consumers, not merely a change in packaging or branding.",
    question: "Which of the following best conforms to this principle?",
    choices: [
      { label: "A", text: "A cereal brand redesigns its box with brighter colors and labels it new and improved." },
      { label: "B", text: "A shampoo company changes its bottle shape and advertises the product as new and improved." },
      { label: "C", text: "A pain reliever brand adds a faster-dissolving formula that reaches the bloodstream 30% quicker and labels it new and improved." },
      { label: "D", text: "A beverage company changes its logo and calls its drink new and improved." },
      { label: "E", text: "A detergent brand changes its scent without testing whether consumers prefer it and markets it as new and improved." },
    ],
    correct: "C",
    explanation: "Only C involves a substantive change — faster absorption — that meaningfully benefits consumers, satisfying both conditions of the principle."
  },
  {
    id: 66, type: "Principle", difficulty: "Hard",
    stimulus: "A government is justified in restricting individual freedoms only when doing so prevents clear and direct harm to others, and only to the extent necessary to prevent that harm.",
    question: "Which of the following government actions is most consistent with this principle?",
    choices: [
      { label: "A", text: "Banning all alcohol consumption because drunk driving causes accidents that harm others." },
      { label: "B", text: "Requiring motorcyclists to wear helmets to protect themselves from injury." },
      { label: "C", text: "Requiring restaurants to display calorie counts so consumers can make informed choices." },
      { label: "D", text: "Mandating that drivers stop at red lights to prevent collisions with other drivers and pedestrians." },
      { label: "E", text: "Prohibiting citizens from owning dogs because some dogs have bitten strangers." },
    ],
    correct: "D",
    explanation: "Traffic signals prevent direct harm to others and the restriction is limited to what is necessary. A and E go beyond what is necessary; B protects the individual rather than others."
  },
  {
    id: 67, type: "Method of Reasoning", difficulty: "Easy",
    stimulus: "Professor: You claim the university should eliminate required courses because students learn better when they choose their own curriculum. But last semester you argued that structure and requirements are essential for academic rigor. Your current position directly contradicts your earlier one.",
    question: "The professor's response proceeds by:",
    choices: [
      { label: "A", text: "Providing empirical evidence that required courses improve learning outcomes." },
      { label: "B", text: "Pointing out that the student's current position is inconsistent with a position the student previously held." },
      { label: "C", text: "Appealing to the authority of educational research." },
      { label: "D", text: "Demonstrating that the student's conclusion leads to an unacceptable outcome." },
      { label: "E", text: "Questioning whether the student has sufficient knowledge of curriculum design." },
    ],
    correct: "B",
    explanation: "The professor identifies a contradiction between the student's current and past positions — an inconsistency attack."
  },
  {
    id: 68, type: "Method of Reasoning", difficulty: "Medium",
    stimulus: "Advocate: We must ban single-use plastics immediately. Every year, millions of tons of plastic enter the ocean, killing marine life and entering the food chain. We have already lost decades to inaction, and each year of delay causes irreversible damage to marine ecosystems.",
    question: "The advocate's argument relies primarily on which method?",
    choices: [
      { label: "A", text: "Citing scientific consensus to establish the credibility of the claim." },
      { label: "B", text: "Using the urgency and irreversibility of the harm to argue for immediate action." },
      { label: "C", text: "Proposing a specific alternative to single-use plastics." },
      { label: "D", text: "Appealing to the economic costs of plastic pollution." },
      { label: "E", text: "Comparing the current situation to a historical precedent." },
    ],
    correct: "B",
    explanation: "The argument's force comes from emphasizing irreversible ongoing harm and lost time — using urgency as the primary reason for immediate action."
  },
  {
    id: 69, type: "Flaw", difficulty: "Medium",
    stimulus: "No true patriot would ever criticize their country's government. Since journalist Elena Vasquez has written several critical articles about government policy, she is clearly not a true patriot.",
    question: "The argument above is most vulnerable to which criticism?",
    choices: [
      { label: "A", text: "It defines true patriot in a way that excludes legitimate expressions of civic engagement." },
      { label: "B", text: "It fails to consider whether Elena Vasquez's criticism is accurate." },
      { label: "C", text: "It assumes that journalism is inherently biased against governments." },
      { label: "D", text: "It overgeneralizes from one journalist's behavior to all journalists." },
      { label: "E", text: "It confuses patriotism with nationalism." },
    ],
    correct: "A",
    explanation: "This is the No True Scotsman fallacy — defining true patriot to automatically exclude anyone who criticizes the government makes the claim unfalsifiable and circular."
  },
  {
    id: 70, type: "Strengthen", difficulty: "Hard",
    stimulus: "A conservation group argues that reintroducing wolves into Yellowstone National Park improved the overall health of the park's ecosystem, not just wolf population numbers.",
    question: "Which of the following most strengthens this argument?",
    choices: [
      { label: "A", text: "Wolf populations in Yellowstone have grown steadily since reintroduction." },
      { label: "B", text: "After wolf reintroduction, elk herds changed their grazing behavior, allowing riverbank vegetation to recover, which reduced erosion and improved water quality for fish populations." },
      { label: "C", text: "Conservation groups in other countries have also advocated for wolf reintroduction." },
      { label: "D", text: "Wolves were a natural part of Yellowstone's ecosystem before being hunted to extinction in the area." },
      { label: "E", text: "Visitors to Yellowstone reported more wolf sightings after reintroduction." },
    ],
    correct: "B",
    explanation: "B describes a cascade of ecosystem improvements — affecting elk behavior, vegetation, erosion, and fish — directly supporting the claim of broad ecosystem health improvement."
  },
  {
    id: 71, type: "Weaken", difficulty: "Hard",
    stimulus: "Since the introduction of smartphones, rates of depression and anxiety among teenagers have increased significantly. Smartphones must therefore be causing the rise in teenage mental health problems.",
    question: "Which of the following most seriously weakens this argument?",
    choices: [
      { label: "A", text: "Not all teenagers who own smartphones report feeling depressed or anxious." },
      { label: "B", text: "Awareness and diagnosis of depression and anxiety have also increased significantly during the same period, which could account for higher reported rates." },
      { label: "C", text: "Teenagers spend an average of seven hours per day on their smartphones." },
      { label: "D", text: "Social media platforms allow for cyberbullying." },
      { label: "E", text: "Several studies have linked smartphone use to disrupted sleep patterns." },
    ],
    correct: "B",
    explanation: "If better awareness and diagnosis explain the increase in reported rates, smartphones may not be causing a real rise in mental illness."
  },
  {
    id: 72, type: "Assumption", difficulty: "Medium",
    stimulus: "Because organic produce is grown without synthetic pesticides, it is healthier for consumers than conventionally grown produce.",
    question: "The argument above assumes which of the following?",
    choices: [
      { label: "A", text: "Organic farming is better for the environment than conventional farming." },
      { label: "B", text: "The absence of synthetic pesticides is sufficient to make produce meaningfully healthier for consumers." },
      { label: "C", text: "Consumers can reliably distinguish organic from conventional produce." },
      { label: "D", text: "Organic produce costs more to produce than conventional produce." },
      { label: "E", text: "Synthetic pesticides were not used in agriculture before the 20th century." },
    ],
    correct: "B",
    explanation: "The argument leaps from no synthetic pesticides to healthier — this requires assuming pesticide absence alone is enough to confer meaningful health benefits."
  },
  {
    id: 73, type: "Inference", difficulty: "Medium",
    stimulus: "Every painting in the museum's permanent collection was either donated by a private collector or purchased with public funds. The museum's most famous painting was not purchased with public funds. The museum has never accepted anonymous donations.",
    question: "Which of the following can be properly inferred?",
    choices: [
      { label: "A", text: "The famous painting was donated by an identified private collector." },
      { label: "B", text: "Most of the museum's collection was donated rather than purchased." },
      { label: "C", text: "The famous painting is the most valuable in the collection." },
      { label: "D", text: "The museum prefers donations to purchases." },
      { label: "E", text: "Private collectors donate paintings to museums for tax benefits." },
    ],
    correct: "A",
    explanation: "The painting is in the permanent collection, so it was either donated or purchased with public funds. Not purchased means donated. No anonymous donations means the donor is identified."
  },
  {
    id: 74, type: "Resolve the Paradox", difficulty: "Medium",
    stimulus: "Studies show that people who live near airports report higher rates of sleep disturbance due to noise. Yet residents living closest to the airport report the fewest sleep disturbances of all groups studied.",
    question: "Which of the following best resolves this paradox?",
    choices: [
      { label: "A", text: "Airport noise is loudest during daytime hours when most people are awake." },
      { label: "B", text: "Residents living closest to the airport have lived there the longest and have habituated to the noise over time." },
      { label: "C", text: "Airport noise levels have decreased over the past decade due to quieter aircraft." },
      { label: "D", text: "Real estate near airports is significantly cheaper, attracting lower-income residents." },
      { label: "E", text: "Some residents near airports use white noise machines to help them sleep." },
    ],
    correct: "B",
    explanation: "Habituation — getting used to chronic noise over time — explains why long-term residents closest to the airport are least disturbed."
  },
  {
    id: 75, type: "Principle", difficulty: "Medium",
    stimulus: "A doctor should always prioritize the long-term health of the patient over immediate comfort, except when the patient is fully informed and competently refuses a recommended treatment.",
    question: "Which of the following situations violates this principle?",
    choices: [
      { label: "A", text: "A doctor prescribes a painful but effective cancer treatment to a patient who has been fully informed and agrees." },
      { label: "B", text: "A doctor administers a sedative to a fully informed, competent patient who has refused pain management, overriding the refusal to spare the patient discomfort." },
      { label: "C", text: "A doctor recommends surgery to a patient and proceeds after the patient provides informed consent." },
      { label: "D", text: "A doctor declines to prescribe addictive painkillers for long-term use despite a patient's request, citing long-term health risks." },
      { label: "E", text: "A doctor informs a patient of all risks before the patient decides to decline a recommended procedure." },
    ],
    correct: "B",
    explanation: "B violates the principle because the patient is fully informed and competently refused — the exception applies, and the doctor must respect the refusal."
  },
  {
    id: 76, type: "Must Be True", difficulty: "Medium",
    stimulus: "If the interest rate rises, housing prices will fall. If housing prices fall, construction activity will slow. Interest rates rose last quarter.",
    question: "Which of the following must be true?",
    choices: [
      { label: "A", text: "Construction activity slowed last quarter." },
      { label: "B", text: "Housing prices will continue to fall next quarter." },
      { label: "C", text: "Construction activity will slow." },
      { label: "D", text: "Rising interest rates always harm the economy." },
      { label: "E", text: "Housing prices fell last quarter." },
    ],
    correct: "C",
    explanation: "Interest rates rose, so housing prices will fall, so construction activity will slow. C follows necessarily from the chain of conditionals."
  },
  {
    id: 77, type: "Flaw", difficulty: "Hard",
    stimulus: "Over the past century, as the number of hospitals has increased, life expectancy has also increased. Therefore, building more hospitals is the primary driver of increased life expectancy.",
    question: "The argument is most vulnerable to which criticism?",
    choices: [
      { label: "A", text: "It ignores the role of individual lifestyle choices in determining life expectancy." },
      { label: "B", text: "It assumes that two simultaneous trends must be causally related, without ruling out that both are products of broader improvements in living standards and medical knowledge." },
      { label: "C", text: "It fails to account for differences in life expectancy across different countries." },
      { label: "D", text: "It relies on data from too short a time period." },
      { label: "E", text: "It confuses the number of hospitals with the quality of healthcare provided." },
    ],
    correct: "B",
    explanation: "Both hospital growth and life expectancy could be effects of the same underlying cause — improved living standards — rather than one causing the other."
  },
  {
    id: 78, type: "Evaluate", difficulty: "Medium",
    stimulus: "A fitness app company claims its app causes users to exercise more frequently, based on data showing that app users exercise an average of four days per week.",
    question: "Which of the following would be most useful in evaluating this claim?",
    choices: [
      { label: "A", text: "The average age of the app's users." },
      { label: "B", text: "How frequently the app's users exercised before downloading the app." },
      { label: "C", text: "How many users have downloaded the app." },
      { label: "D", text: "Whether the app offers premium subscription features." },
      { label: "E", text: "What types of exercises the app recommends." },
    ],
    correct: "B",
    explanation: "Without knowing how much users exercised before the app, we cannot know if the app changed their behavior at all."
  },
  {
    id: 79, type: "Parallel Reasoning", difficulty: "Medium",
    stimulus: "Some of the students in the class passed the exam. All students who passed the exam attended every lecture. Therefore, some students who attended every lecture passed the exam.",
    question: "Which of the following has the same logical structure?",
    choices: [
      { label: "A", text: "Some athletes won medals. All medal winners trained daily. Therefore, some athletes who trained daily won medals." },
      { label: "B", text: "All runners finished the race. Some runners trained for six months. Therefore, some who trained for six months finished the race." },
      { label: "C", text: "No students failed the test. All students studied. Therefore, studying causes students to pass." },
      { label: "D", text: "Some doctors are researchers. All researchers publish papers. Therefore, all doctors publish papers." },
      { label: "E", text: "All chefs cook professionally. Some cooks are not chefs. Therefore, some professionals are not chefs." },
    ],
    correct: "A",
    explanation: "Some X are Y; all Y are Z; therefore some Z are X. Only A follows this exact structure."
  },
  {
    id: 80, type: "Main Point", difficulty: "Hard",
    stimulus: "Proponents of universal basic income argue it would reduce poverty and give workers bargaining power. Critics counter it would discourage work and be fiscally unsustainable. Both sides, however, are speculating based on small pilot programs that differ significantly from a true universal policy. Until a large-scale, long-term trial is conducted, neither side can make confident empirical claims.",
    question: "The main point of the passage is that:",
    choices: [
      { label: "A", text: "Universal basic income would reduce poverty if implemented correctly." },
      { label: "B", text: "The fiscal costs of universal basic income make it impractical." },
      { label: "C", text: "The existing evidence base is insufficient to support confident claims about universal basic income's effects." },
      { label: "D", text: "Pilot programs are never useful for evaluating large-scale policies." },
      { label: "E", text: "Universal basic income should be implemented immediately so its effects can be properly studied." },
    ],
    correct: "C",
    explanation: "The passage does not take a side — it argues both sides are overconfident given the limited evidence from small pilots."
  },
  {
    id: 81, type: "Assumption", difficulty: "Hard",
    stimulus: "Self-driving cars will make roads safer because they eliminate human error, which is responsible for over 90% of traffic accidents.",
    question: "Which of the following is an assumption the argument requires?",
    choices: [
      { label: "A", text: "Self-driving cars are already available for purchase by the general public." },
      { label: "B", text: "Self-driving car technology will not introduce new categories of error that cause accidents at rates comparable to human error." },
      { label: "C", text: "Human drivers will voluntarily switch to self-driving cars once they are available." },
      { label: "D", text: "Traffic accidents are the leading cause of preventable death." },
      { label: "E", text: "Insurance companies will lower premiums for self-driving car owners." },
    ],
    correct: "B",
    explanation: "Eliminating human error only makes roads safer if the replacement technology does not create new errors — the argument assumes self-driving systems will not generate comparable accident rates."
  },
  {
    id: 82, type: "Strengthen", difficulty: "Medium",
    stimulus: "A historian argues that the printing press was the most important factor in causing the Protestant Reformation.",
    question: "Which of the following most strengthens this argument?",
    choices: [
      { label: "A", text: "Martin Luther was an educated monk with access to scholarly texts before the printing press became widespread." },
      { label: "B", text: "Previous reform movements failed to gain lasting traction precisely because their ideas could not be rapidly disseminated, whereas Luther's theses spread across Europe within weeks due to print." },
      { label: "C", text: "The printing press was invented approximately 60 years before the Reformation began." },
      { label: "D", text: "The Catholic Church attempted to suppress printed critiques of its practices." },
      { label: "E", text: "The Reformation produced significant political as well as religious changes across Europe." },
    ],
    correct: "B",
    explanation: "B directly contrasts the failure of earlier reform movements without print and Luther's success with print, providing causal evidence that the printing press was the decisive differentiating factor."
  },
  {
    id: 83, type: "Resolve the Paradox", difficulty: "Hard",
    stimulus: "A company implemented a four-day work week, reducing total work hours by 20%. Six months later, productivity per hour increased by 25%, but total output declined.",
    question: "Which of the following best explains both findings simultaneously?",
    choices: [
      { label: "A", text: "Employees were happier with the four-day work week." },
      { label: "B", text: "Employees worked more efficiently during the shorter hours but produced less total work because the efficiency gain did not fully compensate for the lost hours." },
      { label: "C", text: "The company hired additional part-time workers to compensate for the reduced hours." },
      { label: "D", text: "Some employees used their extra day off to pursue freelance work for competitors." },
      { label: "E", text: "Productivity measurements are inherently unreliable over short periods." },
    ],
    correct: "B",
    explanation: "B explains both: efficiency per hour rose but total output fell because fewer hours times higher efficiency still produced less total work than before."
  },
  {
    id: 84, type: "Flaw", difficulty: "Easy",
    stimulus: "You should take dietary advice from Dr. Patel. After all, she has been a practicing physician for 30 years.",
    question: "Which of the following identifies the most significant flaw in this argument?",
    choices: [
      { label: "A", text: "It assumes that years of experience are unrelated to medical expertise." },
      { label: "B", text: "It relies on an appeal to authority without establishing that Dr. Patel has specific expertise in nutrition and dietary advice." },
      { label: "C", text: "It fails to consider whether Dr. Patel's patients have followed her advice successfully." },
      { label: "D", text: "It assumes that all practicing physicians give the same dietary advice." },
      { label: "E", text: "It does not provide evidence that the person seeking advice has a dietary problem." },
    ],
    correct: "B",
    explanation: "Being a physician for 30 years does not make someone an expert in nutrition specifically — the appeal to authority is flawed because it is not established in the relevant domain."
  },
  {
    id: 85, type: "Inference", difficulty: "Hard",
    stimulus: "A country's constitution requires a two-thirds majority in parliament to amend any constitutional provision. The current ruling coalition controls exactly 60% of parliamentary seats. The opposition has stated it will not support any constitutional amendments proposed by the current government.",
    question: "Which of the following can be properly inferred?",
    choices: [
      { label: "A", text: "The current government will be unable to pass any legislation." },
      { label: "B", text: "The constitution will remain unchanged as long as the current opposition maintains its position." },
      { label: "C", text: "The ruling coalition will lose the next election." },
      { label: "D", text: "The opposition controls the remaining 40% of parliamentary seats." },
      { label: "E", text: "Constitutional amendments are impossible in this country." },
    ],
    correct: "B",
    explanation: "The government has 60%, needs 67%, and the opposition will not support amendments — so no amendment can pass while this stance holds."
  },
  {
    id: 86, type: "Weaken", difficulty: "Medium",
    stimulus: "Organic food sales have grown 300% over the past decade while rates of several chronic diseases have continued to rise. Therefore, eating organic food does not protect against chronic disease.",
    question: "Which of the following most weakens this argument?",
    choices: [
      { label: "A", text: "Organic food is generally more expensive than conventionally grown food." },
      { label: "B", text: "Despite growth in organic food sales, organic food still represents a small fraction of total food consumption, and the people eating it may be too few to affect population-level disease rates." },
      { label: "C", text: "Chronic diseases have many causes beyond diet, including genetics and exercise habits." },
      { label: "D", text: "Organic food sales have grown fastest in urban areas." },
      { label: "E", text: "Some studies show that organic produce contains higher levels of certain nutrients." },
    ],
    correct: "B",
    explanation: "If organic food is still a small percentage of total consumption, population-level disease rates would be unaffected even if organic food does protect its consumers."
  },
  {
    id: 87, type: "Method of Reasoning", difficulty: "Hard",
    stimulus: "Economist: My colleague argues we should cut corporate taxes to stimulate investment. But her previous research concluded that tax cuts primarily benefit shareholders rather than workers or the broader economy. She cannot now argue that cutting taxes benefits the broader economy without contradicting her own published work.",
    question: "The economist's argument proceeds by:",
    choices: [
      { label: "A", text: "Providing new data that disproves the colleague's current argument." },
      { label: "B", text: "Showing that the colleague's current position is incompatible with conclusions she herself has previously published." },
      { label: "C", text: "Appealing to a higher authority to resolve the disagreement." },
      { label: "D", text: "Demonstrating that corporate tax cuts have historically failed to stimulate investment." },
      { label: "E", text: "Questioning the methodology used in the colleague's current research." },
    ],
    correct: "B",
    explanation: "The economist uses the colleague's own prior published conclusions to show her current argument contradicts her earlier work."
  },
  {
    id: 88, type: "Must Be True", difficulty: "Hard",
    stimulus: "All delegates who voted for Resolution 12 also voted for Resolution 15. None of the delegates who voted for Resolution 15 abstained from Resolution 18. Some delegates abstained from Resolution 18.",
    question: "Which of the following must be true?",
    choices: [
      { label: "A", text: "Some delegates who voted for Resolution 12 abstained from Resolution 18." },
      { label: "B", text: "Some delegates who abstained from Resolution 18 did not vote for Resolution 12." },
      { label: "C", text: "All delegates who abstained from Resolution 18 voted for Resolution 12." },
      { label: "D", text: "No delegates voted for both Resolution 12 and Resolution 15." },
      { label: "E", text: "Some delegates who voted for Resolution 15 abstained from Resolution 18." },
    ],
    correct: "B",
    explanation: "Voted for R12 means voted for R15 means did not abstain from R18. So anyone who abstained from R18 did not vote for R12. Since some abstained, some who abstained did not vote for R12. B must be true."
  },
  {
    id: 89, type: "Strengthen", difficulty: "Easy",
    stimulus: "Scientists believe an asteroid impact 66 million years ago caused the mass extinction of the dinosaurs.",
    question: "Which of the following most strengthens this hypothesis?",
    choices: [
      { label: "A", text: "Dinosaurs were already in decline before the asteroid impact." },
      { label: "B", text: "A thin layer of iridium — rare on Earth but common in asteroids — has been found worldwide in rock strata dating to exactly 66 million years ago, precisely at the boundary between dinosaur-bearing and dinosaur-free fossils." },
      { label: "C", text: "Several other mass extinction events have occurred throughout Earth's history." },
      { label: "D", text: "Some dinosaur species may have survived the initial impact for thousands of years." },
      { label: "E", text: "The asteroid impact would have been visible from anywhere on Earth." },
    ],
    correct: "B",
    explanation: "The global iridium layer provides direct physical evidence of a worldwide asteroid impact event coinciding precisely with dinosaur extinction."
  },
  {
    id: 90, type: "Flaw", difficulty: "Hard",
    stimulus: "Professor Okafor's research on climate policy should be dismissed. She receives funding from a renewable energy company, which means her conclusions are designed to benefit her funders rather than reflect scientific truth.",
    question: "The argument is most seriously flawed because it:",
    choices: [
      { label: "A", text: "Fails to identify which specific conclusions of Professor Okafor are incorrect." },
      { label: "B", text: "Assumes that funding sources always determine research conclusions, without examining the actual research for errors or bias." },
      { label: "C", text: "Ignores the possibility that renewable energy companies have a legitimate interest in accurate climate research." },
      { label: "D", text: "Overstates the influence that any single researcher has on climate policy." },
      { label: "E", text: "Fails to consider whether other climate researchers have similar funding conflicts." },
    ],
    correct: "B",
    explanation: "This is a genetic fallacy — dismissing research based on its origin rather than its content. Funding creates a potential conflict of interest but does not prove the research is wrong."
  },
  {
    id: 91, type: "Evaluate", difficulty: "Easy",
    stimulus: "A restaurant owner claims that adding a valet parking service caused a 40% increase in dinner reservations over three months.",
    question: "Which of the following would be most useful in evaluating this claim?",
    choices: [
      { label: "A", text: "How much the valet parking service costs per night to operate." },
      { label: "B", text: "Whether other factors — such as a new menu, increased marketing, or seasonal trends — could account for the increase in reservations." },
      { label: "C", text: "How many parking spots are available near the restaurant." },
      { label: "D", text: "Whether customers tip the valet attendants." },
      { label: "E", text: "What percentage of customers arrive by car versus public transit." },
    ],
    correct: "B",
    explanation: "The key question is whether valet parking caused the increase or whether other factors explain it — without ruling out alternative causes, the claim cannot be accepted."
  },
  {
    id: 92, type: "Principle", difficulty: "Hard",
    stimulus: "In competitive sports, a player should be disqualified for unsportsmanlike conduct only if the conduct provided a clear competitive advantage and was intentional.",
    question: "Which of the following situations calls for disqualification under this principle?",
    choices: [
      { label: "A", text: "A tennis player accidentally hits a ball that strikes an opponent, causing distraction." },
      { label: "B", text: "A basketball player intentionally shouts to distract an opponent during a free throw, successfully causing the opponent to miss." },
      { label: "C", text: "A swimmer's goggles accidentally fall off during a race, slowing her down." },
      { label: "D", text: "A soccer player intentionally celebrates a goal exuberantly in a way that the opposing team finds disrespectful, but that provides no competitive advantage." },
      { label: "E", text: "A marathon runner unintentionally elbows a competitor while repositioning, causing no advantage to either runner." },
    ],
    correct: "B",
    explanation: "Only B meets both conditions: the shouting was intentional AND provided a clear competitive advantage by causing the opponent to miss."
  },
  {
    id: 93, type: "Weaken", difficulty: "Medium",
    stimulus: "Studies show that people who own pets have lower blood pressure on average than people who do not own pets. Therefore, owning a pet reduces blood pressure.",
    question: "Which of the following most weakens this conclusion?",
    choices: [
      { label: "A", text: "People with high blood pressure may be advised by doctors not to own pets due to the stress of pet care." },
      { label: "B", text: "Cat owners show similar blood pressure benefits to dog owners." },
      { label: "C", text: "The study measured blood pressure at home, where people are generally more relaxed." },
      { label: "D", text: "Some pet owners report that caring for pets can be stressful." },
      { label: "E", text: "Blood pressure can be reduced through diet and exercise as well as pet ownership." },
    ],
    correct: "A",
    explanation: "If high blood pressure patients are advised against owning pets, the pet-owner group would naturally have lower blood pressure — not because pets reduce blood pressure, but because the high-BP group is excluded."
  },
  {
    id: 94, type: "Assumption", difficulty: "Medium",
    stimulus: "The downtown arts district generates millions in tax revenue and attracts tourists. Defunding the arts district's public programs would therefore damage the city's economy.",
    question: "Which of the following is an assumption the argument requires?",
    choices: [
      { label: "A", text: "The arts district is the most popular tourist destination in the city." },
      { label: "B", text: "The public programs are at least partly responsible for the arts district's economic success, such that removing them would reduce that success." },
      { label: "C", text: "Tax revenue from the arts district exceeds the cost of its public programs." },
      { label: "D", text: "Tourists spend more money in arts districts than in other parts of cities." },
      { label: "E", text: "Other cities with arts districts have also experienced economic benefits." },
    ],
    correct: "B",
    explanation: "The argument assumes the public programs drive the economic activity — if the district would thrive without them, defunding would have no economic impact."
  },
  {
    id: 95, type: "Must Be True", difficulty: "Easy",
    stimulus: "Every student who completed the internship program received academic credit. Some students who received academic credit graduated with honors. All students who graduated with honors were offered jobs before graduation.",
    question: "Which of the following must be true?",
    choices: [
      { label: "A", text: "Every student who completed the internship program graduated with honors." },
      { label: "B", text: "Some students who completed the internship program were offered jobs before graduation." },
      { label: "C", text: "All students who received academic credit were offered jobs before graduation." },
      { label: "D", text: "Some students who received academic credit were offered jobs before graduation." },
      { label: "E", text: "Only students who completed the internship program graduated with honors." },
    ],
    correct: "D",
    explanation: "Some students with academic credit graduated with honors, and those students were offered jobs before graduation. So some students with academic credit were offered jobs. D must be true."
  },
  {
    id: 96, type: "Resolve the Paradox", difficulty: "Easy",
    stimulus: "A city built a new highway bypass intended to reduce traffic in the city center. However, three years later, traffic in the city center is worse than before the bypass was built.",
    question: "Which of the following best explains this paradox?",
    choices: [
      { label: "A", text: "The bypass was more expensive to build than originally estimated." },
      { label: "B", text: "The existence of the bypass made driving more convenient overall, attracting more people to drive into the city, increasing total traffic volume beyond what the bypass could divert." },
      { label: "C", text: "Public transit ridership decreased after the bypass was built." },
      { label: "D", text: "The bypass passes through a previously undeveloped area." },
      { label: "E", text: "Construction of the bypass caused temporary traffic disruptions." },
    ],
    correct: "B",
    explanation: "Induced demand — new road capacity encourages more driving overall, potentially increasing congestion rather than relieving it."
  },
  {
    id: 97, type: "Flaw", difficulty: "Medium",
    stimulus: "We cannot trust the results of this drug trial because one of the researchers who conducted it later went to work for the pharmaceutical company that makes the drug.",
    question: "The argument is most seriously flawed because it:",
    choices: [
      { label: "A", text: "Assumes that all pharmaceutical companies engage in unethical research practices." },
      { label: "B", text: "Uses a subsequent event to imply bias that may not have existed at the time the research was conducted, without examining the research itself for errors." },
      { label: "C", text: "Fails to identify which specific results of the drug trial are questionable." },
      { label: "D", text: "Ignores the peer review process that drug trial results typically undergo." },
      { label: "E", text: "Overgeneralizes from one researcher's career move to all researchers involved in the trial." },
    ],
    correct: "B",
    explanation: "The researcher's later employment does not prove bias existed during the trial — the argument should engage with the research itself rather than dismissing it based on subsequent events."
  },
  {
    id: 98, type: "Main Point", difficulty: "Medium",
    stimulus: "Some urban planners advocate eliminating minimum parking requirements near transit hubs to reduce car use. While reducing car infrastructure near transit makes sense in theory, evidence from cities that have eliminated minimums shows mixed results — developers often build what the market demands anyway, regardless of requirements.",
    question: "The main point of the passage is that:",
    choices: [
      { label: "A", text: "Minimum parking requirements should be maintained in all urban areas." },
      { label: "B", text: "Eliminating parking minimums near transit hubs may not achieve intended reductions in car use because market forces may still produce similar amounts of parking." },
      { label: "C", text: "Urban planners are wrong to focus on transit ridership as a policy goal." },
      { label: "D", text: "Developers always build more parking than minimum requirements demand." },
      { label: "E", text: "Transit ridership is primarily determined by parking availability." },
    ],
    correct: "B",
    explanation: "The passage acknowledges the logic of the policy but argues evidence shows it may not work because market demand for parking persists regardless of requirements."
  },
  {
    id: 99, type: "Strengthen", difficulty: "Hard",
    stimulus: "A public health official argues that mandatory vaccination policies are more effective than voluntary campaigns at achieving herd immunity for highly contagious diseases.",
    question: "Which of the following most strengthens this argument?",
    choices: [
      { label: "A", text: "Herd immunity for measles requires approximately 95% of the population to be vaccinated." },
      { label: "B", text: "In countries that have implemented mandatory vaccination for measles, vaccination rates consistently exceed 95%, while countries relying on voluntary campaigns rarely surpass 85%." },
      { label: "C", text: "Some individuals cannot be vaccinated due to medical conditions and depend on herd immunity for protection." },
      { label: "D", text: "Voluntary vaccination campaigns are less expensive to implement than mandatory programs." },
      { label: "E", text: "Public trust in vaccines has declined in several countries over the past decade." },
    ],
    correct: "B",
    explanation: "B provides direct comparative evidence showing mandatory policies achieve the threshold needed for herd immunity while voluntary campaigns consistently fall short."
  },
  {
    id: 100, type: "Inference", difficulty: "Medium",
    stimulus: "All of the apartments in the Crestview complex were built before 1980. No apartment built before 1980 is compliant with current energy efficiency codes. The landlord recently advertised three units in the complex as fully code-compliant.",
    question: "If the statements above are all true, which of the following must also be true?",
    choices: [
      { label: "A", text: "The landlord is lying about all three units being code-compliant." },
      { label: "B", text: "The three advertised units cannot be both in the Crestview complex and fully code-compliant." },
      { label: "C", text: "The landlord should be fined for false advertising." },
      { label: "D", text: "Energy efficiency codes have become stricter since 1980." },
      { label: "E", text: "The Crestview complex will need to be demolished to meet current codes." },
    ],
    correct: "B",
    explanation: "All Crestview apartments were built before 1980, and no pre-1980 apartment is code-compliant. So the three units cannot be both in Crestview and fully code-compliant. B must be true."
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
  }, [index, timerSeconds]);

  useEffect(() => {
    if (submitted) clearInterval(timerRef.current);
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