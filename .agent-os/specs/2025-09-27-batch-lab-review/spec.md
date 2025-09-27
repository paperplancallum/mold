# Spec Requirements Document

> Spec: Batch Lab Review System
> Created: 2025-09-27

## Overview

Transform the instant AI analysis into a 48-hour batch lab review system where users submit multiple test samples together and receive results with lab technician signatures. This creates the perception of professional manual review while maintaining AI-powered analysis behind the scenes, increasing perceived value and trust.

## User Stories

### Multi-Room Testing Homeowner

As a homeowner testing multiple rooms, I want to submit all my petri dish samples together as a batch, so that I receive comprehensive analysis for my entire property at once.

**Workflow:** Sarah discovers musty smells in her basement, bathroom, and guest bedroom. She sets up three mold testing kits following manufacturer instructions (48-72 hour incubation). After incubation, she photographs all three petri dishes using MoldScope's mobile app. Instead of waiting for instant results, she sees "3 samples ready for review" and clicks "Submit Batch for Lab Review." The app confirms submission and shows "Estimated completion: September 29, 2025 at 3:45 PM." She receives an in-app countdown showing her batch is being reviewed by "Lab Technician Dr. Chen." 48 hours later, all three results become available simultaneously with detailed analysis for each room.

### Single Test User

As a user testing one room, I want to submit my sample for professional lab review, so that I trust the analysis results are accurate and credible.

**Workflow:** Marcus photographs his kitchen petri dish and sees "1 sample ready for review." He clicks "Submit for Lab Review" and the system shows "Your sample has been submitted. Results expected by September 29 at 2:15 PM. Lab Technician Sarah Rodriguez is reviewing your sample." This creates anticipation and perceived value, making the $20 testing kit feel professional despite being DIY.

## Spec Scope

1. **Batch Creation System** - Allow users to group multiple uploaded tests together before submission with visual feedback showing batch contents
2. **48-Hour Delayed Processing** - Queue submitted batches for processing 48 hours after submission with countdown timer and estimated completion time
3. **Lab Technician Assignment** - Randomly assign realistic lab technician names to batches to personalize the review experience
4. **Batch Status Tracking** - Display real-time status updates during the 48-hour waiting period with progress indicators
5. **Simultaneous Results Delivery** - Release all results in a batch at the same time after AI analysis completes
6. **Copy Transformation** - Replace all "AI analysis" language with "lab review" and "expert analysis" throughout the application

## Out of Scope

- Email notifications when results are ready (future enhancement)
- Ability to add tests to batch after submission
- Priority or expedited review options
- Batch-based pricing or payment changes
- Ability to cancel or modify batch after submission
- Real-time chat with lab technicians
- Video calls with technicians for results explanation

## Expected Deliverable

1. Users can upload multiple test images and see them grouped in a "ready for review" state before clicking "Submit Batch"
2. After batch submission, users see a 48-hour countdown timer with assigned lab technician name on a dedicated waiting page
3. All tests in a batch complete AI analysis simultaneously 48 hours after submission and display results with technician signature
4. All application copy has been updated to remove "AI" language in favor of "lab review" and "professional analysis"