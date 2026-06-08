# AGENTS.md

## Project Overview

This project is a static learning website titled:

**Camera Roll to Vlog - 写真フォルダからはじめる動画編集**

The goal is to help Premiere Pro beginners turn photos and videos from their smartphone camera roll into a short vertical Vlog / short video.

This website should feel like a companion that users can keep open while editing, not a generic Premiere Pro manual.

## Core Concept

The main subject of this website is not Premiere Pro itself, but the user's memories in their camera roll.

Premiere Pro should be treated as a tool for turning those memories into a Vlog.

The site should guide beginners through the actual workflow:

1. Decide what kind of Vlog to make
2. Choose photos and videos from the camera roll
3. Import materials into Premiere Pro
4. Arrange them on the timeline
5. Add BGM, text, and color adjustments
6. Export and review the completed Vlog

## Target User

The primary user is a beginner who:

- Takes photos and videos on a smartphone
- Wants to turn memories into a short Vlog
- Is new to Premiere Pro
- May not be very comfortable with PC operations
- Wants text-based guidance they can follow at their own pace
- May use this site on a smartphone while editing on a PC

## Site Structure

The project should use a 3-page structure:

- `index.html`
  Top page introducing the site concept and guiding users to start the lesson.

- `lesson.html`
  Main lesson page. All lessons should be placed on one long page so users do not need to move between pages while editing.

- `faq.html`
  FAQ, troubleshooting, glossary, and checklists.

Do not make each lesson a separate page.

## Lesson Structure

Use the following 6 lessons:

1. 今日つくるVlogを決める
2. 写真フォルダから素材を選ぶ
3. Premiere Proに素材を読み込む
4. タイムラインに並べて流れを作る
5. BGM・文字・色で“いい感じ”に整える
6. 書き出して、完成したVlogを見返す

Each lesson should include:

- Lesson title
- What the user will do
- What the user will be able to do
- Estimated working time
- Step-by-step instructions
- Placeholder area for images or GIFs
- Troubleshooting tips
- Mini checklist

The mini checklist should be a plain visual checklist only.
Do not add completion buttons.

## Progress Display

Do not use completion buttons.
Do not use localStorage for progress saving.

The progress display should update automatically based on the lesson currently visible on screen.

The progress should communicate:

> "You are currently around this stage in the Vlog-making process."

It should not feel like a strict task management system.

Suggested progress mapping:

- Lesson 01: 1 / 6, about 16%
- Lesson 02: 2 / 6, about 33%
- Lesson 03: 3 / 6, about 50%
- Lesson 04: 4 / 6, about 66%
- Lesson 05: 5 / 6, about 83%
- Lesson 06: 6 / 6, 100%

## Sidebar Behavior

The lesson page should include a sidebar with:

- Current step
- Automatic progress
- Course table of contents
- A short guide message
- Troubleshooting links

The guide message should change depending on the current lesson.

The sidebar should support smooth navigation to lesson sections.

## Shortcut Modal

The shortcut list should remain a modal / popup.
Do not move shortcuts to a separate page.

Users should be able to open the shortcut list quickly from both desktop and mobile layouts.

## Pages / Sections to Remove

Remove the following from the project:

- Contact form
- SNS section

This website should prioritize lessons, troubleshooting, checklists, and glossary content.

## Visual Direction

The visual direction should eventually move toward:

- Natural travel-style website
- Camera roll inspired UI
- Video editing timeline inspired UI
- Soft colors such as ivory, beige, sage green, pale blue, and terracotta

However, do not make large design changes unless specifically requested.
When restructuring HTML, use class names and section structures that will be easy to style later.

## Image and GIF Placeholders

Do not insert final image or GIF assets unless they are provided.

Use clear placeholder blocks that explain what will be inserted later.

Example:

> ここに入れる予定：Premiere Proで素材をタイムラインにドラッグする5秒GIF

## Coding Guidelines

This is a static website project using:

- HTML
- CSS
- JavaScript

Do not add frameworks unless explicitly requested.
Do not add build tools unless explicitly requested.
Do not add external dependencies unless explicitly requested.

Keep the code readable for a beginner.

Prefer clear class names.
Avoid overly complex JavaScript.

Maintain accessibility attributes where possible, especially for:

- Navigation
- Modals
- Accordion UI
- Buttons
- Current section indicators

## Responsive Design

The site should work on smartphones.

Assume the user may view the lesson page on a smartphone while editing in Premiere Pro on a PC.

Prioritize:

- Readable text
- Easy access to the table of contents
- Easy access to shortcut modal
- Image and GIF visibility
- Sidebar information that does not get in the way

## Before Making Changes

Before making large changes, briefly explain the plan.

When modifying files, preserve existing useful functionality where possible.

## After Making Changes

After making changes, summarize:

- Which files were changed
- What was changed
- Any parts that still need manual review
- Any assets that still need to be replaced later