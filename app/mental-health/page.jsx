'use client'

import { useState, useRef, useEffect } from 'react'
import { Container, Row, Col, Card, Button, ProgressBar, Form, Badge } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Brain,
    Heart,
    Smile,
    Sun,
    ClipboardList,
    Headphones,
    BookOpen,
    Phone,
    Play,
    Pause,
    RotateCcw,
    CheckCircle2,
    Frown,
    Meh,
    AlertCircle,
    Plus,
    Minus,
    Lock,
    BarChart2,
    List as ListIcon,
    Activity
} from 'lucide-react'
import { useUser } from '@stackframe/stack'
import { useRouter } from 'next/navigation'
import { saveAssessmentResult, saveMoodEntry, getMoodHistory } from '../actions/mental-health'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const soothingStyles = {
    gradientText: {
        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    glassCard: {
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
    },
    activeTab: {
        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
        color: 'white',
        border: 'none'
    },
    inactiveTab: {
        background: 'white',
        color: '#64748b',
        border: '1px solid #e2e8f0'
    }
}

// --- Components ---

const lsasSituations = [
    "Using a telephone in public",
    "Participating in a small group activity",
    "Eating in public",
    "Drinking with others",
    "Talking to someone in authority",
    "Acting, performing, or speaking in front of an audience",
    "Going to a party",
    "Working while being observed",
    "Writing while being observed",
    "Calling someone you don't know very well",
    "Talking face to face with someone you don't know very well",
    "Meeting strangers",
    "Urinating in a public bathroom",
    "Entering a room when others are already seated",
    "Being the center of attention",
    "Speaking up at a meeting",
    "Taking a test of your ability, skill, or knowledge",
    "Expressing disagreement or disapproval to someone you don't know very well",
    "Looking someone who you don't know very well straight in the eyes",
    "Giving a prepared oral talk to a group",
    "Trying to make someone's acquaintance for the purpose of a romantic/sexual relationship",
    "Returning goods to a store for a refund",
    "Giving a party",
    "Resisting a high pressure sales person"
]

const generateLsasQuestions = () => {
    return lsasSituations.flatMap(sit => [
        { prompt: `Fear: ${sit}`, options: ["None", "Mild", "Moderate", "Severe"] },
        { prompt: `Avoidance: ${sit}`, options: ["Never", "Occasionally", "Often", "Usually"] }
    ])
}

const AssessmentTool = () => {
    const user = useUser()
    const router = useRouter()
    const [selectedAssessment, setSelectedAssessment] = useState(null)
    const [step, setStep] = useState(0)
    const [score, setScore] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [started, setStarted] = useState(false)

    const assessments = [
        {
            id: 'phq9',
            name: 'PHQ-9',
            fullName: 'Patient Health Questionnaire-9',
            category: 'Depression',
            description: 'Screening for depression severity.',
            questions: [
                "Little interest or pleasure in doing things?",
                "Feeling down, depressed, or hopeless?",
                "Trouble falling or staying asleep, or sleeping too much?",
                "Feeling tired or having little energy?",
                "Poor appetite or overeating?",
                "Feeling bad about yourself - or that you are a failure or have let yourself or your family down?",
                "Trouble concentrating on things, such as reading the newspaper or watching television?",
                "Moving or speaking so slowly that other people could have noticed?",
                "Thoughts that you would be better off dead or of hurting yourself in some way?"
            ],
            getResult: (score) => {
                if (score <= 4) return { text: "Minimal Depression", color: "success", advice: "You seem to be doing well. Keep maintaining your mental hygiene." }
                if (score <= 9) return { text: "Mild Depression", color: "warning", advice: "Consider monitoring your mood and practicing self-care." }
                if (score <= 14) return { text: "Moderate Depression", color: "orange", advice: "It might be helpful to talk to a professional counselor." }
                if (score <= 19) return { text: "Moderately Severe Depression", color: "danger", advice: "Please seek professional help." }
                return { text: "Severe Depression", color: "danger", advice: "Please seek professional help immediately." }
            }
        },
        {
            id: 'gad7',
            name: 'GAD-7',
            fullName: 'Generalized Anxiety Disorder-7',
            category: 'Anxiety',
            description: 'Screening for anxiety problems.',
            questions: [
                "Feeling nervous, anxious, or on edge?",
                "Not being able to stop or control worrying?",
                "Worrying too much about different things?",
                "Trouble relaxing?",
                "Being so restless that it is hard to sit still?",
                "Becoming easily annoyed or irritable?",
                "Feeling afraid as if something awful might happen?"
            ],
            getResult: (score) => {
                if (score <= 4) return { text: "Minimal Anxiety", color: "success", advice: "Anxiety levels are low." }
                if (score <= 9) return { text: "Mild Anxiety", color: "warning", advice: "Monitor your anxiety levels." }
                if (score <= 14) return { text: "Moderate Anxiety", color: "orange", advice: "Consider professional consultation." }
                return { text: "Severe Anxiety", color: "danger", advice: "Please seek professional help." }
            }
        },
        {
            id: 'srq20',
            name: 'SRQ-20',
            fullName: 'Self-Reporting Questionnaire-20',
            category: 'General',
            description: 'Screening for common mental disorders.',
            questions: [
                "Do you often have headaches?",
                "Is your appetite poor?",
                "Do you sleep badly?",
                "Are you easily frightened?",
                "Do you feel nervous, tense or worried?",
                "Do your hands shake?",
                "Is your digestion poor?",
                "Do you have trouble thinking clearly?",
                "Do you feel unhappy?",
                "Do you cry more than usual?",
                "Do you find it difficult to enjoy your daily activities?",
                "Do you find it difficult to make decisions?",
                "Is your daily work suffering?",
                "Are you unable to play a useful part in your life?",
                "Have you lost interest in things?",
                "Do you feel that you are a worthless person?",
                "Has the thought of ending your life been on your mind?",
                "Do you feel tired all the time?",
                "Do you have uncomfortable feelings in your stomach?",
                "Are you easily tired?"
            ],
            getResult: (score) => {
                // SRQ-20 is typically binary (Yes=1, No=0). 
                // Assuming the standard 0-3 scale is used here for consistency, we might need to adjust or interpret.
                // But for simplicity in this UI, if we use the same 0-3 buttons, the score will be higher.
                // Let's assume we treat any positive answer as a symptom. 
                // Ideally, SRQ-20 uses Yes/No. We should probably stick to the existing UI buttons (0-3) for now 
                // or interpret >0 as Yes. 
                // A cut-off of 7/8 is common for "caseness".
                // If using 0-3 scale: 0=No, 1-3=Yes-ish.
                // Let's just provide a general interpretation based on total score relative to max (60).
                if (score <= 10) return { text: "Low Distress", color: "success", advice: "Your reported symptoms are minimal." }
                if (score <= 25) return { text: "Moderate Distress", color: "warning", advice: "You are experiencing some symptoms of distress." }
                return { text: "High Distress", color: "danger", advice: "Please consult a mental health professional." }
            }
        },
        {
            id: 'asrs',
            name: 'ASRS v1.1',
            fullName: 'Adult ADHD Self-Report Scale',
            category: 'ADHD',
            description: 'Screening for ADHD in adults.',
            questions: [
                "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
                "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
                "How often do you have problems remembering appointments or obligations?",
                "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
                "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
                "How often do you feel overly active and compelled to do things, like you were driven by a motor?"
            ],
            getResult: (score) => {
                // Part A Screener. 
                // 0-3 scale maps roughly to Never, Rarely, Sometimes, Often, Very Often if we had 5 buttons.
                // With 4 buttons (0-3): 0=Never, 1=Several, 2=More than half, 3=Nearly every day.
                // High score indicates likelihood.
                if (score < 9) return { text: "Unlikely ADHD", color: "success", advice: "Symptoms are not consistent with ADHD." }
                return { text: "Likely ADHD", color: "warning", advice: "Your symptoms suggest you might have ADHD. Consider a professional evaluation." }
            }
        },
        {
            id: 'pcptsd5',
            name: 'PC-PTSD-5',
            fullName: 'Primary Care PTSD Screen',
            category: 'PTSD',
            description: 'Screening for PTSD symptoms.',
            questions: [
                "Had nightmares about the event(s) or thought about the event(s) when you did not want to?",
                "Tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?",
                "Been constantly on guard, watchful, or easily startled?",
                "Felt numb or detached from people, activities, or your surroundings?",
                "Felt guilty or unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?"
            ],
            getResult: (score) => {
                // Score > 3 suggests probable PTSD.
                // Max score with 0-3 buttons is 15.
                // If we treat >0 as "Yes", then score is count of non-zero answers.
                // But we are summing the values.
                // Let's approximate:
                if (score < 5) return { text: "Negative Screen", color: "success", advice: "PTSD symptoms are not significant." }
                return { text: "Positive Screen", color: "danger", advice: "Please seek professional help for PTSD assessment." }
            }
        },
        {
            id: 'bdi',
            name: 'BDI',
            fullName: 'Beck Depression Inventory',
            category: 'Depression',
            description: 'Assess the severity of depressive symptoms.',
            questions: [
                {
                    prompt: "Sadness",
                    options: [
                        "I do not feel sad.",
                        "I feel sad",
                        "I am sad all the time and I can't snap out of it.",
                        "I am so sad and unhappy that I can't stand it."
                    ]
                },
                {
                    prompt: "Pessimism",
                    options: [
                        "I am not particularly discouraged about the future.",
                        "I feel discouraged about the future.",
                        "I feel I have nothing to look forward to.",
                        "I feel the future is hopeless and that things cannot improve."
                    ]
                },
                {
                    prompt: "Past Failure",
                    options: [
                        "I do not feel like a failure.",
                        "I feel I have failed more than the average person.",
                        "As I look back on my life, all I can see is a lot of failures.",
                        "I feel I am a complete failure as a person."
                    ]
                },
                {
                    prompt: "Loss of Pleasure",
                    options: [
                        "I get as much satisfaction out of things as I used to.",
                        "I don't enjoy things the way I used to.",
                        "I don't get real satisfaction out of anything anymore.",
                        "I am dissatisfied or bored with everything."
                    ]
                },
                {
                    prompt: "Guilty Feelings",
                    options: [
                        "I don't feel particularly guilty",
                        "I feel guilty a good part of the time.",
                        "I feel quite guilty most of the time.",
                        "I feel guilty all of the time."
                    ]
                },
                {
                    prompt: "Punishment Feelings",
                    options: [
                        "I don't feel I am being punished.",
                        "I feel I may be punished.",
                        "I expect to be punished.",
                        "I feel I am being punished."
                    ]
                },
                {
                    prompt: "Self-Dislike",
                    options: [
                        "I don't feel disappointed in myself.",
                        "I am disappointed in myself.",
                        "I am disgusted with myself.",
                        "I hate myself."
                    ]
                },
                {
                    prompt: "Self-Criticalness",
                    options: [
                        "I don't feel I am any worse than anybody else.",
                        "I am critical of myself for my weaknesses or mistakes.",
                        "I blame myself all the time for my faults.",
                        "I blame myself for everything bad that happens."
                    ]
                },
                {
                    prompt: "Suicidal Thoughts or Wishes",
                    options: [
                        "I don't have any thoughts of killing myself.",
                        "I have thoughts of killing myself, but I would not carry them out.",
                        "I would like to kill myself.",
                        "I would kill myself if I had the chance."
                    ]
                },
                {
                    prompt: "Crying",
                    options: [
                        "I don't cry any more than usual.",
                        "I cry more now than I used to.",
                        "I cry all the time now.",
                        "I used to be able to cry, but now I can't cry even though I want to."
                    ]
                },
                {
                    prompt: "Agitation",
                    options: [
                        "I am no more irritated by things than I ever was.",
                        "I am slightly more irritated now than usual.",
                        "I am quite annoyed or irritated a good deal of the time.",
                        "I feel irritated all the time."
                    ]
                },
                {
                    prompt: "Loss of Interest",
                    options: [
                        "I have not lost interest in other people.",
                        "I am less interested in other people than I used to be.",
                        "I have lost most of my interest in other people.",
                        "I have lost all of my interest in other people."
                    ]
                },
                {
                    prompt: "Indecisiveness",
                    options: [
                        "I make decisions about as well as I ever could.",
                        "I put off making decisions more than I used to.",
                        "I have greater difficulty in making decisions more than I used to.",
                        "I can't make decisions at all anymore."
                    ]
                },
                {
                    prompt: "Worthlessness",
                    options: [
                        "I don't feel that I look any worse than I used to.",
                        "I am worried that I am looking old or unattractive.",
                        "I feel there are permanent changes in my appearance that make me look unattractive",
                        "I believe that I look ugly."
                    ]
                },
                {
                    prompt: "Loss of Energy",
                    options: [
                        "I can work about as well as before.",
                        "It takes an extra effort to get started at doing something.",
                        "I have to push myself very hard to do anything.",
                        "I can't do any work at all."
                    ]
                },
                {
                    prompt: "Changes in Sleeping Pattern",
                    options: [
                        "I can sleep as well as usual.",
                        "I don't sleep as well as I used to.",
                        "I wake up 1-2 hours earlier than usual and find it hard to get back to sleep.",
                        "I wake up several hours earlier than I used to and cannot get back to sleep."
                    ]
                },
                {
                    prompt: "Tiredness",
                    options: [
                        "I don't get more tired than usual.",
                        "I get tired more easily than I used to.",
                        "I get tired from doing almost anything.",
                        "I am too tired to do anything."
                    ]
                },
                {
                    prompt: "Changes in Appetite",
                    options: [
                        "My appetite is no worse than usual.",
                        "My appetite is not as good as it used to be.",
                        "My appetite is much worse now.",
                        "I have no appetite at all anymore."
                    ]
                },
                {
                    prompt: "Weight Loss",
                    options: [
                        "I haven't lost much weight, if any, lately.",
                        "I have lost more than five pounds.",
                        "I have lost more than ten pounds.",
                        "I have lost more than fifteen pounds."
                    ]
                },
                {
                    prompt: "Somatic Preoccupation",
                    options: [
                        "I am no more worried about my health than usual.",
                        "I am worried about physical problems like aches, pains, upset stomach, or constipation.",
                        "I am very worried about physical problems and it's hard to think of much else.",
                        "I am so worried about my physical problems that I cannot think of anything else."
                    ]
                },
                {
                    prompt: "Loss of Libido",
                    options: [
                        "I have not noticed any recent change in my interest in sex.",
                        "I am less interested in sex than I used to be.",
                        "I have almost no interest in sex.",
                        "I have lost interest in sex completely."
                    ]
                }
            ],
            getResult: (score) => {
                if (score <= 10) return { text: "Normal", color: "success", advice: "These ups and downs are considered normal." }
                if (score <= 16) return { text: "Mild Mood Disturbance", color: "info", advice: "You are experiencing mild mood disturbances." }
                if (score <= 20) return { text: "Borderline Clinical Depression", color: "warning", advice: "You are on the borderline of clinical depression." }
                if (score <= 30) return { text: "Moderate Depression", color: "orange", advice: "You are experiencing moderate depression. Professional help is recommended." }
                if (score <= 40) return { text: "Severe Depression", color: "danger", advice: "You are experiencing severe depression. Please seek professional help immediately." }
                return { text: "Extreme Depression", color: "danger", advice: "You are experiencing extreme depression. Please seek professional help immediately." }
            }
        },
        {
            id: 'epds',
            name: 'EPDS',
            fullName: 'Edinburgh Postnatal Depression Scale',
            category: 'Depression',
            description: 'Screening for postpartum depression.',
            questions: [
                {
                    prompt: "I have been able to laugh and see the funny side of things",
                    options: [
                        "As much as I always could",
                        "Not quite so much now",
                        "Definitely not so much now",
                        "Not at all"
                    ]
                },
                {
                    prompt: "I have looked forward with enjoyment to things",
                    options: [
                        "As much as I ever did",
                        "Rather less than I used to",
                        "Definitely less than I used to",
                        "Hardly at all"
                    ]
                },
                {
                    prompt: "I have blamed myself unnecessarily when things went wrong",
                    options: [
                        "No, never",
                        "Not very often",
                        "Yes, some of the time",
                        "Yes, most of the time"
                    ]
                },
                {
                    prompt: "I have been anxious or worried for no good reason",
                    options: [
                        "No, not at all",
                        "Hardly ever",
                        "Yes, sometimes",
                        "Yes, very often"
                    ]
                },
                {
                    prompt: "I have felt scared or panicky for no very good reason",
                    options: [
                        "No, not at all",
                        "No, not much",
                        "Yes, sometimes",
                        "Yes, quite a lot"
                    ]
                },
                {
                    prompt: "Things have been getting on top of me",
                    options: [
                        "No, I have been coping as well as ever.",
                        "No, most of the time I have coped quite well.",
                        "Yes, sometimes I haven't been coping as well as usual",
                        "Yes, most of the time I haven't been able to cope at all."
                    ]
                },
                {
                    prompt: "I have been so unhappy that I have had difficulty sleeping",
                    options: [
                        "No, not at all",
                        "Not very often",
                        "Yes, sometimes",
                        "Yes, most of the time"
                    ]
                },
                {
                    prompt: "I have felt sad or miserable",
                    options: [
                        "No, not at all",
                        "Not very often",
                        "Yes, quite often",
                        "Yes, most of the time"
                    ]
                },
                {
                    prompt: "I have been so unhappy that I have been crying",
                    options: [
                        "No, never",
                        "Only occasionally",
                        "Yes, quite often",
                        "Yes, most of the time"
                    ]
                },
                {
                    prompt: "The thought of harming myself has occurred to me",
                    options: [
                        "Never",
                        "Hardly ever",
                        "Sometimes",
                        "Yes, quite often"
                    ]
                }
            ],
            getResult: (score) => {
                if (score > 10) return { text: "Possible Depression", color: "danger", advice: "A score of more than 10 suggests minor or major depression may be present. Further evaluation is recommended." }
                return { text: "Normal", color: "success", advice: "Your score suggests you are not currently experiencing significant symptoms of postnatal depression." }
            }
        },
        {
            id: 'lsas',
            name: 'LSAS-SR',
            fullName: 'Liebowitz Social Anxiety Scale',
            category: 'Anxiety',
            description: 'Assess social anxiety disorder.',
            questions: generateLsasQuestions(),
            getResult: (score) => {
                if (score <= 29) return { text: "No Social Anxiety", color: "success", advice: "You do not suffer from social anxiety." }
                if (score <= 49) return { text: "Mild Social Anxiety", color: "info", advice: "You have mild social anxiety." }
                if (score <= 64) return { text: "Moderate Social Anxiety", color: "warning", advice: "You have moderate social anxiety." }
                if (score <= 79) return { text: "Marked Social Anxiety", color: "orange", advice: "You have marked social anxiety. Professional help is recommended." }
                if (score <= 94) return { text: "Severe Social Anxiety", color: "danger", advice: "You have severe social anxiety. Please seek professional help." }
                return { text: "Very Severe Social Anxiety", color: "danger", advice: "You have very severe social anxiety. Please seek professional help immediately." }
            }
        },
        {
            id: 'spin',
            name: 'SPIN',
            fullName: 'Social Phobia Inventory',
            category: 'Anxiety',
            description: 'Screen for social anxiety.',
            questions: [
                "I am afraid of people in authority.",
                "I am bothered by blushing in front of people.",
                "Parties and social events scare me.",
                "I avoid talking to people I don’t know.",
                "Being criticized scares me a lot.",
                "I avoid doing things or speaking to people for fear of embarrassment.",
                "Sweating in front of people causes me distress.",
                "I avoid going to parties.",
                "I avoid activities in which I am the center of attention.",
                "Talking to strangers scares me.",
                "I avoid having to give speeches.",
                "I would do anything to avoid being criticized.",
                "Heart palpitations bother me when I am around people.",
                "I am afraid of doing things when people might be watching.",
                "Being embarrassed or looking stupid are among my worst fears.",
                "I avoid speaking to anyone in authority.",
                "Trembling or shaking in front of others is distressing to me."
            ].map(q => ({
                prompt: q,
                options: ["Not at all", "A little bit", "Somewhat", "Very much", "Extremely"]
            })),
            getResult: (score) => {
                if (score <= 20) return { text: "None/Mild Social Anxiety", color: "success", advice: "Your symptoms are minimal." }
                if (score <= 30) return { text: "Moderate Social Anxiety", color: "warning", advice: "You may be experiencing moderate social anxiety." }
                if (score <= 40) return { text: "Severe Social Anxiety", color: "orange", advice: "You are likely experiencing severe social anxiety. Professional help is recommended." }
                return { text: "Very Severe Social Anxiety", color: "danger", advice: "Please seek professional help immediately." }
            }
        },
        {
            id: 'mdq',
            name: 'MDQ',
            fullName: 'Mood Disorder Questionnaire',
            category: 'Bipolar',
            description: 'Screen for bipolar disorder.',
            questions: [
                {
                    prompt: "1. Has there ever been a period of time when you were not your usual self and... you felt so good or so hyper that other people thought you were not your normal self or you were so hyper that you got into trouble?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "2. ...you were so irritable that you shouted at people or started fights or arguments?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "3. ...you felt much more self-confident than usual?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "4. ...you got much less sleep than usual and found you didn't really miss it?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "5. ...you were much more talkative or spoke faster than usual?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "6. ...thoughts raced through your head or you couldn't slow your mind down?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "7. ...you were so easily distracted by things around you that you had trouble concentrating or staying on track?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "8. ...you had much more energy than usual?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "9. ...you were much more active or did many more things than usual?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "10. ...you were much more social or outgoing than usual, for example, you telephoned friends in the middle of the night?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "11. ...you were much more interested in sex than usual?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "12. ...you did things that were unusual for you or that other people might have thought were excessive, foolish, or risky?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "13. ...spending money got you or your family in trouble?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "14. If you checked YES to more than one of the above, have several of these ever happened during the same period of time?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "15. How much of a problem did any of these cause you — like being able to work; having family, money, or legal troubles; getting into arguments or fights?",
                    options: ["No Problem", "Minor Problem", "Moderate Problem", "Serious Problem"]
                },
                {
                    prompt: "16. Have any of your blood relatives (ie, children, siblings, parents, grandparents, aunts, uncles) had manic-depressive illness or bipolar disorder?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "17. Has a health professional ever told you that you have manic-depressive illness or bipolar disorder?",
                    options: ["No", "Yes"]
                }
            ],

            getResult: (score) => {
                const symptomCount = score % 100;
                const coOccurrence = Math.floor((score % 1000) / 100) === 1;
                const impact = Math.floor(score / 1000) >= 1;

                if (symptomCount >= 7 && coOccurrence && impact) {
                    return { text: "Positive Screen", color: "danger", advice: "Your responses suggest a high likelihood of Bipolar Disorder. Please seek a comprehensive medical evaluation." }
                }
                return { text: "Negative Screen", color: "success", advice: "Your responses do not currently suggest Bipolar Disorder." }
            }
        },
        {
            id: 'audit',
            name: 'AUDIT',
            fullName: 'Alcohol Use Disorders Identification Test',
            category: 'Addiction',
            description: 'Screening for alcohol consumption.',
            questions: [
                {
                    prompt: "1. How often do you have a drink containing alcohol?",
                    options: ["Never", "Monthly or less", "2 to 4 times a month", "2 to 3 times a week", "4 or more times a week"],
                    values: [0, 1, 2, 3, 4]
                },
                {
                    prompt: "2. How many drinks containing alcohol do you have on a typical day when you are drinking?",
                    options: ["1 or 2", "3 or 4", "5 or 6", "7 to 9", "10 or more"],
                    values: [0, 1, 2, 3, 4]
                },
                {
                    prompt: "3. How often do you have six or more drinks on one occasion?",
                    options: ["Never", "Less than monthly", "Monthly", "Weekly", "Daily or almost daily"],
                    values: [0, 1, 2, 3, 4]
                },
                {
                    prompt: "4. How often during the last year have you found that you were not able to stop drinking once you had started?",
                    options: ["Never", "Less than monthly", "Monthly", "Weekly", "Daily or almost daily"],
                    values: [0, 1, 2, 3, 4]
                },
                {
                    prompt: "5. How often during the last year have you failed to do what was normally expected from you because of drinking?",
                    options: ["Never", "Less than monthly", "Monthly", "Weekly", "Daily or almost daily"],
                    values: [0, 1, 2, 3, 4]
                },
                {
                    prompt: "6. How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
                    options: ["Never", "Less than monthly", "Monthly", "Weekly", "Daily or almost daily"],
                    values: [0, 1, 2, 3, 4]
                },
                {
                    prompt: "7. How often during the last year have you had a feeling of guilt or remorse after drinking?",
                    options: ["Never", "Less than monthly", "Monthly", "Weekly", "Daily or almost daily"],
                    values: [0, 1, 2, 3, 4]
                },
                {
                    prompt: "8. How often during the last year have you been unable to remember what happened the night before because you had been drinking?",
                    options: ["Never", "Less than monthly", "Monthly", "Weekly", "Daily or almost daily"],
                    values: [0, 1, 2, 3, 4]
                },
                {
                    prompt: "9. Have you or someone else been injured as a result of your drinking?",
                    options: ["No", "Yes, but not in the last year", "Yes, during the last year"],
                    values: [0, 2, 4]
                },
                {
                    prompt: "10. Has a relative or friend or a doctor or another health worker been concerned about your drinking or suggested you cut down?",
                    options: ["No", "Yes, but not in the last year", "Yes, during the last year"],
                    values: [0, 2, 4]
                }
            ],
            getResult: (score) => {
                // WHO Guidelines:
                // 0-7: Low Risk
                // 8-15: Hazardous Drinking
                // 16-19: Harmful Drinking
                // 20+: Possible Dependence
                if (score <= 7) return { text: "Low Risk", color: "success", advice: "Your alcohol consumption is within the low-risk range." }
                if (score <= 15) return { text: "Hazardous Drinking", color: "warning", advice: "You may be drinking at hazardous levels. Consider cutting back." }
                if (score <= 19) return { text: "Harmful Drinking", color: "orange", advice: "Your drinking patterns are likely harmful. Professional advice is recommended." }
                return { text: "Possible Dependence", color: "danger", advice: "Your score suggests possible alcohol dependence. Please seek professional help." }
            }
        },
        {
            id: 'dast10',
            name: 'DAST-10',
            fullName: 'Drug Abuse Screening Test',
            category: 'Addiction',
            description: 'Screening for drug abuse.',
            questions: [
                "1. Have you used drugs other than those required for medical reasons?",
                "2. Do you abuse more than one drug at a time?",
                "3. Are you unable to stop abusing drugs when you want to?",
                "4. Have you ever had blackouts or flashbacks as a result of drug use?",
                "5. Do you ever feel bad or guilty about your drug use?",
                "6. Does your spouse (or parents) ever complain about your involvement with drugs?",
                "7. Have you neglected your family because of your use of drugs?",
                "8. Have you engaged in illegal activities in order to obtain drugs?",
                "9. Have you ever experienced withdrawal symptoms (felt sick) when you stopped taking drugs?",
                "10. Have you had medical problems as a result of your drug use (e.g. memory loss, hepatitis, convulsions, bleeding)?"
            ].map(q => ({
                prompt: q,
                options: ["No", "Yes"] // 0=No, 1=Yes
            })),
            getResult: (score) => {
                if (score === 0) return { text: "No Problems", color: "success", advice: "No problems reported." }
                if (score <= 2) return { text: "Low Level", color: "info", advice: "Monitor and re-assess at a later date." }
                if (score <= 5) return { text: "Moderate Level", color: "warning", advice: "Further investigation is recommended." }
                if (score <= 8) return { text: "Substantial Level", color: "orange", advice: "Intensive assessment is required." }
                return { text: "Severe Level", color: "danger", advice: "Intensive assessment is required immediately." }
            }
        },
        {
            id: 'cssrs',
            name: 'C-SSRS',
            fullName: 'Columbia Suicide Severity Rating Scale',
            category: 'Suicide Risk',
            description: 'Screen for suicide risk.',
            questions: [
                {
                    prompt: "1. Wish to be Dead: Have you wished you were dead or wished you could go to sleep and never wake up?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "2. Non-Specific Active Suicidal Thoughts: Have you had any thoughts about killing yourself?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "3. Active Suicidal Ideation with Any Methods (Not Plan) without Intent to Act: Have you thought about how you would do that?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "4. Active Suicidal Ideation with Some Intent to Act, without Specific Plan: Did you think that this was something you might actually do?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "5. Active Suicidal Ideation with Specific Plan and Intent: Have you decided how or when you would make yourself not alive anymore/kill yourself?",
                    options: ["No", "Yes"]
                },
                {
                    prompt: "6. Suicidal Behavior: Have you done anything, started to do anything, or prepared to do anything to end your life?",
                    options: ["No", "Yes"]
                }
            ],
            getResult: (score) => {
                if (score > 0) {
                    return { text: "High Risk", color: "danger", advice: "Your responses indicate a risk of suicide. Please call a suicide hotline or go to the nearest emergency room immediately." }
                }
                return { text: "Low Risk", color: "success", advice: "No current evidence of suicidal ideation or behavior reported." }
            }
        }
    ]

    const handleAnswer = (value) => {
        let addedValue = value;
        let nextStep = step + 1;

        // Special handling for MDQ encoding
        if (selectedAssessment?.id === 'mdq') {
            if (step < 13) { // Q1-13
                addedValue = value; // 0 or 1
            } else if (step === 13) { // Q14
                addedValue = value * 100; // 0 or 100
            } else if (step === 14) { // Q15
                // Options: 0=No, 1=Minor, 2=Mod, 3=Serious
                // We need Mod(2) or Serious(3) to be 1000.
                addedValue = (value >= 2) ? 1000 : 0;
            } else {
                // Q16 and Q17 (Family history, Prior diagnosis) do not affect the score for the screener result
                addedValue = 0;
            }
        }

        // Special handling for AUDIT
        if (selectedAssessment?.id === 'audit') {
            // Use specific values if defined (for Q9, Q10)
            if (selectedAssessment.questions[step].values) {
                addedValue = selectedAssessment.questions[step].values[value];
            }

            // Skip logic
            // Q1: If "Never" (value 0), skip to Q9 (index 8)
            if (step === 0 && value === 0) {
                nextStep = 8; // Jump to Q9
            }

            // Since we don't store history, we'll just implement the Q1 skip for now which is the most critical.
        }

        // Special handling for DAST-10
        if (selectedAssessment?.id === 'dast10') {

            if (step === 2) { // Question 3
                // If "No" (0) -> +1 point. If "Yes" (1) -> +0 points.
                addedValue = (value === 0) ? 1 : 0;
            } else {
                // For all others, "Yes" (1) -> +1 point. "No" (0) -> +0 points.
                addedValue = value;
            }
        }

        // Special handling for C-SSRS branching
        if (selectedAssessment?.id === 'cssrs') {

            if (step === 1 && value === 0) { // Q2 is No
                nextStep = 5; // Skip Q3(2), Q4(3), Q5(4) -> Go to Q6 (index 5)
            }
        }

        const newScore = score + addedValue
        if (nextStep < selectedAssessment.questions.length) {
            setScore(newScore)
            setStep(nextStep)
        } else {
            setScore(newScore)
            setShowResult(true)

            if (user) {
                // Save result to DB
                const resultData = selectedAssessment.getResult(newScore);
                saveAssessmentResult({
                    assessmentId: selectedAssessment.id,
                    assessmentName: selectedAssessment.name,
                    score: newScore,
                    resultText: resultData.text,
                    color: resultData.color
                }).catch(err => console.error("Failed to save assessment", err));
            }
        }
    }

    const resetAssessment = () => {
        setStep(0)
        setScore(0)
        setShowResult(false)
        setStarted(false)
        setSelectedAssessment(null)
    }

    const startAssessment = (assessment) => {
        if (!user) {
            return; // Blocked by UI, but double check
        }
        if (assessment.questions) {
            setSelectedAssessment(assessment)
            setStarted(true)
        } else {
            alert("This assessment is currently available only through professional consultation.")
        }
    }

    return (
        <Card style={soothingStyles.glassCard} className="p-4 h-100">
            <Card.Body>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
                        <ClipboardList size={24} />
                    </div>
                    <h4 className="fw-bold mb-0">Mental Health Assessment</h4>
                </div>

                {!user && (
                    <div className="alert alert-warning border-0 bg-warning bg-opacity-10 d-flex align-items-center gap-3 mb-4 rounded-4" role="alert">
                        <Lock size={20} className="text-warning" />
                        <div className="flex-grow-1">
                            <h6 className="fw-bold mb-1">Login Required</h6>
                            <p className="mb-0 small text-muted">You must be logged in to take mental health assessments and save your results.</p>
                        </div>
                        <Button variant="warning" size="sm" className="px-3 rounded-pill fw-bold text-white shadow-sm" onClick={() => router.push('/handler/sign-in')}>
                            Log In
                        </Button>
                    </div>
                )}

                {!selectedAssessment ? (
                    <div className="d-flex flex-column gap-3 p-1" style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
                        {assessments.map((assessment) => (
                            <motion.div
                                key={assessment.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-3 rounded-3 border bg-white cursor-pointer hover-shadow ${!user ? 'opacity-50' : ''}`}
                                onClick={() => user ? startAssessment(assessment) : null}
                                style={{ cursor: user ? 'pointer' : 'not-allowed' }}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <h6 className="fw-bold mb-0 text-primary">{assessment.name}</h6>
                                            <Badge bg="light" text="dark" className="border">{assessment.category}</Badge>
                                        </div>
                                        <div className="small text-muted">{assessment.fullName}</div>
                                    </div>
                                    <div className="text-muted">
                                        <Plus size={20} style={{ transform: 'rotate(45deg)' }} /> {/* Using Plus as generic icon, maybe ChevronRight is better but not imported */}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : !showResult ? (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="mb-4">
                            <Button variant="link" className="p-0 mb-3 text-muted text-decoration-none" onClick={() => setSelectedAssessment(null)}>
                                &larr; Back to Assessments
                            </Button>
                            <h5 className="fw-bold mb-2 text-primary">{selectedAssessment.fullName}</h5>
                            <div className="d-flex justify-content-between text-muted small mb-2">
                                <span>Question {step + 1} of {selectedAssessment.questions.length}</span>
                                <span>{Math.round(((step + 1) / selectedAssessment.questions.length) * 100)}%</span>
                            </div>
                            <ProgressBar now={((step + 1) / selectedAssessment.questions.length) * 100} variant="primary" className="mb-4" style={{ height: '6px' }} />
                            <h5 className="mb-4 fw-medium text-dark">
                                {typeof selectedAssessment.questions[step] === 'string'
                                    ? selectedAssessment.questions[step]
                                    : selectedAssessment.questions[step].prompt}
                            </h5>
                        </div>
                        <div className="d-grid gap-3">
                            {typeof selectedAssessment.questions[step] === 'string' ? (
                                <>
                                    <Button variant="outline-light" className="text-dark border text-start p-3 hover-bg-light" onClick={() => handleAnswer(0)}>Not at all</Button>
                                    <Button variant="outline-light" className="text-dark border text-start p-3 hover-bg-light" onClick={() => handleAnswer(1)}>Several days</Button>
                                    <Button variant="outline-light" className="text-dark border text-start p-3 hover-bg-light" onClick={() => handleAnswer(2)}>More than half the days</Button>
                                    <Button variant="outline-light" className="text-dark border text-start p-3 hover-bg-light" onClick={() => handleAnswer(3)}>Nearly every day</Button>
                                </>
                            ) : (
                                selectedAssessment.questions[step].options.map((option, idx) => (
                                    <Button
                                        key={idx}
                                        variant="outline-light"
                                        className="text-dark border text-start p-3 hover-bg-light"
                                        onClick={() => handleAnswer(idx)}
                                    >
                                        {option}
                                    </Button>
                                ))
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-4"
                    >
                        <div className={`d-inline-flex p-4 rounded-circle bg-${selectedAssessment.getResult(score).color} bg-opacity-10 text-${selectedAssessment.getResult(score).color} mb-4`}>
                            <CheckCircle2 size={48} />
                        </div>
                        <h3 className="fw-bold mb-2">{selectedAssessment.getResult(score).text}</h3>
                        <p className="text-muted mb-4">{selectedAssessment.getResult(score).advice}</p>
                        <div className="d-flex justify-content-center gap-3">
                            <Button variant="outline-secondary" className="rounded-pill px-4" onClick={() => {
                                setStep(0)
                                setScore(0)
                                setShowResult(false)
                            }}>Retake</Button>
                            <Button variant="primary" className="rounded-pill px-4" onClick={resetAssessment}>All Assessments</Button>
                        </div>
                    </motion.div>
                )}
            </Card.Body>
        </Card>
    )
}

const MeditationPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
    const [activeSession, setActiveSession] = useState('Breathing')
    const audioRef = useRef(null)

    const sessionTracks = {
        'Breathing': '/assets/music/breathing.mp3',
        'Anxiety Release': '/assets/music/anxiety.mp3',
        'Sleep': '/assets/music/sleep.mp3',
        'Focus': '/assets/music/focus.mp3'
    }

    const sessionImages = {
        'Breathing': '/assets/meditation/breathing.png',
        'Anxiety Release': '/assets/meditation/anxiety.png',
        'Sleep': '/assets/meditation/sleep.png',
        'Focus': '/assets/meditation/focus.png'
    }

    const sessionThemes = {
        'Breathing': { bg: '#E3F2FD', text: '#0D47A1', button: 'outline-primary' }, // Light Blue
        'Anxiety Release': { bg: '#E8F5E9', text: '#1B5E20', button: 'outline-success' }, // Light Green
        'Sleep': { bg: '#EDE7F6', text: '#311B92', button: 'outline-secondary' }, // Light Deep Purple
        'Focus': { bg: '#FFF3E0', text: '#E65100', button: 'outline-warning' } // Light Orange
    }

    const togglePlay = () => setIsPlaying(!isPlaying)

    const adjustTime = (amount) => {
        setTimeLeft(prev => {
            const newTime = prev + amount
            return newTime >= 0 ? newTime : 0
        })
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    useEffect(() => {
        let interval = null
        if (isPlaying && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsPlaying(false)
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
        }
        return () => clearInterval(interval)
    }, [isPlaying, timeLeft])

    useEffect(() => {
        // When session changes, reset timer and handle audio
        if (audioRef.current) {
            // Note: src is updated via prop, we just need to ensure it loads/plays
            audioRef.current.load()
            if (isPlaying) {
                audioRef.current.play().catch(error => console.log("Audio play failed:", error))
            }
        }
        setTimeLeft(300) // Reset timer to 5 minutes
    }, [activeSession])

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(error => console.log("Audio play failed:", error))
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying])

    const handleReset = () => {
        setIsPlaying(false)
        setTimeLeft(300)
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
    }

    return (
        <Card style={soothingStyles.glassCard} className="p-4 h-100">
            <Card.Body>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info">
                        <Headphones size={24} />
                    </div>
                    <h4 className="fw-bold mb-0">Guided Meditation</h4>
                </div>

                <div
                    className="py-4 mb-4 rounded-4 overflow-hidden transition-all"
                    style={{ backgroundColor: sessionThemes[activeSession].bg, transition: 'background-color 0.5s ease' }}
                >
                    <div className="d-flex flex-column flex-md-row align-items-center justify-content-around px-4 gap-4">
                        {/* Controls Section */}
                        <div className="text-center z-1">
                            <div
                                className="mb-3 text-uppercase tracking-wider small fw-bold"
                                style={{ color: sessionThemes[activeSession].text, opacity: 0.7 }}
                            >
                                {activeSession}
                            </div>

                            <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
                                <Button
                                    variant={sessionThemes[activeSession].button}
                                    className="rounded-circle p-2 border-2"
                                    onClick={() => adjustTime(-60)}
                                    disabled={isPlaying || timeLeft < 60}
                                    aria-label="Decrease time"
                                >
                                    <Minus size={20} />
                                </Button>
                                <div
                                    className="display-1 fw-bold font-monospace"
                                    style={{ minWidth: '220px', color: sessionThemes[activeSession].text }}
                                >
                                    {formatTime(timeLeft)}
                                </div>
                                <Button
                                    variant={sessionThemes[activeSession].button}
                                    className="rounded-circle p-2 border-2"
                                    onClick={() => adjustTime(60)}
                                    disabled={isPlaying}
                                    aria-label="Increase time"
                                >
                                    <Plus size={20} />
                                </Button>
                            </div>

                            <div className="d-flex justify-content-center gap-3">
                                <Button
                                    variant={isPlaying ? "dark" : "dark"} // Keep play button distinct/dark for contrast
                                    className="rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm"
                                    style={{ width: '64px', height: '64px' }}
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? <Pause size={28} /> : <Play size={28} className="ms-1" />}
                                </Button>
                                <Button
                                    variant="outline-dark"
                                    className="rounded-circle p-3 d-flex align-items-center justify-content-center border-2"
                                    style={{ width: '64px', height: '64px' }}
                                    onClick={handleReset}
                                >
                                    <RotateCcw size={24} />
                                </Button>
                            </div>
                        </div>

                        {/* Animated Character */}
                        <motion.div
                            key={activeSession}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: [0, -15, 0], scale: 1 }}
                            transition={{
                                opacity: { duration: 0.5 },
                                scale: { duration: 0.5 },
                                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                            }}
                            style={{ width: '280px', height: '280px' }}
                            className="d-flex align-items-center justify-content-center"
                        >
                            <img
                                src={sessionImages[activeSession]}
                                alt={activeSession}
                                className="w-100 h-100 object-fit-contain"
                                style={{
                                    filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.1))',
                                    mixBlendMode: 'multiply' // Helps blend the image background with the container
                                }}
                            />
                        </motion.div>
                    </div>
                </div>

                <div className="d-flex gap-2 overflow-auto pb-2">
                    {['Breathing', 'Anxiety Release', 'Sleep', 'Focus'].map((session) => (
                        <Button
                            key={session}
                            variant={activeSession === session ? "primary" : "outline-light"}
                            className={`rounded-pill px-4 py-2 ${activeSession !== session ? 'text-dark border' : ''}`}
                            onClick={() => setActiveSession(session)}
                        >
                            {session}
                        </Button>
                    ))}
                </div>
                <audio key={activeSession} ref={audioRef} src={sessionTracks[activeSession]} loop />
            </Card.Body>
        </Card>
    )
}

const MoodTracker = () => {
    const user = useUser()
    const [selectedMood, setSelectedMood] = useState(null)
    const [history, setHistory] = useState([])
    const [viewMode, setViewMode] = useState('graph') // 'graph' or 'list'

    const getMoodScore = (label) => {
        switch (label) {
            case 'Great': return 5;
            case 'Good': return 4;
            case 'Okay': return 3;
            case 'Bad': return 2;
            case 'Awful': return 1;
            default: return 3;
        }
    }

    useEffect(() => {
        if (user) {
            getMoodHistory().then(data => {
                const formatted = data.map(entry => ({
                    label: entry.moodLabel,
                    color: entry.moodColor,
                    date: new Date(entry.createdAt).toLocaleDateString() + ' ' + new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    timestamp: new Date(entry.createdAt).getTime(),
                    score: getMoodScore(entry.moodLabel),
                    icon: moods.find(m => m.label === entry.moodLabel)?.icon || Smile
                }));
                // Combine with local history if any? simpler to just set history
                setHistory(formatted);
            });
        }
    }, [user]);

    const moods = [
        { icon: Sun, label: 'Great', color: '#fbbf24' },
        { icon: Smile, label: 'Good', color: '#4ade80' },
        { icon: Meh, label: 'Okay', color: '#94a3b8' },
        { icon: Frown, label: 'Bad', color: '#f87171' },
        { icon: AlertCircle, label: 'Awful', color: '#ef4444' }
    ]

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood)
        const now = new Date();
        const newEntry = {
            ...mood,
            date: now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: now.getTime(),
            score: getMoodScore(mood.label)
        };
        setHistory([newEntry, ...history].slice(0, 50))

        if (user) {
            saveMoodEntry({
                moodLabel: mood.label,
                moodColor: mood.color
            }).catch(e => console.error("Failed to save mood", e));
        }
    }

    // Sort history for chart (oldest first)
    const chartData = [...history].reverse();

    return (
        <Card style={soothingStyles.glassCard} className="p-4 h-100">
            <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning">
                            <Heart size={24} />
                        </div>
                        <h4 className="fw-bold mb-0">Mood Tracker</h4>
                    </div>
                    <div className="d-flex bg-light rounded-pill p-1 border">
                        <button
                            className={`btn btn-sm rounded-pill px-3 fw-bold ${viewMode === 'graph' ? 'bg-white shadow-sm text-dark' : 'text-muted'}`}
                            onClick={() => setViewMode('graph')}
                        >
                            <BarChart2 size={16} className="me-2" /> Graph
                        </button>
                        <button
                            className={`btn btn-sm rounded-pill px-3 fw-bold ${viewMode === 'list' ? 'bg-white shadow-sm text-dark' : 'text-muted'}`}
                            onClick={() => setViewMode('list')}
                        >
                            <ListIcon size={16} className="me-2" /> List
                        </button>
                    </div>
                </div>

                <div className="d-flex justify-content-between mb-5">
                    {moods.map((mood, idx) => (
                        <motion.div key={idx} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <div
                                className="d-flex flex-column align-items-center cursor-pointer"
                                onClick={() => handleMoodSelect(mood)}
                            >
                                <div
                                    className="p-3 rounded-circle mb-2 transition-all"
                                    style={{
                                        backgroundColor: selectedMood?.label === mood.label ? mood.color : '#f1f5f9',
                                        color: selectedMood?.label === mood.label ? 'white' : '#64748b'
                                    }}
                                >
                                    <mood.icon size={24} />
                                </div>
                                <span className="small text-muted">{mood.label}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <h6 className="text-muted text-uppercase tracking-wider small mb-3">
                    {viewMode === 'graph' ? 'Mood Trends' : 'Recent Entries'}
                </h6>

                {viewMode === 'graph' ? (
                    <div style={{ height: '300px', width: '100%' }}>
                        {history.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        hide={true}
                                    />
                                    <YAxis
                                        domain={[1, 5]}
                                        ticks={[1, 2, 3, 4, 5]}
                                        tickFormatter={(value) => {
                                            if (value === 5) return 'Great';
                                            if (value === 3) return 'Okay';
                                            if (value === 1) return 'Awful';
                                            return '';
                                        }}
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorScore)"
                                        animationDuration={1000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="d-flex align-items-center justify-content-center h-100 text-muted small bg-light rounded-3">
                                No mood data available for chart.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {history.length > 0 ? history.map((entry, idx) => (
                            <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
                                <div className="d-flex align-items-center gap-3">
                                    <entry.icon size={20} style={{ color: entry.color }} />
                                    <span className="fw-medium">{entry.label}</span>
                                </div>
                                <span className="text-muted small">{entry.date}</span>
                            </div>
                        )) : (
                            <div className="text-center text-muted py-4 small">No mood entries yet today.</div>
                        )}
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

const TherapyResources = () => {
    const resources = [
        { title: "KIRAN Helpline", number: "1800-599-0019", icon: Phone, color: "danger" },
        { title: "Vandrevala Foundation", number: "1860-266-2345", icon: AlertCircle, color: "warning" },
        { title: "iCall (TISS)", number: "9152987821", icon: BookOpen, color: "primary" }
    ]

    return (
        <Card style={soothingStyles.glassCard} className="p-4 h-100">
            <Card.Body>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
                        <BookOpen size={24} />
                    </div>
                    <h4 className="fw-bold mb-0">Therapy Resources</h4>
                </div>

                <div className="d-grid gap-3">
                    {resources.map((res, idx) => (
                        <div key={idx} className="d-flex align-items-center p-3 rounded-4 bg-white border shadow-sm hover-shadow transition-all">
                            <div className={`p-3 rounded-circle bg-${res.color} bg-opacity-10 text-${res.color} me-3`}>
                                <res.icon size={24} />
                            </div>
                            <div>
                                <h6 className="fw-bold mb-1">{res.title}</h6>
                                <p className="mb-0 text-muted small">{res.number}</p>
                            </div>
                            <Button variant="link" className="ms-auto text-muted">
                                <RotateCcw size={16} className="opacity-0" /> {/* Spacer */}
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-3 rounded-4 bg-primary bg-opacity-10 text-primary small">
                    <strong>Note:</strong> If you are in immediate danger, please call your local emergency number (112) immediately.
                </div>
            </Card.Body>
        </Card>
    )
}

export default function MentalHealthPage() {
    const [activeTab, setActiveTab] = useState('assessment')

    const tabs = [
        { id: 'assessment', label: 'Assessment', icon: ClipboardList },
        { id: 'meditation', label: 'Meditation', icon: Headphones },
        { id: 'mood', label: 'Mood Tracker', icon: Heart },
        { id: 'resources', label: 'Resources', icon: BookOpen },
    ]

    return (
        <Container className="py-5">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-5"
            >
                <div className="d-inline-flex align-items-center justify-content-center p-4 rounded-circle mb-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #fdf4ff 0%, #ffffff 100%)' }}>
                    <Brain size={48} className="text-primary" style={{ color: '#9333ea' }} />
                </div>
                <h1 className="fw-bold mb-3 display-4" style={soothingStyles.gradientText}>Mental Wellness Hub</h1>
                <p className="text-muted fs-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    A comprehensive toolkit for your mental well-being.
                </p>
            </motion.div>

            {/* Navigation Tabs */}
            <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab(tab.id)}
                        className="btn px-4 py-3 rounded-pill d-flex align-items-center gap-2 fw-bold shadow-sm"
                        style={activeTab === tab.id ? soothingStyles.activeTab : soothingStyles.inactiveTab}
                    >
                        <tab.icon size={20} />
                        {tab.label}
                    </motion.button>
                ))}
            </div>

            {/* Content Area */}
            <Row className="justify-content-center">
                <Col lg={10}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'assessment' && <AssessmentTool />}
                            {activeTab === 'meditation' && <MeditationPlayer />}
                            {activeTab === 'mood' && <MoodTracker />}
                            {activeTab === 'resources' && <TherapyResources />}
                        </motion.div>
                    </AnimatePresence>
                </Col>
            </Row>
        </Container>
    )
}
