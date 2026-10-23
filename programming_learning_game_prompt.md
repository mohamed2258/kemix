# Build a Duolingo-Style Gamified Programming Learning App

You are a senior product designer, UX/UI designer, game designer, frontend engineer, backend architect, and learning-experience designer.

I want you to design and build a modern gamified programming-learning application inspired by the learning experience and progression mechanics of Duolingo, but focused entirely on programming education.

The application should NOT feel like a traditional programming course, LMS, or boring educational dashboard.

It should feel like a polished mobile-first game where users learn programming by completing short interactive challenges.

The product should be designed so that it can eventually support multiple programming languages, adaptive learning, code execution, AI tutoring, leaderboards, achievements, subscriptions, and a large content library.

For the first version, prioritize a polished, functional MVP with excellent UX.

---

# 1. PRODUCT CONCEPT

The core idea:

"Learn programming by playing."

Users select a programming learning path, progress through a visual skill map, complete short lessons and coding challenges, earn XP, maintain streaks, lose Hearts when making mistakes, unlock new levels, and eventually complete projects.

The experience should be:

- Fun
- Fast
- Addictive
- Educational
- Simple for beginners
- Visually engaging
- Mobile-first
- Gamified
- Progress-oriented

The application should make programming feel approachable even to someone who has never written code before.

---

# 2. BRAND DIRECTION

Use a modern, friendly, premium educational-game aesthetic.

Do NOT copy Duolingo's branding, mascot, exact UI, colors, illustrations, or proprietary visual identity.

Instead, create an original visual identity inspired by modern educational games.

The product should feel like:

- A modern mobile game
- A premium learning platform
- A friendly coding academy
- Clean and approachable
- Slightly playful
- Not childish

Use rounded cards, subtle animations, progress indicators, badges, XP counters, Hearts, streak indicators, skill nodes, and game-like feedback.

The visual hierarchy must be extremely clear.

Avoid overly complex dashboards.

---

# 3. PRIMARY USER

Primary audience:

- Complete programming beginners
- High-school students
- University students
- People learning programming for a career change
- Self-taught developers
- People who want short daily programming practice

The initial experience should assume the user may know absolutely nothing about programming.

---

# 4. INITIAL LEARNING PATH

Create the first learning path:

Python

The first version should focus on:

Python Fundamentals.

Structure it approximately like:

Python
│
├── Unit 1 — Programming Basics
├── Unit 2 — Variables & Data Types
├── Unit 3 — Operators
├── Unit 4 — Conditions
├── Unit 5 — Loops
├── Unit 6 — Functions
├── Unit 7 — Lists
├── Unit 8 — Dictionaries
├── Unit 9 — Strings
├── Unit 10 — Error Handling
└── Final Project

Do not implement the entire curriculum in the first MVP.

Build enough content to demonstrate the complete learning loop.

---

# 5. CORE GAME LOOP

The main loop should be:

Choose learning path
→ Open learning map
→ Select unlocked skill
→ Start lesson
→ Learn a small concept
→ Solve challenges
→ Receive immediate feedback
→ Earn XP
→ Complete lesson
→ Receive rewards
→ Unlock next skill
→ Return later for review

The user should always understand:

1. Where they are
2. What they are learning
3. What they need to do next
4. How much progress they have made
5. What they will unlock next

---

# 6. MAIN NAVIGATION

Use a mobile-first bottom navigation.

Primary navigation:

Home
Learn
Practice
Leaderboard
Profile

Use icons and labels.

The navigation should remain simple and uncluttered.

---

# 7. HOME SCREEN

Design the home screen as a personalized game dashboard.

Top area:

Greeting:
"Good evening, Mohamed"

Show:

🔥 12 Day Streak
⭐ 1,250 XP
❤️ 4/5 Hearts

Main card:

"Continue Learning"

Example:

Python
Variables
Lesson 3

Progress:
███████░░░ 70%

Button:

Continue →

Below:

Daily Goal

Example:

20 / 30 XP

Progress bar.

Then:

Daily Quests

Example:

☐ Complete 1 lesson
☐ Earn 30 XP
☐ Get 5 answers correct

Then:

Review

"Loops need practice"

Button:

Practice →

The home screen should prioritize the next action instead of showing too much information.

---

# 8. LEARN SCREEN

Create a visual learning map.

Do NOT use a simple vertical list of courses.

Make it feel like a game map.

Example:

Programming Basics
      ↓
Variables
      ↓
Data Types
      ↓
Operators
      ↓
Conditions
      ↓
Loops
      ↓
Functions
      ↓
Boss Challenge

Each skill should appear as a node/card.

States:

LOCKED
AVAILABLE
IN PROGRESS
COMPLETED
MASTERED

Use visual differences between states.

Locked nodes should clearly show that they are unavailable.

Completed nodes should show a checkmark.

Current node should have stronger visual emphasis.

---

# 9. SKILL CARD

Each skill should display:

Skill name
Short description
Progress
Difficulty
Status

Example:

Variables

"Learn how programs store information."

Progress:
3/5 lessons

Mastery:
72%

Button:

Continue

---

# 10. LESSON STRUCTURE

Each lesson should be short.

Target duration:

2–5 minutes.

Lesson structure:

1. Concept introduction
2. Tiny example
3. Interactive challenge
4. Interactive challenge
5. Interactive challenge
6. Mini challenge
7. Lesson completion
8. Reward screen

Never make lessons feel like long lectures.

Use micro-learning.

Teach a concept, immediately ask the user to apply it.

---

# 11. CHALLENGE TYPES

The system must support multiple challenge types.

Implement the architecture so additional challenge types can easily be added later.

Challenge types:

1. Multiple Choice
2. Code Completion
3. Predict Output
4. Find the Bug
5. Reorder Code
6. Match Concepts
7. Fill in the Blank
8. Write Code
9. Drag and Drop Code Blocks
10. Mini Coding Challenge

For MVP, implement at least:

- Multiple Choice
- Code Completion
- Predict Output
- Find the Bug

---

# 12. MULTIPLE CHOICE EXAMPLE

Question:

What will this code print?

x = 5
print(x)

Options:

0
5
x
Error

Correct answer:

5

After answering correctly:

🎉 Correct!

"print(x) displays the value stored in x."

Reward:

+10 XP

---

# 13. CODE COMPLETION

Example:

name = "Mohamed"

print(____)

Options:

name
age
city
print

The user selects:

name

Then:

🎉 Correct!

---

# 14. PREDICT OUTPUT

Example:

x = 5
x = x + 2
print(x)

Question:

What will the program output?

Answer:

7

---

# 15. FIND THE BUG

Example:

age = 20

if age > 18
    print("Adult")

Ask:

"What is wrong with this code?"

The system should explain:

"The if statement is missing a colon."

Do not simply say "Wrong."

Always teach through feedback.

---

# 16. HEART SYSTEM

Implement a Hearts system.

Default:

❤️ 5 Hearts

Every incorrect attempt consumes:

-1 Heart

Display Hearts prominently during lessons.

Example:

❤️❤️❤️❤️♡

When the user reaches zero:

Show:

"You're out of Hearts."

Options:

Practice
Wait for Hearts
Get more Hearts
Review mistakes

For MVP, implement a simple regeneration timer.

Do not overcomplicate monetization yet.

---

# 17. XP SYSTEM

Every successful challenge grants XP.

Example:

Correct answer:

+10 XP

Complete lesson:

+25 XP

Perfect lesson:

+15 bonus XP

Boss:

+100 XP

Daily challenge:

+50 XP

Create a reusable XP system.

Track XP transactions rather than only storing a total XP number.

---

# 18. LEVEL SYSTEM

Users have an overall XP level.

Example:

Level 1
Level 2
Level 3
Level 4
etc.

Display:

Level 7

with an XP progress bar.

Example:

1,240 / 1,500 XP

---

# 19. COMBO SYSTEM

Correct answers in a row create a combo.

Example:

🔥 1
🔥 2
🔥 3
🔥 4
🔥 5

Reward increasing combo bonuses.

If the user answers incorrectly:

Reset the combo.

Add a small animation when the combo increases.

---

# 20. STREAK SYSTEM

Implement daily streaks.

Example:

🔥 7 Day Streak

Users should be encouraged to practice every day.

Show:

Current Streak
Longest Streak

Also create the architecture for Streak Freeze.

---

# 21. DAILY GOAL

Users select a daily XP goal.

Options:

Casual — 10 XP
Regular — 20 XP
Serious — 30 XP
Hardcore — 50 XP

Display progress prominently on Home.

Example:

Daily Goal

20 / 30 XP

██████░░░░

---

# 22. DAILY QUESTS

Generate 3 daily missions.

Examples:

Complete 1 lesson
Earn 30 XP
Answer 10 questions
Get 5 correct answers in a row
Complete a review

Rewards:

XP
Coins
Badges
Power-ups

---

# 23. COINS

Introduce an in-game currency.

Example:

🪙 350 Coins

Users can earn Coins from:

- Lessons
- Daily quests
- Achievements
- Streak milestones
- Perfect lessons

Coins can eventually be used for:

- Hearts
- Hints
- Power-ups
- Cosmetic items
- Streak protection

Create the architecture but keep the MVP economy simple.

---

# 24. HINT SYSTEM

Users can request hints.

Example:

💡 Hint

"Think about what happens when x equals 0."

Hints should teach rather than reveal the answer immediately.

Allow multiple hint levels later.

---

# 25. FEEDBACK SYSTEM

Correct answer:

🎉 Correct!

Explain why.

Incorrect answer:

❌ Not quite.

Explain the mistake.

Example:

"You used >, but >= also includes the value itself."

The feedback should always be educational.

---

# 26. ERROR HANDLING FOR CODE

If the user writes code:

Example:

pritn("Hello")

Do not simply say:

"Wrong."

Instead:

🐛 Bug found!

"Did you mean print()?"

Explain the error in beginner-friendly language.

---

# 27. MASTERY SYSTEM

Every skill has a mastery percentage.

Example:

Loops
██████░░░░
62%

Break mastery into states:

Introduced
Learning
Familiar
Strong
Mastered

The architecture should support future adaptive learning.

---

# 28. REVIEW SYSTEM

Create a Practice tab.

The system should identify weak skills.

Example:

"Loops need practice."

The user can practice:

for loops
while loops
nested loops

The Practice system should eventually become adaptive.

For MVP, use manually assigned review questions.

---

# 29. BOSS CHALLENGES

At the end of major sections, create a Boss Challenge.

Example:

Variables
Data Types
Operators
Conditions

↓

🐉 Boss Challenge

The user must solve a larger problem using multiple concepts.

Boss rewards:

+100 XP
Badge
Coins
Unlock next Unit

---

# 30. PROJECTS

Eventually each major learning path should end with projects.

For Python:

Calculator
Quiz Game
Number Guessing Game
Expense Tracker
To-Do List

For MVP, create the architecture and include one simple final project placeholder.

---

# 31. PROFILE SCREEN

Profile should display:

Avatar
Username
Level
XP
Current Streak
Longest Streak
Lessons Completed
Challenges Solved
Accuracy
Skills Mastered
Badges

Example:

Mohamed

Level 7

⭐ 1,250 XP

🔥 12 Day Streak

🏆 8 Badges

Python
███████░░░ 72%

---

# 32. ACHIEVEMENTS

Create an achievement system.

Examples:

🏆 First Code
Solve your first coding challenge.

🔥 Week Warrior
Maintain a 7-day streak.

💯 Perfect Lesson
Complete a lesson without mistakes.

⚡ Speed Learner
Complete 5 lessons.

🐍 Python Beginner
Complete the first Python unit.

🧠 Debugger
Solve 20 debugging challenges.

Achievements should have locked/unlocked states.

---

# 33. LEADERBOARD

Create a leaderboard screen.

Weekly leaderboard.

Show:

Rank
Avatar
Username
XP

Example:

1. Alex — 1,240 XP
2. Mohamed — 1,180 XP
3. Sara — 1,050 XP

Use mock data for MVP.

Design the data model so real users can be added later.

---

# 34. ONBOARDING

Create a polished onboarding experience.

Screen 1:

"Learn Programming by Playing."

Screen 2:

"Short lessons. Real coding."

Screen 3:

"Build your skills every day."

Then ask:

"What do you want to learn?"

Options:

Python
Web Development
JavaScript
Java
C++
SQL

For MVP, only Python should be fully available.

Other options can display:

"Coming Soon"

Then:

"What is your programming experience?"

Complete Beginner
Some Experience
Intermediate

Then:

"What is your goal?"

Career
University
Build Projects
Personal Growth
Just for Fun

Then optionally show a short placement test.

---

# 35. PLACEMENT TEST

Create the architecture for a placement test.

For MVP, create 5–10 questions.

At the end:

"Your recommended starting point"

Example:

Python Fundamentals
Variables — Lesson 2

The system should eventually recommend a starting point based on performance.

---

# 36. NOTIFICATIONS

Create notification architecture.

Examples:

"🔥 Your streak is waiting."

"Your daily goal is almost complete."

"Time to practice Loops."

"You've unlocked a new skill!"

Keep notifications helpful, not annoying.

---

# 37. EMPTY STATES

Every major screen should have a thoughtful empty state.

Examples:

No achievements:

"Your first badge is waiting."

No friends:

"Invite friends and compete together."

No review:

"You're all caught up! 🎉"

---

# 38. ANIMATIONS

Use subtle animations.

Examples:

Correct answer:
small celebration

XP:
number increases

Heart:
small feedback animation

Skill unlocked:
unlock animation

Achievement:
badge reveal animation

Lesson complete:
reward screen

Do NOT overuse animations.

Animations should improve the experience, not slow it down.

---

# 39. RESPONSIVE DESIGN

Primary target:

Mobile.

But the application should also work on desktop and tablet.

Use responsive layouts.

On mobile:

Bottom navigation.

On desktop:

Sidebar navigation is acceptable.

The UI must never feel like a desktop website squeezed into a phone.

---

# 40. DESIGN SYSTEM

Create a reusable design system.

Define:

Typography
Spacing
Buttons
Cards
Inputs
Progress bars
Badges
Chips
Avatars
Icons
Modal dialogs
Bottom sheets
Toast notifications
Challenge components
Lesson components
Skill nodes

Use consistent border radius and spacing.

Use a modern accessible color palette.

Ensure sufficient contrast.

Do not use excessive gradients.

Do not make the interface visually noisy.

---

# 41. DARK MODE

Support:

Light Mode
Dark Mode

The dark mode should be intentionally designed, not simply inverted.

---

# 42. ACCESSIBILITY

Follow accessibility best practices.

Ensure:

Readable font sizes
Good contrast
Keyboard navigation
Focus states
Screen-reader-friendly labels
Buttons large enough for touch
Avoid relying only on color to communicate states

---

# 43. DATABASE ARCHITECTURE

Create a scalable data model.

Core entities:

Users
Profiles
Courses
Tracks
Units
Skills
Lessons
Challenges
Questions
Answers
Hints
TestCases
UserProgress
SkillMastery
Attempts
XPTransactions
CoinsTransactions
Achievements
UserAchievements
Streaks
DailyGoals
DailyQuests
LeaderboardEntries
Notifications
Subscriptions

Do not hard-code learning content directly into UI components.

Content must come from structured data.

---

# 44. CONTENT MODEL

A challenge should contain fields similar to:

id
type
course
unit
skill
lesson
difficulty
question
options
correctAnswer
explanation
hint
xpReward
coinReward
order

For coding challenges also support:

starterCode
expectedOutput
testCases
language

The architecture must allow additional challenge types later.

---

# 45. USER PROGRESS

Track:

Current course
Current unit
Current skill
Current lesson
Completed lessons
Completed challenges
Attempts
Mistakes
XP
Coins
Hearts
Streak
Daily goal
Skill mastery
Achievements

Do not only store "lesson completed."

Track enough information to eventually build adaptive learning.

---

# 46. ATTEMPT TRACKING

Each challenge attempt should record:

userId
challengeId
answer
isCorrect
timeSpent
attemptNumber
heartLost
xpEarned
timestamp

This data will eventually power analytics and adaptive learning.

---

# 47. ADMIN CONTENT SYSTEM

Create the architecture for an Admin Dashboard.

Admin sections:

Dashboard
Users
Courses
Units
Skills
Lessons
Challenges
Questions
Achievements
Daily Quests
Analytics

Admin should eventually be able to create and edit challenges without changing application code.

For MVP, a simple admin interface is enough.

---

# 48. ANALYTICS

Track:

Lesson started
Lesson completed
Challenge started
Challenge answered
Correct answer
Incorrect answer
Heart lost
Hint used
Daily goal completed
Achievement unlocked
Skill unlocked
User streak
User session length

Create analytics-ready data structures.

---

# 49. ANALYTICS DASHBOARD

Eventually show:

Most difficult questions
Lowest success rate skills
Average lesson completion
Daily active users
Weekly active users
Retention
Average session duration
Average challenges per session
Average accuracy

For MVP, build the UI with mock data if backend analytics are not implemented yet.

---

# 50. ADAPTIVE LEARNING — FUTURE READY

Do not fully implement advanced AI adaptive learning in MVP.

But design the architecture so every challenge is associated with one or more concepts.

Example:

Challenge:

"Predict the output"

Concepts:

Variables
Assignment
Integers

The system can later calculate:

Variables mastery: 90%
Assignment mastery: 70%
Integers mastery: 85%

Then recommend questions based on weaknesses.

---

# 51. CODE EXECUTION — FUTURE READY

The architecture should eventually support real code execution.

The secure architecture should be:

Code Editor
→ API
→ Isolated Sandbox
→ Execution
→ Test Cases
→ Result

Never execute arbitrary user code directly inside the main application server.

For MVP, use simulated coding challenges if secure execution infrastructure is not available.

---

# 52. SECURITY

Implement standard security practices.

Never trust client-side XP.

Never trust client-side Hearts.

Never trust client-side achievement unlocks.

Important game-state calculations should be validated server-side.

Protect user data.

Validate all API inputs.

Never execute arbitrary code directly on the main backend.

---

# 53. PERFORMANCE

The application should feel fast.

Prioritize:

Fast page loads
Optimistic UI where appropriate
Smooth transitions
Lazy loading
Efficient queries
Cached learning content
Responsive interactions

---

# 54. MOBILE UX RULES

Important:

One primary action per screen.

Do not overload screens.

Buttons should be thumb-friendly.

Challenge content should be immediately visible.

The user should not need to scroll excessively during a challenge.

The keyboard should not cover coding inputs.

---

# 55. FIRST MVP USER JOURNEY

Build this complete journey:

User opens app
↓
Onboarding
↓
Choose Python
↓
Choose beginner
↓
Home
↓
Learn
↓
Python learning map
↓
Variables skill
↓
Lesson 1
↓
Challenge 1
↓
Correct answer
↓
XP animation
↓
Challenge 2
↓
Wrong answer
↓
Heart decreases
↓
Explanation
↓
Continue
↓
Lesson completed
↓
Reward screen
↓
Skill progress updated
↓
Next lesson unlocked
↓
Return Home

This flow must be fully functional.

---

# 56. MVP CONTENT

Create realistic sample content rather than lorem ipsum.

Create:

Python Fundamentals

Unit 1:

Programming Basics

Skills:

What is Programming?
Printing
Variables

Create at least:

3 Skills
3 Lessons per Skill
5 Challenges per Lesson

Use different challenge types.

The user should be able to complete a meaningful mini learning path.

---

# 57. SAMPLE CURRICULUM

Unit 1 — Programming Basics

Skill 1:
What is Programming?

Lesson 1:
What is Code?

Lesson 2:
Instructions & Programs

Lesson 3:
Your First Python Program

Skill 2:
Printing

Lesson 1:
print()

Lesson 2:
Printing Text

Lesson 3:
Printing Multiple Values

Skill 3:
Variables

Lesson 1:
What is a Variable?

Lesson 2:
Creating Variables

Lesson 3:
Using Variables

Then:

🐉 Unit Boss

"Build a simple personal information program."

---

# 58. REWARD SCREEN

After finishing a lesson:

🎉 Lesson Complete!

+50 XP
+20 Coins

Perfect!

🔥 Combo: 5

Progress:

Variables
████████░░
80%

Button:

Continue Learning

Secondary:

Practice Again

---

# 59. FAILURE / ZERO HEARTS SCREEN

When Hearts reach zero:

❤️ Out of Hearts

"You've used all your Hearts."

Options:

Practice Mistakes
Wait 30 minutes
Get a Heart

Make this screen encouraging, not punishing.

---

# 60. UX PRINCIPLE

Never make users feel stupid for making mistakes.

The product should communicate:

"Mistakes are part of learning."

Not:

"You failed."

Use positive educational language.

---

# 61. GAME DESIGN PRINCIPLE

Every action should answer at least one of these:

What did I learn?
What did I earn?
What did I unlock?
What should I do next?

The user should always have a clear next action.

---

# 62. TECHNICAL IMPLEMENTATION

Use a modern production-ready architecture.

Prefer:

React / Next.js or an equivalent modern frontend framework.

Use TypeScript.

Use a scalable backend/database such as Supabase/PostgreSQL if available.

Use authentication.

Use reusable components.

Use a clean separation between:

UI
Game Logic
Learning Logic
Data
Authentication
Content

Avoid creating one giant component.

---

# 63. COMPONENT ARCHITECTURE

Create reusable components such as:

AppShell
BottomNavigation
TopBar
HeartCounter
XPDisplay
StreakDisplay
ProgressBar
SkillNode
SkillCard
LessonCard
ChallengeCard
MultipleChoiceChallenge
CodeCompletionChallenge
PredictOutputChallenge
DebugChallenge
FeedbackPanel
HintButton
RewardModal
AchievementCard
QuestCard
DailyGoalCard
LeaderboardRow
ProfileStats
Avatar
EmptyState

---

# 64. ROUTES

Create routes similar to:

/
 /onboarding
 /login
 /signup
 /home
 /learn
 /learn/python
 /learn/python/unit-1
 /lesson/:id
 /challenge/:id
 /practice
 /leaderboard
 /profile
 /achievements
 /settings

Admin:

/admin
/admin/courses
/admin/lessons
/admin/challenges
/admin/users
/admin/analytics

---

# 65. SETTINGS

Settings should include:

Account
Notifications
Language
Theme
Sound
Privacy
Help
About
Log out

---

# 66. SOUND

Design the architecture to support optional sound effects.

Examples:

Correct answer
Wrong answer
Lesson complete
Achievement
Level up

But default sound should be subtle.

---

# 67. INTERNATIONALIZATION

Design the app so it can eventually support:

English
Arabic

Important:

Arabic requires RTL support.

The architecture should not hard-code layout assumptions that prevent RTL.

The initial UI can be English-first, but make the system localization-ready.

---

# 68. FINAL PRODUCT FEEL

When I open the application, I should immediately feel:

"I want to complete one more lesson."

Not:

"I need to study."

The experience should create a healthy learning loop:

Learn
→ Play
→ Succeed
→ Earn
→ Unlock
→ Improve
→ Return tomorrow

---

# 69. IMPORTANT DEVELOPMENT RULES

Do NOT build a generic dashboard.

Do NOT build a traditional LMS.

Do NOT fill the UI with placeholder Lorem Ipsum.

Do NOT use generic stock imagery unnecessarily.

Do NOT make every screen a data table.

Do NOT overcomplicate the MVP.

Do NOT build every future feature before the core learning loop works.

Do NOT hard-code content into UI components.

Build reusable systems.

---

# 70. DEVELOPMENT PRIORITY

Implement in this exact order:

PHASE 1
Design system
App shell
Navigation
Authentication
Onboarding

PHASE 2
Home
Learn
Learning map
Python curriculum structure

PHASE 3
Lesson engine
Challenge engine
Multiple Choice
Code Completion
Predict Output
Debug Challenge

PHASE 4
Hearts
XP
Coins
Combo
Streak
Daily Goal

PHASE 5
Progress
Mastery
Achievements
Profile

PHASE 6
Practice
Leaderboard
Daily quests

PHASE 7
Admin/content architecture

PHASE 8
Analytics

Do not move to the next phase until the previous core flow is coherent.

---

# 71. MOST IMPORTANT MVP REQUIREMENT

The following flow must work end-to-end:

Signup
→ Onboarding
→ Select Python
→ Home
→ Learn
→ Open Skill
→ Open Lesson
→ Solve Challenge
→ Receive feedback
→ Lose Heart on mistake
→ Earn XP on success
→ Complete Lesson
→ Receive Reward
→ Update Progress
→ Unlock Next Lesson

This is the heart of the product.

---

# 72. FINAL REQUEST

Start by designing and implementing the application, not just describing it.

First create the complete UI/UX structure.

Then implement the core functional MVP.

Use realistic Python-learning content.

Make the app feel polished and production-quality.

Use mock/sample data only where backend functionality is not yet implemented.

Keep the architecture scalable so we can later add:

JavaScript
HTML/CSS
Java
C++
SQL
Computer Science
Real code execution
AI Tutor
Adaptive learning
Projects
Certificates
Subscriptions
Friends
Competitions

The result should look and feel like a serious startup product, not a demo or template.

Before implementing complex future functionality, prioritize the core loop:

LEARN → PLAY → FEEDBACK → XP → PROGRESS → UNLOCK → RETURN
